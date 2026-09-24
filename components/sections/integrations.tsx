import Image from "next/image";
import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { integrations } from "@/content/integrations";
import background from "@/public/figma/integrations-bg.webp";
import rings from "@/public/figma/integrations-rings.svg";

// Card centre in Figma coordinates; tiles/dots/rings are anchored to it so the ≥1024 layout survives
// the narrower 960px card at 1024.
const CENTER_X = 620;
const fromCenter = (x: number) => `calc(50% + ${x - CENTER_X}px)`;

/*
 * Figma 1:2664 — 1240×704 dark card (radius 32) with a photographic background, heading block 72px from
 * the top, concentric orbit rings from y=296 and ten 72px glass logo tiles placed on them.
 * ≥1024: Figma's absolute layout. <1024: centred tile grid (4 cols at 768, 3 at 375) — the orbit isn't shrunk.
 * Logos are decorative (the heading carries the meaning), so the tile layer is aria-hidden.
 */
export function Integrations() {
  const { title, description, items, dots } = integrations;

  return (
    <section id="integrations" aria-labelledby="integrations-title" className="py-16">
      <div className="container-site">
        <div className="relative isolate mx-auto flex max-w-[1240px] flex-col items-center overflow-hidden rounded-[32px] bg-[#0b0b0b] px-5 pt-14 pb-12 md:px-10 lg:h-[704px] lg:pt-[72px] lg:pb-0">
          <Image
            src={background}
            alt=""
            fill
            sizes="(min-width: 1304px) 1240px, calc(100vw - 40px)"
            className="-z-10 object-cover"
          />

          <SectionHeading
            id="integrations-title"
            tone="dark"
            className="max-w-[540px] gap-4"
            title={
              <>
                {title.before}{" "}
                <span className="bg-[linear-gradient(92.04deg,#834eff_40.986%,#ff1200_100.11%)] bg-clip-text text-transparent">
                  {title.highlight}
                </span>
              </>
            }
            description={description}
            titleClassName="mx-auto max-w-[11.425em] tracking-normal"
            descriptionClassName="text-base leading-6"
          />

          {/* ≥1024 orbit decoration */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
            <Image
              src={rings}
              alt=""
              width={829}
              height={409}
              unoptimized
              className="absolute top-[295.5px] max-w-none"
              style={{ left: fromCenter(206) }}
            />
            {dots.map(([x, y]) => (
              <span
                key={`${x}-${y}`}
                className="absolute size-[5px] rounded-full bg-[#5f5f5f]"
                style={{ left: fromCenter(x), top: y }}
              />
            ))}
          </div>

          <ul
            aria-hidden="true"
            // Row width fits exactly 3 (375) / 4 (768) tiles; flex-wrap centres the short last row.
            className="mt-12 flex w-[280px] flex-wrap justify-center gap-x-8 gap-y-6 md:w-[408px] md:gap-x-10 lg:contents"
          >
            {items.map((item) => (
              <li
                key={item.name}
                className="flex size-[72px] items-center justify-center rounded-full border border-white/16 bg-white/18 drop-shadow-[0_4px_8px_rgba(0,0,0,0.24)] backdrop-blur-[24px] lg:absolute lg:left-(--x) lg:top-(--y)"
                style={{ "--x": fromCenter(item.position[0]), "--y": `${item.position[1]}px` } as CSSProperties}
              >
                <Image
                  src={item.logo}
                  alt=""
                  width={Math.round(item.size[0])}
                  height={Math.round(item.size[1])}
                  unoptimized
                  className="max-w-none"
                  style={{ width: item.size[0], height: item.size[1] }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
