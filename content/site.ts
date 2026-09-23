export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  url: string;
};

const productionUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const site: SiteConfig = {
  name: "WorkUp",
  title: "WorkUp — Streamline work for team productivity",
  description:
    "Boost team collaboration and communication. Our platform provides a central hub for organizing tasks, track progress, and staying in sync.",
  url: productionUrl,
};
