import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";
import logoMark from "@/public/figma/logo-mark.svg";

export type LogoProps = {
  className?: string;
  /** Wordmark colour — footer uses `text-ink-muted` (Figma: ink @ 80%). */
  wordmarkClassName?: string;
};

// Figma 1:2306: 40px primary tile (2px padding, radius 8) holding the 36px mark, 8px gap, Manrope Bold 24/28.
export function Logo({ className, wordmarkClassName }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cn("inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm", className)}
    >
      <span className="inline-flex rounded-sm bg-primary p-0.5">
        <Image src={logoMark} alt="" width={36} height={36} unoptimized />
      </span>
      <span className={cn("text-2xl leading-7 font-bold text-ink", wordmarkClassName)}>{site.name}</span>
    </Link>
  );
}
