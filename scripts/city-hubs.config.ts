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
  includePilier?: boolean; // ajoute un 8e article pilier "acheter X" (off par défaut)
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

  montreuil: {
    city: "Montreuil",
    cityShort: "Montreuil",
    base: "montreuil",
    ficheSlug: "montreuil-93048",
    departement: "Seine-Saint-Denis",
    median: 5800,
    evolutionNote: "en hausse sur 5 ans (gentrification du Bas-Montreuil), marché contrasté est-ouest",
    quartiers: [
      { nom: "Bas-Montreuil", fourchette: "6 500-7 500 €/m²", note: "ouest, collé à Paris et au métro 9, gentrifié, ateliers d'artistes, le plus cher" },
      { nom: "Croix-de-Chavaux", fourchette: "5 500-6 500 €/m²", note: "centre vivant, métro 9, marché, commerces" },
      { nom: "Bel-Air / Signac", fourchette: "5 200-6 000 €/m²", note: "hauteurs résidentielles, calme, vues" },
      { nom: "La Boissière", fourchette: "4 600-5 400 €/m²", note: "est, populaire, désservi par le prolongement du métro 11 (2024)" },
      { nom: "Hauts-de-Montreuil / Murs-à-Pêches", fourchette: "4 500-5 300 €/m²", note: "est, en mutation, jardins historiques des Murs-à-Pêches, le plus abordable" },
    ],
    transport:
      "le métro 9 (Mairie de Montreuil, Croix-de-Chavaux, Robespierre) qui rejoint le centre de Paris en 20-25 minutes, le prolongement du métro 11 ouvert en 2024 vers l'est (stations Montreuil-Hôpital et La Dhuys), et un réseau de bus dense",
    contexte:
      "la commune la plus peuplée de Seine-Saint-Denis avec Saint-Denis (110 000 habitants), capitale culturelle alternative de l'est parisien (cinéma, plus forte densité d'artistes d'Île-de-France, marchés bio), gentrification rapide du Bas-Montreuil mais contrastes sociaux et scolaires marqués entre l'ouest collé à Paris et l'est populaire",
    rendement: "4-4,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 % (variable selon le secteur, plus à l'est)",
    comparison: {
      city: "Vincennes",
      base: "vincennes",
      ficheSlug: "vincennes-94080",
      price: 9200,
      angle:
        "Montreuil, gentrifiant, créatif et abordable (5 800 €/m²), face à Vincennes, établie, bourgeoise et premium (9 200 €/m²), deux voisines de l'est aux profils opposés",
    },
    datasetCount: 176,
    dates: [
      "2026-04-09",
      "2026-04-15",
      "2026-04-22",
      "2026-04-29",
      "2026-05-06",
      "2026-05-12",
      "2026-05-18",
      "2026-05-23",
    ],
    // S2-S7 déjà générés ; on laisse le générateur compléter le S1 manquant
    // (le slug acheter-montreuil-quartier-par-quartier reste le pilier).
    skipSlots: [],
  },

  versailles: {
    city: "Versailles",
    cityShort: "Versailles",
    base: "versailles",
    ficheSlug: "versailles-78646",
    departement: "Yvelines",
    median: 7400,
    evolutionNote: "stable à légèrement en baisse sur 5 ans, marché de prestige",
    quartiers: [
      { nom: "Notre-Dame", fourchette: "8 000-9 500 €/m²", note: "centre nord, marché Notre-Dame, le plus cher et le plus demandé" },
      { nom: "Saint-Louis", fourchette: "7 500-9 000 €/m²", note: "centre sud, quartier des antiquaires, cathédrale, calme bourgeois" },
      { nom: "Clagny-Glatigny", fourchette: "7 500-8 800 €/m²", note: "résidentiel chic nord, proche du château et du parc" },
      { nom: "Porchefontaine", fourchette: "6 500-7 800 €/m²", note: "sud-est, esprit village très prisé des familles" },
      { nom: "Chantiers", fourchette: "6 000-7 200 €/m²", note: "autour de la gare des Chantiers, en mutation, plus jeune et abordable" },
      { nom: "Montreuil (quartier de Versailles)", fourchette: "6 000-7 200 €/m²", note: "est, plus populaire, en hausse" },
    ],
    transport:
      "trois gares (Versailles Rive Gauche, RER C vers Invalides en 35 min ; Versailles-Chantiers, Transilien N/U et TER vers Montparnasse en 15-30 min plus le tram T13 ; Versailles Rive Droite, Transilien L vers Saint-Lazare en 30 min), et la future ligne 18 du Grand Paris Express à Satory vers 2030",
    contexte:
      "ville de prestige autour du château, écoles et lycées réputés (Hoche, La Bruyère), université UVSQ, marché Notre-Dame, cadre patrimonial et familial recherché par les Parisiens en quête d'espace et d'écoles",
    rendement: "2,8-3,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-6 % (tendu sur le centre, plus sur l'ancien à rénover et les passoires DPE)",
    comparison: {
      city: "Saint-Germain-en-Laye",
      base: "saint-germain-en-laye",
      ficheSlug: "saint-germain-en-laye-78551",
      price: 7100,
      angle:
        "Versailles (3 gares, château, marché, plus urbaine, 7 400 €/m²) face à Saint-Germain-en-Laye (RER A direct, forêt, lycée international, 7 100 €/m²), le duel prestige des Yvelines",
    },
    datasetCount: 176,
    dates: [
      "2026-04-11",
      "2026-04-13",
      "2026-04-16",
      "2026-04-23",
      "2026-04-30",
      "2026-05-08",
      "2026-05-14",
      "2026-05-21",
    ],
    skipSlots: [],
  },

  "rueil-malmaison": {
    city: "Rueil-Malmaison",
    cityShort: "Rueil-Malmaison",
    base: "rueil-malmaison",
    ficheSlug: "rueil-malmaison-92063",
    departement: "Hauts-de-Seine",
    median: 6900,
    evolutionNote: "stable sur 5 ans, marché résidentiel familial",
    quartiers: [
      { nom: "Centre-ville", fourchette: "7 000-8 000 €/m²", note: "autour de la mairie, commerces, le plus animé" },
      { nom: "Mont-Valérien", fourchette: "7 000-8 200 €/m²", note: "hauteurs, pavillonnaire chic, le plus coté" },
      { nom: "Buzenval", fourchette: "6 800-7 800 €/m²", note: "résidentiel calme, proche du parc" },
      { nom: "Rueil-sur-Seine / Plaine-Gare", fourchette: "6 500-7 500 €/m²", note: "autour du RER A, écoquartier des bords de Seine" },
      { nom: "Coteaux / Belle-Rive", fourchette: "6 300-7 200 €/m²", note: "bords de Seine, plus abordable" },
    ],
    transport:
      "le RER A (gare Rueil-Malmaison) qui rejoint La Défense en 7 minutes et Châtelet en 25 minutes, un réseau de bus dense vers La Défense, et l'accès à l'A86",
    contexte:
      "grande ville résidentielle bourgeoise des Hauts-de-Seine (80 000 habitants), château de Malmaison de Napoléon et Joséphine, bords de Seine, parcs, proximité immédiate de La Défense, profil familial avec des écoles correctes",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-6 % (tendu sur les hauteurs, plus sur l'ancien à rénover)",
    comparison: {
      city: "Saint-Cloud",
      base: "saint-cloud",
      ficheSlug: "saint-cloud-92064",
      price: 8400,
      angle:
        "Rueil-Malmaison, plus grande, plus abordable et tournée vers la Seine (6 900 €/m²), face à Saint-Cloud, plus chic, plus chère et perchée sur ses hauteurs boisées (8 400 €/m²), deux options de l'ouest proches de La Défense",
    },
    datasetCount: 176,
    dates: [
      "2026-04-07",
      "2026-04-10",
      "2026-04-17",
      "2026-04-24",
      "2026-05-01",
      "2026-05-09",
      "2026-05-15",
      "2026-05-22",
    ],
    skipSlots: [],
  },
};
