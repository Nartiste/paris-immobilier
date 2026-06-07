#!/usr/bin/env tsx
/**
 * Génère une image hero par article de blog, en stratégie cascadée :
 *
 *   1. Détection commune dans titre/slug → Wikipedia commune
 *   2. Détection ligne transport (RER, Transilien, TGV) → Wikipedia
 *   3. Détection mot-clé géographique (Annecy, Chambéry, Paris, etc.)
 *   4. Fallback catégorie (transport, finance, persona, etc.) → image Wikimedia générique pré-curée
 *
 * Output : écrit dans lib/blog-cover-images.ts (Record<slug, BlogCoverImage>).
 * Incrémental : skip les slugs déjà présents (delete la clé pour régénérer).
 *
 * Usage :
 *   npm run generate-blog-images               # tous les articles manquants
 *   npm run generate-blog-images <slug>        # un slug spécifique (re-fetch même si déjà mappé)
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { BLOG_POSTS } from "../lib/blog-posts.js";
import { SAMPLE_COMMUNES } from "../lib/sample-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Types
// ============================================================================

type BlogCoverImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  sourceUrl: string;
};

type WikiSummary = {
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
  titles?: { normalized: string };
  content_urls?: { desktop?: { page: string } };
  type?: string;
};

// ============================================================================
// Overrides par mot-clé de slug (priorité maximale).
// Pour les villes dont le résumé Wikipedia FR n'a PAS d'image (ex:
// Boulogne-Billancourt) ou dont le nom court dans les titres ne matche pas le
// nom complet du dataset. Le 1er match (slug.includes) gagne.
// ============================================================================

const SLUG_IMAGE_OVERRIDES: Array<{ match: string; image: BlogCoverImage }> = [
  {
    match: "boulogne",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/View_on_Boulogne-Billancourt_from_Parc_de_Saint-Cloud_140411_1.jpg/1920px-View_on_Boulogne-Billancourt_from_Parc_de_Saint-Cloud_140411_1.jpg",
      width: 1920,
      height: 478,
      alt: "Boulogne-Billancourt vue depuis le parc de Saint-Cloud",
      credit: "Wikipedia · Boulogne-Billancourt",
      sourceUrl: "https://fr.wikipedia.org/wiki/Boulogne-Billancourt",
    },
  },
  {
    // "Montreuil" tout court est une page d'homonymie sans image.
    match: "montreuil",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/H%C3%B4tel_ville_Montreuil_Seine_St_Denis_15.jpg/1920px-H%C3%B4tel_ville_Montreuil_Seine_St_Denis_15.jpg",
      width: 1920,
      height: 1394,
      alt: "Hôtel de ville de Montreuil, Seine-Saint-Denis",
      credit: "Wikipedia · Montreuil",
      sourceUrl: "https://fr.wikipedia.org/wiki/Montreuil_(Seine-Saint-Denis)",
    },
  },
  {
    // "Malakoff" est une page d'homonymie (bataille de Crimée…) sans image : on force l'hôtel de ville.
    // Placé avant "montrouge" pour que malakoff-ou-montrouge prenne bien l'image de Malakoff.
    match: "malakoff",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/H%C3%B4tel_ville_Malakoff_Hauts_Seine_1.jpg/1280px-H%C3%B4tel_ville_Malakoff_Hauts_Seine_1.jpg",
      width: 1280,
      height: 960,
      alt: "Hôtel de ville de Malakoff, Hauts-de-Seine",
      credit: "Wikipedia · Malakoff",
      sourceUrl: "https://fr.wikipedia.org/wiki/Malakoff_(Hauts-de-Seine)",
    },
  },
  {
    // "Châtillon" est une page d'homonymie : on force l'église Notre-Dame-du-Calvaire (monument classé).
    match: "chatillon",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/%C3%89glise_Notre-Dame-du-Calvaire_-_Ch%C3%A2tillon_-_Haut-de-Seine_%E2%80%93_France_%E2%80%93_M%C3%A9rim%C3%A9e_PA92000012_%282%29.jpg/1280px-%C3%89glise_Notre-Dame-du-Calvaire_-_Ch%C3%A2tillon_-_Haut-de-Seine_%E2%80%93_France_%E2%80%93_M%C3%A9rim%C3%A9e_PA92000012_%282%29.jpg",
      width: 1280,
      height: 960,
      alt: "Église Notre-Dame-du-Calvaire de Châtillon, monument classé",
      credit: "Wikipedia · Châtillon",
      sourceUrl: "https://fr.wikipedia.org/wiki/Ch%C3%A2tillon_(Hauts-de-Seine)",
    },
  },
  {
    // La page "Montrouge" n'a pas d'image d'infobox : on force le Beffroi, son landmark.
    match: "montrouge",
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Le_Beffroi_%28Montrouge%29_2017.jpg/1280px-Le_Beffroi_%28Montrouge%29_2017.jpg",
      width: 1280,
      height: 853,
      alt: "Le Beffroi, équipement culturel emblématique de Montrouge",
      credit: "Wikipedia · Montrouge",
      sourceUrl: "https://fr.wikipedia.org/wiki/Montrouge",
    },
  },
];

// ============================================================================
// Fallbacks pré-curés (Wikimedia Commons, libres de droits)
// Par catégorie d'article. URL pointent sur upload.wikimedia.org direct.
// ============================================================================

const CATEGORY_FALLBACKS: Record<string, BlogCoverImage> = {
  transport: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Gare_du_Nord_Paris_2007.jpg/1920px-Gare_du_Nord_Paris_2007.jpg",
    width: 1920,
    height: 1280,
    alt: "Gare du Nord, hub ferroviaire de Paris Île-de-France",
    credit: "Wikipedia · Gare du Nord",
    sourceUrl: "https://fr.wikipedia.org/wiki/Gare_du_Nord",
  },
  finance: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Paris_Opera_full_frontal_architecture%2C_May_2009.jpg/1920px-Paris_Opera_full_frontal_architecture%2C_May_2009.jpg",
    width: 1920,
    height: 1280,
    alt: "Architecture haussmannienne parisienne, marché immobilier",
    credit: "Wikipedia · Paris",
    sourceUrl: "https://fr.wikipedia.org/wiki/Paris",
  },
  tendance: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Tour_Eiffel_Wikimedia_Commons.jpg/1280px-Tour_Eiffel_Wikimedia_Commons.jpg",
    width: 1280,
    height: 1920,
    alt: "Paris depuis la Tour Eiffel, métropole francilienne en mutation",
    credit: "Wikipedia · Paris",
    sourceUrl: "https://fr.wikipedia.org/wiki/Paris",
  },
  persona: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Parc_de_Saint-Cloud_avec_vue_de_Paris.jpg/1920px-Parc_de_Saint-Cloud_avec_vue_de_Paris.jpg",
    width: 1920,
    height: 1280,
    alt: "Famille parisienne dans un parc en banlieue ouest",
    credit: "Wikipedia · Saint-Cloud",
    sourceUrl: "https://fr.wikipedia.org/wiki/Parc_de_Saint-Cloud",
  },
  guide: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sceaux_park_grand_canal.jpg/1920px-Sceaux_park_grand_canal.jpg",
    width: 1920,
    height: 1280,
    alt: "Vivre en banlieue parisienne, parc de Sceaux",
    credit: "Wikipedia · Sceaux",
    sourceUrl: "https://fr.wikipedia.org/wiki/Sceaux_(Hauts-de-Seine)",
  },
};

// ============================================================================
// Wikipedia REST API helper
// ============================================================================

async function fetchWikiSummary(pageTitle: string): Promise<WikiSummary | null> {
  try {
    const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "VivrePresDeParis/1.0 (https://vivre-pres-de-paris.fr)",
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as WikiSummary;
  } catch {
    return null;
  }
}

function wikiToCover(
  data: WikiSummary,
  altOverride: string,
  pageTitle: string,
): BlogCoverImage | null {
  if (!data.thumbnail?.source) return null;
  const original = data.originalimage ?? data.thumbnail;
  return {
    url: original.source,
    width: original.width,
    height: original.height,
    alt: altOverride,
    credit: `Wikipedia · ${data.titles?.normalized ?? pageTitle}`,
    sourceUrl:
      data.content_urls?.desktop?.page ??
      `https://fr.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
  };
}

// ============================================================================
// Détection d'entités
// ============================================================================

/** Détecte la commune mentionnée dans le titre via SAMPLE_COMMUNES. */
function detectCommune(title: string, slug: string): { nom: string; alt: string } | null {
  const lowerTitle = title.toLowerCase();
  const lowerSlug = slug.toLowerCase();
  // Tri par longueur descendante pour matcher "Saint-Germain-en-Laye" avant "Saint-Germain"
  const sorted = [...SAMPLE_COMMUNES].sort((a, b) => b.nom.length - a.nom.length);
  for (const c of sorted) {
    const nameLower = c.nom.toLowerCase();
    const slugForm = nameLower
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (lowerTitle.includes(nameLower) || lowerSlug.includes(slugForm)) {
      return {
        nom: c.nom,
        alt: `Vivre à ${c.nom} (${c.code_postal}), ${c.departement}`,
      };
    }
  }
  return null;
}

/** Détecte une ligne de transport mentionnée dans le titre. */
function detectTransportLine(title: string): { wikiTitle: string; alt: string } | null {
  const lower = title.toLowerCase();
  const lineMatchers: Array<{ regex: RegExp; wikiTitle: string; alt: string }> = [
    { regex: /\brer\s*a\b/, wikiTitle: "RER A", alt: "Ligne RER A, Île-de-France" },
    { regex: /\brer\s*b\b/, wikiTitle: "RER B", alt: "Ligne RER B, Île-de-France" },
    { regex: /\brer\s*c\b/, wikiTitle: "RER C", alt: "Ligne RER C, Île-de-France" },
    { regex: /\brer\s*d\b/, wikiTitle: "RER D", alt: "Ligne RER D, Île-de-France" },
    { regex: /\brer\s*e\b/, wikiTitle: "RER E", alt: "Ligne RER E, Île-de-France" },
    { regex: /transilien\s*[hjklnpru]\b/i, wikiTitle: "Transilien", alt: "Réseau Transilien SNCF, Île-de-France" },
    { regex: /grand paris express|gpe|ligne 14|ligne 15|ligne 16|ligne 17|ligne 18/, wikiTitle: "Grand Paris Express", alt: "Grand Paris Express, futur métro automatique" },
    { regex: /\btgv\b/, wikiTitle: "TGV", alt: "TGV, train à grande vitesse SNCF" },
  ];
  for (const m of lineMatchers) {
    if (m.regex.test(lower)) return { wikiTitle: m.wikiTitle, alt: m.alt };
  }
  return null;
}

/** Détecte un keyword géographique générique (Paris, Lyon, etc.). */
function detectGeoKeyword(title: string): { wikiTitle: string; alt: string } | null {
  const lower = title.toLowerCase();
  const geoMatchers: Array<{ regex: RegExp; wikiTitle: string; alt: string }> = [
    { regex: /lyon\b/, wikiTitle: "Lyon", alt: "Lyon, métropole rhône-alpine" },
    { regex: /\bnantes\b/, wikiTitle: "Nantes", alt: "Nantes, métropole atlantique" },
    { regex: /\brennes\b/, wikiTitle: "Rennes", alt: "Rennes, capitale bretonne" },
    { regex: /\bbordeaux\b/, wikiTitle: "Bordeaux", alt: "Bordeaux, métropole girondine" },
    { regex: /\bmarseille\b/, wikiTitle: "Marseille", alt: "Marseille, métropole méditerranéenne" },
    { regex: /\btoulouse\b/, wikiTitle: "Toulouse", alt: "Toulouse, métropole occitane" },
    { regex: /\bstrasbourg\b/, wikiTitle: "Strasbourg", alt: "Strasbourg, capitale alsacienne" },
    { regex: /\bdijon\b/, wikiTitle: "Dijon", alt: "Dijon, capitale bourguignonne" },
    { regex: /\bnormandie\b/, wikiTitle: "Normandie", alt: "Normandie, région côtière" },
    { regex: /\bbretagne\b/, wikiTitle: "Bretagne", alt: "Bretagne, région atlantique" },
    { regex: /\boccitanie\b/, wikiTitle: "Occitanie", alt: "Occitanie, région du Sud" },
    { regex: /\bgrand paris\b/, wikiTitle: "Métropole du Grand Paris", alt: "Métropole du Grand Paris" },
    { regex: /\bbanlieue parisienne\b/, wikiTitle: "Banlieue de Paris", alt: "Banlieue parisienne" },
    { regex: /\bparis\b/, wikiTitle: "Paris", alt: "Paris, capitale française" },
  ];
  for (const m of geoMatchers) {
    if (m.regex.test(lower)) return { wikiTitle: m.wikiTitle, alt: m.alt };
  }
  return null;
}

// ============================================================================
// Stratégie principale par article
// ============================================================================

async function resolveImageForArticle(post: (typeof BLOG_POSTS)[number]): Promise<BlogCoverImage> {
  const title = post.title;
  const slug = post.slug;
  const category = post.category;

  // 0. Override par mot-clé de slug (priorité max, pas de fetch)
  for (const o of SLUG_IMAGE_OVERRIDES) {
    if (slug.includes(o.match)) return o.image;
  }

  // 1. Commune
  const commune = detectCommune(title, slug);
  if (commune) {
    const data = await fetchWikiSummary(commune.nom);
    if (data) {
      const cover = wikiToCover(data, commune.alt, commune.nom);
      if (cover) return cover;
    }
  }

  // 2. Ligne transport
  const line = detectTransportLine(title);
  if (line) {
    const data = await fetchWikiSummary(line.wikiTitle);
    if (data) {
      const cover = wikiToCover(data, line.alt, line.wikiTitle);
      if (cover) return cover;
    }
  }

  // 3. Keyword géographique
  const geo = detectGeoKeyword(title);
  if (geo) {
    const data = await fetchWikiSummary(geo.wikiTitle);
    if (data) {
      const cover = wikiToCover(data, geo.alt, geo.wikiTitle);
      if (cover) return cover;
    }
  }

  // 4. Fallback catégorie
  return CATEGORY_FALLBACKS[category] ?? CATEGORY_FALLBACKS.guide;
}

// ============================================================================
// Output file mgmt
// ============================================================================

function loadExisting(outPath: string): Record<string, BlogCoverImage> {
  if (!fs.existsSync(outPath)) return {};
  try {
    const content = fs.readFileSync(outPath, "utf-8");
    const match = content.match(/BLOG_COVER_IMAGES\s*:\s*Record<string,\s*BlogCoverImage>\s*=\s*({[\s\S]*?})\s*;/);
    if (!match) return {};
    return Function(`return ${match[1]};`)() as Record<string, BlogCoverImage>;
  } catch (err) {
    console.warn("Échec parsing existant, on repart à vide :", err);
    return {};
  }
}

function writeOutput(outPath: string, content: Record<string, BlogCoverImage>): void {
  const entries = Object.keys(content)
    .sort()
    .map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(content[k])}`)
    .join(",\n");

  const ts = `// Auto-généré via scripts/generate-blog-images.ts
// Pour régénérer un slug : supprime sa clé puis relance le script
// Pour tout régénérer : supprime ce fichier puis relance

import type { BlogCoverImage } from "./blog-images";

export const BLOG_COVER_IMAGES: Record<string, BlogCoverImage> = {
${entries}
};
`;

  fs.writeFileSync(outPath, ts);
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const outPath = path.resolve(__dirname, "..", "lib", "blog-cover-images.ts");
  const existing = loadExisting(outPath);

  const targetSlug = process.argv[2];
  const targets = targetSlug
    ? BLOG_POSTS.filter((p) => p.slug === targetSlug)
    : BLOG_POSTS.filter((p) => !existing[p.slug]);

  if (targets.length === 0) {
    console.log(`✅ Tous les ${BLOG_POSTS.length} articles ont déjà une image. Rien à faire.`);
    return;
  }

  console.log(`📸 Génération hero images pour ${targets.length} articles…\n`);

  let i = 0;
  for (const post of targets) {
    i++;
    process.stdout.write(`   [${i}/${targets.length}] ${post.slug}… `);
    const cover = await resolveImageForArticle(post);
    existing[post.slug] = cover;
    // Save après chaque article (incrémental, safe si crash)
    writeOutput(outPath, existing);
    console.log(`✓ ${cover.credit}`);
  }

  console.log(`\n✅ Terminé. ${Object.keys(existing).length} articles dans lib/blog-cover-images.ts`);
}

main().catch((err) => {
  console.error("❌ Erreur :", err);
  process.exit(1);
});
