"use client";

import { useState, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export type ToggleProps = Omit<ComponentPropsWithoutRef<"button">, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

// Figma "_Toggle base": 36×20, 2px padding, 16px white knob with shadow;
// on = primary, off = surface-tertiary.
export function Toggle({
  checked,
  defaultChecked = false,
  onCheckedChange,
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
      className={cn(
        "inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
        isOn ? "bg-primary" : "bg-surface-tertiary",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-4 rounded-full bg-white shadow-knob transition-transform",
          isOn ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}
