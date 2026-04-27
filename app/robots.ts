import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paris-immobilier-git-main-prception.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
