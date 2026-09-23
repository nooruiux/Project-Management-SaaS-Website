import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// Figma:
// - chip: hero "Update" pill — white, 1px #e9d7fe border, h28 px8, Manrope SemiBold 14/18, primary text.
// - new:  footer "New" pill — #f1f4ff, 1px primary border, h24 px8, radius 16, Inter Medium 12/18, ink text.
export const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap border",
  {
    variants: {
      variant: {
        chip: "h-7 rounded-full border-primary-border bg-surface px-2 font-sans text-sm leading-[18px] font-semibold text-primary",
        new: "h-6 rounded-lg border-primary bg-primary-wash px-2 font-ui text-xs leading-[18px] font-medium text-ink",
      },
    },
    defaultVariants: { variant: "chip" },
  },
);

export type BadgeProps = ComponentPropsWithoutRef<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
