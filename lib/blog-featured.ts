/**
 * Vitrine éditoriale du blog : les articles mis en avant sur /blog,
 * dans cet ordre (le premier publié devient la une, les suivants
 * remplissent les premières cartes avant le fil chronologique).
 *
 * Critère : villes premium / images fortes pour le site (prestige,
 * notoriété, qualité perçue), PAS la date de publication. À terme,
 * remplacer ou pondérer par les pages vues GA4 quand l'accès API
 * sera branché.
 *
 * Un slug absent ou non publié est ignoré silencieusement : la liste
 * peut être éditée sans risque.
 */
export const FEATURED_SLUGS: string[] = [
  "vivre-a-versailles-2026",
  "vivre-a-neuilly-sur-seine-2026",
  "vivre-a-saint-germain-en-laye-2026",
  "vivre-a-vincennes-2026",
  "vivre-a-boulogne-2026",
  "vivre-a-enghien-les-bains-2026",
  "vivre-a-saint-cloud-2026",
  "vivre-a-le-vesinet-2026",
  "vivre-a-maisons-laffitte-2026",
  "vivre-a-sceaux-2026",
  "vivre-a-saint-maur-2026",
  "vivre-a-issy-les-moulineaux-2026",
  "vivre-a-rueil-malmaison-2026",
  "vivre-a-le-raincy-2026",
];
