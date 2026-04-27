import type { MetadataRoute } from "next";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { communeToSlug } from "@/lib/slug";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paris-immobilier-git-main-prception.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const communeUrls: MetadataRoute.Sitemap = SAMPLE_COMMUNES.map((c) => ({
    url: `${BASE}/vivre-a/${communeToSlug(c)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticUrls, ...communeUrls];
}
