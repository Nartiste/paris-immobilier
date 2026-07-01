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

export type HubSlot = "vivre" | "pilier" | "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7";

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

  antony: {
    city: "Antony",
    cityShort: "Antony",
    base: "antony",
    ficheSlug: "antony-92002",
    departement: "Hauts-de-Seine",
    median: 6100,
    evolutionNote: "stable sur 5 ans, marché familial du sud",
    quartiers: [
      { nom: "Centre-ville", fourchette: "6 300-7 200 €/m²", note: "autour de la mairie et du marché, gare RER B Antony, le plus animé" },
      { nom: "Pajeaud / Parc de Sceaux", fourchette: "6 500-7 500 €/m²", note: "résidentiel chic au nord, proche du parc de Sceaux, le plus coté" },
      { nom: "La Fontaine", fourchette: "6 000-6 900 €/m²", note: "résidentiel pavillonnaire, calme" },
      { nom: "Les Baconnets", fourchette: "5 800-6 700 €/m²", note: "sud, gare RER B Les Baconnets, pavillonnaire familial" },
      { nom: "Croix de Berny", fourchette: "5 800-6 800 €/m²", note: "est, RER B et tram T7, en mutation, plus abordable" },
    ],
    transport:
      "le RER B (gares Antony et Les Baconnets, Châtelet en 25-30 minutes), l'Orlyval qui rejoint l'aéroport d'Orly en 8 minutes, le tram T7 à la Croix de Berny, et l'accès rapide à l'A86 et l'A6",
    contexte:
      "grande ville résidentielle et familiale du sud des Hauts-de-Seine (63 000 habitants), à deux pas du parc de Sceaux, lycées réputés (lycée Descartes), marché animé, accès direct à l'aéroport d'Orly, bon équilibre prix-qualité sur l'axe RER B sud",
    rendement: "3,5-4 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 % (plus de marge sur l'ancien et la Croix de Berny)",
    comparison: {
      city: "Massy",
      base: "massy",
      ficheSlug: "massy-91377",
      price: 4900,
      angle:
        "Antony, résidentielle, familiale et établie proche du parc de Sceaux (6 100 €/m²), face à Massy, plus abordable et en plein essor avec son pôle TGV et la future ligne 18 du Grand Paris Express (4 900 €/m²), deux options du sud RER B",
    },
    datasetCount: 176,
    dates: [
      "2026-04-06",
      "2026-04-09",
      "2026-04-16",
      "2026-04-23",
      "2026-04-30",
      "2026-05-07",
      "2026-05-13",
      "2026-05-20",
    ],
    skipSlots: [],
  },

  nanterre: {
    city: "Nanterre",
    cityShort: "Nanterre",
    base: "nanterre",
    ficheSlug: "nanterre-92050",
    departement: "Hauts-de-Seine",
    median: 5400,
    evolutionNote: "en hausse sur 5 ans, ville en pleine transformation près de La Défense",
    quartiers: [
      { nom: "Plateau-Mont-Valérien", fourchette: "6 000-7 000 €/m²", note: "sud résidentiel sur les hauteurs, le plus coté" },
      { nom: "Centre / Mairie", fourchette: "5 500-6 500 €/m²", note: "cœur de ville, commerces, RER A Nanterre-Ville" },
      { nom: "Préfecture / Université", fourchette: "5 200-6 200 €/m²", note: "RER A, lisière de La Défense et campus Paris-Nanterre" },
      { nom: "Vieux-Pont / Provinces Françaises", fourchette: "5 000-6 000 €/m²", note: "résidentiel, en normalisation" },
      { nom: "Petit-Nanterre", fourchette: "4 500-5 300 €/m²", note: "nord, populaire, le plus abordable, secteur en rénovation" },
    ],
    transport:
      "trois gares RER A (Nanterre-Ville, Nanterre-Université, Nanterre-Préfecture, La Défense à une ou deux stations, Châtelet en 25 minutes), le prolongement du RER E à Nanterre-La Folie ouvert en 2024 vers Saint-Lazare, le tram T2 et la proximité immédiate de La Défense",
    contexte:
      "grande ville des Hauts-de-Seine (96 000 habitants) collée au premier quartier d'affaires d'Europe, université Paris-Nanterre, en pleine mutation avec l'écoquartier des Groues et l'Arena, contrastes entre un nord populaire et un sud résidentiel, l'option la plus abordable du croissant ouest proche de La Défense",
    rendement: "4-4,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 % (forte marge au nord, plus tendu sur le Plateau)",
    comparison: {
      city: "Suresnes",
      base: "suresnes",
      ficheSlug: "suresnes-92073",
      price: 7800,
      angle:
        "Nanterre, plus grande, plus abordable et en pleine transformation au pied de La Défense (5 400 €/m²), face à Suresnes, plus chic et plus chère sur les pentes du Mont-Valérien avec vue sur Paris (7 800 €/m²), deux options de l'ouest proches du quartier d'affaires",
    },
    datasetCount: 176,
    dates: [
      "2026-04-05",
      "2026-04-08",
      "2026-04-15",
      "2026-04-22",
      "2026-04-29",
      "2026-05-06",
      "2026-05-12",
      "2026-05-19",
    ],
    skipSlots: [],
  },

  "issy-les-moulineaux": {
    city: "Issy-les-Moulineaux",
    cityShort: "Issy-les-Moulineaux",
    base: "issy-les-moulineaux",
    ficheSlug: "issy-les-moulineaux-92040",
    departement: "Hauts-de-Seine",
    median: 8500,
    evolutionNote: "stable à légèrement en baisse sur 5 ans, marché premium très demandé",
    quartiers: [
      { nom: "Centre-ville / Corentin Celton", fourchette: "8 500-10 000 €/m²", note: "M12, mairie, commerces, le plus demandé" },
      { nom: "Les Hauts d'Issy", fourchette: "8 200-9 500 €/m²", note: "résidentiel sur les hauteurs, calme, vues" },
      { nom: "Val de Seine / Les Épinettes", fourchette: "8 000-9 500 €/m²", note: "bords de Seine, tours média, immeubles récents" },
      { nom: "Quartier du Fort", fourchette: "7 800-9 000 €/m²", note: "écoquartier en mutation, plus abordable" },
      { nom: "Île Saint-Germain", fourchette: "8 500-9 800 €/m²", note: "cadre vert au bord de la Seine, recherché" },
    ],
    transport:
      "le métro 12 (Mairie d'Issy, Corentin Celton), le tram T2, le RER C (gares Issy et Issy-Val de Seine), et la proximité immédiate du 15e arrondissement de Paris (Châtelet en 20-25 minutes)",
    contexte:
      "pôle média et tech majeur de la petite couronne (sièges sociaux, la vallée de la com), bords de Seine réaménagés et Île Saint-Germain, tissu dense et prisé quasi parisien, recherché par les cadres et les jeunes actifs",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-5 % (marché tendu, plus sur l'ancien à rénover)",
    comparison: {
      city: "Suresnes",
      base: "suresnes",
      ficheSlug: "suresnes-92073",
      price: 7800,
      angle:
        "Issy-les-Moulineaux, pôle média dense et quasi parisien au sud-ouest (8 500 €/m²), face à Suresnes, plus résidentielle et un peu moins chère sur les pentes du Mont-Valérien (7 800 €/m²), deux options de bord de Seine dans les Hauts-de-Seine",
    },
    datasetCount: 176,
    dates: [
      "2026-04-04",
      "2026-04-07",
      "2026-04-14",
      "2026-04-21",
      "2026-04-28",
      "2026-05-05",
      "2026-05-11",
      "2026-05-18",
    ],
    skipSlots: [],
  },

  "saint-germain-en-laye": {
    city: "Saint-Germain-en-Laye",
    cityShort: "Saint-Germain-en-Laye",
    base: "saint-germain-en-laye",
    ficheSlug: "saint-germain-en-laye-78551",
    departement: "Yvelines",
    median: 7100,
    evolutionNote: "stable sur 5 ans, marché de prestige familial",
    quartiers: [
      { nom: "Centre-ville / Château", fourchette: "7 500-9 000 €/m²", note: "autour du château et du RER A, commerces, le plus demandé" },
      { nom: "Saint-Léger", fourchette: "8 000-9 500 €/m²", note: "villas bourgeoises près de la forêt, le plus coté" },
      { nom: "Hennemont / Lisière Pereire", fourchette: "7 200-8 500 €/m²", note: "résidentiel chic en lisière de forêt" },
      { nom: "Fourqueux", fourchette: "6 500-7 800 €/m²", note: "ouest pavillonnaire (commune fusionnée en 2019), plus familial" },
      { nom: "Bords de Seine / lisière Le Pecq", fourchette: "6 500-7 500 €/m²", note: "plus abordable, proche de la Seine" },
    ],
    transport:
      "le RER A en terminus (Saint-Germain-en-Laye, La Défense en 20 minutes et Châtelet en 30, avec une place assise au départ), le Transilien L, le tram T13 vers Saint-Cyr et Achères, et la forêt domaniale de 3 500 hectares en lisière",
    contexte:
      "ville royale de prestige (château, terrasse Le Nôtre, forêt de 3 500 hectares), Lycée International réputé mondialement pour ses sections étrangères, profil familial aisé et expatrié, RER A en terminus très recherché des Parisiens en quête d'espace et d'écoles",
    rendement: "2,8-3,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-6 % (tendu sur le centre et Saint-Léger, plus sur l'ancien à rénover)",
    comparison: {
      city: "Poissy",
      base: "poissy",
      ficheSlug: "poissy-78498",
      price: 4200,
      angle:
        "Saint-Germain-en-Laye, prestige royal avec forêt et Lycée International (7 100 €/m²), face à Poissy, accessible et en plein essor avec l'arrivée d'EOLE et ses bords de Seine (4 200 €/m²), deux options de la même ligne RER A à deux niveaux de budget",
    },
    datasetCount: 176,
    dates: [
      "2026-04-03",
      "2026-04-06",
      "2026-04-13",
      "2026-04-20",
      "2026-04-27",
      "2026-05-04",
      "2026-05-10",
      "2026-05-17",
    ],
    skipSlots: [],
  },

  // Configs ajoutées a posteriori (Hubs construits avant le générateur) pour
  // backfiller l'article "Vivre à X". Leurs S1-S7 existent déjà : le générateur
  // les skippe et n'insère que le slot vivre.
  boulogne: {
    city: "Boulogne-Billancourt",
    cityShort: "Boulogne-Billancourt",
    base: "boulogne",
    ficheSlug: "boulogne-billancourt-92012",
    departement: "Hauts-de-Seine",
    median: 9200,
    evolutionNote: "stable sur 5 ans après correction, marché premium",
    quartiers: [
      { nom: "Les Princes-Marmottan", fourchette: "10 500-12 000 €/m²", note: "nord chic, proche du Bois de Boulogne, le plus prestigieux" },
      { nom: "Centre-ville / Marcel-Sembat", fourchette: "9 500-11 000 €/m²", note: "commerces, métro 9, animé" },
      { nom: "Parchamp-Albert-Kahn", fourchette: "9 000-10 500 €/m²", note: "résidentiel, jardins Albert-Kahn" },
      { nom: "Billancourt / Le Trapèze", fourchette: "8 500-10 000 €/m²", note: "sud, écoquartier neuf, Île Seguin, moderne" },
      { nom: "Point-du-Jour / République", fourchette: "8 000-9 500 €/m²", note: "ouest, bords de Seine, plus abordable" },
    ],
    transport:
      "les métros 9 et 10, la future ligne 15 Sud du Grand Paris Express à Pont de Sèvres, le tram T2, et la proximité immédiate de Paris (18 minutes)",
    contexte:
      "plus grande ville de banlieue parisienne (121 000 habitants), pôle média et sièges sociaux, Bois de Boulogne et bords de Seine, profil familial et cadre, quasi parisien",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-5 %",
    comparison: { city: "Issy-les-Moulineaux", base: "issy-les-moulineaux", ficheSlug: "issy-les-moulineaux-92040", price: 8500, angle: "duel sud-ouest 92" },
    datasetCount: 176,
    dates: ["2026-03-30", "2026-04-02", "2026-04-09", "2026-04-16", "2026-04-23", "2026-04-30", "2026-05-07", "2026-05-14"],
    skipSlots: [],
  },

  vincennes: {
    city: "Vincennes",
    cityShort: "Vincennes",
    base: "vincennes",
    ficheSlug: "vincennes-94080",
    departement: "Val-de-Marne",
    median: 9200,
    evolutionNote: "stable sur 5 ans, marché de report premium",
    quartiers: [
      { nom: "Domaine du Bois / Nord", fourchette: "9 800-11 500 €/m²", note: "contre le Bois de Vincennes, résidentiel chic, le plus cher" },
      { nom: "Cœur de Ville", fourchette: "9 500-11 000 €/m²", note: "autour de la mairie et du métro 1, rue du Midi commerçante" },
      { nom: "Sud / Diderot-République", fourchette: "9 000-10 200 €/m²", note: "métro 1 Bérault, proche RER A" },
      { nom: "Est / Quartier des Vignerons", fourchette: "8 800-9 800 €/m²", note: "vers Montreuil, le plus abordable" },
    ],
    transport:
      "le métro 1 en terminus (Château de Vincennes, plus station Bérault, Châtelet en 13-16 minutes) et le RER A (Châtelet en 10 minutes, La Défense en 20), avec le Bois de Vincennes en lisière",
    contexte:
      "ville premium et familiale de l'est (50 000 habitants) collée au 12e arrondissement, château, Bois de Vincennes de 995 hectares, écoles réputées, ambiance bourgeoise, transport exceptionnel",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-4 %",
    comparison: { city: "Saint-Mandé", base: "saint-mande", ficheSlug: "saint-mande-94067", price: 9400, angle: "déjà couvert par un article existant" },
    datasetCount: 176,
    dates: ["2026-03-29", "2026-04-01", "2026-04-08", "2026-04-15", "2026-04-22", "2026-04-29", "2026-05-06", "2026-05-13"],
    skipSlots: ["s7"],
  },

  "neuilly-sur-seine": {
    city: "Neuilly-sur-Seine",
    cityShort: "Neuilly-sur-Seine",
    base: "neuilly-sur-seine",
    ficheSlug: "neuilly-sur-seine-92051",
    departement: "Hauts-de-Seine",
    median: 12100,
    evolutionNote: "stable sur 5 ans, marché de prestige le plus cher de banlieue",
    quartiers: [
      { nom: "Saint-James / Bagatelle", fourchette: "13 000-16 000 €/m²", note: "ouest, villas et hôtels particuliers, le plus prestigieux" },
      { nom: "Les Sablons", fourchette: "12 000-14 500 €/m²", note: "sud, contre le Bois de Boulogne, métro 1, ultra-chic" },
      { nom: "Château / Madrid", fourchette: "11 500-13 500 €/m²", note: "centre, avenue Charles-de-Gaulle, prestige" },
      { nom: "Hôtel de Ville / rue de Chartres", fourchette: "11 000-13 000 €/m²", note: "esprit village commerçant, recherché" },
      { nom: "Bineau / Charcot", fourchette: "10 500-12 500 €/m²", note: "nord, plus familial, le moins cher relativement" },
    ],
    transport:
      "le métro 1 (Les Sablons, Pont de Neuilly, Champs-Élysées et Châtelet en 20 minutes, La Défense à une station) et la proximité immédiate du Bois de Boulogne",
    contexte:
      "commune la plus chère de la banlieue parisienne (60 000 habitants), ultra-résidentielle et bourgeoise, écoles privées très réputées, Bois de Boulogne en lisière, cadres dirigeants et familles fortunées",
    rendement: "2,5-3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-4 % (très tendu, quasi nul sur Saint-James)",
    comparison: { city: "Levallois-Perret", base: "levallois-perret", ficheSlug: "levallois-perret-92044", price: 9100, angle: "Neuilly, prestige absolu, familial et collé au Bois (12 100 €/m²), face à Levallois-Perret, plus dense, plus jeune et un peu moins chère (9 100 €/m²), deux références de l'ouest huppé" },
    datasetCount: 176,
    dates: ["2026-04-02", "2026-04-05", "2026-04-12", "2026-04-19", "2026-04-26", "2026-05-03", "2026-05-09", "2026-05-16"],
    skipSlots: [],
  },

  "saint-cloud": {
    city: "Saint-Cloud",
    cityShort: "Saint-Cloud",
    base: "saint-cloud",
    ficheSlug: "saint-cloud-92064",
    departement: "Hauts-de-Seine",
    median: 8400,
    evolutionNote: "stable sur 5 ans, marché résidentiel chic",
    quartiers: [
      { nom: "Montretout", fourchette: "8 500-10 000 €/m²", note: "hauteurs, vues sur Paris, le plus chic" },
      { nom: "Centre / Village", fourchette: "8 000-9 500 €/m²", note: "cœur historique, commerces" },
      { nom: "Les Coteaux", fourchette: "8 000-9 200 €/m²", note: "résidentiel, desservi par le tram T2" },
      { nom: "Val d'Or", fourchette: "7 800-9 000 €/m²", note: "autour de la gare, pratique" },
      { nom: "Hippodrome / bords de Seine", fourchette: "7 500-8 800 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le Transilien L (Saint-Cloud et Le Val d'Or, Saint-Lazare en 15-20 minutes), le tram T2 (Parc de Saint-Cloud, Les Coteaux, vers La Défense et Paris rive gauche), et le parc de Saint-Cloud de 460 hectares",
    contexte:
      "ville résidentielle chic perchée sur les hauteurs de l'ouest (30 000 habitants), parc de Saint-Cloud, vues sur Paris, écoles réputées, profil familial-bourgeois, proche de La Défense",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: { city: "Suresnes", base: "suresnes", ficheSlug: "suresnes-92073", price: 7800, angle: "Saint-Cloud, plus chic et perchée avec son parc et ses vues (8 400 €/m²), face à Suresnes, plus accessible et plus jeune sur les pentes du Mont-Valérien (7 800 €/m²), deux options de l'ouest reliées par le tram T2" },
    datasetCount: 176,
    dates: ["2026-04-03", "2026-04-06", "2026-04-13", "2026-04-20", "2026-04-27", "2026-05-04", "2026-05-10", "2026-05-17"],
    skipSlots: [],
  },

  pantin: {
    city: "Pantin",
    cityShort: "Pantin",
    base: "pantin",
    ficheSlug: "pantin-93055",
    departement: "Seine-Saint-Denis",
    median: 5900,
    evolutionNote: "en forte hausse sur 5 ans, gentrification rapide le long du canal",
    quartiers: [
      { nom: "Bords du canal de l'Ourcq", fourchette: "6 000-7 200 €/m²", note: "lofts, sièges créatifs (Hermès, BETC), le plus branché" },
      { nom: "Église de Pantin / Centre", fourchette: "5 800-6 800 €/m²", note: "métro 5, cœur de ville en hausse" },
      { nom: "Hoche", fourchette: "5 800-6 800 €/m²", note: "métro 5, gentrification rapide" },
      { nom: "Quatre-Chemins", fourchette: "5 200-6 000 €/m²", note: "sud populaire en mutation, métro 7" },
      { nom: "Petit-Pantin / Les Courtillières", fourchette: "4 800-5 600 €/m²", note: "nord populaire, le plus abordable" },
    ],
    transport:
      "le métro 5 (Église de Pantin, Hoche), le métro 7 (Aubervilliers-Pantin Quatre-Chemins), le RER E (Pantin, Haussmann-Saint-Lazare en 10 minutes), le tram T3b et les berges du canal de l'Ourcq",
    contexte:
      "le Brooklyn parisien de l'est (60 000 habitants), gentrification rapide le long du canal avec les sièges d'Hermès, BETC et Chanel, scène créative, mais contrastes sociaux forts entre secteurs populaires et bords de canal branchés",
    rendement: "4-4,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 % (variable selon le secteur)",
    comparison: { city: "Montreuil", base: "montreuil", ficheSlug: "montreuil-93048", price: 5800, angle: "Pantin, canal, créatif et porté par le RER E (5 900 €/m²), face à Montreuil, plus grande et plus établie dans sa gentrification (5 800 €/m²), les deux moteurs de l'est qui monte" },
    datasetCount: 176,
    dates: ["2026-04-04", "2026-04-07", "2026-04-14", "2026-04-21", "2026-04-28", "2026-05-05", "2026-05-11", "2026-05-18"],
    // vivre / S1 / S5 déjà couverts par des articles Pantin existants (slugs
    // différents) : on les skippe pour ne pas cannibaliser. Reste S2,S3,S4,S6,S7.
    skipSlots: ["vivre", "s1", "s5"],
  },

  "asnieres-sur-seine": {
    city: "Asnières-sur-Seine",
    cityShort: "Asnières-sur-Seine",
    base: "asnieres-sur-seine",
    ficheSlug: "asnieres-sur-seine-92004",
    departement: "Hauts-de-Seine",
    median: 6800,
    evolutionNote: "en hausse sur 5 ans, ville en valorisation",
    quartiers: [
      { nom: "Île Robinson / bords de Seine", fourchette: "7 200-8 200 €/m²", note: "résidentiel chic au bord de l'eau, le plus prisé" },
      { nom: "Centre / Mairie", fourchette: "6 800-7 800 €/m²", note: "cœur de ville, commerces" },
      { nom: "Bac / Flachat", fourchette: "6 500-7 500 €/m²", note: "proche de Paris et de Clichy, pratique" },
      { nom: "Voltaire / Concorde", fourchette: "6 200-7 200 €/m²", note: "résidentiel" },
      { nom: "Les Grésillons", fourchette: "5 500-6 500 €/m²", note: "nord en mutation, RER C et future gare de la ligne 15, le plus abordable" },
    ],
    transport:
      "le Transilien L et J (gare d'Asnières-sur-Seine, Saint-Lazare en 10 minutes), le RER C (Les Grésillons) et la future ligne 15 du Grand Paris Express aux Grésillons",
    contexte:
      "grande ville du nord-ouest sur la Seine (86 000 habitants), mélange de bords de Seine résidentiels chics (Île Robinson) et de secteurs populaires en mutation (Grésillons), collée à Paris 17e et à Clichy, en pleine valorisation",
    rendement: "3,5-4 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: { city: "Levallois-Perret", base: "levallois-perret", ficheSlug: "levallois-perret-92044", price: 9100, angle: "Asnières-sur-Seine, plus grande, plus abordable et tournée vers la Seine (6 800 €/m²), face à Levallois-Perret, plus dense, plus premium et collée à Paris (9 100 €/m²), deux options du nord-ouest sur la Seine" },
    datasetCount: 176,
    dates: ["2026-04-01", "2026-04-04", "2026-04-11", "2026-04-18", "2026-04-25", "2026-05-02", "2026-05-08", "2026-05-15"],
    skipSlots: [],
  },

  "nogent-sur-marne": {
    city: "Nogent-sur-Marne",
    cityShort: "Nogent-sur-Marne",
    base: "nogent-sur-marne",
    ficheSlug: "nogent-sur-marne-94052",
    departement: "Val-de-Marne",
    median: 7600,
    evolutionNote: "stable sur 5 ans, marché bourgeois prisé",
    quartiers: [
      { nom: "Bords de Marne / Le Port", fourchette: "7 800-9 000 €/m²", note: "résidentiel chic au bord de l'eau, guinguettes, le plus prisé" },
      { nom: "Centre / Marché Baltard", fourchette: "7 500-8 500 €/m²", note: "cœur commerçant, halle Baltard, RER" },
      { nom: "Le Bois", fourchette: "7 500-8 500 €/m²", note: "contre le bois de Vincennes, résidentiel" },
      { nom: "Plateau / Val de Beauté", fourchette: "7 200-8 200 €/m²", note: "résidentiel calme" },
      { nom: "Quartier de la gare", fourchette: "7 000-8 000 €/m²", note: "pratique, RER A et E, le plus abordable" },
    ],
    transport:
      "le RER A (Nogent-sur-Marne, Châtelet en 18 minutes), le RER E (Nogent-Le Perreux, Haussmann-Saint-Lazare), les bords de Marne et la proximité du bois de Vincennes",
    contexte:
      "ville bourgeoise et verdoyante au bord de la Marne (32 000 habitants), guinguettes, marché couvert Baltard, bois de Vincennes attenant, profil familial-chic, l'une des plus prisées de l'est parisien",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: { city: "Le Perreux-sur-Marne", base: "le-perreux-sur-marne", ficheSlug: "le-perreux-sur-marne-94058", price: 7400, angle: "Nogent-sur-Marne, plus dense avec son centre commerçant et le RER A (7 600 €/m²), face au Perreux-sur-Marne, plus résidentiel et pavillonnaire (7 400 €/m²), deux voisines bourgeoises des bords de Marne" },
    datasetCount: 176,
    dates: ["2026-03-31", "2026-04-03", "2026-04-10", "2026-04-17", "2026-04-24", "2026-05-01", "2026-05-07", "2026-05-14"],
    skipSlots: [],
  },

  "le-perreux-sur-marne": {
    city: "Le Perreux-sur-Marne",
    cityShort: "Le Perreux-sur-Marne",
    base: "le-perreux-sur-marne",
    ficheSlug: "le-perreux-sur-marne-94058",
    departement: "Val-de-Marne",
    median: 7400,
    evolutionNote: "stable sur 5 ans, marché résidentiel chic",
    quartiers: [
      { nom: "Bords de Marne", fourchette: "7 500-8 500 €/m²", note: "résidentiel chic au bord de l'eau, villas, le plus prisé" },
      { nom: "Centre / Mairie", fourchette: "7 200-8 200 €/m²", note: "cœur de ville, commerces" },
      { nom: "Quartier de la gare", fourchette: "7 000-8 000 €/m²", note: "RER A et E, pratique" },
      { nom: "Les Joncs Marins", fourchette: "6 800-7 800 €/m²", note: "pavillonnaire familial" },
      { nom: "Bel-Air", fourchette: "6 800-7 700 €/m²", note: "résidentiel, le plus abordable" },
    ],
    transport:
      "le RER A et le RER E (gare de Nogent-Le Perreux, Châtelet et Haussmann en 18-20 minutes), et les bords de Marne",
    contexte:
      "ville résidentielle pavillonnaire et bourgeoise au bord de la Marne (35 000 habitants), calme, villas, profil familial aisé, l'une des plus chères de l'est du Val-de-Marne",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: { city: "Joinville-le-Pont", base: "joinville-le-pont", ficheSlug: "joinville-le-pont-94042", price: 6800, angle: "Le Perreux-sur-Marne, résidentiel chic et pavillonnaire (7 400 €/m²), face à Joinville-le-Pont, plus mixte et un peu moins chère (6 800 €/m²), au bord de la Marne et du bois de Vincennes" },
    datasetCount: 176,
    dates: ["2026-03-30", "2026-04-02", "2026-04-09", "2026-04-16", "2026-04-23", "2026-04-30", "2026-05-06", "2026-05-13"],
    skipSlots: [],
  },

  "charenton-le-pont": {
    city: "Charenton-le-Pont",
    cityShort: "Charenton-le-Pont",
    base: "charenton-le-pont",
    ficheSlug: "charenton-le-pont-94018",
    departement: "Val-de-Marne",
    median: 7500,
    evolutionNote: "stable sur 5 ans, marché tendu collé à Paris",
    quartiers: [
      { nom: "Bercy / quartier de Paris", fourchette: "7 800-9 000 €/m²", note: "collé au 12e arrondissement, le plus cher" },
      { nom: "Centre / Liberté", fourchette: "7 500-8 500 €/m²", note: "métro 8, commerces" },
      { nom: "Bords de Marne / Conflans", fourchette: "7 200-8 200 €/m²", note: "résidentiel bord d'eau" },
      { nom: "Petit-Château", fourchette: "7 000-8 000 €/m²", note: "résidentiel calme" },
      { nom: "Quartier de la gare", fourchette: "7 000-7 900 €/m²", note: "pratique, le plus abordable" },
    ],
    transport:
      "le métro 8 (Charenton-Écoles, Liberté), la proximité immédiate de Paris 12e et de Bercy à pied, le RER A et D tout proches, et les bords de Marne et de Seine",
    contexte:
      "petite ville dense collée à Paris 12e, à Bercy (29 000 habitants), très pratique, prix proche de Paris, profil familial-urbain, bois de Vincennes à proximité",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: { city: "Maisons-Alfort", base: "maisons-alfort", ficheSlug: "maisons-alfort-94046", price: 6600, angle: "Charenton-le-Pont, collée à Paris 12e et plus chère (7 500 €/m²), face à Maisons-Alfort, plus grande et plus abordable au bord de la Marne (6 600 €/m²)" },
    datasetCount: 176,
    dates: ["2026-03-29", "2026-04-01", "2026-04-08", "2026-04-15", "2026-04-22", "2026-04-29", "2026-05-05", "2026-05-12"],
    skipSlots: [],
  },

  "maisons-alfort": {
    city: "Maisons-Alfort",
    cityShort: "Maisons-Alfort",
    base: "maisons-alfort",
    ficheSlug: "maisons-alfort-94046",
    departement: "Val-de-Marne",
    median: 6600,
    evolutionNote: "en légère hausse sur 5 ans, marché porté par la ligne 15 à venir",
    quartiers: [
      { nom: "Charentonneau", fourchette: "6 800-7 600 €/m²", note: "résidentiel au bord de la Marne, le plus prisé" },
      { nom: "Centre / Les Juilliottes", fourchette: "6 500-7 500 €/m²", note: "métro 8, commerces" },
      { nom: "Vert-de-Maisons", fourchette: "6 500-7 400 €/m²", note: "RER D et future ligne 15, en valorisation" },
      { nom: "Liberté / École vétérinaire", fourchette: "6 300-7 200 €/m²", note: "résidentiel" },
      { nom: "Les Planètes", fourchette: "6 200-7 000 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le métro 8 (Maisons-Alfort-Stade, Les Juilliottes), le RER D (Maisons-Alfort-Alfortville, Le Vert de Maisons), la future ligne 15 du Grand Paris Express au Vert-de-Maisons, et les bords de Marne",
    contexte:
      "grande ville familiale au bord de la Marne (57 000 habitants), célèbre école vétérinaire, desserte qui se renforce avec la ligne 15, bon rapport qualité-prix de l'est parisien",
    rendement: "3,5-4 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: { city: "Créteil", base: "creteil", ficheSlug: "creteil-94028", price: 4800, angle: "Maisons-Alfort, plus résidentielle et plus chère au bord de la Marne (6 600 €/m²), face à Créteil, plus grande, plus abordable et portée par le métro et son lac (4 800 €/m²)" },
    datasetCount: 176,
    dates: ["2026-03-28", "2026-03-31", "2026-04-07", "2026-04-14", "2026-04-21", "2026-04-28", "2026-05-04", "2026-05-11"],
    skipSlots: [],
  },

  // Vague ouest premium + est (juin 2026). Levallois & Saint-Mandé ont déjà des
  // articles (slugs différents) : skipSlots évite la cannibalisation.
  "levallois-perret": {
    city: "Levallois-Perret",
    cityShort: "Levallois-Perret",
    base: "levallois-perret",
    ficheSlug: "levallois-perret-92044",
    departement: "Hauts-de-Seine",
    median: 9100,
    evolutionNote: "stable sur 5 ans après correction, marché premium très tendu",
    quartiers: [
      { nom: "Front de Seine / Eiffel", fourchette: "9 500-10 800 €/m²", note: "ouest, haussmannien et front de Seine, le plus prisé" },
      { nom: "Bords de Seine / Île de la Jatte", fourchette: "9 300-10 500 €/m²", note: "cadre vert au bord de l'eau, côté Levallois de l'île, très coté" },
      { nom: "Centre / Mairie", fourchette: "9 200-10 200 €/m²", note: "autour de l'hôtel de ville et du métro 3, commerces, animé" },
      { nom: "Marché / Aristide Briand", fourchette: "9 000-10 000 €/m²", note: "quartier du marché couvert, recherché des familles" },
      { nom: "Planchette / Collange", fourchette: "8 700-9 700 €/m²", note: "nord-est, plus calme, proche de Clichy, le plus abordable" },
    ],
    transport:
      "le métro 3 (Anatole France, Louise Michel, Pont de Levallois-Bécon en terminus, Saint-Lazare en 12 minutes et Opéra en 18), le Transilien L à Clichy-Levallois, et la proximité immédiate de Paris 17e et de La Défense",
    contexte:
      "l'une des villes les plus densément peuplées d'Europe (64 000 habitants sur 2,4 km²), profil jeune cadre et famille aisée, Île de la Jatte et bords de Seine, marché couvert et commerces, un quasi-arrondissement parisien au nord-ouest",
    rendement: "2,8-3,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-5 % (marché tendu, un peu plus sur l'ancien à rénover et les passoires DPE)",
    comparison: {
      city: "Neuilly-sur-Seine",
      base: "neuilly-sur-seine",
      ficheSlug: "neuilly-sur-seine-92051",
      price: 12100,
      angle:
        "Levallois-Perret, dense, jeune et un peu plus accessible (9 100 €/m²), face à Neuilly-sur-Seine, plus prestigieuse, plus verte et nettement plus chère contre le Bois (12 100 €/m²), les deux références de l'ouest huppé",
    },
    datasetCount: 176,
    dates: ["2026-03-27", "2026-04-03", "2026-04-10", "2026-04-17", "2026-04-24", "2026-05-01", "2026-05-08", "2026-05-15"],
    skipSlots: ["vivre", "s1", "s5"],
  },

  suresnes: {
    city: "Suresnes",
    cityShort: "Suresnes",
    base: "suresnes",
    ficheSlug: "suresnes-92073",
    departement: "Hauts-de-Seine",
    median: 7800,
    evolutionNote: "stable sur 5 ans, marché résidentiel des coteaux",
    quartiers: [
      { nom: "Mont-Valérien", fourchette: "8 200-9 200 €/m²", note: "hauteurs boisées, vues sur Paris, le plus chic" },
      { nom: "Centre-ville", fourchette: "7 800-8 700 €/m²", note: "autour de la mairie et du marché Caron, commerces, animé" },
      { nom: "République / Carnot", fourchette: "7 400-8 300 €/m²", note: "résidentiel, proche du tram T2" },
      { nom: "Cité-jardins", fourchette: "7 200-8 100 €/m²", note: "patrimoine classé des années 1920-30, recherché des familles" },
      { nom: "Bords de Seine / Quartier de la Gare", fourchette: "7 200-8 000 €/m²", note: "le plus abordable, proche de la passerelle vers La Défense" },
    ],
    transport:
      "le tram T2 (Suresnes-Longchamp, Belvédère, vers La Défense en 5 minutes et Paris rive gauche), le Transilien L (Suresnes-Mont-Valérien, Saint-Lazare en 12 minutes), et une passerelle piétonne directe vers La Défense",
    contexte:
      "ville des coteaux de l'ouest perchée sur le Mont-Valérien (49 000 habitants), célèbre cité-jardins classée, vignoble municipal, vues panoramiques sur Paris, profil familial et cadre, à un pont de La Défense",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Saint-Cloud",
      base: "saint-cloud",
      ficheSlug: "saint-cloud-92064",
      price: 8400,
      angle:
        "Suresnes, plus accessible et plus jeune sur les pentes du Mont-Valérien avec sa cité-jardins (7 800 €/m²), face à Saint-Cloud, plus chic et plus chère sur ses hauteurs avec son parc (8 400 €/m²), deux voisines de l'ouest reliées par le tram T2",
    },
    datasetCount: 176,
    dates: ["2026-03-26", "2026-04-02", "2026-04-09", "2026-04-16", "2026-04-23", "2026-04-30", "2026-05-07", "2026-05-14"],
    skipSlots: [],
  },

  "saint-mande": {
    city: "Saint-Mandé",
    cityShort: "Saint-Mandé",
    base: "saint-mande",
    ficheSlug: "saint-mande-94067",
    departement: "Val-de-Marne",
    median: 9400,
    evolutionNote: "stable sur 5 ans, micro-marché premium très tendu",
    quartiers: [
      { nom: "Tourelle / Lac de Saint-Mandé", fourchette: "9 800-11 000 €/m²", note: "contre le Bois de Vincennes et le lac, le plus prisé" },
      { nom: "Mairie / Demi-Lune", fourchette: "9 500-10 800 €/m²", note: "centre autour de l'hôtel de ville, métro 1, le plus demandé" },
      { nom: "Alphand / Général de Gaulle", fourchette: "9 200-10 300 €/m²", note: "résidentiel, proche du RER A à Vincennes" },
      { nom: "Cailletet / Sud", fourchette: "9 000-10 000 €/m²", note: "vers Charenton, le plus abordable relativement" },
    ],
    transport:
      "le métro 1 (Saint-Mandé, Bérault, Châtelet en 12 minutes et La Défense en 22), le RER A tout proche à Vincennes, et le Bois de Vincennes en lisière directe",
    contexte:
      "micro-commune ultra-résidentielle et bourgeoise collée au 12e arrondissement (22 000 habitants sur moins d'1 km²), l'une des plus chères de l'est, lac et Bois de Vincennes en lisière, écoles réputées, profil familial aisé quasi parisien",
    rendement: "2,8-3,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-4 % (très tendu)",
    comparison: {
      city: "Vincennes",
      base: "vincennes",
      ficheSlug: "vincennes-94080",
      price: 9200,
      angle: "déjà couvert par l'article vincennes-saint-mande-comparaison-immobilier-2026",
    },
    datasetCount: 176,
    dates: ["2026-03-25", "2026-04-01", "2026-04-08", "2026-04-15", "2026-04-22", "2026-04-29", "2026-05-06", "2026-05-13"],
    skipSlots: ["vivre", "s1", "s5", "s7"],
  },

  "fontenay-sous-bois": {
    city: "Fontenay-sous-Bois",
    cityShort: "Fontenay-sous-Bois",
    base: "fontenay-sous-bois",
    ficheSlug: "fontenay-sous-bois-94033",
    departement: "Val-de-Marne",
    median: 6500,
    evolutionNote: "en légère hausse sur 5 ans, marché familial porté par le RER A",
    quartiers: [
      { nom: "Plateau / Village", fourchette: "6 800-7 600 €/m²", note: "esprit village autour de l'église et de la mairie, le plus prisé" },
      { nom: "Bois / lisière Bois de Vincennes", fourchette: "6 600-7 400 €/m²", note: "résidentiel calme proche du bois" },
      { nom: "Les Rigollots", fourchette: "6 500-7 300 €/m²", note: "limite Vincennes-Montreuil, commerçant, recherché" },
      { nom: "Val de Fontenay", fourchette: "6 000-6 800 €/m²", note: "pôle RER A et E plus bureaux, immeubles, pratique" },
      { nom: "Larris / Jean Zay", fourchette: "5 600-6 400 €/m²", note: "secteur de logements collectifs, le plus abordable" },
    ],
    transport:
      "le RER A (Fontenay-sous-Bois, Châtelet en 16 minutes) et le pôle de Val de Fontenay (RER A et E, l'un des plus fréquentés d'Île-de-France, future ligne 15 Est et prolongement du tram T1), avec le Bois de Vincennes à l'ouest",
    contexte:
      "grande ville résidentielle de l'est collée à Vincennes et au Bois (53 000 habitants), esprit village sur le plateau, pôle d'emploi et de transport majeur à Val de Fontenay, bon compromis prix-accès de l'est parisien",
    rendement: "3,5-4 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Nogent-sur-Marne",
      base: "nogent-sur-marne",
      ficheSlug: "nogent-sur-marne-94052",
      price: 7600,
      angle:
        "Fontenay-sous-Bois, plus grande, plus verte et plus accessible avec son village et le Bois (6 500 €/m²), face à Nogent-sur-Marne, plus bourgeoise et plus chère au bord de la Marne (7 600 €/m²), deux voisines de l'est sur le RER A",
    },
    datasetCount: 176,
    dates: ["2026-03-24", "2026-03-31", "2026-04-07", "2026-04-14", "2026-04-21", "2026-04-28", "2026-05-05", "2026-05-12"],
    skipSlots: [],
  },

  // Vague premium-absentes (juin 2026) : fiches créées dans le dataset
  // (Courbevoie, Puteaux, Montrouge, Vanves) puis hubs complets S1-S7 + vivre.
  courbevoie: {
    city: "Courbevoie",
    cityShort: "Courbevoie",
    base: "courbevoie",
    ficheSlug: "courbevoie-92026",
    departement: "Hauts-de-Seine",
    median: 7500,
    evolutionNote: "stable sur 5 ans, marché porté par La Défense",
    quartiers: [
      { nom: "Bécon-les-Bruyères", fourchette: "7 500-8 500 €/m²", note: "autour de la gare, esprit village prisé, le plus recherché" },
      { nom: "Faubourg de l'Arche", fourchette: "7 200-8 200 €/m²", note: "neuf, au pied de La Défense, immeubles récents" },
      { nom: "Cœur de ville / Charras", fourchette: "7 200-8 000 €/m²", note: "centre, mairie, commerces" },
      { nom: "Bords de Seine", fourchette: "7 200-8 200 €/m²", note: "façade sur la Seine, vues, recherché" },
      { nom: "Gambetta / Marceau", fourchette: "6 900-7 700 €/m²", note: "résidentiel, le plus abordable" },
    ],
    transport:
      "le Transilien L (Courbevoie et Bécon-les-Bruyères, Saint-Lazare en 10-12 minutes), le tram T2, et La Défense limitrophe (RER A, métro 1, Châtelet en 20 minutes)",
    contexte:
      "grande ville au pied de La Défense (82 000 habitants), entre tours du quartier d'affaires et esprit village à Bécon-les-Bruyères, bords de Seine, profil jeune actif et famille, l'une des portes d'entrée abordables de l'ouest d'affaires",
    rendement: "3,3-3,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-6 % (plus de marge sur l'ancien, tendu autour de Bécon)",
    comparison: {
      city: "Puteaux",
      base: "puteaux",
      ficheSlug: "puteaux-92062",
      price: 8300,
      angle:
        "Courbevoie, plus grande, plus familiale et plus accessible avec son village de Bécon (7 500 €/m²), face à Puteaux, plus chère et plus dense collée à La Défense (8 300 €/m²), les deux communes du pied du quartier d'affaires",
    },
    datasetCount: 176,
    dates: ["2026-03-23", "2026-03-30", "2026-04-06", "2026-04-13", "2026-04-20", "2026-04-27", "2026-05-04", "2026-05-11"],
    skipSlots: [],
  },

  puteaux: {
    city: "Puteaux",
    cityShort: "Puteaux",
    base: "puteaux",
    ficheSlug: "puteaux-92062",
    departement: "Hauts-de-Seine",
    median: 8300,
    evolutionNote: "stable sur 5 ans, marché premium adossé à La Défense",
    quartiers: [
      { nom: "Île de Puteaux / Bords de Seine", fourchette: "8 600-9 600 €/m²", note: "cadre vert au bord de l'eau, île de loisirs, le plus prisé" },
      { nom: "Vieux Puteaux / Centre", fourchette: "8 300-9 300 €/m²", note: "cœur historique, commerces, esprit village" },
      { nom: "Chantecoq", fourchette: "8 000-9 000 €/m²", note: "résidentiel pavillonnaire sur les hauteurs" },
      { nom: "La Défense / Boieldieu", fourchette: "7 900-8 900 €/m²", note: "tours et dalle, au cœur du quartier d'affaires" },
      { nom: "Bergères", fourchette: "7 800-8 700 €/m²", note: "résidentiel, le plus abordable" },
    ],
    transport:
      "le RER A et le métro 1 à La Défense (limitrophe, Châtelet en 15 minutes), le tram T2 (Puteaux, Belvédère), le Transilien L (Puteaux), et l'île de loisirs sur la Seine",
    contexte:
      "ville dense et prospère adossée à La Défense (45 000 habitants), entre vieux village commerçant, île de loisirs sur la Seine et tours du quartier d'affaires, profil cadre et jeune actif, équipements et services réputés généreux",
    rendement: "3,1-3,6 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-5 % (tendu, plus sur l'ancien à rénover)",
    comparison: {
      city: "Suresnes",
      base: "suresnes",
      ficheSlug: "suresnes-92073",
      price: 7800,
      angle:
        "Puteaux, plus dense, plus urbaine et collée à La Défense (8 300 €/m²), face à Suresnes, plus résidentielle et un peu moins chère sur les coteaux du Mont-Valérien (7 800 €/m²), deux voisines de l'ouest reliées par le tram T2",
    },
    datasetCount: 176,
    dates: ["2026-03-22", "2026-03-29", "2026-04-05", "2026-04-12", "2026-04-19", "2026-04-26", "2026-05-03", "2026-05-10"],
    skipSlots: [],
  },

  montrouge: {
    city: "Montrouge",
    cityShort: "Montrouge",
    base: "montrouge",
    ficheSlug: "montrouge-92049",
    departement: "Hauts-de-Seine",
    median: 8000,
    evolutionNote: "stable sur 5 ans, marché tendu collé à Paris 14e",
    quartiers: [
      { nom: "Jean Jaurès / porte d'Orléans", fourchette: "8 300-9 300 €/m²", note: "collé au 14e, le plus cher" },
      { nom: "Mairie / Centre", fourchette: "8 200-9 200 €/m²", note: "métro 4 Mairie de Montrouge, commerces, le plus demandé" },
      { nom: "Ferry / Gautier", fourchette: "7 800-8 700 €/m²", note: "résidentiel familial" },
      { nom: "Plateau / République", fourchette: "7 700-8 600 €/m²", note: "axe commerçant, animé" },
      { nom: "Périchaux / sud", fourchette: "7 500-8 300 €/m²", note: "vers Bagneux et la future ligne 15, le plus abordable" },
    ],
    transport:
      "le métro 4 en terminus (Mairie de Montrouge, Châtelet en 15 minutes et Montparnasse en 8), la proximité immédiate de Paris 14e à pied, et le tram T6 à Châtillon tout proche",
    contexte:
      "ville dense et prisée collée à la porte d'Orléans (50 000 habitants), quasi un arrondissement parisien, marché et commerces dynamiques, profil jeune cadre et famille en report direct du 14e, prix juste sous ceux de Paris",
    rendement: "3,2-3,7 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-5 % (marché très tendu, un peu plus au sud)",
    comparison: {
      city: "Vanves",
      base: "vanves",
      ficheSlug: "vanves-92075",
      price: 8200,
      angle:
        "Montrouge, plus grande et plus animée collée à la porte d'Orléans et au métro 4 (8 000 €/m²), face à Vanves, plus petite et plus résidentielle côté 15e (8 200 €/m²), deux reports directs du sud de Paris",
    },
    datasetCount: 176,
    dates: ["2026-03-21", "2026-03-28", "2026-04-04", "2026-04-11", "2026-04-18", "2026-04-25", "2026-05-02", "2026-05-09"],
    skipSlots: [],
  },

  vanves: {
    city: "Vanves",
    cityShort: "Vanves",
    base: "vanves",
    ficheSlug: "vanves-92075",
    departement: "Hauts-de-Seine",
    median: 8200,
    evolutionNote: "stable sur 5 ans, petit marché tendu côté Paris 15e",
    quartiers: [
      { nom: "Centre / Mairie", fourchette: "8 300-9 300 €/m²", note: "autour de l'hôtel de ville, commerces, le plus demandé" },
      { nom: "Plateau / Métro 13", fourchette: "8 200-9 200 €/m²", note: "M13 Malakoff-Plateau de Vanves, pratique" },
      { nom: "Quartier de la gare", fourchette: "8 000-9 000 €/m²", note: "Transilien N vers Montparnasse en 4 minutes, recherché" },
      { nom: "Cabourg / Larmeroux", fourchette: "7 900-8 800 €/m²", note: "résidentiel pavillonnaire calme" },
      { nom: "Saint-Remy / lisière Issy", fourchette: "7 800-8 700 €/m²", note: "le plus abordable, proche d'Issy" },
    ],
    transport:
      "le métro 13 (Malakoff-Plateau de Vanves), le Transilien N (gare de Vanves-Malakoff, Montparnasse en 4 minutes), et la proximité immédiate de Paris 15e à pied",
    contexte:
      "petite ville résidentielle et familiale côté Paris 15e (27 000 habitants), esprit village avec son lycée et son marché, Transilien express vers Montparnasse, l'une des plus recherchées du sud par les familles qui quittent le 15e",
    rendement: "3,1-3,6 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-5 % (marché tendu et de petite taille)",
    comparison: {
      city: "Issy-les-Moulineaux",
      base: "issy-les-moulineaux",
      ficheSlug: "issy-les-moulineaux-92040",
      price: 8500,
      angle:
        "Vanves, plus petite, plus village et un peu moins chère côté 15e (8 200 €/m²), face à Issy-les-Moulineaux, plus grande, plus tertiaire et plus chère sur la Seine (8 500 €/m²), deux voisines du sud-ouest très prisées des familles",
    },
    datasetCount: 176,
    dates: ["2026-03-20", "2026-03-27", "2026-04-03", "2026-04-10", "2026-04-17", "2026-04-24", "2026-05-01", "2026-05-08"],
    skipSlots: [],
  },

  // Vague sud-ouest 92 famille (juin 2026). 4 fiches dataset créées en amont.
  malakoff: {
    city: "Malakoff",
    cityShort: "Malakoff",
    base: "malakoff",
    ficheSlug: "malakoff-92046",
    departement: "Hauts-de-Seine",
    median: 7400,
    evolutionNote: "en hausse sur 5 ans, gentrification continue côté Paris 14e",
    quartiers: [
      { nom: "Centre / Hôtel de ville", fourchette: "7 500-8 300 €/m²", note: "autour de la mairie et du marché, métro 13 Étienne Dolet, le plus prisé" },
      { nom: "Barreau / porte de Vanves", fourchette: "7 300-8 100 €/m²", note: "collé à Paris 14e, très demandé" },
      { nom: "Pierre Larousse", fourchette: "7 100-7 900 €/m²", note: "pavillonnaire et ateliers d'artistes, recherché" },
      { nom: "Plateau de Vanves", fourchette: "7 200-8 000 €/m²", note: "métro 13, pratique" },
      { nom: "Sud / Prévert-Stalingrad", fourchette: "6 900-7 600 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le métro 13 (Malakoff-Rue Étienne Dolet et Malakoff-Plateau de Vanves, Montparnasse en 8 minutes et Saint-Lazare en 20), le Transilien N à Vanves-Malakoff, et la proximité immédiate de Paris 14e à pied",
    contexte:
      "petite ville dense et bobo-populaire collée à Paris 14e (31 000 habitants), esprit village avec son marché et ses maisons d'artistes, gentrification continue, profil jeune cadre et famille, l'une des entrées sud de Paris les plus prisées",
    rendement: "3,3-3,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 % (marché tendu et de petite taille)",
    comparison: {
      city: "Montrouge",
      base: "montrouge",
      ficheSlug: "montrouge-92049",
      price: 8000,
      angle:
        "Malakoff, plus bobo-populaire et un peu plus abordable contre Paris 14e (7 400 €/m²), face à Montrouge, plus bourgeoise et plus chère juste à côté (8 000 €/m²), deux entrées sud de Paris très prisées des familles",
    },
    datasetCount: 176,
    dates: ["2026-03-19", "2026-03-26", "2026-04-02", "2026-04-09", "2026-04-16", "2026-04-23", "2026-04-30", "2026-05-07"],
    skipSlots: [],
  },

  chatillon: {
    city: "Châtillon",
    cityShort: "Châtillon",
    base: "chatillon",
    ficheSlug: "chatillon-92020",
    departement: "Hauts-de-Seine",
    median: 6900,
    evolutionNote: "en hausse sur 5 ans, marché porté par la ligne 15 à venir",
    quartiers: [
      { nom: "Centre / Mairie", fourchette: "7 000-7 800 €/m²", note: "autour de l'hôtel de ville, métro 13 Châtillon-Montrouge, le plus prisé" },
      { nom: "Division Leclerc", fourchette: "6 800-7 500 €/m²", note: "axe commerçant, tram T6" },
      { nom: "Coteaux / Parc", fourchette: "6 700-7 400 €/m²", note: "pavillonnaire calme sur les hauteurs" },
      { nom: "Sablons / limite Bagneux", fourchette: "6 500-7 200 €/m²", note: "résidentiel" },
      { nom: "Est / Vauban", fourchette: "6 400-7 100 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le métro 13 en terminus (Châtillon-Montrouge, Montparnasse en 10 minutes), le tram T6 vers Vélizy et Viroflay, la future ligne 15 Sud du Grand Paris Express à Châtillon-Montrouge (mise en service vers 2025-2026), et l'accès à l'A86",
    contexte:
      "ville résidentielle et familiale du sud (37 000 habitants), terminus du métro 13, pôle de transport renforcé par la ligne 15, commerces sur l'avenue de la Division Leclerc, bon rapport accès-prix de la première couronne sud",
    rendement: "3,5-4 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Clamart",
      base: "clamart",
      ficheSlug: "clamart-92023",
      price: 6500,
      angle:
        "Châtillon, dense, en terminus du métro 13 et boostée par la ligne 15 (6 900 €/m²), face à Clamart, plus grande, plus verte et un peu plus abordable (6 500 €/m²), deux voisines du sud-ouest reliées par le tram T6",
    },
    datasetCount: 176,
    dates: ["2026-03-18", "2026-03-25", "2026-04-01", "2026-04-08", "2026-04-15", "2026-04-22", "2026-04-29", "2026-05-06"],
    skipSlots: [],
  },

  sceaux: {
    city: "Sceaux",
    cityShort: "Sceaux",
    base: "sceaux",
    ficheSlug: "sceaux-92071",
    departement: "Hauts-de-Seine",
    median: 7600,
    evolutionNote: "stable sur 5 ans, marché de prestige familial",
    quartiers: [
      { nom: "Parc de Sceaux / Coulée verte", fourchette: "7 800-9 200 €/m²", note: "villas en lisière du parc, le plus coté" },
      { nom: "Centre / Rue Houdan", fourchette: "7 800-9 000 €/m²", note: "cœur historique piéton, commerces, le plus demandé" },
      { nom: "Charaire / Musiciens", fourchette: "7 200-8 200 €/m²", note: "résidentiel pavillonnaire" },
      { nom: "Petit-Chambord", fourchette: "7 200-8 000 €/m²", note: "calme, proche du RER Sceaux" },
      { nom: "Blagis / limite Fontenay-aux-Roses", fourchette: "6 800-7 600 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER B (gares Sceaux, Robinson en terminus et Parc de Sceaux, Châtelet en 20-25 minutes et Denfert-Rochereau en 15), et le parc de Sceaux de 180 hectares dessiné par Le Nôtre",
    contexte:
      "ville bourgeoise et verdoyante du sud (20 000 habitants), célèbre parc de Sceaux, lycées Lakanal et Marie Curie réputés, rue Houdan piétonne, profil familial aisé très recherché des Parisiens en quête d'écoles et de verdure",
    rendement: "2,8-3,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 % (tendu sur le centre et le parc, plus sur l'ancien à rénover)",
    comparison: {
      city: "Antony",
      base: "antony",
      ficheSlug: "antony-92002",
      price: 6100,
      angle:
        "Sceaux, bourgeoise, verte et prestigieuse autour de son parc et de ses lycées (7 600 €/m²), face à Antony, plus grande, plus accessible et plus diverse sur le RER B (6 100 €/m²), deux voisines du sud qui se partagent le parc de Sceaux",
    },
    datasetCount: 176,
    dates: ["2026-03-17", "2026-03-24", "2026-03-31", "2026-04-07", "2026-04-14", "2026-04-21", "2026-04-28", "2026-05-05"],
    skipSlots: [],
  },

  clamart: {
    city: "Clamart",
    cityShort: "Clamart",
    base: "clamart",
    ficheSlug: "clamart-92023",
    departement: "Hauts-de-Seine",
    median: 6500,
    evolutionNote: "en hausse sur 5 ans, marché porté par les écoquartiers et la ligne 15",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "6 800-7 600 €/m²", note: "autour de la gare Transilien N, commerces, le plus prisé" },
      { nom: "Jardin Parisien / Panorama", fourchette: "6 500-7 400 €/m²", note: "écoquartiers neufs près de la future gare ligne 15, en valorisation" },
      { nom: "Trivaux / Garenne", fourchette: "6 200-7 000 €/m²", note: "en lisière de la forêt de Meudon, résidentiel" },
      { nom: "Percy / Schneider", fourchette: "6 300-7 100 €/m²", note: "pavillonnaire familial" },
      { nom: "Le Petit-Clamart", fourchette: "5 800-6 600 €/m²", note: "sud, plus excentré, le plus abordable" },
    ],
    transport:
      "le Transilien N (gare de Clamart, Montparnasse en 8 minutes), le tram T6 (Châtillon vers Vélizy-Viroflay), la future ligne 15 Sud du Grand Paris Express à Fort d'Issy-Vanves-Clamart (vers 2025-2026), et la forêt domaniale de Meudon-Clamart",
    contexte:
      "grande ville résidentielle et verte du sud-ouest (53 000 habitants), entre la forêt de Meudon et les écoquartiers neufs (Jardin Parisien, Panorama), pôle renforcé par la ligne 15, profil familial, bon compromis prix-nature de la première couronne",
    rendement: "3,3-3,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Issy-les-Moulineaux",
      base: "issy-les-moulineaux",
      ficheSlug: "issy-les-moulineaux-92040",
      price: 8500,
      angle:
        "Clamart, plus verte, plus familiale et nettement plus accessible (6 500 €/m²), face à Issy-les-Moulineaux, plus dense, plus chère et quasi parisienne (8 500 €/m²), deux options du sud-ouest des Hauts-de-Seine",
    },
    datasetCount: 176,
    dates: ["2026-03-16", "2026-03-23", "2026-03-30", "2026-04-06", "2026-04-13", "2026-04-20", "2026-04-27", "2026-05-04"],
    skipSlots: [],
  },

  // Vague boucle nord-ouest (juin 2026). 4 fiches dataset créées (Bezons en Val-d'Oise).
  colombes: {
    city: "Colombes",
    cityShort: "Colombes",
    base: "colombes",
    ficheSlug: "colombes-92025",
    departement: "Hauts-de-Seine",
    median: 5600,
    evolutionNote: "en hausse sur 5 ans, ville populaire en valorisation",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "5 800-6 600 €/m²", note: "autour de la gare et de la mairie, Transilien, le plus prisé" },
      { nom: "Bords de Seine / Île Marante", fourchette: "5 600-6 400 €/m²", note: "cadre vert au bord de l'eau, résidentiel" },
      { nom: "Europe / Stade Yves-du-Manoir", fourchette: "5 400-6 200 €/m²", note: "site olympique 2024, en valorisation" },
      { nom: "Petit-Colombes", fourchette: "4 800-5 600 €/m²", note: "ouest populaire, prolongement du T1 à venir, en mutation" },
      { nom: "Fossés-Jean / Aristide Briand", fourchette: "4 700-5 400 €/m²", note: "nord populaire, le plus abordable" },
    ],
    transport:
      "le Transilien J et L (gares de Colombes, du Stade et Le Stade-Colombes, Saint-Lazare en 15-20 minutes), le tram T2 en limite (Charlebourg), et le futur prolongement du tram T1 vers le Petit-Colombes",
    contexte:
      "grande ville populaire en valorisation du nord-ouest (85 000 habitants), bords de Seine, stade Yves-du-Manoir rénové pour les JO 2024, marché accessible et en hausse, contrastes entre un centre prisé et des secteurs populaires à l'ouest",
    rendement: "3,8-4,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 % (plus de marge à l'ouest et sur l'ancien)",
    comparison: {
      city: "Bois-Colombes",
      base: "bois-colombes",
      ficheSlug: "bois-colombes-92009",
      price: 7000,
      angle:
        "Colombes, grande, populaire et accessible (5 600 €/m²), face à Bois-Colombes, plus petite, plus chic et nettement plus chère (7 000 €/m²), deux voisines du nord-ouest aux profils opposés",
    },
    datasetCount: 176,
    dates: ["2026-03-15", "2026-03-22", "2026-03-29", "2026-04-05", "2026-04-12", "2026-04-19", "2026-04-26", "2026-05-03"],
    skipSlots: [],
  },

  "bois-colombes": {
    city: "Bois-Colombes",
    cityShort: "Bois-Colombes",
    base: "bois-colombes",
    ficheSlug: "bois-colombes-92009",
    departement: "Hauts-de-Seine",
    median: 7000,
    evolutionNote: "stable sur 5 ans, marché familial-chic recherché",
    quartiers: [
      { nom: "Centre / Mairie", fourchette: "7 200-8 100 €/m²", note: "autour de l'hôtel de ville et du marché, le plus prisé" },
      { nom: "Les Bruyères", fourchette: "7 000-7 900 €/m²", note: "résidentiel pavillonnaire, calme" },
      { nom: "Petit-Bois / Gare", fourchette: "6 900-7 700 €/m²", note: "autour de la gare Transilien, pratique" },
      { nom: "Les Bourguignons", fourchette: "6 900-7 600 €/m²", note: "rues pavillonnaires prisées des familles" },
      { nom: "Gramme / Pierre Joigneaux", fourchette: "6 800-7 500 €/m²", note: "résidentiel, le plus abordable" },
    ],
    transport:
      "le Transilien J et L (gare de Bois-Colombes, Saint-Lazare en 12 minutes), et la proximité d'Asnières et de la future ligne 15 du Grand Paris Express",
    contexte:
      "petite ville résidentielle et familiale-chic du nord-ouest (29 000 habitants), maisons de ville et rues pavillonnaires prisées, écoles réputées, esprit village calme à 12 minutes de Saint-Lazare, l'une des plus recherchées de la boucle nord",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "La Garenne-Colombes",
      base: "la-garenne-colombes",
      ficheSlug: "la-garenne-colombes-92035",
      price: 7400,
      angle:
        "Bois-Colombes, village pavillonnaire familial autour de Saint-Lazare (7 000 €/m²), face à La Garenne-Colombes, plus chic, plus dense et un peu plus chère côté La Défense (7 400 €/m²), les deux pépites familiales de la boucle nord",
    },
    datasetCount: 176,
    dates: ["2026-03-14", "2026-03-21", "2026-03-28", "2026-04-04", "2026-04-11", "2026-04-18", "2026-04-25", "2026-05-02"],
    skipSlots: [],
  },

  "la-garenne-colombes": {
    city: "La Garenne-Colombes",
    cityShort: "La Garenne-Colombes",
    base: "la-garenne-colombes",
    ficheSlug: "la-garenne-colombes-92035",
    departement: "Hauts-de-Seine",
    median: 7400,
    evolutionNote: "stable sur 5 ans, marché familial-bourgeois prisé",
    quartiers: [
      { nom: "Centre / Place de Belgique", fourchette: "7 500-8 400 €/m²", note: "cœur de ville commerçant, le plus prisé" },
      { nom: "Faubourg de l'Arche", fourchette: "7 500-8 600 €/m²", note: "immeubles récents en lisière de La Défense, le plus coté" },
      { nom: "Charlebourg", fourchette: "7 200-8 000 €/m²", note: "tram T2, résidentiel, proche La Défense" },
      { nom: "Les Vallées", fourchette: "7 100-7 900 €/m²", note: "rues pavillonnaires familiales" },
      { nom: "Champs-Philippe", fourchette: "7 000-7 800 €/m²", note: "pavillonnaire calme, le plus abordable" },
    ],
    transport:
      "le Transilien L (gare de La Garenne-Colombes, Saint-Lazare en 15 minutes), le tram T2 (Charlebourg vers La Défense et Paris rive gauche), et la proximité immédiate de La Défense et de Courbevoie",
    contexte:
      "petite ville résidentielle et bourgeoise du nord-ouest (29 000 habitants), centre commerçant animé autour de la place de Belgique, rues pavillonnaires prisées des familles, à un pas de La Défense, très recherchée pour son équilibre village-emploi",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Courbevoie",
      base: "courbevoie",
      ficheSlug: "courbevoie-92026",
      price: 7500,
      angle:
        "La Garenne-Colombes, village familial bourgeois à un pas de La Défense (7 400 €/m²), face à Courbevoie, plus grande, plus dense et adossée au quartier d'affaires (7 500 €/m²), deux voisines du pied de La Défense",
    },
    datasetCount: 176,
    dates: ["2026-03-13", "2026-03-20", "2026-03-27", "2026-04-03", "2026-04-10", "2026-04-17", "2026-04-24", "2026-05-01"],
    skipSlots: [],
  },

  bezons: {
    city: "Bezons",
    cityShort: "Bezons",
    base: "bezons",
    ficheSlug: "bezons-95063",
    departement: "Val-d'Oise",
    median: 4300,
    evolutionNote: "en hausse sur 5 ans, ville en transformation portée par le tram T2",
    quartiers: [
      { nom: "Cœur de ville / Bords de Seine", fourchette: "4 800-5 500 €/m²", note: "écoquartier neuf au bord de l'eau, terminus T2, le plus prisé" },
      { nom: "Centre / Mairie", fourchette: "4 500-5 200 €/m²", note: "autour de l'hôtel de ville, commerces" },
      { nom: "Bords de Seine est", fourchette: "4 600-5 300 €/m²", note: "résidentiel récent" },
      { nom: "Agriculture / limite Sartrouville", fourchette: "4 200-4 900 €/m²", note: "pavillonnaire" },
      { nom: "Val Notre-Dame", fourchette: "4 000-4 700 €/m²", note: "nord, le plus abordable" },
    ],
    transport:
      "le tram T2 en terminus (Bezons, vers La Défense en 15 minutes et Paris rive gauche jusqu'à Porte de Versailles), et l'accès à l'A86 et au pont de Bezons vers Argenteuil",
    contexte:
      "ville populaire du Val-d'Oise en pleine transformation (30 000 habitants), nouveau cœur de ville et écoquartier des bords de Seine autour du terminus du tram T2, l'une des entrées les plus abordables de la boucle de Seine reliées à La Défense",
    rendement: "4,3-4,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-8 % (marché plus négociable)",
    comparison: {
      city: "Nanterre",
      base: "nanterre",
      ficheSlug: "nanterre-92050",
      price: 5400,
      angle:
        "Bezons, populaire, en transformation et la plus accessible au terminus du T2 (4 300 €/m²), face à Nanterre, plus grande, plus chère et adossée à La Défense (5 400 €/m²), deux options abordables de l'ouest reliées au quartier d'affaires",
    },
    datasetCount: 176,
    dates: ["2026-03-12", "2026-03-19", "2026-03-26", "2026-04-02", "2026-04-09", "2026-04-16", "2026-04-23", "2026-04-30"],
    skipSlots: [],
  },

  // Vague ouest 92 huppé (juin 2026). 4 fiches dataset premium créées.
  garches: {
    city: "Garches",
    cityShort: "Garches",
    base: "garches",
    ficheSlug: "garches-92033",
    departement: "Hauts-de-Seine",
    median: 7500,
    evolutionNote: "stable sur 5 ans, marché résidentiel bourgeois",
    quartiers: [
      { nom: "Plateau / lisière de forêt", fourchette: "7 600-8 600 €/m²", note: "villas en lisière de Fausses-Reposes, le plus coté" },
      { nom: "Centre / Mairie", fourchette: "7 500-8 400 €/m²", note: "cœur de ville commerçant autour de la gare, le plus prisé" },
      { nom: "Vignes-Benettes / Pasteur", fourchette: "7 300-8 100 €/m²", note: "résidentiel pavillonnaire, proche de l'hôpital Raymond-Poincaré" },
      { nom: "Les Quatre Vents", fourchette: "7 200-8 000 €/m²", note: "résidentiel calme" },
      { nom: "Bas de Garches / limite Vaucresson", fourchette: "7 200-7 900 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le Transilien L (gare de Garches-Marnes-la-Coquette, Saint-Lazare en 20 minutes via La Défense), des bus vers Saint-Cloud et Rueil, l'accès à l'A13, et la forêt domaniale de Fausses-Reposes en lisière",
    contexte:
      "ville résidentielle bourgeoise et verdoyante de l'ouest (18 000 habitants), villas et maisons de maître, hôpital Raymond-Poincaré, lisière de la forêt de Fausses-Reposes et du parc de Saint-Cloud, profil familial aisé, calme à 20 minutes de Saint-Lazare",
    rendement: "2,8-3,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 % (tendu, davantage sur l'ancien à rénover)",
    comparison: {
      city: "Saint-Cloud",
      base: "saint-cloud",
      ficheSlug: "saint-cloud-92064",
      price: 8400,
      angle:
        "Garches, plus confidentielle, plus verte et un peu plus accessible (7 500 €/m²), face à Saint-Cloud, plus grande, plus chic et plus chère sur ses hauteurs avec son parc (8 400 €/m²), deux voisines résidentielles de l'ouest",
    },
    datasetCount: 176,
    dates: ["2026-03-11", "2026-03-18", "2026-03-25", "2026-04-01", "2026-04-08", "2026-04-15", "2026-04-22", "2026-04-29"],
    skipSlots: [],
  },

  vaucresson: {
    city: "Vaucresson",
    cityShort: "Vaucresson",
    base: "vaucresson",
    ficheSlug: "vaucresson-92076",
    departement: "Hauts-de-Seine",
    median: 8500,
    evolutionNote: "stable sur 5 ans, micro-marché de prestige",
    quartiers: [
      { nom: "Parc Princesse / villas", fourchette: "8 800-9 800 €/m²", note: "grandes propriétés sous les arbres, le plus prestigieux" },
      { nom: "Bois / lisière forêt", fourchette: "8 600-9 700 €/m²", note: "villas en lisière de Fausses-Reposes et Saint-Cucufa" },
      { nom: "Centre / Mairie", fourchette: "8 500-9 500 €/m²", note: "cœur de ville autour de la gare, le plus demandé" },
      { nom: "La Marche", fourchette: "8 200-9 200 €/m²", note: "résidentiel, proche du golf" },
      { nom: "Limite Garches", fourchette: "8 200-9 100 €/m²", note: "le plus abordable relativement" },
    ],
    transport:
      "le Transilien L (gare de Vaucresson, Saint-Lazare en 22 minutes via La Défense), l'accès rapide à l'A13, et les forêts de Fausses-Reposes et de Saint-Cucufa en lisière",
    contexte:
      "petite commune résidentielle parmi les plus huppées de l'ouest (9 000 habitants), villas et grandes propriétés sous les arbres, golf, lycée Toulouse-Lautrec, cadre forestier, profil de cadres dirigeants et familles fortunées",
    rendement: "2,5-3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-4 % (très tendu, marché de petite taille)",
    comparison: {
      city: "Garches",
      base: "garches",
      ficheSlug: "garches-92033",
      price: 7500,
      angle:
        "Vaucresson, micro-commune de villas la plus chère du secteur (8 500 €/m²), face à Garches, plus grande, plus commerçante et un peu plus accessible (7 500 €/m²), les deux voisines huppées de la forêt de Fausses-Reposes",
    },
    datasetCount: 176,
    dates: ["2026-03-10", "2026-03-17", "2026-03-24", "2026-03-31", "2026-04-07", "2026-04-14", "2026-04-21", "2026-04-28"],
    skipSlots: [],
  },

  "ville-d-avray": {
    city: "Ville-d'Avray",
    cityShort: "Ville-d'Avray",
    base: "ville-d-avray",
    ficheSlug: "ville-d-avray-92077",
    departement: "Hauts-de-Seine",
    median: 7500,
    evolutionNote: "stable sur 5 ans, marché résidentiel verdoyant",
    quartiers: [
      { nom: "Étangs de Corot", fourchette: "7 800-8 800 €/m²", note: "villas près des étangs peints par Corot, le plus prisé" },
      { nom: "Centre / Mairie", fourchette: "7 500-8 400 €/m²", note: "cœur de ville, commerces" },
      { nom: "La Colline / lisière forêt", fourchette: "7 400-8 300 €/m²", note: "villas sous les arbres, calme" },
      { nom: "Le Parc de Lesser", fourchette: "7 300-8 100 €/m²", note: "résidentiel chic" },
      { nom: "Gare / limite Sèvres", fourchette: "7 200-8 000 €/m²", note: "pratique, le plus abordable" },
    ],
    transport:
      "le Transilien L (gares de Sèvres-Ville-d'Avray et Ville-d'Avray, Saint-Lazare en 20 minutes via La Défense), des bus vers Saint-Cloud et Versailles, et la forêt de Fausses-Reposes avec les étangs de Corot",
    contexte:
      "commune résidentielle verdoyante et arty de l'ouest (11 000 habitants), célèbres étangs de Corot peints par l'artiste, forêt de Fausses-Reposes, villas sous les arbres, profil familial aisé en quête de nature à 20 minutes de Saint-Lazare",
    rendement: "2,8-3,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 % (tendu, davantage sur l'ancien à rénover)",
    comparison: {
      city: "Saint-Cloud",
      base: "saint-cloud",
      ficheSlug: "saint-cloud-92064",
      price: 8400,
      angle:
        "Ville-d'Avray, confidentielle, arty et nichée dans la forêt avec ses étangs de Corot (7 500 €/m²), face à Saint-Cloud, plus grande, plus urbaine et plus chère avec son parc et ses vues (8 400 €/m²), deux voisines vertes de l'ouest",
    },
    datasetCount: 176,
    dates: ["2026-03-09", "2026-03-16", "2026-03-23", "2026-03-30", "2026-04-06", "2026-04-13", "2026-04-20", "2026-04-27"],
    skipSlots: [],
  },

  "le-plessis-robinson": {
    city: "Le Plessis-Robinson",
    cityShort: "Le Plessis-Robinson",
    base: "le-plessis-robinson",
    ficheSlug: "le-plessis-robinson-92060",
    departement: "Hauts-de-Seine",
    median: 6500,
    evolutionNote: "en hausse sur 5 ans, marché porté par la rénovation du cœur de ville",
    quartiers: [
      { nom: "Cœur de Ville", fourchette: "6 800-7 600 €/m²", note: "centre néo-traditionnel primé, le plus prisé" },
      { nom: "Cité-jardins", fourchette: "6 500-7 300 €/m²", note: "patrimoine classé des années 1930, recherché" },
      { nom: "Robinson / limite Sceaux", fourchette: "6 500-7 400 €/m²", note: "proche du RER B à Robinson, résidentiel" },
      { nom: "Les Hauts-du-Plessis", fourchette: "6 300-7 100 €/m²", note: "résidentiel familial" },
      { nom: "Le Pierrier", fourchette: "6 200-7 000 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le tram T6 (vers Châtillon-Montrouge et Viroflay) et le tram T10 ouvert en 2023 (vers Antony), des bus vers le RER B à Robinson et Sceaux, et le parc Henri Sellier ainsi que le bois de la Garenne",
    contexte:
      "ville familiale de l'ouest sud (30 000 habitants) célèbre pour la rénovation primée de son cœur de ville d'architecture néo-traditionnelle, sa Cité-jardins historique classée et ses nombreux parcs, desservie par les trams T6 et T10, très prisée des familles",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Clamart",
      base: "clamart",
      ficheSlug: "clamart-92023",
      price: 6500,
      angle:
        "Le Plessis-Robinson, cœur de ville rénové, Cité-jardins et très familiale (6 500 €/m²), face à Clamart, plus grande, plus variée et adossée à la forêt de Meudon (6 500 €/m²), deux options vertes du sud-ouest au même budget",
    },
    datasetCount: 176,
    dates: ["2026-03-08", "2026-03-15", "2026-03-22", "2026-03-29", "2026-04-05", "2026-04-12", "2026-04-19", "2026-04-26"],
    skipSlots: [],
  },

  // Vague boucle RER A Yvelines premium (juin 2026). 4 fiches dataset créées.
  "le-vesinet": {
    city: "Le Vésinet",
    cityShort: "Le Vésinet",
    base: "le-vesinet",
    ficheSlug: "le-vesinet-78650",
    departement: "Yvelines",
    median: 7800,
    evolutionNote: "stable sur 5 ans, marché de prestige ville-parc",
    quartiers: [
      { nom: "Les Ibis / les lacs", fourchette: "8 000-9 500 €/m²", note: "villas autour des lacs et rivières artificielles, le plus prisé" },
      { nom: "Centre / Église", fourchette: "7 800-9 000 €/m²", note: "autour de l'église Sainte-Marguerite et du RER, commerces" },
      { nom: "Princesse", fourchette: "7 500-8 600 €/m²", note: "résidentiel chic, proche de la gare Le Vésinet-Le Pecq" },
      { nom: "Grandchamp", fourchette: "7 400-8 400 €/m²", note: "villas sous les arbres, calme" },
      { nom: "La Borde", fourchette: "7 300-8 200 €/m²", note: "le plus abordable relativement" },
    ],
    transport:
      "le RER A (gares Le Vésinet-Centre et Le Vésinet-Le Pecq, La Défense en 12 minutes et Châtelet en 25), au cœur d'un cadre de ville-parc classé avec lacs, rivières et milliers d'arbres",
    contexte:
      "ville-parc résidentielle parmi les plus huppées des Yvelines (16 000 habitants), villas sous les arbres autour de lacs et rivières artificielles classés, l'une des communes les plus vertes et les plus aisées d'Île-de-France, RER A direct vers La Défense",
    rendement: "2,5-3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-4 % (très tendu, marché de villas)",
    comparison: {
      city: "Saint-Germain-en-Laye",
      base: "saint-germain-en-laye",
      ficheSlug: "saint-germain-en-laye-78551",
      price: 7100,
      angle:
        "Le Vésinet, ville-parc confidentielle de villas autour de ses lacs (7 800 €/m²), face à Saint-Germain-en-Laye, plus grande, plus animée et royale avec sa forêt et son château (7 100 €/m²), deux références premium du RER A",
    },
    datasetCount: 176,
    dates: ["2026-03-07", "2026-03-14", "2026-03-21", "2026-03-28", "2026-04-04", "2026-04-11", "2026-04-18", "2026-04-25"],
    skipSlots: [],
  },

  "maisons-laffitte": {
    city: "Maisons-Laffitte",
    cityShort: "Maisons-Laffitte",
    base: "maisons-laffitte",
    ficheSlug: "maisons-laffitte-78358",
    departement: "Yvelines",
    median: 6800,
    evolutionNote: "stable sur 5 ans, marché familial de prestige",
    quartiers: [
      { nom: "Le Parc", fourchette: "7 000-8 200 €/m²", note: "villas dans le parc classé, le plus prisé et le plus coté" },
      { nom: "Centre / Gare", fourchette: "6 600-7 500 €/m²", note: "autour du RER et du château, commerces" },
      { nom: "Vieux Maisons", fourchette: "6 300-7 200 €/m²", note: "rues pavillonnaires anciennes" },
      { nom: "Le Mesnil", fourchette: "6 200-7 000 €/m²", note: "résidentiel, le plus abordable" },
    ],
    transport:
      "le RER A (gare Maisons-Laffitte, La Défense en 18 minutes et Châtelet en 30), le château de Mansart, le parc classé et le célèbre centre d'entraînement hippique",
    contexte:
      "ville résidentielle et familiale de prestige des Yvelines (24 000 habitants), surnommée la Cité du cheval pour son hippodrome et son centre d'entraînement, château de Mansart, vaste parc classé de villas, profil familial aisé sur le RER A",
    rendement: "2,8-3,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Saint-Germain-en-Laye",
      base: "saint-germain-en-laye",
      ficheSlug: "saint-germain-en-laye-78551",
      price: 7100,
      angle:
        "Maisons-Laffitte, cité du cheval avec son parc de villas et son château de Mansart (6 800 €/m²), face à Saint-Germain-en-Laye, plus chère, plus animée et royale avec sa forêt (7 100 €/m²), deux voisines premium du nord des Yvelines",
    },
    datasetCount: 176,
    dates: ["2026-03-06", "2026-03-13", "2026-03-20", "2026-03-27", "2026-04-03", "2026-04-10", "2026-04-17", "2026-04-24"],
    skipSlots: [],
  },

  chatou: {
    city: "Chatou",
    cityShort: "Chatou",
    base: "chatou",
    ficheSlug: "chatou-78146",
    departement: "Yvelines",
    median: 6500,
    evolutionNote: "stable sur 5 ans, marché familial des bords de Seine",
    quartiers: [
      { nom: "Bords de Seine / Île des Impressionnistes", fourchette: "6 800-7 600 €/m²", note: "le long de la Seine, Maison Fournaise, le plus prisé" },
      { nom: "Centre / Gare", fourchette: "6 600-7 400 €/m²", note: "autour du RER A Chatou-Croissy, commerces" },
      { nom: "Les Coteaux / limite Le Vésinet", fourchette: "6 400-7 200 €/m²", note: "résidentiel pavillonnaire chic" },
      { nom: "Les Landes", fourchette: "6 200-7 000 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER A (gare Chatou-Croissy, La Défense en 12 minutes et Châtelet en 22), les bords de Seine et l'Île des Impressionnistes avec la Maison Fournaise",
    contexte:
      "ville résidentielle et familiale des bords de Seine (30 000 habitants), berceau de l'impressionnisme avec l'Île et la Maison Fournaise, marché aux puces de Chatou, profil familial-bourgeois à 12 minutes de La Défense en RER A",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Croissy-sur-Seine",
      base: "croissy-sur-seine",
      ficheSlug: "croissy-sur-seine-78190",
      price: 7000,
      angle:
        "Chatou, plus grande, plus commerçante et un peu plus accessible (6 500 €/m²), face à Croissy-sur-Seine, plus confidentielle et résidentielle au bord de la Seine (7 000 €/m²), les deux voisines de la gare Chatou-Croissy",
    },
    datasetCount: 176,
    dates: ["2026-03-05", "2026-03-12", "2026-03-19", "2026-03-26", "2026-04-02", "2026-04-09", "2026-04-16", "2026-04-23"],
    skipSlots: [],
  },

  "croissy-sur-seine": {
    city: "Croissy-sur-Seine",
    cityShort: "Croissy-sur-Seine",
    base: "croissy-sur-seine",
    ficheSlug: "croissy-sur-seine-78190",
    departement: "Yvelines",
    median: 7000,
    evolutionNote: "stable sur 5 ans, marché résidentiel chic",
    quartiers: [
      { nom: "Bords de Seine / Grenouillère", fourchette: "7 200-8 000 €/m²", note: "le long de la Seine, ancien lieu de villégiature impressionniste, le plus prisé" },
      { nom: "Centre / Chiquette", fourchette: "7 000-7 800 €/m²", note: "cœur résidentiel, écoles" },
      { nom: "Les Ponts", fourchette: "6 800-7 600 €/m²", note: "proche de Chatou et du RER" },
      { nom: "Hauts de Croissy", fourchette: "6 700-7 500 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER A (gare Chatou-Croissy, La Défense en 12 minutes et Châtelet en 22), les bords de Seine et le parc des Impressionnistes",
    contexte:
      "commune résidentielle chic des bords de Seine (10 000 habitants), ancien lieu de villégiature des impressionnistes avec la Grenouillère, profil familial aisé et calme, RER A direct vers La Défense",
    rendement: "2,8-3,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Le Vésinet",
      base: "le-vesinet",
      ficheSlug: "le-vesinet-78650",
      price: 7800,
      angle:
        "Croissy-sur-Seine, paisible et résidentielle au bord de la Seine (7 000 €/m²), face au Vésinet, ville-parc plus huppée autour de ses lacs (7 800 €/m²), deux voisines premium du RER A à l'ouest",
    },
    datasetCount: 176,
    dates: ["2026-03-04", "2026-03-11", "2026-03-18", "2026-03-25", "2026-04-01", "2026-04-08", "2026-04-15", "2026-04-22"],
    skipSlots: [],
  },

  // Vague plateau / tranchée Paris-Versailles (juin 2026). Vélizy déjà en base ; 3 fiches créées.
  "velizy-villacoublay": {
    city: "Vélizy-Villacoublay",
    cityShort: "Vélizy-Villacoublay",
    base: "velizy-villacoublay",
    ficheSlug: "velizy-villacoublay-78640",
    departement: "Yvelines",
    median: 5200,
    evolutionNote: "stable sur 5 ans, marché porté par l'emploi et le tram T6",
    quartiers: [
      { nom: "Mozart / Centre", fourchette: "5 500-6 300 €/m²", note: "cœur de ville rénové, tram T6, le plus prisé" },
      { nom: "Europe / Inovel Parc", fourchette: "5 400-6 200 €/m²", note: "près du pôle d'emploi et de Vélizy 2" },
      { nom: "Le Clos / Provinces", fourchette: "5 400-6 200 €/m²", note: "résidentiel pavillonnaire" },
      { nom: "Louvois", fourchette: "5 300-6 000 €/m²", note: "résidentiel" },
      { nom: "Mail / Villacoublay", fourchette: "5 200-5 900 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le tram T6 (de Châtillon-Montrouge à Viroflay, qui traverse la ville), le Transilien N à Chaville et Versailles tout proche, l'accès direct à l'A86 et à la N118, et le pôle d'emploi de Vélizy (Dassault, Thales, centre commercial Vélizy 2)",
    contexte:
      "ville résidentielle et premier pôle tertiaire de l'ouest (22 000 habitants), employeur majeur (Dassault, Thales, Eiffage) et grand centre commercial Vélizy 2, desservie par le tram T6, en lisière de la forêt de Meudon, bon rapport prix-emploi du plateau",
    rendement: "4-4,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Viroflay",
      base: "viroflay",
      ficheSlug: "viroflay-78686",
      price: 6800,
      angle:
        "Vélizy-Villacoublay, pôle d'emploi accessible et bien desservi par le T6 (5 200 €/m²), face à Viroflay, plus résidentielle, plus chic et plus chère (6 800 €/m²), deux voisines du plateau reliées par le tram",
    },
    datasetCount: 176,
    dates: ["2026-03-03", "2026-03-10", "2026-03-17", "2026-03-24", "2026-03-31", "2026-04-07", "2026-04-14", "2026-04-21"],
    skipSlots: [],
  },

  viroflay: {
    city: "Viroflay",
    cityShort: "Viroflay",
    base: "viroflay",
    ficheSlug: "viroflay-78686",
    departement: "Yvelines",
    median: 6800,
    evolutionNote: "stable sur 5 ans, marché familial résidentiel",
    quartiers: [
      { nom: "Rive Droite", fourchette: "7 000-7 800 €/m²", note: "autour de la gare Transilien L, résidentiel chic, le plus prisé" },
      { nom: "Centre", fourchette: "6 800-7 600 €/m²", note: "cœur de ville commerçant" },
      { nom: "Rive Gauche", fourchette: "6 600-7 400 €/m²", note: "autour du RER C et du T6, pratique" },
      { nom: "Les Arnauds / lisière forêt", fourchette: "6 500-7 300 €/m²", note: "le plus abordable, proche des bois" },
    ],
    transport:
      "le Transilien L (Viroflay Rive Droite, Saint-Lazare en 20 minutes), le Transilien N et le RER C (Viroflay Rive Gauche, vers Montparnasse et Austerlitz), le tram T6, et la forêt de Fausses-Reposes en lisière",
    contexte:
      "ville résidentielle et familiale chic entre Versailles et Paris (16 000 habitants), quatre gares et le tram T6, esprit village avec ses commerces, en lisière de la forêt de Fausses-Reposes, très prisée des familles pour son accessibilité",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Versailles",
      base: "versailles",
      ficheSlug: "versailles-78646",
      price: 7400,
      angle:
        "Viroflay, plus petite, plus confidentielle et un peu plus accessible (6 800 €/m²), face à Versailles, plus grande, royale et plus chère avec son château (7 400 €/m²), deux voisines bien desservies de l'ouest",
    },
    datasetCount: 176,
    dates: ["2026-03-02", "2026-03-09", "2026-03-16", "2026-03-23", "2026-03-30", "2026-04-06", "2026-04-13", "2026-04-20"],
    skipSlots: [],
  },

  chaville: {
    city: "Chaville",
    cityShort: "Chaville",
    base: "chaville",
    ficheSlug: "chaville-92022",
    departement: "Hauts-de-Seine",
    median: 6500,
    evolutionNote: "stable sur 5 ans, marché familial verdoyant",
    quartiers: [
      { nom: "Rive Droite / Centre", fourchette: "6 600-7 400 €/m²", note: "autour de la gare Transilien L, le plus prisé" },
      { nom: "Rive Gauche", fourchette: "6 500-7 300 €/m²", note: "autour du RER C, pratique" },
      { nom: "Atrium / Forêt", fourchette: "6 400-7 200 €/m²", note: "résidentiel en lisière de bois" },
      { nom: "Doisu / Brise-Pain", fourchette: "6 300-7 100 €/m²", note: "pavillonnaire, le plus abordable" },
    ],
    transport:
      "le Transilien L (Chaville Rive Droite, Saint-Lazare en 20 minutes), le Transilien N et le RER C (Chaville Rive Gauche), et les forêts de Fausses-Reposes et de Meudon qui couvrent une grande partie de la commune",
    contexte:
      "ville résidentielle et familiale très verte entre Versailles et Sèvres (20 000 habitants), à moitié couverte par les forêts de Meudon et Fausses-Reposes, trois gares, esprit village calme prisé des familles qui quittent Paris pour la nature",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Sèvres",
      base: "sevres",
      ficheSlug: "sevres-92072",
      price: 7000,
      angle:
        "Chaville, plus verte, plus calme et un peu plus accessible (6 500 €/m²), face à Sèvres, plus animée, plus tournée vers la Seine et un peu plus chère (7 000 €/m²), deux voisines boisées de l'ouest",
    },
    datasetCount: 176,
    dates: ["2026-03-01", "2026-03-08", "2026-03-15", "2026-03-22", "2026-03-29", "2026-04-05", "2026-04-12", "2026-04-19"],
    skipSlots: [],
  },

  sevres: {
    city: "Sèvres",
    cityShort: "Sèvres",
    base: "sevres",
    ficheSlug: "sevres-92072",
    departement: "Hauts-de-Seine",
    median: 7000,
    evolutionNote: "stable sur 5 ans, marché résidentiel des bords de Seine",
    quartiers: [
      { nom: "Brimborion / bords de Seine", fourchette: "7 200-8 000 €/m²", note: "coteaux et bord de Seine, vues, le plus prisé" },
      { nom: "Centre / Ville", fourchette: "7 000-7 800 €/m²", note: "cœur de ville autour de la Manufacture, commerces" },
      { nom: "Les Bruyères", fourchette: "6 800-7 600 €/m²", note: "résidentiel sur les hauteurs" },
      { nom: "Ernest Renan / Gare basse", fourchette: "6 800-7 500 €/m²", note: "pratique, le plus abordable" },
    ],
    transport:
      "le tram T2 (Brimborion, Musée de Sèvres, vers La Défense et Paris rive gauche), le Transilien L (Sèvres-Ville-d'Avray et Sèvres Rive Gauche), le métro 9 tout proche à Pont de Sèvres, et le domaine national de Saint-Cloud en lisière",
    contexte:
      "ville résidentielle de coteaux au bord de la Seine (24 000 habitants), célèbre Manufacture nationale de porcelaine, parc de Saint-Cloud et forêt de Meudon en lisière, tram T2 vers La Défense, profil familial à 20 minutes de Paris",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Boulogne-Billancourt",
      base: "boulogne",
      ficheSlug: "boulogne-billancourt-92012",
      price: 9200,
      angle:
        "Sèvres, résidentielle, verte et bien plus accessible sur ses coteaux (7 000 €/m²), face à Boulogne-Billancourt, dense, premium et bien plus chère de l'autre côté de la Seine (9 200 €/m²), deux options du sud-ouest reliées par le pont de Sèvres",
    },
    datasetCount: 176,
    dates: ["2026-02-28", "2026-03-07", "2026-03-14", "2026-03-21", "2026-03-28", "2026-04-04", "2026-04-11", "2026-04-18"],
    skipSlots: [],
  },

  // Vague ceinture de villas ouest (juin 2026). 4 fiches dataset premium créées.
  louveciennes: {
    city: "Louveciennes",
    cityShort: "Louveciennes",
    base: "louveciennes",
    ficheSlug: "louveciennes-78350",
    departement: "Yvelines",
    median: 7300,
    evolutionNote: "stable sur 5 ans, marché de prestige villageois",
    quartiers: [
      { nom: "Coteaux / bords de Seine", fourchette: "7 400-8 400 €/m²", note: "villas avec vues sur la Seine, le plus coté" },
      { nom: "Village / Centre", fourchette: "7 300-8 200 €/m²", note: "cœur historique autour de l'église, le plus prisé" },
      { nom: "Le Prieuré", fourchette: "7 200-8 100 €/m²", note: "résidentiel chic sous les arbres" },
      { nom: "Voisins / lisière forêt de Marly", fourchette: "7 000-7 900 €/m²", note: "le plus abordable, proche des bois" },
    ],
    transport:
      "le Transilien L (gare de Louveciennes, Saint-Lazare en 30 minutes via La Défense), l'accès à l'A86 et la N186, et la forêt domaniale de Marly ainsi que les coteaux de Seine peints par Sisley et Renoir",
    contexte:
      "petit village résidentiel de prestige de la boucle de Seine (7 000 habitants), villas et propriétés sous les arbres, coteaux peints par les impressionnistes, forêt de Marly, l'un des cadres les plus confidentiels et les plus aisés de l'ouest",
    rendement: "2,5-3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "2-4 % (très tendu, marché de villas)",
    comparison: {
      city: "Marly-le-Roi",
      base: "marly-le-roi",
      ficheSlug: "marly-le-roi-78372",
      price: 6200,
      angle:
        "Louveciennes, village confidentiel de villas sur les coteaux de Seine (7 300 €/m²), face à Marly-le-Roi, plus grande, plus familiale et un peu plus accessible autour de son domaine royal (6 200 €/m²), deux voisines huppées de la forêt de Marly",
    },
    datasetCount: 176,
    dates: ["2026-02-27", "2026-03-06", "2026-03-13", "2026-03-20", "2026-03-27", "2026-04-03", "2026-04-10", "2026-04-17"],
    skipSlots: [],
  },

  bougival: {
    city: "Bougival",
    cityShort: "Bougival",
    base: "bougival",
    ficheSlug: "bougival-78092",
    departement: "Yvelines",
    median: 6500,
    evolutionNote: "stable sur 5 ans, marché résidentiel des bords de Seine",
    quartiers: [
      { nom: "Bords de Seine / Île de la Chaussée", fourchette: "6 800-7 600 €/m²", note: "au bord de l'eau, ancienne Grenouillère, le plus prisé" },
      { nom: "Coteaux / La Jonchère", fourchette: "6 600-7 400 €/m²", note: "villas sur les hauteurs, vues sur la Seine" },
      { nom: "Centre / Village", fourchette: "6 500-7 300 €/m²", note: "cœur historique, commerces" },
      { nom: "Les Hauts de Bougival", fourchette: "6 300-7 000 €/m²", note: "résidentiel, le plus abordable" },
    ],
    transport:
      "le RER A tout proche à Rueil-Malmaison et le Transilien L à Louveciennes (vers Saint-Lazare et La Défense), un réseau de bus vers les gares, l'accès à l'A86, et les bords de Seine chers aux impressionnistes",
    contexte:
      "village résidentiel des bords de Seine (8 500 habitants), berceau de l'impressionnisme avec la Grenouillère et la datcha de Tourgueniev, coteaux boisés et Île de la Chaussée, profil familial aisé entre Rueil et la boucle de Saint-Germain",
    rendement: "2,8-3,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Croissy-sur-Seine",
      base: "croissy-sur-seine",
      ficheSlug: "croissy-sur-seine-78190",
      price: 7000,
      angle:
        "Bougival, village impressionniste des coteaux de Seine (6 500 €/m²), face à Croissy-sur-Seine, plus résidentielle et un peu plus chère sur l'autre rive (7 000 €/m²), deux voisines de la Grenouillère au bord de la Seine",
    },
    datasetCount: 176,
    dates: ["2026-02-26", "2026-03-05", "2026-03-12", "2026-03-19", "2026-03-26", "2026-04-02", "2026-04-09", "2026-04-16"],
    skipSlots: [],
  },

  "marly-le-roi": {
    city: "Marly-le-Roi",
    cityShort: "Marly-le-Roi",
    base: "marly-le-roi",
    ficheSlug: "marly-le-roi-78372",
    departement: "Yvelines",
    median: 6200,
    evolutionNote: "stable sur 5 ans, marché familial autour du domaine royal",
    quartiers: [
      { nom: "Centre / Village", fourchette: "6 400-7 200 €/m²", note: "cœur historique près du parc, le plus prisé" },
      { nom: "Montval", fourchette: "6 200-7 000 €/m²", note: "résidentiel pavillonnaire" },
      { nom: "Le Cœur Volant / lisière forêt", fourchette: "6 100-6 900 €/m²", note: "proche des bois de Marly" },
      { nom: "Les Grandes-Terres", fourchette: "6 000-6 800 €/m²", note: "grand ensemble résidentiel des années 50 signé Lopez, le plus abordable" },
    ],
    transport:
      "le Transilien L (gare de Marly-le-Roi, Saint-Lazare en 30 minutes via La Défense), l'accès à l'A13 et la N186, et le parc et la forêt de Marly (domaine royal de Louis XIV) qui bordent la ville",
    contexte:
      "ville résidentielle et familiale des Yvelines (16 000 habitants), ancien domaine royal de Louis XIV avec son parc et son abreuvoir, forêt de Marly, écoles réputées, esprit village à 30 minutes de Saint-Lazare, prisée des familles",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Saint-Germain-en-Laye",
      base: "saint-germain-en-laye",
      ficheSlug: "saint-germain-en-laye-78551",
      price: 7100,
      angle:
        "Marly-le-Roi, plus villageoise, plus verte et plus accessible autour de son domaine royal (6 200 €/m²), face à Saint-Germain-en-Laye, plus grande, plus animée et plus chère avec son château et son RER A (7 100 €/m²), deux voisines royales des Yvelines",
    },
    datasetCount: 176,
    dates: ["2026-02-25", "2026-03-04", "2026-03-11", "2026-03-18", "2026-03-25", "2026-04-01", "2026-04-08", "2026-04-15"],
    skipSlots: [],
  },

  "le-pecq": {
    city: "Le Pecq",
    cityShort: "Le Pecq",
    base: "le-pecq",
    ficheSlug: "le-pecq-78481",
    departement: "Yvelines",
    median: 6500,
    evolutionNote: "stable sur 5 ans, marché résidentiel des bords de Seine",
    quartiers: [
      { nom: "Bords de Seine / Mexique", fourchette: "6 800-7 500 €/m²", note: "au bord de l'eau au pied de Saint-Germain, le plus prisé" },
      { nom: "Canada / Ermitage", fourchette: "6 400-7 100 €/m²", note: "résidentiel sur les hauteurs, vues sur la Seine" },
      { nom: "Centre / Vignes-Benettes", fourchette: "6 500-7 200 €/m²", note: "cœur de ville, commerces" },
      { nom: "Le Pecq bas / gare", fourchette: "6 300-7 000 €/m²", note: "pratique, proche du RER A, le plus abordable" },
    ],
    transport:
      "le RER A (gare Le Vésinet-Le Pecq en limite, La Défense en 12 minutes et Châtelet en 25), le Transilien L à Saint-Germain tout proche, et les bords de Seine au pied de la terrasse de Saint-Germain avec la base de loisirs nautiques",
    contexte:
      "ville résidentielle des bords de Seine au pied de Saint-Germain-en-Laye (16 000 habitants), la plus basse de la boucle avec ses berges et sa base nautique, profil familial, RER A direct vers La Défense",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Le Vésinet",
      base: "le-vesinet",
      ficheSlug: "le-vesinet-78650",
      price: 7800,
      angle:
        "Le Pecq, résidentielle et accessible au bord de la Seine (6 500 €/m²), face au Vésinet, ville-parc plus huppée autour de ses lacs juste à côté (7 800 €/m²), deux voisines de la gare Le Vésinet-Le Pecq",
    },
    datasetCount: 176,
    dates: ["2026-02-24", "2026-03-03", "2026-03-10", "2026-03-17", "2026-03-24", "2026-03-31", "2026-04-07", "2026-04-14"],
    skipSlots: [],
  },
};
