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
  titleClassName?: string;
  descriptionClassName?: string;
};

// All section H2s use the `text-h2` token (40px desktop) with Figma's -2% tracking.
export function SectionHeading({
  id,
  title,
  description,
  align = "center",
  as: Heading = "h2",
  tone = "light",
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <Heading
        id={id}
        className={cn(
          "font-sans font-bold tracking-[-0.02em]",
          Heading === "h2" ? "text-h2" : "text-h3",
          tone === "dark" ? "text-white" : "text-ink",
          titleClassName,
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            // Figma: every section lead uses an Inter body style.
            "font-body text-lead",
            tone === "dark" ? "text-white/80" : "text-ink-subtle",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
