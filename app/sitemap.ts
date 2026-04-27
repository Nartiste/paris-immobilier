import type { MetadataRoute } from "next";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { TRANSPORT_LINES } from "@/lib/transport-lines";
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

  const lineUrls: MetadataRoute.Sitemap = TRANSPORT_LINES.map((l) => ({
    url: `${BASE}/lignes/${l.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticUrls, ...communeUrls, ...lineUrls];
}
