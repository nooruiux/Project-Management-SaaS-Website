import { Hero, HeroBackground } from "@/components/sections/hero";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { Navbar } from "@/components/sections/navbar";

export default function Home() {
  return (
    <div className="relative isolate">
      <a
        href="#main"
        className="sr-only z-50 min-h-11 items-center rounded-sm bg-surface px-4 font-semibold text-ink shadow-xl focus:not-sr-only focus:fixed focus:inline-flex focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <HeroBackground />
      <Navbar />
      <main id="main">
        <Hero />
        <LogoCloud />
      </main>
    </div>
  );
}
