import type { MetadataRoute } from "next";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { communeToSlug } from "@/lib/slug";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
  ];

  const communeUrls: MetadataRoute.Sitemap = SAMPLE_COMMUNES.map((c) => ({
    url: `${BASE}/vivre-a/${communeToSlug(c)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticUrls, ...communeUrls];
}
