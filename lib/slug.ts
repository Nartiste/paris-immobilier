/**
 * Slug réversible pour les URLs SEO `/vivre-a/[slug]`.
 *
 * Format : "nom-de-la-commune-INSEE" — l'INSEE final sert d'identifiant unique
 * et permet de retrouver la commune même si plusieurs villes ont le même nom.
 *
 * Ex : "fontenay-sous-bois-94033", "saint-denis-93066".
 */

import type { Commune } from "./types";

export function nameToSlug(nom: string): string {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function communeToSlug(c: Commune): string {
  return `${nameToSlug(c.nom)}-${c.code_insee}`;
}

/**
 * Reverse: given a slug, extract the INSEE (last 5-char block).
 */
export function slugToInsee(slug: string): string | null {
  const match = slug.match(/(\d[A-Z0-9]\d{3})$/i);
  return match ? match[1].toUpperCase() : null;
}
