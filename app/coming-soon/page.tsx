import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { StatusPage } from "@/components/status-page";
import { routes } from "@/content/routes";

export const metadata: Metadata = {
  title: "Coming soon — WorkUp",
  description: "This part of WorkUp isn't live yet.",
  robots: { index: false, follow: true },
  alternates: { canonical: routes.comingSoon },
};

export default function ComingSoonPage() {
  return (
    <SiteShell>
      <StatusPage
        eyebrow="Coming soon"
        title="We're still building this page"
        description="This part of WorkUp isn't live yet. In the meantime, take a look at what the platform can already do."
        primary={{ label: "Explore features", href: routes.features }}
        secondary={{ label: "Back to home", href: routes.home }}
      />
    </SiteShell>
  );
}
