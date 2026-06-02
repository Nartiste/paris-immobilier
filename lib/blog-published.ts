/**
 * Source unique de vérité pour les articles RÉELLEMENT publiables.
 *
 * Un brief peut exister dans BLOG_POSTS sans que son contenu markdown soit
 * encore généré dans BLOG_CONTENT (ex: génération Opus en attente, crédit API
 * épuisé, article en préparation). Dans ce cas on ne veut PAS l'exposer :
 *  - pas dans l'index /blog
 *  - pas dans le sitemap
 *  - pas dans la recherche
 *  - la page /blog/[slug] renvoie notFound() plutôt qu'un corps vide
 *
 * Tout consommateur qui liste des articles destinés au public DOIT utiliser
 * PUBLISHED_BLOG_POSTS (et non BLOG_POSTS brut).
 */
import { BLOG_POSTS } from "./blog-posts";
import { BLOG_CONTENT } from "./blog-content";

/** Vrai si l'article a un contenu markdown non vide prêt à afficher. */
export function hasPublishedContent(slug: string): boolean {
  const c = BLOG_CONTENT[slug];
  return typeof c === "string" && c.trim().length > 0;
}

/** Articles avec contenu réel, prêts à être exposés publiquement. */
export const PUBLISHED_BLOG_POSTS = BLOG_POSTS.filter((p) =>
  hasPublishedContent(p.slug),
);
