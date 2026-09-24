import type { ReactNode } from "react";
import { Footer } from "@/components/sections/footer";
import { HeroBackground } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";

/** Page chrome shared by every route: skip link, background pattern, sticky navbar, <main>, footer. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate">
      <a
        href="#main"
        className="sr-only z-50 min-h-11 items-center rounded-sm bg-surface px-4 font-semibold text-ink shadow-xl focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:inline-flex"
      >
        Skip to content
      </a>
      <HeroBackground />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
