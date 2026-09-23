import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AvatarStackProps = {
  children: ReactNode;
  /** Accessible summary of the group, e.g. "Team members". */
  label?: string;
  className?: string;
};

// Figma hero: avatars overlap by 12px (mr-[-12px]); last item sits on top of the pile.
export function AvatarStack({ children, label, className }: AvatarStackProps) {
  const items = Children.toArray(children);
  return (
    <span
      role={label ? "group" : undefined}
      aria-label={label}
      className={cn("inline-flex items-center", className)}
    >
      {items.map((child, i) => (
        <span key={i} className={cn("inline-flex", i < items.length - 1 && "-mr-3")}>
          {child}
        </span>
      ))}
    </span>
  );
}
