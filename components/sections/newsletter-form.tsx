"use client";

import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import { footer } from "@/content/footer";
import { cn } from "@/lib/utils";
import sendIcon from "@/public/figma/icon-send.svg";

type Status = "idle" | "error" | "success";

/*
 * Figma 1:3778 — 319px pill (1px primary border, pl20 pr8 py8) with a 48px round primary submit.
 * Real <label>, type="email", autocomplete="email"; native constraint validation drives visible
 * error / success states announced via aria-live. No backend is wired yet (see TODO below).
 */
export function NewsletterForm() {
  const { newsletter } = footer;
  const inputId = useId();
  const messageId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    if (input.validity.valueMissing) {
      setStatus("error");
      setMessage(newsletter.errorEmpty);
    } else if (!input.validity.valid) {
      setStatus("error");
      setMessage(newsletter.errorInvalid);
    } else {
      // TODO: POST to the newsletter provider once the client picks one.
      setStatus("success");
      setMessage(newsletter.success);
      e.currentTarget.reset();
    }
    if (!input.validity.valid) input.focus();
  };

  return (
    <form noValidate onSubmit={onSubmit} className="relative w-full max-w-[319px]">
      <label htmlFor={inputId} className="sr-only">
        {newsletter.label}
      </label>
      <div
        className={cn(
          "flex items-center justify-between gap-2 rounded-full border bg-transparent py-[7px] pr-[7px] pl-[19px] transition-shadow focus-within:shadow-ring-primary",
          status === "error" ? "border-accent-red" : "border-primary",
        )}
      >
        <input
          id={inputId}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder={newsletter.placeholder}
          aria-invalid={status === "error" || undefined}
          aria-describedby={message ? messageId : undefined}
          onInput={() => status !== "idle" && setStatus("idle")}
          className="min-w-0 flex-1 bg-transparent font-body text-base leading-6 text-ink placeholder:text-ink/72 focus:outline-none"
        />
        <button
          type="submit"
          aria-label={newsletter.submitLabel}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary transition-colors hover:bg-primary-hover"
        >
          <Image src={sendIcon} alt="" width={24} height={24} unoptimized />
        </button>
      </div>
      <p
        id={messageId}
        aria-live="polite"
        // Message text stays ink: brand red on the cyan footer is only ~3.2:1. The error state is also
        // carried by the red field border (non-text, ≥3:1) and aria-invalid.
        // Sits in Figma's 20px bottom padding under the field, so showing it never shifts the layout.
        className="absolute top-full left-0 mt-1 w-max max-w-[min(360px,90vw)] font-body text-sm leading-5 font-medium text-ink"
      >
        {status === "idle" ? "" : message}
      </p>
    </form>
  );
}
