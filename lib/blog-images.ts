/**
 * Images hero pour les articles de blog.
 *
 * Architecture optimisée perf + SEO :
 *  - URLs externes (Wikimedia Commons principalement), zéro poids dans le repo
 *  - next/image optimise auto en AVIF/WebP + génère 5 tailles responsive
 *  - Hostname Wikimedia déjà whitelisté dans next.config.ts
 *  - Alt text descriptif pour ranking Google Images
 *  - Image utilisée aussi pour OpenGraph + schema.org BlogPosting.image
 *
 * Mapping pré-généré par scripts/generate-blog-images.ts → écrit dans
 * lib/blog-cover-images.ts. Zéro fetch au build, zéro fetch au runtime.
 */

import { BLOG_COVER_IMAGES } from "./blog-cover-images";

export type BlogCoverImage = {
  /** URL haute résolution de l'image (Wikimedia Commons typiquement) */
  url: string;
  /** Largeur native (en px, pour éviter le layout shift) */
  width: number;
  /** Hauteur native (en px) */
  height: number;
  /** Texte alt descriptif avec keyword principal */
  alt: string;
  /** Crédit visible sous l'image (ex: "Wikipedia · Annecy") */
  credit: string;
  /** Lien vers la source pour conformité licence */
  sourceUrl: string;
};

export function getBlogCoverImage(slug: string): BlogCoverImage | null {
  return BLOG_COVER_IMAGES[slug] ?? null;
}
