"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useState, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

// Figma "_Toggle base": 36×20, 2px padding, 16px white knob with shadow; on = primary, off = surface-tertiary.
// `mockup` is the same toggle at the 0.894 scale used inside the section-7 app mockup (32.19×17.89).
const trackVariants = cva("inline-flex shrink-0 items-center rounded-full transition-colors", {
  variants: {
    size: {
      md: "h-5 w-9 p-0.5",
      mockup: "h-[17.885px] w-[32.193px] p-[1.789px]",
    },
  },
  defaultVariants: { size: "md" },
});

const knobVariants = cva("rounded-full bg-white shadow-knob transition-transform", {
  variants: {
    size: {
      md: "size-4",
      mockup: "size-[14.308px]",
    },
    on: { true: "", false: "translate-x-0" },
  },
  compoundVariants: [
    { size: "md", on: true, class: "translate-x-4" },
    { size: "mockup", on: true, class: "translate-x-[14.308px]" },
  ],
  defaultVariants: { size: "md", on: false },
});

export type ToggleProps = Omit<ComponentPropsWithoutRef<"button">, "onChange"> &
  VariantProps<typeof trackVariants> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  };

export function Toggle({
  checked,
  defaultChecked = false,
  onCheckedChange,
  size,
  className,
  onClick,
  ...props
}: ToggleProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = checked ?? internal;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const next = !isOn;
        if (checked === undefined) setInternal(next);
        onCheckedChange?.(next);
      }}
      className={cn(trackVariants({ size }), isOn ? "bg-primary" : "bg-surface-tertiary", className)}
      {...props}
    >
      <span aria-hidden="true" className={knobVariants({ size, on: isOn })} />
    </button>
  );
}
