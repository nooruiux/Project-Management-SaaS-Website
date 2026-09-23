import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

export type CardProps<T extends ElementType = "div"> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

// Neutral surface container; section-specific padding/radius/background are passed via className.
export function Card<T extends ElementType = "div">({ as, className, ...props }: CardProps<T>) {
  const Component: ElementType = as ?? "div";
  return <Component className={cn("rounded-xl bg-surface", className)} {...props} />;
}
