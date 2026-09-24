import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type GridPatternProps = {
  /** Frame height (Figma clip). Width is always the 1440px design frame, centred. */
  height: number;
  /** Filled 64px cells, in frame coordinates. */
  cells: ReadonlyArray<readonly [number, number]>;
  /** background-position of the 64px line grid (Figma content offset + 1px inside stroke). */
  gridPosition: string;
  /** Top of the line grid inside the frame (lines never render above it). */
  gridTop?: number;
  /** CSS mask-image reproducing the Figma alpha mask. */
  mask: string;
  /** Extra layers drawn above the grid (e.g. per-row stroke overrides). */
  children?: ReactNode;
  className?: string;
};

/*
 * Figma "Background pattern" (used in the hero 1:1649 and testimonials 1:3054): 64px blocks with a 1px
 * rgba(208,213,221,0.8) right/bottom stroke, some blocks filled #e6e6e6 (= border token), the whole frame
 * at 32% opacity under an alpha mask. Built in CSS so it never becomes an LCP image.
 */
export function GridPattern({ height, cells, gridPosition, gridTop = 0, mask, children, className }: GridPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 -z-10 overflow-hidden", className)}
      style={{ height }}
    >
      <div
        className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2 opacity-[0.32]"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {cells.map(([x, y]) => (
          <span key={`${x}-${y}`} className="absolute size-16 bg-border" style={{ left: x, top: y }} />
        ))}
        <div
          className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_right,transparent_63px,rgba(208,213,221,0.8)_63px),linear-gradient(to_bottom,transparent_63px,rgba(208,213,221,0.8)_63px)] bg-size-[64px_64px]"
          style={{ top: gridTop, backgroundPosition: gridPosition }}
        />
        {children}
      </div>
    </div>
  );
}
