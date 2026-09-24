import { hero } from "@/content/hero";
import { site } from "@/content/site";

/** schema.org graph for the home page. Every claim mirrors copy that's visible on the page (name, lead, 14-day free trial). */
export function StructuredData() {
  const orgId = `${site.url}/#organization`;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: site.name,
        url: `${site.url}/`,
        logo: `${site.url}/icons/icon-512.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: `${site.url}/`,
        description: site.description,
        publisher: { "@id": orgId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${site.url}/#software`,
        name: site.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: hero.lead,
        url: `${site.url}/`,
        publisher: { "@id": orgId },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: hero.note,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
