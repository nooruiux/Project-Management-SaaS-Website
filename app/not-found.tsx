import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { StatusPage } from "@/components/status-page";
import { routes } from "@/content/routes";

export const metadata: Metadata = {
  // Next already emits <meta name="robots" content="noindex"> for not-found responses.
  title: "Page not found — WorkUp",
};

export default function NotFound() {
  return (
    <SiteShell>
      <StatusPage
        eyebrow="404"
        title="We can't find that page"
        description="The page you're looking for doesn't exist or has moved. Let's get you back on track."
        primary={{ label: "Back to home", href: routes.home }}
        secondary={{ label: "Explore features", href: routes.features }}
      />
    </SiteShell>
  );
}
