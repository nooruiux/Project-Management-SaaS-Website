import { Button } from "@/components/ui/button";
import { hero } from "@/content/hero";

// Interim shell for the scaffold commit — replaced by the composed sections from PHASE 3 onward.
export default function Home() {
  const { headline } = hero;
  return (
    <main id="main" className="container-site flex min-h-dvh flex-col items-center justify-center gap-10 py-24 text-center">
      <div className="flex max-w-[681px] flex-col items-center gap-6">
        <h1 className="text-display font-bold tracking-[-0.02em] text-ink">
          {headline.beforeIcon} {headline.betweenIconAndAvatars} {headline.afterAvatars}
        </h1>
        <p className="max-w-[637px] text-lead text-ink-subtle">{hero.lead}</p>
      </div>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-[18px] sm:w-auto sm:flex-row">
          <Button href={hero.primaryCta.href} size="lg" className="w-full sm:w-auto">
            {hero.primaryCta.label}
          </Button>
          <Button href={hero.secondaryCta.href} variant="secondary" size="lg" className="w-full sm:w-auto">
            {hero.secondaryCta.label}
          </Button>
        </div>
        <p className="text-sm text-ink-muted">{hero.note}</p>
      </div>
    </main>
  );
}
