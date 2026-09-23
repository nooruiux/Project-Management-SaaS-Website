import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InputProps = ComponentPropsWithoutRef<"input"> & {
  /** Accessible label. Visually hidden unless `showLabel` is set. */
  label: string;
  showLabel?: boolean;
  /** Trailing slot, e.g. the newsletter submit button. */
  trailing?: ReactNode;
  wrapperClassName?: string;
};

// Figma newsletter field: pill, 1px primary border, pl20 pr8 py8, Inter Regular 16/24.
export function Input({
  label,
  showLabel = false,
  trailing,
  id,
  className,
  wrapperClassName,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      <label htmlFor={inputId} className={cn(showLabel ? "font-ui text-sm font-medium text-ink" : "sr-only")}>
        {label}
      </label>
      <div className="flex items-center justify-between gap-2 rounded-full border border-primary py-2 pr-2 pl-5 focus-within:shadow-ring-primary">
        <input
          id={inputId}
          className={cn(
            "min-w-0 flex-1 bg-transparent font-ui text-base leading-6 text-ink placeholder:text-ink-subtle focus:outline-none",
            className,
          )}
          {...props}
        />
        {trailing}
      </div>
    </div>
  );
}
