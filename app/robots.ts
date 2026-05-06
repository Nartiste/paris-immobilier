import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /api/   : routes serveur, jamais utiles à indexer
        // /_next/ : assets Next.js (chunks JS, fonts .woff2, images optimisées).
        //           Google a tenté d'indexer 2 .woff2, on bloque la racine.
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
