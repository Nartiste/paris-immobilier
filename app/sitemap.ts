import type { MetadataRoute } from "next";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { TRANSPORT_LINES } from "@/lib/transport-lines";
import { PERSONAS } from "@/lib/persona";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { communeToSlug } from "@/lib/slug";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/comparer`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/ou-vivre-pres-de-paris`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...PERSONAS.map((p) => ({
      url: `${BASE}/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...BLOG_POSTS.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];

  const seen = new Set<string>();
  const communeUrls: MetadataRoute.Sitemap = SAMPLE_COMMUNES
    .filter((c) => {
      const slug = communeToSlug(c);
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    })
    .map((c) => ({
      url: `${BASE}/vivre-a/${communeToSlug(c)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const lineUrls: MetadataRoute.Sitemap = TRANSPORT_LINES.map((l) => ({
    url: `${BASE}/lignes/${l.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const tempsUrls: MetadataRoute.Sitemap = [15, 30, 45, 60, 90, 120].map(
    (t) => ({
      url: `${BASE}/a-${t}-minutes-de-paris`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    }),
  );

  return [...staticUrls, ...communeUrls, ...lineUrls, ...tempsUrls];
}
