"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { testimonials, type Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/utils";
import arrow from "@/public/figma/carousel-next.svg";
import quote64 from "@/public/figma/quote-64.svg";
import quote80 from "@/public/figma/quote-80.svg";

// Card colour follows the slot, as in Figma: featured = lavender, then cyan, then green.
const slotStyles = [
  "border-primary bg-primary-wash",
  "border-accent-cyan-line bg-accent-cyan-soft",
  "border-accent-green bg-accent-green-soft",
] as const;

function Card({ item, slot, featured }: { item: Testimonial; slot: number; featured: boolean }) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-lg border font-body",
        slotStyles[slot],
        featured
          ? "justify-center gap-16 px-[39px] py-[59px]"
          : // Figma text boxes: cyan card 516px (right inset 25), green card 509px (right inset 32).
            cn("gap-7 px-[23px] py-[23px] md:pl-[31px]", slot === 1 ? "md:pr-6" : "md:pr-[31px]"),
      )}
    >
      <blockquote className={cn("flex flex-col", featured ? "gap-4" : "gap-2")}>
        <Image
          src={featured ? quote80 : quote64}
          alt=""
          aria-hidden="true"
          width={featured ? 80 : 64}
          height={featured ? 80 : 64}
          unoptimized
        />
        <p className={cn("text-ink", featured ? "text-xl leading-[30px]" : "text-base leading-6")}>{item.quote}</p>
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <Image
          src={item.avatar}
          alt=""
          width={featured ? 80 : 52}
          height={featured ? 80 : 52}
          sizes={featured ? "80px" : "52px"}
          className={featured ? "size-20" : "size-[52px]"}
        />
        <span className={cn("flex flex-col", featured && "gap-1")}>
          <span className={cn("font-semibold text-ink", featured ? "text-2xl leading-8" : "text-xl leading-[30px]")}>
            {item.name}
          </span>
          <span className="text-base leading-6 text-ink-muted">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/*
 * Figma 1:3714 + 1:3757. ≥1280: Figma's composition — one featured card (687×616) and two stacked cards
 * (573×298); prev/next rotate which testimonial is featured (no invented content, no autoplay).
 * <1280: a native scroll-snap track (swipe on touch), one card per view with a peek of the next.
 * Keyboard: ←/→ anywhere in the carousel, plus the labelled prev/next buttons. Changes are announced politely.
 */
export function TestimonialsCarousel() {
  const { items, prevLabel, nextLabel } = testimonials;
  const count = items.length;
  const [index, setIndex] = useState(0);
  const [announce, setAnnounce] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(count - 1, next));
      setIndex(clamped);
      setAnnounce(true);
      // A focused arrow that becomes disabled would drop focus to <body>; hand it to the other arrow.
      if (clamped === count - 1 && document.activeElement === nextRef.current) prevRef.current?.focus();
      if (clamped === 0 && document.activeElement === prevRef.current) nextRef.current?.focus();
      const track = trackRef.current;
      // Keep the <1280 track in sync (no-op when it's hidden).
      if (track && track.offsetParent !== null) {
        const slide = track.children[clamped] as HTMLElement | undefined;
        slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      }
    },
    [count],
  );

  // Swipes on the track update the index (the slide mostly in view wins).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // The track is display:none at ≥1280 — ignore observer noise from it there.
        if (track.offsetParent === null) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setIndex(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { root: track, threshold: [0.6] },
    );
    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    }
  };

  // Touch swipe on the ≥1280 composition (e.g. large tablets in landscape).
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "touch") pointerStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (pointerStart.current === null) return;
    const dx = e.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
  };

  const side = [items[(index + 1) % count], items[(index + 2) % count]];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      onKeyDown={onKeyDown}
      className="flex w-full flex-col items-center gap-12"
    >
      {/* ≥1280 composition */}
      <div
        className="hidden w-full grid-cols-[687fr_573fr] gap-5 xl:grid"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div
          key={`featured-${index}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}`}
          className={cn("h-[616px]", announce && "animate-fade-in")}
        >
          <Card item={items[index]} slot={0} featured />
        </div>
        <div className="flex flex-col gap-5" aria-hidden="true">
          {side.map((item, i) => (
            // Fade only after a user-initiated change, never on load.
            <div key={`${item.name}-${index}`} className={cn("h-[298px]", announce && "animate-fade-in")}>
              <Card item={item} slot={i + 1} featured={false} />
            </div>
          ))}
        </div>
      </div>

      {/* <1280 swipe track */}
      <div
        ref={trackRef}
        className="-mx-(--gutter) flex w-[calc(100%+2*var(--gutter))] snap-x snap-mandatory scroll-px-(--gutter) gap-5 overflow-x-auto px-(--gutter) [scrollbar-width:none] xl:hidden [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <div
            key={item.name}
            data-index={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className="w-[85%] shrink-0 snap-start md:w-[60%]"
          >
            <Card item={item} slot={i} featured={false} />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          ref={prevRef}
          type="button"
          aria-label={prevLabel}
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="rounded-full transition-opacity disabled:cursor-not-allowed disabled:opacity-[0.32]"
        >
          <Image src={arrow} alt="" width={48} height={48} unoptimized className="-scale-x-100" />
        </button>
        <button
          ref={nextRef}
          type="button"
          aria-label={nextLabel}
          onClick={() => goTo(index + 1)}
          disabled={index === count - 1}
          className="rounded-full transition-opacity disabled:cursor-not-allowed disabled:opacity-[0.32]"
        >
          <Image src={arrow} alt="" width={48} height={48} unoptimized />
        </button>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce ? `Testimonial ${index + 1} of ${count}: ${items[index].name}, ${items[index].role}` : ""}
      </p>
    </div>
  );
}
