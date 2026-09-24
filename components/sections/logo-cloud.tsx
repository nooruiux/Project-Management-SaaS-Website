import Image from "next/image";
import { logoCloud, type CompanyLogo } from "@/content/logos";
import { cn } from "@/lib/utils";

function LogoList({ logos, duplicate = false, className }: { logos: CompanyLogo[]; duplicate?: boolean; className?: string }) {
  return (
    <ul aria-hidden={duplicate || undefined} className={cn("flex shrink-0 items-start gap-[22px]", className)}>
      {logos.map((logo) => (
        <li key={logo.name} className="shrink-0">
          <Image
            src={logo.src}
            alt={duplicate ? "" : logo.name}
            width={Math.round(logo.width)}
            height={44}
            unoptimized
            className="h-11 w-auto"
          />
        </li>
      ))}
    </ul>
  );
}

// Figma 1:2588 — 16px top / 40px bottom, caption → logos gap 32px, logos 44px tall with 22px gaps.
export function LogoCloud() {
  const { caption, logos } = logoCloud;

  return (
    <section aria-labelledby="logo-cloud-title" className="pt-4 pb-10">
      <div className="container-site flex flex-col items-center gap-8">
        <p id="logo-cloud-title" className="text-center text-base leading-6 font-medium text-ink-muted">
          {caption}
        </p>

        {/* ≥768: static centred row (wraps between 768 and 1279). */}
        <LogoList logos={logos} className="hidden max-w-[1115px] flex-wrap justify-center md:flex" />

        {/*
         * <768: auto-scrolling marquee with edge fades. Under reduced motion it stops and becomes
         * a horizontally scrollable row instead.
         */}
        <div className="-mx-(--gutter) w-[calc(100%+2*var(--gutter))] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] motion-reduce:overflow-x-auto md:hidden">
          <div className="flex w-max gap-[22px] animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:px-(--gutter)">
            <LogoList logos={logos} />
            <LogoList logos={logos} duplicate className="motion-reduce:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
