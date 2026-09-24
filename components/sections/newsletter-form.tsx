"use client";

import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import { footer } from "@/content/footer";
import type { SubscribeCode } from "@/lib/newsletter";
import { cn } from "@/lib/utils";
import sendIcon from "@/public/figma/icon-send.svg";

// "error" = the input is wrong (field marked invalid); "notice" = a service problem (field untouched).
type Status = "idle" | "submitting" | "error" | "notice" | "success";

const codeMessage: Record<SubscribeCode, keyof typeof footer.newsletter> = {
  pending: "pending",
  exists: "exists",
  invalid: "errorInvalid",
  rate_limited: "rateLimited",
  unavailable: "unavailable",
  error: "error",
};

/*
 * Figma 1:3778 — 319px pill (1px primary border, pl20 pr8 py8) with a 48px round primary submit.
 * Real <label>, type="email", autocomplete="email". Client-side constraint validation first, then
 * POST /api/subscribe (server → Mailchimp, double opt-in). Every outcome gets a visible, announced state;
 * no fake success when the service is unavailable. `company` is a honeypot hidden from people.
 */
export function NewsletterForm() {
  const { newsletter } = footer;
  const inputId = useId();
  const messageId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const fail = (text: string, input?: HTMLInputElement) => {
    setStatus("error");
    setMessage(text);
    input?.focus();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const input = form.elements.namedItem("email") as HTMLInputElement;
    const honeypot = (form.elements.namedItem("company") as HTMLInputElement).value;

    if (input.validity.valueMissing) return fail(newsletter.errorEmpty, input);
    if (!input.validity.valid) return fail(newsletter.errorInvalid, input);

    setStatus("submitting");
    setMessage(newsletter.submitting);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value, company: honeypot }),
      });
      const { code } = (await res.json().catch(() => ({ code: "error" }))) as { code: SubscribeCode };
      const text = newsletter[codeMessage[code] ?? "error"];
      if (code === "pending" || code === "exists") {
        setStatus("success");
        setMessage(text);
        form.reset();
      } else if (code === "invalid") {
        fail(text, input);
      } else {
        setStatus("notice");
        setMessage(text);
      }
    } catch {
      setStatus("notice");
      setMessage(newsletter.error);
    }
  };

  const busy = status === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} className="relative w-full max-w-[319px]">
      <label htmlFor={inputId} className="sr-only">
        {newsletter.label}
      </label>
      {/* Honeypot: off-screen, unfocusable, ignored by assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
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
          maxLength={254}
          placeholder={newsletter.placeholder}
          aria-invalid={status === "error" || undefined}
          aria-describedby={message ? messageId : undefined}
          onInput={() => (status === "error" || status === "notice") && setStatus("idle")}
          className="min-w-0 flex-1 bg-transparent font-body text-base leading-6 text-ink placeholder:text-ink/72 focus:outline-none"
        />
        <button
          type="submit"
          aria-label={newsletter.submitLabel}
          aria-disabled={busy || undefined}
          className={cn(
            "inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary transition-colors hover:bg-primary-hover",
            busy && "cursor-progress opacity-70",
          )}
        >
          <Image src={sendIcon} alt="" width={24} height={24} unoptimized className={cn(busy && "animate-pulse")} />
        </button>
      </div>
      <p
        id={messageId}
        role="status"
        aria-live="polite"
        // Sits in Figma's 20px bottom padding under the field, so showing it never shifts the layout.
        // Text stays ink: brand red on the cyan footer is only ~3.2:1; errors also get the red field border.
        className="absolute top-full left-0 mt-1 w-max max-w-[min(360px,90vw)] font-body text-sm leading-5 font-medium text-ink"
      >
        {status === "idle" ? "" : message}
      </p>
    </form>
  );
}
