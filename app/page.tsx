import { DeliverProjects } from "@/components/sections/deliver-projects";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { Integrations } from "@/components/sections/integrations";
import { LogoCloud } from "@/components/sections/logo-cloud";
import { StrategicPlanning } from "@/components/sections/strategic-planning";
import { Testimonials } from "@/components/sections/testimonials";
import { WorkFaster } from "@/components/sections/work-faster";
import { SiteShell } from "@/components/site-shell";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <LogoCloud />
      <Features />
      <WorkFaster />
      <StrategicPlanning />
      <DeliverProjects />
      <Integrations />
      <Testimonials />
    </SiteShell>
  );
}
