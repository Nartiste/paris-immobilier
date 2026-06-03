/**
 * Configs des Hubs villes pour le générateur scaffold-city-hub.ts.
 *
 * Ajouter une ville = ajouter une entrée ici, puis lancer :
 *   npm run scaffold-hub <base>          (génère + insère les briefs manquants)
 *   npm run regenerate-blog -- <slug>    (pour chaque nouveau slug)
 *   npm run generate-blog-images         (covers)
 *   npm run build
 *
 * Le générateur produit jusqu'à 8 briefs standardisés (pilier + S1-S7) avec
 * CTA acheteur, interliens et data moot DVF par quartier. Les slots déjà
 * couverts par un article existant se mettent dans skipSlots (anti-cannibal),
 * et tout slug déjà présent dans blog-posts.ts est de toute façon ignoré.
 */

export type Quartier = {
  nom: string;
  fourchette: string; // ex: "7 500-8 500 €/m²"
  note: string; // ex: "boucle de la Marne, le plus prisé"
};

export type HubSlot = "pilier" | "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7";

export type CityHubConfig = {
  city: string; // nom complet, ex: "Saint-Maur-des-Fossés"
  cityShort: string; // ex: "Saint-Maur"
  base: string; // base de slug, ex: "saint-maur"
  ficheSlug: string; // ex: "saint-maur-des-fosses-94068"
  departement: string;
  median: number; // prix médian €/m²
  evolutionNote: string; // ex: "+1,2 % sur 5 ans, marché stable"
  quartiers: Quartier[];
  transport: string; // phrase dense sur la desserte
  contexte: string; // écoles / éco / ambiance, 1-2 phrases
  rendement: string; // ex: "3,2-3,8 % brut"
  fraisNotaire: string; // ex: "7,5-8 %"
  negoMargin: string; // ex: "3-6 %"
  comparison: {
    city: string; // ville voisine pour S7
    base: string; // base de slug voisine
    ficheSlug: string;
    price: number;
    angle: string; // ce qui distingue les deux
  };
  datasetCount: number; // pour la copy comparateur (176)
  dates: string[]; // 8 dates publishedAt (passées, ≤ aujourd'hui), une par slot
  skipSlots?: HubSlot[]; // slots déjà couverts par un article existant
};

export const CITY_HUBS: Record<string, CityHubConfig> = {
  "saint-maur": {
    city: "Saint-Maur-des-Fossés",
    cityShort: "Saint-Maur",
    base: "saint-maur",
    ficheSlug: "saint-maur-des-fosses-94068",
    departement: "Val-de-Marne",
    median: 6800,
    evolutionNote: "stable sur 5 ans (environ +1 %), marché de report familial",
    quartiers: [
      { nom: "Vieux Saint-Maur", fourchette: "7 500-8 500 €/m²", note: "dans la boucle de la Marne, esprit village, bord d'eau, le plus prisé" },
      { nom: "La Varenne", fourchette: "7 000-8 000 €/m²", note: "sud-est, bord de Marne, résidentiel chic, gare RER A La Varenne-Chennevières" },
      { nom: "Adamville", fourchette: "6 200-7 000 €/m²", note: "centre, commerçant, proche gare Saint-Maur-Créteil" },
      { nom: "Champignol", fourchette: "6 000-6 800 €/m²", note: "nord, pavillonnaire résidentiel" },
      { nom: "La Pie", fourchette: "5 800-6 500 €/m²", note: "sud, le plus abordable, en voie de normalisation" },
    ],
    transport:
      "quatre gares RER A sur la commune (Saint-Maur-Créteil, Le Parc de Saint-Maur, Champigny, La Varenne-Chennevières), Châtelet en 25-30 minutes, et la future ligne 15 Sud du Grand Paris Express à Saint-Maur-Créteil (ouverture vers 2025-2026)",
    contexte:
      "commune familiale-bourgeoise lovée dans une boucle de la Marne, écoles publiques et privées réputées (lycée Marcelin Berthelot, plusieurs collèges bien notés), bords de Marne pour le sport et la promenade, esprit village rare à 28 minutes de Paris",
    rendement: "3,2-3,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-6 % (tendu mais moins que la petite couronne ouest, davantage sur l'ancien à rénover)",
    comparison: {
      city: "Nogent-sur-Marne",
      base: "nogent",
      ficheSlug: "nogent-sur-marne-94052",
      price: 7600,
      angle:
        "Nogent-sur-Marne, plus chic, plus dense et plus proche de Paris (18 minutes, RER A et RER E), face à Saint-Maur plus grand, plus village, bord de Marne et un peu moins cher (6 800 vs 7 600 €/m²)",
    },
    datasetCount: 176,
    dates: [
      "2026-04-08",
      "2026-04-14",
      "2026-04-21",
      "2026-04-28",
      "2026-05-05",
      "2026-05-11",
      "2026-05-16",
      "2026-05-21",
    ],
    skipSlots: [],
  },
};
