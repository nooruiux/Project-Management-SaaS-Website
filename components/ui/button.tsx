import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Figma: navbar CTA = md (h48 px24), hero CTAs = lg (h56 px32); radius 8, Manrope Bold 16.
export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm font-sans font-bold leading-none transition-colors disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-hover",
        secondary:
          "border-[1.4px] border-primary bg-surface text-ink hover:bg-primary-soft",
        ghost: "text-ink hover:text-primary",
      },
      size: {
        sm: "h-11 px-5 text-sm",
        md: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

type ButtonAsButton = ButtonOwnProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonAsLink = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant, size, leftIcon, rightIcon, className, children, ...rest } = props;
  const classes = cn(buttonVariants({ variant, size }), className);
  const content = (
    <>
      {leftIcon ? <span aria-hidden="true" className="inline-flex shrink-0">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span aria-hidden="true" className="inline-flex shrink-0">{rightIcon}</span> : null}
    </>
  );

  if (typeof rest.href === "string") {
    const linkProps = rest as Omit<ButtonAsLink, keyof ButtonOwnProps | "className" | "children">;
    return (
      <Link className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = rest as Omit<ButtonAsButton, keyof ButtonOwnProps | "className" | "children">;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
