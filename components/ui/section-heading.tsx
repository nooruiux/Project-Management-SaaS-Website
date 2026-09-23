import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionHeadingProps = {
  /** Used by the parent <section aria-labelledby>. */
  id: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  /** Heading level; sections use h2 by default. */
  as?: "h2" | "h3";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  id,
  title,
  description,
  align = "center",
  as: Heading = "h2",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <Heading
        id={id}
        className={cn(
          "font-sans font-bold",
          Heading === "h2" ? "text-h2" : "text-h3",
          tone === "dark" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className={cn("text-lead", tone === "dark" ? "text-white/80" : "text-ink-muted")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
