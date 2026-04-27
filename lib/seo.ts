/**
 * Helpers SEO + GEO partagés par toutes les pages.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

export type Breadcrumb = {
  name: string;
  /** URL relative ou absolue. Si vide, c'est le dernier item (page courante). */
  url?: string;
};

/**
 * Génère le JSON-LD BreadcrumbList pour les rich snippets Google + LLMs.
 */
export function breadcrumbJsonLd(items: Breadcrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}` } : {}),
    })),
  };
}
