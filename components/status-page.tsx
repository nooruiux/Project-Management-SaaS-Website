import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type StatusPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  children?: ReactNode;
};

/** Branded full-height message page (coming soon, 404) built only from design-system tokens and primitives. */
export function StatusPage({ eyebrow, title, description, primary, secondary }: StatusPageProps) {
  return (
    <section aria-labelledby="status-title" className="container-site flex min-h-[70dvh] flex-col items-center justify-center gap-10 py-24 text-center">
      <div className="flex max-w-[640px] flex-col items-center gap-6">
        <Badge variant="chip">{eyebrow}</Badge>
        <h1 id="status-title" className="text-display leading-[1.1875] font-bold tracking-[-0.02em] text-ink">
          {title}
        </h1>
        <p className="max-w-[560px] text-lead text-ink-subtle">{description}</p>
      </div>
      <div className="flex w-full flex-col gap-[18px] md:w-auto md:flex-row">
        <Button href={primary.href} size="lg" className="w-full md:w-auto">
          {primary.label}
        </Button>
        {secondary ? (
          <Button href={secondary.href} variant="secondary" size="lg" className="w-full md:w-auto">
            {secondary.label}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
