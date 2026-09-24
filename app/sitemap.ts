import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Only indexable pages. /coming-soon is noindex, so it's deliberately left out.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${site.url}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
