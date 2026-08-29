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

  // Vague sud RER B (juin 2026). Arcueil déjà en base ; 3 fiches créées.
  "bourg-la-reine": {
    city: "Bourg-la-Reine",
    cityShort: "Bourg-la-Reine",
    base: "bourg-la-reine",
    ficheSlug: "bourg-la-reine-92014",
    departement: "Hauts-de-Seine",
    median: 7000,
    evolutionNote: "stable sur 5 ans, marché résidentiel chic du sud",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "7 200-8 000 €/m²", note: "autour du RER B et du marché, le plus prisé" },
      { nom: "Nord / limite Sceaux", fourchette: "7 000-7 800 €/m²", note: "résidentiel chic, proche du parc de Sceaux" },
      { nom: "La Faïencerie / L'Yser", fourchette: "6 800-7 600 €/m²", note: "pavillonnaire recherché" },
      { nom: "Sud / Grand Chemin", fourchette: "6 800-7 500 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER B (gare Bourg-la-Reine, Châtelet en 18 minutes et Denfert-Rochereau en 12), l'accès à l'A86, et la proximité immédiate du parc de Sceaux",
    contexte:
      "ville résidentielle chic et familiale du sud (20 000 habitants), marché réputé, rues pavillonnaires, proximité du parc de Sceaux et de bons lycées, l'une des adresses les plus prisées du RER B sud à 18 minutes de Châtelet",
    rendement: "2,8-3,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Sceaux",
      base: "sceaux",
      ficheSlug: "sceaux-92071",
      price: 7600,
      angle:
        "Bourg-la-Reine, chic, commerçante et bien reliée par le RER B (7 000 €/m²), face à Sceaux, plus verte, plus bourgeoise et un peu plus chère autour de son parc (7 600 €/m²), deux voisines prisées du sud",
    },
    datasetCount: 176,
    dates: ["2026-02-23", "2026-03-02", "2026-03-09", "2026-03-16", "2026-03-23", "2026-03-30", "2026-04-06", "2026-04-13"],
    skipSlots: [],
  },

  "fontenay-aux-roses": {
    city: "Fontenay-aux-Roses",
    cityShort: "Fontenay-aux-Roses",
    base: "fontenay-aux-roses",
    ficheSlug: "fontenay-aux-roses-92032",
    departement: "Hauts-de-Seine",
    median: 6500,
    evolutionNote: "stable sur 5 ans, marché familial verdoyant",
    quartiers: [
      { nom: "Centre / Mairie", fourchette: "6 600-7 400 €/m²", note: "cœur de ville autour du RER B, le plus prisé" },
      { nom: "Scarron / Ormeaux", fourchette: "6 500-7 300 €/m²", note: "résidentiel pavillonnaire, écoles" },
      { nom: "Les Pervenches", fourchette: "6 400-7 200 €/m²", note: "résidentiel calme" },
      { nom: "Blagis / limite Sceaux-Bagneux", fourchette: "6 300-7 100 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER B (gare Fontenay-aux-Roses, Châtelet en 20 minutes et Denfert-Rochereau en 14), la Coulée verte du sud parisien, et l'accès à l'A86",
    contexte:
      "ville résidentielle et familiale verdoyante du sud (25 000 habitants), Coulée verte, rues pavillonnaires, écoles réputées et proximité du parc de Sceaux, esprit village prisé des familles sur le RER B",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Châtillon",
      base: "chatillon",
      ficheSlug: "chatillon-92020",
      price: 6900,
      angle:
        "Fontenay-aux-Roses, verte, familiale et calme sur le RER B (6 500 €/m²), face à Châtillon, plus dense et boostée par la ligne 15 sur le métro 13 (6 900 €/m²), deux voisines du sud proche",
    },
    datasetCount: 176,
    dates: ["2026-02-22", "2026-03-01", "2026-03-08", "2026-03-15", "2026-03-22", "2026-03-29", "2026-04-05", "2026-04-12"],
    skipSlots: [],
  },

  bagneux: {
    city: "Bagneux",
    cityShort: "Bagneux",
    base: "bagneux",
    ficheSlug: "bagneux-92007",
    departement: "Hauts-de-Seine",
    median: 5800,
    evolutionNote: "en forte hausse sur 5 ans, marché transformé par le métro 4 et la ligne 15",
    quartiers: [
      { nom: "Quartier Nord / Barbara", fourchette: "6 000-6 800 €/m²", note: "autour des nouvelles stations du métro 4, en pleine valorisation, le plus prisé" },
      { nom: "Centre / Marché", fourchette: "5 800-6 600 €/m²", note: "cœur de ville, commerces" },
      { nom: "Tertres-Cuverons", fourchette: "5 600-6 300 €/m²", note: "résidentiel" },
      { nom: "Pierre Plate / Sud", fourchette: "5 500-6 200 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le métro 4 prolongé en 2022 (stations Barbara et Bagneux-Lucie Aubrac, Montparnasse en 15 minutes et Châtelet en 25), la future ligne 15 Sud du Grand Paris Express à Bagneux-Lucie Aubrac (mise en service vers 2025-2026), le RER B tout proche à Arcueil-Cachan, et l'accès à l'A86",
    contexte:
      "ville populaire du sud en pleine transformation (42 000 habitants), désenclavée par l'arrivée du métro 4 et bientôt de la ligne 15, marché en forte hausse, l'un des meilleurs rapports prix-accès du sud proche à moins de 6 000 €/m²",
    rendement: "3,5-4 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Montrouge",
      base: "montrouge",
      ficheSlug: "montrouge-92049",
      price: 8000,
      angle:
        "Bagneux, populaire, en pleine valorisation avec le métro 4 et la ligne 15 (5 800 €/m²), face à Montrouge, plus bourgeoise et bien plus chère juste au nord (8 000 €/m²), deux options du sud proche à deux niveaux de budget",
    },
    datasetCount: 176,
    dates: ["2026-02-21", "2026-02-28", "2026-03-07", "2026-03-14", "2026-03-21", "2026-03-28", "2026-04-04", "2026-04-11"],
    skipSlots: [],
  },

  arcueil: {
    city: "Arcueil",
    cityShort: "Arcueil",
    base: "arcueil",
    ficheSlug: "arcueil-94003",
    departement: "Val-de-Marne",
    median: 6800,
    evolutionNote: "en hausse sur 5 ans, marché porté par la ligne 15 à venir",
    quartiers: [
      { nom: "Centre / Aqueduc", fourchette: "6 800-7 500 €/m²", note: "autour de l'aqueduc Médicis et du centre, le plus prisé" },
      { nom: "Vache Noire / limite Montrouge", fourchette: "6 700-7 400 €/m²", note: "résidentiel, proche du centre commercial" },
      { nom: "Laplace / RER", fourchette: "6 600-7 300 €/m²", note: "autour de la gare Arcueil-Cachan, pratique" },
      { nom: "Berthollet / Irlandais", fourchette: "6 500-7 200 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER B (gare Arcueil-Cachan, Châtelet en 18 minutes et Denfert-Rochereau en 10), la future ligne 15 Sud du Grand Paris Express à Arcueil-Cachan (vers 2025-2026), l'aqueduc Médicis, et l'accès à l'A6 et l'A6b",
    contexte:
      "ville en mutation du sud proche (22 000 habitants), aqueducs Médicis et de la Vanne, scène culturelle avec l'Anis Gras, désenclavement par la future ligne 15, collée à Montrouge et Gentilly, à 10 minutes de Denfert-Rochereau en RER B",
    rendement: "3,3-3,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Cachan",
      base: "cachan",
      ficheSlug: "cachan-94016",
      price: 5800,
      angle:
        "Arcueil, en mutation et bien reliée par le RER B et bientôt la ligne 15 (6 800 €/m²), face à Cachan, résidentielle, étudiante et un peu plus abordable juste à côté (autour de 5 800 €/m²), les deux communes de la gare Arcueil-Cachan",
    },
    datasetCount: 176,
    dates: ["2026-02-20", "2026-02-27", "2026-03-06", "2026-03-13", "2026-03-20", "2026-03-27", "2026-04-03", "2026-04-10"],
    skipSlots: [],
  },

  // Vague 93 gentrifié (juin 2026). Saint-Ouen déjà en base ; 3 fiches créées.
  "les-lilas": {
    city: "Les Lilas",
    cityShort: "Les Lilas",
    base: "les-lilas",
    ficheSlug: "les-lilas-93045",
    departement: "Seine-Saint-Denis",
    median: 7500,
    evolutionNote: "en hausse sur 5 ans, marché prisé collé à Paris",
    quartiers: [
      { nom: "Mairie des Lilas", fourchette: "7 600-8 400 €/m²", note: "terminus du métro 11, cœur de ville, le plus prisé" },
      { nom: "Centre / Marché", fourchette: "7 400-8 200 €/m²", note: "commerces, esprit village" },
      { nom: "Les Bruyères / hauteurs", fourchette: "7 300-8 100 €/m²", note: "résidentiel, vues sur Paris" },
      { nom: "Sente des Cornettes / limite Romainville", fourchette: "7 000-7 800 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le métro 11 (Mairie des Lilas en terminus, République en 12 minutes et Châtelet en 15), son prolongement vers l'est ouvert en 2024, et un réseau de bus dense vers Paris",
    contexte:
      "petite ville prisée et bobo collée à Paris 19e-20e (23 000 habitants), esprit village avec ses commerces et son théâtre du Garde-Chasse, profil créatif et familial, l'une des adresses les plus recherchées de l'est à 12 minutes de République",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Le Pré-Saint-Gervais",
      base: "le-pre-saint-gervais",
      ficheSlug: "le-pre-saint-gervais-93061",
      price: 7000,
      angle:
        "Les Lilas, village bobo prisé au terminus du métro 11 (7 500 €/m²), face au Pré-Saint-Gervais, plus petit, plus confidentiel et un peu plus abordable juste à côté (7 000 €/m²), deux pépites de l'est collées à Paris",
    },
    datasetCount: 176,
    dates: ["2026-02-19", "2026-02-26", "2026-03-05", "2026-03-12", "2026-03-19", "2026-03-26", "2026-04-02", "2026-04-09"],
    skipSlots: [],
  },

  "le-pre-saint-gervais": {
    city: "Le Pré-Saint-Gervais",
    cityShort: "Le Pré-Saint-Gervais",
    base: "le-pre-saint-gervais",
    ficheSlug: "le-pre-saint-gervais-93061",
    departement: "Seine-Saint-Denis",
    median: 7000,
    evolutionNote: "en hausse sur 5 ans, marché confidentiel prisé",
    quartiers: [
      { nom: "Centre / Mairie", fourchette: "7 100-7 900 €/m²", note: "cœur de ville village, le plus prisé" },
      { nom: "Les Hauts / Danton", fourchette: "7 000-7 800 €/m²", note: "résidentiel sur les hauteurs" },
      { nom: "Sept-Arpents / limite Pantin", fourchette: "6 800-7 500 €/m²", note: "proche du métro 5, pratique" },
      { nom: "Jean Jaurès", fourchette: "6 800-7 400 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le métro 5 (Hoche à Pantin tout proche) et le métro 7bis (Pré-Saint-Gervais, Danube), un réseau de bus vers Paris 19e, et la proximité immédiate des Buttes-Chaumont",
    contexte:
      "l'une des plus petites communes de France par la superficie (18 000 habitants sur 0,7 km²), village bobo confidentiel collé à Paris 19e et aux Buttes-Chaumont, esprit hameau prisé des familles créatives, en pleine valorisation",
    rendement: "3-3,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Pantin",
      base: "pantin",
      ficheSlug: "pantin-93055",
      price: 5900,
      angle:
        "Le Pré-Saint-Gervais, village bobo confidentiel collé aux Buttes-Chaumont (7 000 €/m²), face à Pantin, plus grande, plus branchée le long du canal et plus abordable (5 900 €/m²), deux voisines de l'est en pleine hausse",
    },
    datasetCount: 176,
    dates: ["2026-02-18", "2026-02-25", "2026-03-04", "2026-03-11", "2026-03-18", "2026-03-25", "2026-04-01", "2026-04-08"],
    skipSlots: [],
  },

  "saint-ouen": {
    city: "Saint-Ouen-sur-Seine",
    cityShort: "Saint-Ouen",
    base: "saint-ouen",
    ficheSlug: "saint-ouen-sur-seine-93070",
    departement: "Seine-Saint-Denis",
    median: 7400,
    evolutionNote: "en forte hausse sur 5 ans, gentrification rapide portée par le métro 14",
    quartiers: [
      { nom: "Vieux Saint-Ouen / Puces", fourchette: "7 600-8 500 €/m²", note: "autour des Puces et du marché, le plus prisé" },
      { nom: "Les Docks", fourchette: "7 400-8 300 €/m²", note: "écoquartier neuf au bord de Seine, moderne" },
      { nom: "Centre / Mairie", fourchette: "7 200-8 000 €/m²", note: "métro 13, commerces" },
      { nom: "Debain / Michelet", fourchette: "6 800-7 600 €/m²", note: "en mutation, le plus abordable" },
    ],
    transport:
      "le métro 14 prolongé (Saint-Ouen, Mairie de Saint-Ouen, Saint-Lazare en 8 minutes et Châtelet en 12), le métro 13, le RER C, et l'écoquartier des Docks au bord de la Seine",
    contexte:
      "ville en gentrification rapide du nord (52 000 habitants), célèbre pour ses Puces (plus grand marché d'antiquités du monde), désenclavée et valorisée par le métro 14, écoquartier des Docks au bord de Seine, collée à Paris 17e-18e, l'une des plus fortes hausses de la petite couronne",
    rendement: "3,3-3,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Asnières-sur-Seine",
      base: "asnieres-sur-seine",
      ficheSlug: "asnieres-sur-seine-92004",
      price: 6800,
      angle:
        "Saint-Ouen-sur-Seine, en pleine gentrification avec ses Puces, ses Docks et le métro 14 (7 400 €/m²), face à Asnières-sur-Seine, plus résidentielle et un peu plus abordable sur l'autre rive (6 800 €/m²), deux villes du nord-ouest en valorisation",
    },
    datasetCount: 176,
    dates: ["2026-02-17", "2026-02-24", "2026-03-03", "2026-03-10", "2026-03-17", "2026-03-24", "2026-03-31", "2026-04-07"],
    skipSlots: [],
  },

  bagnolet: {
    city: "Bagnolet",
    cityShort: "Bagnolet",
    base: "bagnolet",
    ficheSlug: "bagnolet-93006",
    departement: "Seine-Saint-Denis",
    median: 6000,
    evolutionNote: "en hausse sur 5 ans, marché en valorisation collé à Paris",
    quartiers: [
      { nom: "Centre / Gallieni", fourchette: "6 200-7 000 €/m²", note: "autour du métro 3 Gallieni, le plus prisé" },
      { nom: "Les Coutures / hauteurs", fourchette: "6 000-6 800 €/m²", note: "résidentiel, vues sur Paris" },
      { nom: "La Noue / limite Montreuil", fourchette: "5 800-6 500 €/m²", note: "en mutation" },
      { nom: "Le Plateau / Malassis", fourchette: "5 700-6 400 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le métro 3 en terminus (Gallieni, République en 15 minutes et Havre-Caumartin en 20), la gare routière internationale de Gallieni, et l'accès immédiat au périphérique et à l'A3",
    contexte:
      "ville populaire en valorisation collée à Paris 20e (36 000 habitants), hauteurs avec vues sur Paris, secteurs en mutation le long du métro 3, profil jeune et créatif attiré par les prix, gentrification progressive dans le sillage de Montreuil",
    rendement: "3,5-4 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Montreuil",
      base: "montreuil",
      ficheSlug: "montreuil-93048",
      price: 5800,
      angle:
        "Bagnolet, populaire, perchée avec vues sur Paris et portée par le métro 3 (6 000 €/m²), face à Montreuil, plus grande, plus gentrifiée et à peine moins chère (5 800 €/m²), deux voisines de l'est qui montent",
    },
    datasetCount: 176,
    dates: ["2026-02-16", "2026-02-23", "2026-03-02", "2026-03-09", "2026-03-16", "2026-03-23", "2026-03-30", "2026-04-06"],
    skipSlots: [],
  },

  // Vague boucle de la Marne / 94 est (juillet 2026). Les 4 villes étaient déjà dans le dataset.
  "joinville-le-pont": {
    city: "Joinville-le-Pont",
    cityShort: "Joinville-le-Pont",
    base: "joinville-le-pont",
    ficheSlug: "joinville-le-pont-94042",
    departement: "Val-de-Marne",
    median: 6800,
    evolutionNote: "en légère hausse sur 5 ans, marché familial des bords de Marne",
    quartiers: [
      { nom: "Bords de Marne / Île Fanac", fourchette: "7 000-7 800 €/m²", note: "guinguettes, aviron, l'île au milieu de la Marne, le plus prisé" },
      { nom: "Centre / Mairie", fourchette: "6 800-7 500 €/m²", note: "autour du RER A et des commerces" },
      { nom: "Polangis", fourchette: "6 600-7 400 €/m²", note: "quartier pavillonnaire calme sous les arbres, très familial" },
      { nom: "Palissy / Hauts de Joinville", fourchette: "6 500-7 200 €/m²", note: "le plus abordable, en hauteur" },
    ],
    transport:
      "le RER A (gare de Joinville-le-Pont, Châtelet en 20 minutes), les bords de Marne et leurs guinguettes, le bois de Vincennes en lisière et l'accès à l'A4",
    contexte:
      "petite ville des bords de Marne au passé de cinéma (20 000 habitants, les anciens studios de Joinville), guinguettes et clubs d'aviron sur l'Île Fanac, quartier pavillonnaire de Polangis, coincée entre le bois de Vincennes et la Marne, très prisée des familles",
    rendement: "3,2-3,7 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Saint-Maur-des-Fossés",
      base: "saint-maur",
      ficheSlug: "saint-maur-des-fosses-94068",
      price: 6800,
      angle:
        "Joinville-le-Pont, petite, cinéphile et animée autour de ses guinguettes (6 800 €/m²), face à Saint-Maur-des-Fossés, plus grande, plus bourgeoise dans sa boucle de la Marne, au même prix (6 800 €/m²), deux voisines de bord de Marne au coude à coude",
    },
    datasetCount: 176,
    dates: ["2026-02-15", "2026-02-22", "2026-03-01", "2026-03-08", "2026-03-15", "2026-03-22", "2026-03-29", "2026-04-05"],
    skipSlots: [],
  },

  "champigny-sur-marne": {
    city: "Champigny-sur-Marne",
    cityShort: "Champigny",
    base: "champigny-sur-marne",
    ficheSlug: "champigny-sur-marne-94017",
    departement: "Val-de-Marne",
    median: 5500,
    evolutionNote: "en forte hausse sur 5 ans, marché porté par l'arrivée de la ligne 15",
    quartiers: [
      { nom: "Bords de Marne / Centre", fourchette: "5 800-6 500 €/m²", note: "cœur de ville près de la Marne, le plus prisé" },
      { nom: "Cœuilly", fourchette: "5 500-6 300 €/m²", note: "plateau pavillonnaire familial recherché" },
      { nom: "Le Tremblay / Polangis", fourchette: "5 500-6 200 €/m²", note: "limite Joinville et Nogent, résidentiel" },
      { nom: "Le Plant / Les Simonettes", fourchette: "5 200-5 900 €/m²", note: "en valorisation avec la ligne 15" },
      { nom: "Bois l'Abbé / Les Mordacs", fourchette: "4 800-5 500 €/m²", note: "grands ensembles, le plus abordable" },
    ],
    transport:
      "le RER A (gare de Champigny à Saint-Maur en limite, Châtelet en 25-30 minutes), le RER E aux Boullereaux, et surtout deux gares de la future ligne 15 Sud du Grand Paris Express (Champigny Centre et Saint-Maur-Créteil en lisière), avec l'A4 à proximité",
    contexte:
      "grande ville populaire et familiale des bords de Marne (78 000 habitants), plateau pavillonnaire de Cœuilly, secteurs en pleine valorisation avec l'arrivée de la ligne 15 (site de maintenance et gare Champigny Centre), l'un des marchés les plus dynamiques du Val-de-Marne en évolution de prix",
    rendement: "3,8-4,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 % (plus de marge sur les grands ensembles)",
    comparison: {
      city: "Saint-Maur-des-Fossés",
      base: "saint-maur",
      ficheSlug: "saint-maur-des-fosses-94068",
      price: 6800,
      angle:
        "Champigny-sur-Marne, populaire, grande et en pleine valorisation avec la ligne 15 (5 500 €/m²), face à Saint-Maur-des-Fossés, bourgeoise et établie dans sa boucle (6 800 €/m²), les deux rives d'une même Marne à 1 300 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-02-14", "2026-02-21", "2026-02-28", "2026-03-07", "2026-03-14", "2026-03-21", "2026-03-28", "2026-04-04"],
    skipSlots: [],
  },

  alfortville: {
    city: "Alfortville",
    cityShort: "Alfortville",
    base: "alfortville",
    ficheSlug: "alfortville-94002",
    departement: "Val-de-Marne",
    median: 5400,
    evolutionNote: "en hausse sur 5 ans, marché porté par le RER D et la ligne 15 à venir",
    quartiers: [
      { nom: "Nord / limite Charenton", fourchette: "5 600-6 300 €/m²", note: "le plus proche de Paris, recherché" },
      { nom: "Centre / Mairie", fourchette: "5 400-6 100 €/m²", note: "cœur de ville commerçant le long de la rue Véron" },
      { nom: "Île au Cointre / bords de Seine", fourchette: "5 300-6 000 €/m²", note: "berges réaménagées, résidentiel" },
      { nom: "Sud / Val de Seine, Chinagora", fourchette: "5 000-5 700 €/m²", note: "au confluent Seine-Marne, le plus abordable" },
    ],
    transport:
      "le RER D (gares de Maisons-Alfort-Alfortville et Le Vert de Maisons, Gare de Lyon en 10 minutes), la future ligne 15 Sud du Grand Paris Express au Vert de Maisons, le métro 8 tout proche à Maisons-Alfort, et les berges de Seine et de Marne",
    contexte:
      "ville-presqu'île entre Seine et Marne (44 000 habitants), coincée entre les deux fleuves face à Charenton et Ivry, forte communauté arménienne et vie de quartier autour de la rue Véron, à 10 minutes de Gare de Lyon en RER D et bientôt sur la ligne 15, marché accessible aux portes de Paris",
    rendement: "3,8-4,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Maisons-Alfort",
      base: "maisons-alfort",
      ficheSlug: "maisons-alfort-94046",
      price: 6600,
      angle:
        "Alfortville, presqu'île populaire entre Seine et Marne, accessible et bien reliée (5 400 €/m²), face à Maisons-Alfort, plus résidentielle et plus chère de l'autre côté des voies (6 600 €/m²), deux jumelles séparées par une gare commune et 1 200 €/m²",
    },
    datasetCount: 176,
    dates: ["2026-02-13", "2026-02-20", "2026-02-27", "2026-03-06", "2026-03-13", "2026-03-20", "2026-03-27", "2026-04-03"],
    skipSlots: [],
  },

  creteil: {
    city: "Créteil",
    cityShort: "Créteil",
    base: "creteil",
    ficheSlug: "creteil-94028",
    departement: "Val-de-Marne",
    median: 4800,
    evolutionNote: "en forte hausse sur 5 ans, préfecture portée par le métro 8 et la ligne 15 à venir",
    quartiers: [
      { nom: "Vieux Créteil / Bords de Marne", fourchette: "5 200-6 000 €/m²", note: "le village historique près de la Marne, le plus prisé" },
      { nom: "Lac / Pointe du Lac", fourchette: "5 000-5 700 €/m²", note: "autour du lac de 40 hectares, métro 8, cadre unique" },
      { nom: "L'Échat / Université", fourchette: "4 800-5 500 €/m²", note: "UPEC, CHU Mondor, future gare ligne 15, en valorisation" },
      { nom: "Préfecture / Palais", fourchette: "4 600-5 300 €/m²", note: "les célèbres immeubles Choux, commerces de Créteil Soleil" },
      { nom: "Mont-Mesly / Habette", fourchette: "4 200-4 900 €/m²", note: "grands ensembles en rénovation, le plus abordable" },
    ],
    transport:
      "le métro 8 (quatre stations dont Créteil-Préfecture et Pointe du Lac, Bastille en 30 minutes), la future ligne 15 Sud du Grand Paris Express à Créteil-L'Échat (vers 2026), le TVM et un réseau de bus dense, avec l'A86 qui traverse la ville",
    contexte:
      "préfecture du Val-de-Marne et deuxième ville de la petite couronne sud (93 000 habitants), lac de 40 hectares avec base nautique, université UPEC et CHU Henri-Mondor, immeubles Choux emblématiques, centre commercial Créteil Soleil, marché le plus abordable de notre sélection à moins de 5 000 €/m² avec un métro direct",
    rendement: "4,3-4,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 % (variable selon le quartier)",
    comparison: {
      city: "Champigny-sur-Marne",
      base: "champigny-sur-marne",
      ficheSlug: "champigny-sur-marne-94017",
      price: 5500,
      angle:
        "Créteil, préfecture équipée avec son lac, son métro et ses 93 000 habitants (4 800 €/m²), face à Champigny-sur-Marne, plus pavillonnaire au bord de la Marne (5 500 €/m²), deux grandes villes du 94 portées par la ligne 15",
    },
    datasetCount: 176,
    dates: ["2026-02-12", "2026-02-19", "2026-02-26", "2026-03-05", "2026-03-12", "2026-03-19", "2026-03-26", "2026-04-02"],
    skipSlots: [],
  },

  // Vague 94 ligne 14 / RER B (juillet 2026). KB + Gentilly créées ; Villejuif a déjà
  // vivre/prix/déménager (slugs -effet-ligne-14 et demenager-) : skip anti-cannibal.
  villejuif: {
    city: "Villejuif",
    cityShort: "Villejuif",
    base: "villejuif",
    ficheSlug: "villejuif-94076",
    departement: "Val-de-Marne",
    median: 5800,
    evolutionNote: "en forte hausse sur 5 ans, marché transformé par les métros 14 et 15",
    quartiers: [
      { nom: "Centre / Paul Vaillant-Couturier", fourchette: "6 000-6 800 €/m²", note: "cœur de ville, métro 7 et institut Gustave-Roussy, le plus prisé" },
      { nom: "Louis Aragon / entrée de ville", fourchette: "5 900-6 600 €/m²", note: "terminus M7, hub de bus, pratique" },
      { nom: "IGR / Hautes-Bruyères", fourchette: "5 800-6 500 €/m²", note: "autour de la gare M14-M15 Villejuif-Gustave Roussy, en pleine valorisation" },
      { nom: "Les Esselières", fourchette: "5 500-6 200 €/m²", note: "résidentiel" },
      { nom: "Alexandre Dumas / Lebon-Lamartine", fourchette: "5 200-5 900 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le métro 7 (trois stations dont Villejuif-Louis Aragon en terminus), le métro 14 prolongé en 2024 (Villejuif-Gustave Roussy, Châtelet en 15 minutes), la future ligne 15 Sud au même endroit, et l'institut Gustave-Roussy premier centre européen de lutte contre le cancer",
    contexte:
      "ville en pleine transformation du sud (60 000 habitants), portée par l'arrivée du métro 14 et bientôt de la ligne 15 autour de l'institut Gustave-Roussy, l'une des plus fortes évolutions de prix du Val-de-Marne, marché encore accessible qui se valorise vite",
    rendement: "3,8-4,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Le Kremlin-Bicêtre",
      base: "le-kremlin-bicetre",
      ficheSlug: "le-kremlin-bicetre-94043",
      price: 7200,
      angle:
        "Villejuif, en pleine mutation avec les métros 14 et 15 et encore accessible (5 800 €/m²), face au Kremlin-Bicêtre, collé à Paris 13e et plus cher (7 200 €/m²), deux étapes du même corridor sud à 1 400 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-02-11", "2026-02-18", "2026-02-25", "2026-03-04", "2026-03-11", "2026-03-18", "2026-03-25", "2026-04-01"],
    skipSlots: ["vivre", "s1", "s5"],
  },

  "le-kremlin-bicetre": {
    city: "Le Kremlin-Bicêtre",
    cityShort: "Le Kremlin-Bicêtre",
    base: "le-kremlin-bicetre",
    ficheSlug: "le-kremlin-bicetre-94043",
    departement: "Val-de-Marne",
    median: 7200,
    evolutionNote: "stable à légère hausse sur 5 ans, marché tendu collé à Paris",
    quartiers: [
      { nom: "Porte d'Italie / Nord", fourchette: "7 400-8 200 €/m²", note: "collé au 13e arrondissement, le plus cher" },
      { nom: "Centre / Mairie", fourchette: "7 200-7 900 €/m²", note: "métro 7, commerces du cœur de ville" },
      { nom: "CHU Bicêtre", fourchette: "7 000-7 700 €/m²", note: "autour de l'hôpital, pratique" },
      { nom: "Sud / limite Villejuif", fourchette: "6 800-7 500 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le métro 7 (Le Kremlin-Bicêtre, Place d'Italie en 5 minutes et Châtelet en 15), la proximité immédiate de la porte d'Italie et du 13e arrondissement à pied, et le CHU Bicêtre",
    contexte:
      "petite ville dense collée à Paris 13e (26 000 habitants), CHU Bicêtre, profil jeune et étudiant avec une vie de quartier animée autour du métro 7, un quasi-arrondissement au sud de la porte d'Italie",
    rendement: "3,2-3,7 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 % (marché tendu)",
    comparison: {
      city: "Gentilly",
      base: "gentilly",
      ficheSlug: "gentilly-94037",
      price: 6800,
      angle:
        "Le Kremlin-Bicêtre, animé et desservi par le métro 7 (7 200 €/m²), face à Gentilly, plus villageoise sur le RER B et un peu plus accessible (6 800 €/m²), deux communes collées au 13e arrondissement",
    },
    datasetCount: 176,
    dates: ["2026-02-10", "2026-02-17", "2026-02-24", "2026-03-03", "2026-03-10", "2026-03-17", "2026-03-24", "2026-03-31"],
    skipSlots: [],
  },

  gentilly: {
    city: "Gentilly",
    cityShort: "Gentilly",
    base: "gentilly",
    ficheSlug: "gentilly-94037",
    departement: "Val-de-Marne",
    median: 6800,
    evolutionNote: "en hausse sur 5 ans, petit marché prisé aux portes de Paris",
    quartiers: [
      { nom: "Centre / Frileuse", fourchette: "7 000-7 700 €/m²", note: "cœur de village autour de la mairie, le plus prisé" },
      { nom: "Plateau / Mazagran", fourchette: "6 800-7 500 €/m²", note: "hauteurs résidentielles, proche Cité Universitaire" },
      { nom: "Gare / Vallée de la Bièvre", fourchette: "6 600-7 300 €/m²", note: "autour du RER B, pratique" },
      { nom: "Victor Hugo / Reims", fourchette: "6 400-7 100 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER B (gare de Gentilly, Denfert-Rochereau en 5 minutes et Châtelet en 10), la Cité Internationale Universitaire et le parc Montsouris juste de l'autre côté du périphérique, et le tram T3a à la porte de Gentilly",
    contexte:
      "petit village urbain aux portes de Paris 13e-14e (19 000 habitants), vallée de la Bièvre, esprit village avec ses ruelles et son marché, siège de Sanofi, à 5 minutes de Denfert en RER B, l'une des communes les plus proches du cœur de Paris",
    rendement: "3,2-3,7 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Arcueil",
      base: "arcueil",
      ficheSlug: "arcueil-94003",
      price: 6800,
      angle:
        "Gentilly, village urbain collé à Paris à 5 minutes de Denfert (6 800 €/m²), face à Arcueil, sa voisine de la vallée de la Bièvre au même prix mais dopée par la future ligne 15 (6 800 €/m²), deux options jumelles du RER B sud",
    },
    datasetCount: 176,
    dates: ["2026-02-09", "2026-02-16", "2026-02-23", "2026-03-02", "2026-03-09", "2026-03-16", "2026-03-23", "2026-03-30"],
    skipSlots: [],
  },

  cachan: {
    city: "Cachan",
    cityShort: "Cachan",
    base: "cachan",
    ficheSlug: "cachan-94016",
    departement: "Val-de-Marne",
    median: 6300,
    evolutionNote: "en légère hausse sur 5 ans, marché familial et étudiant",
    quartiers: [
      { nom: "Centre / Mairie", fourchette: "6 500-7 200 €/m²", note: "cœur de ville commerçant, le plus prisé" },
      { nom: "Coteau / Aqueduc", fourchette: "6 300-7 000 €/m²", note: "hauteurs résidentielles sous l'aqueduc" },
      { nom: "Gare / Arcueil-Cachan", fourchette: "6 200-6 900 €/m²", note: "RER B et future ligne 15, en valorisation" },
      { nom: "Ouest / Grange Ory", fourchette: "6 000-6 700 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER B (gares Arcueil-Cachan et Bagneux-Pont-Royal, Denfert-Rochereau en 12 minutes), la future ligne 15 Sud à Arcueil-Cachan (vers 2026), et l'aqueduc de la Vanne qui traverse la ville",
    contexte:
      "ville familiale et étudiante de la vallée de la Bièvre (31 000 habitants), ancien berceau de l'ENS Cachan devenue CentraleSupélec-ENS Paris-Saclay historique, aqueduc monumental, marchés et coteaux, bien reliée par le RER B et bientôt la ligne 15",
    rendement: "3,5-4 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Bourg-la-Reine",
      base: "bourg-la-reine",
      ficheSlug: "bourg-la-reine-92014",
      price: 7000,
      angle:
        "Cachan, familiale et étudiante avec son aqueduc et la ligne 15 à venir (6 300 €/m²), face à Bourg-la-Reine, plus bourgeoise et plus chère deux stations plus loin (7 000 €/m²), deux valeurs sûres du RER B sud",
    },
    datasetCount: 176,
    dates: ["2026-02-08", "2026-02-15", "2026-02-22", "2026-03-01", "2026-03-08", "2026-03-15", "2026-03-22", "2026-03-29"],
    skipSlots: [],
  },

  // Vague boucle RER A / EOLE ouest (juillet 2026). Houilles + Conflans créées.
  sartrouville: {
    city: "Sartrouville",
    cityShort: "Sartrouville",
    base: "sartrouville",
    ficheSlug: "sartrouville-78586",
    departement: "Yvelines",
    median: 4100,
    evolutionNote: "en légère hausse sur 5 ans, grand marché familial accessible",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "4 300-4 900 €/m²", note: "autour du RER A, commerces, le plus prisé" },
      { nom: "La Vaudoire / Debussy", fourchette: "4 100-4 700 €/m²", note: "pavillonnaire familial" },
      { nom: "Bords de Seine", fourchette: "4 000-4 600 €/m²", note: "berges réaménagées, résidentiel" },
      { nom: "Le Plateau / Indes", fourchette: "3 800-4 400 €/m²", note: "grands ensembles en rénovation, le plus abordable" },
    ],
    transport:
      "le RER A (gare de Sartrouville, Châtelet en 25 minutes), le Transilien L, la future arrivée du RER E prolongé (EOLE), et l'A14 toute proche",
    contexte:
      "grande ville pavillonnaire et familiale de la boucle de Seine (52 000 habitants), deuxième ville des Yvelines, marché accessible autour de 4 100 €/m² avec un RER A direct, secteurs pavillonnaires calmes et grands ensembles en rénovation au Plateau",
    rendement: "4,3-4,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 %",
    comparison: {
      city: "Houilles",
      base: "houilles",
      ficheSlug: "houilles-78311",
      price: 5200,
      angle:
        "Sartrouville, grande, pavillonnaire et la plus accessible de la boucle (4 100 €/m²), face à Houilles, plus petite, plus chic et mieux cotée une gare plus loin (5 200 €/m²), deux voisines du RER A à 1 100 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-02-07", "2026-02-14", "2026-02-21", "2026-02-28", "2026-03-07", "2026-03-14", "2026-03-21", "2026-03-28"],
    skipSlots: [],
  },

  houilles: {
    city: "Houilles",
    cityShort: "Houilles",
    base: "houilles",
    ficheSlug: "houilles-78311",
    departement: "Yvelines",
    median: 5200,
    evolutionNote: "en hausse sur 5 ans, marché familial recherché de la boucle",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "5 400-6 000 €/m²", note: "autour de la gare trois lignes, commerces, le plus prisé" },
      { nom: "Réveil Matin", fourchette: "5 200-5 800 €/m²", note: "pavillonnaire familial recherché" },
      { nom: "Les Blanches / Belles-Vues", fourchette: "5 000-5 600 €/m²", note: "résidentiel calme" },
      { nom: "Sud / limite Carrières", fourchette: "4 900-5 500 €/m²", note: "le plus abordable" },
    ],
    transport:
      "la gare de Houilles-Carrières-sur-Seine desservie par trois lignes (RER A vers Châtelet en 20 minutes, Transilien J et L vers Saint-Lazare en 12-15 minutes), et l'arrivée à terme du RER E prolongé",
    contexte:
      "ville pavillonnaire familiale et recherchée de la boucle de Seine (33 000 habitants), la ville de Victor Schoelcher, gare exceptionnelle à trois lignes qui met Saint-Lazare à 12 minutes, marché porté par les familles qui quittent Paris et Levallois-Asnières",
    rendement: "3,7-4,2 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Maisons-Laffitte",
      base: "maisons-laffitte",
      ficheSlug: "maisons-laffitte-78358",
      price: 6800,
      angle:
        "Houilles, pavillonnaire pratique avec sa gare trois lignes (5 200 €/m²), face à Maisons-Laffitte, prestige équestre avec parc et château juste au nord (6 800 €/m²), deux profils de la boucle à 1 600 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-02-06", "2026-02-13", "2026-02-20", "2026-02-27", "2026-03-06", "2026-03-13", "2026-03-20", "2026-03-27"],
    skipSlots: [],
  },

  "conflans-sainte-honorine": {
    city: "Conflans-Sainte-Honorine",
    cityShort: "Conflans",
    base: "conflans-sainte-honorine",
    ficheSlug: "conflans-sainte-honorine-78172",
    departement: "Yvelines",
    median: 3900,
    evolutionNote: "en légère hausse sur 5 ans, marché accessible au confluent Seine-Oise",
    quartiers: [
      { nom: "Centre / Vieux Conflans", fourchette: "4 100-4 700 €/m²", note: "cœur historique au-dessus de la Seine, le plus prisé" },
      { nom: "Fin d'Oise / Pointe", fourchette: "3 900-4 500 €/m²", note: "au confluent, gare RER A, pratique" },
      { nom: "Chennevières / Plateau", fourchette: "3 800-4 400 €/m²", note: "pavillonnaire familial" },
      { nom: "Renouveau / Roches", fourchette: "3 600-4 200 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER A (gare de Conflans-Fin-d'Oise, La Défense en 30 minutes), le Transilien J (Conflans-Sainte-Honorine vers Saint-Lazare), la confluence Seine-Oise et l'A15 toute proche",
    contexte:
      "capitale française de la batellerie au confluent de la Seine et de l'Oise (36 000 habitants), musée et pardon national des mariniers, vieux centre perché avec vue sur les fleuves, marché parmi les plus accessibles de notre sélection sous 4 000 €/m² avec deux gares",
    rendement: "4,4-4,9 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-8 % (marché plus négociable)",
    comparison: {
      city: "Poissy",
      base: "poissy",
      ficheSlug: "poissy-78498",
      price: 4200,
      angle:
        "Conflans-Sainte-Honorine, batelière et abordable au confluent Seine-Oise (3 900 €/m²), face à Poissy, plus grande et portée par EOLE et son usine Stellantis en mutation (4 200 €/m²), deux villes de Seine accessibles de l'ouest",
    },
    datasetCount: 176,
    dates: ["2026-02-05", "2026-02-12", "2026-02-19", "2026-02-26", "2026-03-05", "2026-03-12", "2026-03-19", "2026-03-26"],
    skipSlots: [],
  },

  poissy: {
    city: "Poissy",
    cityShort: "Poissy",
    base: "poissy",
    ficheSlug: "poissy-78498",
    departement: "Yvelines",
    median: 4200,
    evolutionNote: "stable sur 5 ans, marché porté par l'arrivée du RER E",
    quartiers: [
      { nom: "Centre / Collégiale", fourchette: "4 500-5 100 €/m²", note: "cœur historique autour de la collégiale et du marché, le plus prisé" },
      { nom: "Gare / EOLE", fourchette: "4 300-4 900 €/m²", note: "RER A et terminus du RER E prolongé, en valorisation" },
      { nom: "Bords de Seine / Villa Savoye", fourchette: "4 200-4 800 €/m²", note: "près de la villa Le Corbusier et de l'île" },
      { nom: "Beauregard / La Coudraie", fourchette: "3 800-4 400 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER A (gare de Poissy, La Défense en 25 minutes), le Transilien J, le terminus ouest du RER E prolongé (EOLE) qui met La Défense à 20 minutes directes, et l'A14",
    contexte:
      "ville royale de naissance de Saint Louis au bord de la Seine (38 000 habitants), collégiale, villa Savoye de Le Corbusier classée, site historique Stellantis en reconversion, terminus EOLE qui redessine son marché, l'un des meilleurs potentiels de valorisation de l'ouest",
    rendement: "4,2-4,7 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 %",
    comparison: {
      city: "Sartrouville",
      base: "sartrouville",
      ficheSlug: "sartrouville-78586",
      price: 4100,
      angle:
        "Poissy, historique et dopée par le terminus EOLE (4 200 €/m²), face à Sartrouville, plus grande et pavillonnaire sur le RER A (4 100 €/m²), deux grandes villes accessibles de la boucle de Seine au coude à coude",
    },
    datasetCount: 176,
    dates: ["2026-02-04", "2026-02-11", "2026-02-18", "2026-02-25", "2026-03-04", "2026-03-11", "2026-03-18", "2026-03-25"],
    skipSlots: [],
  },

  // Vague nord-est 93/77 à volume (juillet 2026). Les 4 étaient déjà dans le dataset.
  "saint-denis": {
    city: "Saint-Denis",
    cityShort: "Saint-Denis",
    base: "saint-denis",
    ficheSlug: "saint-denis-93066",
    departement: "Seine-Saint-Denis",
    median: 4200,
    evolutionNote: "la plus forte hausse de la petite couronne sur 5 ans, transformée par le métro 14 et l'héritage des JO",
    quartiers: [
      { nom: "Pleyel", fourchette: "4 800-5 600 €/m²", note: "terminus du métro 14 et hub des lignes 15-16-17, village olympique, le plus dynamique" },
      { nom: "Centre / Basilique", fourchette: "4 300-5 000 €/m²", note: "autour de la basilique royale et du marché, métro 13 et tram" },
      { nom: "La Plaine / Stade de France", fourchette: "4 200-4 900 €/m²", note: "RER B et D, pôle d'emploi et sièges sociaux" },
      { nom: "Gare / Confluence", fourchette: "4 000-4 700 €/m²", note: "en mutation le long du canal" },
      { nom: "Franc-Moisin / Bel-Air", fourchette: "3 600-4 300 €/m²", note: "grands ensembles en rénovation, le plus abordable" },
    ],
    transport:
      "le métro 14 en terminus à Saint-Denis-Pleyel (Châtelet en 15 minutes), le futur hub des lignes 15, 16 et 17 au même endroit, le métro 13, les RER B et D, les trams T1 et T8, et le Stade de France",
    contexte:
      "ville royale et populaire en pleine métamorphose (113 000 habitants), basilique des rois de France, village olympique reconverti, hub Pleyel le plus connecté du Grand Paris, la plus forte évolution de prix de la petite couronne sur 5 ans, marché encore sous 4 500 €/m²",
    rendement: "4,5-5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 % (variable selon le quartier)",
    comparison: {
      city: "Saint-Ouen-sur-Seine",
      base: "saint-ouen",
      ficheSlug: "saint-ouen-sur-seine-93070",
      price: 7400,
      angle:
        "Saint-Denis, immense, royale et encore accessible en pleine transformation olympique (4 200 €/m²), face à Saint-Ouen-sur-Seine, déjà gentrifiée avec ses Puces et ses Docks (7 400 €/m²), deux étapes du même axe métro 14 à 3 200 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-01-20", "2026-01-27", "2026-02-03", "2026-02-10", "2026-02-17", "2026-02-24", "2026-03-03", "2026-03-10"],
    skipSlots: [],
  },

  aubervilliers: {
    city: "Aubervilliers",
    cityShort: "Aubervilliers",
    base: "aubervilliers",
    ficheSlug: "aubervilliers-93001",
    departement: "Seine-Saint-Denis",
    median: 4400,
    evolutionNote: "en très forte hausse sur 5 ans, portée par les métros 12 et 7 et le canal",
    quartiers: [
      { nom: "Front Populaire / Plaine", fourchette: "4 800-5 500 €/m²", note: "métro 12, campus Condorcet, le plus proche de Paris" },
      { nom: "Centre / Mairie", fourchette: "4 400-5 100 €/m²", note: "métro 12 prolongé, marché et commerces" },
      { nom: "Canal / Victor Hugo", fourchette: "4 300-5 000 €/m²", note: "berges du canal Saint-Denis en mutation" },
      { nom: "Quatre-Chemins", fourchette: "4 000-4 700 €/m²", note: "métro 7, populaire et commerçant" },
      { nom: "Fort d'Aubervilliers", fourchette: "3 900-4 600 €/m²", note: "renouvellement urbain et future gare ligne 15, le plus abordable" },
    ],
    transport:
      "le métro 12 prolongé (Mairie d'Aubervilliers depuis 2022, Saint-Lazare en 20 minutes), le métro 7 (Quatre-Chemins, Fort d'Aubervilliers), la future ligne 15 Est au Fort, le canal Saint-Denis et le campus Condorcet",
    contexte:
      "grande ville populaire du nord en pleine mutation (91 000 habitants), campus Condorcet des sciences humaines, berges du canal Saint-Denis, ateliers et street-art, la deuxième plus forte hausse de prix de la petite couronne, collée à Paris 19e",
    rendement: "4,5-5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 %",
    comparison: {
      city: "Pantin",
      base: "pantin",
      ficheSlug: "pantin-93055",
      price: 5900,
      angle:
        "Aubervilliers, populaire et en début de transformation le long de son canal (4 400 €/m²), face à Pantin, déjà installée comme le Brooklyn parisien avec Hermès et le RER E (5 900 €/m²), deux voisines de canal à 1 500 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-01-19", "2026-01-26", "2026-02-02", "2026-02-09", "2026-02-16", "2026-02-23", "2026-03-02", "2026-03-09"],
    skipSlots: [],
  },

  "noisy-le-grand": {
    city: "Noisy-le-Grand",
    cityShort: "Noisy-le-Grand",
    base: "noisy-le-grand",
    ficheSlug: "noisy-le-grand-93051",
    departement: "Seine-Saint-Denis",
    median: 4100,
    evolutionNote: "en hausse sur 5 ans, pôle de l'est porté par les futures lignes 15 et 16",
    quartiers: [
      { nom: "Centre / Vieux Noisy", fourchette: "4 400-5 000 €/m²", note: "cœur historique commerçant, le plus prisé" },
      { nom: "Bords de Marne", fourchette: "4 300-4 900 €/m²", note: "résidentiel au bord de l'eau" },
      { nom: "Mont d'Est / Arènes", fourchette: "4 000-4 600 €/m²", note: "RER A, centre d'affaires et centre commercial les Arcades" },
      { nom: "Champs / Noisy-Champs", fourchette: "4 000-4 600 €/m²", note: "future gare lignes 15-16, campus Descartes, en valorisation" },
      { nom: "Pavé Neuf / Palacio", fourchette: "3 700-4 300 €/m²", note: "l'architecture monumentale d'Abraxas, le plus abordable" },
    ],
    transport:
      "le RER A (gares Noisy-le-Grand-Mont d'Est et Noisy-Champs, Châtelet en 25 minutes), la future gare Noisy-Champs des lignes 15 et 16 du Grand Paris Express, le campus Descartes de la Cité Descartes, et l'A4",
    contexte:
      "grand pôle tertiaire et résidentiel de l'est (68 000 habitants), célèbre pour l'architecture monumentale des Espaces d'Abraxas et des Arènes de Picasso, Cité Descartes et son campus, bords de Marne, futur hub Noisy-Champs des lignes 15-16, l'une des meilleures notes qualité-prix de l'est",
    rendement: "4,3-4,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Champigny-sur-Marne",
      base: "champigny-sur-marne",
      ficheSlug: "champigny-sur-marne-94017",
      price: 5500,
      angle:
        "Noisy-le-Grand, pôle tertiaire équipé et plus accessible sur le RER A (4 100 €/m²), face à Champigny-sur-Marne, plus pavillonnaire au bord de la Marne (5 500 €/m²), deux grandes villes de l'est portées par la ligne 15",
    },
    datasetCount: 176,
    dates: ["2026-01-18", "2026-01-25", "2026-02-01", "2026-02-08", "2026-02-15", "2026-02-22", "2026-03-01", "2026-03-08"],
    skipSlots: [],
  },

  chelles: {
    city: "Chelles",
    cityShort: "Chelles",
    base: "chelles",
    ficheSlug: "chelles-77108",
    departement: "Seine-et-Marne",
    median: 3500,
    evolutionNote: "en hausse sur 5 ans, meilleure note qualité-prix de notre comparateur",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "3 800-4 400 €/m²", note: "RER E et Transilien P, future ligne 16, le plus prisé" },
      { nom: "Sud / Bords de Marne", fourchette: "3 600-4 200 €/m²", note: "résidentiel près de la Marne et de la base de loisirs" },
      { nom: "Chantereine / Nord", fourchette: "3 400-4 000 €/m²", note: "pavillonnaire" },
      { nom: "Les Coudreaux", fourchette: "3 200-3 800 €/m²", note: "pavillonnaire à l'est, le plus abordable" },
    ],
    transport:
      "le RER E et le Transilien P (gare de Chelles-Gournay, Haussmann-Saint-Lazare en 25 minutes et Gare de l'Est en 15), la future gare de la ligne 16 du Grand Paris Express, le canal de Chelles et les bords de Marne",
    contexte:
      "première ville de Seine-et-Marne aux portes du 93 (55 000 habitants), berceau mérovingien, canal et bords de Marne, la meilleure note qualité-prix de notre comparateur : moins de 3 600 €/m² avec un RER E direct et la ligne 16 à venir, le marché famille par excellence",
    rendement: "4,8-5,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-8 % (marché négociable)",
    comparison: {
      city: "Noisy-le-Grand",
      base: "noisy-le-grand",
      ficheSlug: "noisy-le-grand-93051",
      price: 4100,
      angle:
        "Chelles, championne du qualité-prix avec son RER E et la ligne 16 à venir (3 500 €/m²), face à Noisy-le-Grand, plus tertiaire et équipée sur le RER A (4 100 €/m²), deux grands marchés famille de l'est à comparer avant d'acheter",
    },
    datasetCount: 176,
    dates: ["2026-01-17", "2026-01-24", "2026-01-31", "2026-02-07", "2026-02-14", "2026-02-21", "2026-02-28", "2026-03-07"],
    skipSlots: [],
  },

  // Batch double août 2026 : Essonne RER B/C/D + est 93. Massy a déjà vivre/prix/déménager.
  massy: {
    city: "Massy",
    cityShort: "Massy",
    base: "massy",
    ficheSlug: "massy-91377",
    departement: "Essonne",
    median: 4900,
    evolutionNote: "en hausse sur 5 ans, hub TGV du sud francilien porté par la ligne 18",
    quartiers: [
      { nom: "Atlantis / Gare TGV", fourchette: "5 200-5 900 €/m²", note: "quartier d'affaires et gare TGV-RER, le plus moderne" },
      { nom: "Centre / Villaine", fourchette: "4 900-5 500 €/m²", note: "cœur historique, marché" },
      { nom: "Vilmorin / Graviers", fourchette: "4 800-5 400 €/m²", note: "résidentiel proche RER B" },
      { nom: "Opéra / Grand Ouest", fourchette: "4 600-5 200 €/m²", note: "autour de l'opéra, en renouvellement" },
      { nom: "Massy-Verrières / limite Antony", fourchette: "4 500-5 100 €/m²", note: "le plus abordable" },
    ],
    transport:
      "les RER B et C (Massy-Palaiseau et Massy-Verrières), la gare TGV Massy-Palaiseau (seule gare TGV au sud de Paris, Bordeaux et Lyon directs), la future ligne 18 du Grand Paris Express (2026-2027), et l'A6-A10",
    contexte:
      "hub ferroviaire unique du sud francilien (51 000 habitants), seule gare TGV de banlieue sud, quartier d'affaires Atlantis, opéra, future ligne 18 vers Saclay et Orly, le marché essonnien le plus dynamique porté par les cadres du plateau de Saclay",
    rendement: "4,2-4,7 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Palaiseau",
      base: "palaiseau",
      ficheSlug: "palaiseau-91477",
      price: 4500,
      angle:
        "Massy, hub TGV urbain et tertiaire (4 900 €/m²), face à Palaiseau, plus résidentielle et étudiante au pied du plateau de Saclay (4 500 €/m²), les deux portes d'entrée du pôle scientifique du sud",
    },
    datasetCount: 176,
    dates: ["2026-03-02", "2026-03-09", "2026-03-16", "2026-03-23", "2026-03-30", "2026-04-06", "2026-04-13", "2026-04-20"],
    skipSlots: ["vivre", "s1", "s5"],
  },

  palaiseau: {
    city: "Palaiseau",
    cityShort: "Palaiseau",
    base: "palaiseau",
    ficheSlug: "palaiseau-91477",
    departement: "Essonne",
    median: 4500,
    evolutionNote: "en hausse sur 5 ans, portée par le plateau de Saclay et la future ligne 18",
    quartiers: [
      { nom: "Centre / Vieux Palaiseau", fourchette: "4 800-5 400 €/m²", note: "cœur historique commerçant, RER B, le plus prisé" },
      { nom: "Plateau / Polytechnique-Camille Claudel", fourchette: "4 600-5 300 €/m²", note: "écoquartier neuf près des grandes écoles, future ligne 18" },
      { nom: "Lozère", fourchette: "4 500-5 100 €/m²", note: "RER B, montée mythique vers Polytechnique, résidentiel" },
      { nom: "Le Pileu / Les Garennes", fourchette: "4 200-4 800 €/m²", note: "pavillonnaire, le plus abordable" },
    ],
    transport:
      "le RER B (gares Palaiseau, Palaiseau-Villebon et Lozère, Denfert en 25 minutes), la future ligne 18 du Grand Paris Express sur le plateau (2026-2027), et les grandes écoles du plateau de Saclay (Polytechnique, ENSTA, AgroParisTech)",
    contexte:
      "ville universitaire au pied du plateau de Saclay (36 000 habitants), Polytechnique et le cluster scientifique en surplomb, vieux centre commerçant, vallée de l'Yvette, profil famille-chercheurs porté par l'écosystème Saclay et la ligne 18 à venir",
    rendement: "4,2-4,7 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Antony",
      base: "antony",
      ficheSlug: "antony-92002",
      price: 6100,
      angle:
        "Palaiseau, universitaire et accessible au pied de Saclay (4 500 €/m²), face à Antony, plus établie et plus chère dans les Hauts-de-Seine (6 100 €/m²), deux étapes du même RER B à 1 600 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-03-01", "2026-03-08", "2026-03-15", "2026-03-22", "2026-03-29", "2026-04-05", "2026-04-12", "2026-04-19"],
    skipSlots: [],
  },

  "savigny-sur-orge": {
    city: "Savigny-sur-Orge",
    cityShort: "Savigny-sur-Orge",
    base: "savigny-sur-orge",
    ficheSlug: "savigny-sur-orge-91589",
    departement: "Essonne",
    median: 3200,
    evolutionNote: "en légère hausse sur 5 ans, grand marché pavillonnaire accessible",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "3 400-3 900 €/m²", note: "autour du RER C, commerces, le plus prisé" },
      { nom: "Grand-Vaux", fourchette: "2 900-3 400 €/m²", note: "grand ensemble en rénovation, le plus abordable" },
      { nom: "Plateau / Champagne", fourchette: "3 200-3 700 €/m²", note: "pavillonnaire familial" },
      { nom: "Bords de l'Orge / Clairefontaine", fourchette: "3 100-3 600 €/m²", note: "près des berges vertes de l'Orge" },
    ],
    transport:
      "le RER C (gare de Savigny-sur-Orge, Bibliothèque François-Mitterrand en 25 minutes et Invalides en 35), les berges de l'Orge aménagées, et l'A6 toute proche",
    contexte:
      "grande ville pavillonnaire de l'Essonne (37 000 habitants), l'un des marchés les plus accessibles de notre comparateur à 3 200 €/m², berges de l'Orge, lycée Corot réputé, profil primo-accédant et famille qui veut une maison à moins de 30 minutes de Paris",
    rendement: "4,7-5,2 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-8 % (marché négociable)",
    comparison: {
      city: "Massy",
      base: "massy",
      ficheSlug: "massy-91377",
      price: 4900,
      angle:
        "Savigny-sur-Orge, pavillonnaire et très accessible sur le RER C (3 200 €/m²), face à Massy, hub TGV plus cher et plus tertiaire (4 900 €/m²), deux visages de l'Essonne nord à 1 700 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-02-28", "2026-03-07", "2026-03-14", "2026-03-21", "2026-03-28", "2026-04-04", "2026-04-11", "2026-04-18"],
    skipSlots: [],
  },

  yerres: {
    city: "Yerres",
    cityShort: "Yerres",
    base: "yerres",
    ficheSlug: "yerres-91691",
    departement: "Essonne",
    median: 4100,
    evolutionNote: "stable sur 5 ans, marché familial des bords de l'Yerres",
    quartiers: [
      { nom: "Centre / Caillebotte", fourchette: "4 300-4 900 €/m²", note: "autour de la propriété Caillebotte et du centre, le plus prisé" },
      { nom: "Gare / RER D", fourchette: "4 100-4 700 €/m²", note: "pratique, commerces" },
      { nom: "Bords de l'Yerres", fourchette: "4 000-4 600 €/m²", note: "résidentiel au bord de la rivière" },
      { nom: "Plateau / Gros Bois", fourchette: "3 900-4 500 €/m²", note: "pavillonnaire près de la forêt, le plus abordable" },
    ],
    transport:
      "le RER D (gare d'Yerres, Gare de Lyon en 25 minutes), la vallée de l'Yerres et ses berges classées, et la forêt de Sénart en lisière",
    contexte:
      "ville familiale des bords de l'Yerres (29 000 habitants), célèbre propriété Caillebotte peinte par l'impressionniste, vallée classée et forêt de Sénart, esprit village résidentiel très recherché des familles du Val d'Yerres, l'une des meilleures notes qualité-prix du sud-est",
    rendement: "4,3-4,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Savigny-sur-Orge",
      base: "savigny-sur-orge",
      ficheSlug: "savigny-sur-orge-91589",
      price: 3200,
      angle:
        "Yerres, bourgeoise et impressionniste au bord de sa rivière (4 100 €/m²), face à Savigny-sur-Orge, plus simple et plus accessible sur le RER C (3 200 €/m²), deux options famille de l'Essonne à comparer selon le budget",
    },
    datasetCount: 176,
    dates: ["2026-02-27", "2026-03-06", "2026-03-13", "2026-03-20", "2026-03-27", "2026-04-03", "2026-04-10", "2026-04-17"],
    skipSlots: [],
  },

  romainville: {
    city: "Romainville",
    cityShort: "Romainville",
    base: "romainville",
    ficheSlug: "romainville-93063",
    departement: "Seine-Saint-Denis",
    median: 5500,
    evolutionNote: "en forte hausse sur 5 ans, gentrification portée par le métro 11 prolongé",
    quartiers: [
      { nom: "Carnot / Mairie", fourchette: "5 700-6 400 €/m²", note: "cœur de ville, métro 11 depuis 2024, le plus prisé" },
      { nom: "Bas-Pays / Fiminco", fourchette: "5 500-6 200 €/m²", note: "fondation d'art Fiminco, anciens laboratoires en reconversion" },
      { nom: "Les Bas-Longchamps", fourchette: "5 300-6 000 €/m²", note: "résidentiel" },
      { nom: "Youri Gagarine / Marcel Cachin", fourchette: "5 000-5 700 €/m²", note: "en renouvellement, le plus abordable" },
    ],
    transport:
      "le métro 11 prolongé en 2024 (stations Serge Gainsbourg et Place Carnot, République en 15 minutes), la Corniche des Forts et sa base de loisirs, et la proximité immédiate des Lilas et de Montreuil",
    contexte:
      "ville en pleine gentrification de l'est (31 000 habitants), désenclavée par le métro 11, fondation d'art contemporain Fiminco dans les anciens laboratoires Roussel, Corniche des Forts boisée, dans le sillage direct des Lilas et de Montreuil",
    rendement: "3,8-4,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Les Lilas",
      base: "les-lilas",
      ficheSlug: "les-lilas-93045",
      price: 7500,
      angle:
        "Romainville, en pleine gentrification avec le métro 11 tout neuf (5 500 €/m²), face aux Lilas, village bobo déjà établi une station plus près (7 500 €/m²), le même axe métro à 2 000 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-02-26", "2026-03-05", "2026-03-12", "2026-03-19", "2026-03-26", "2026-04-02", "2026-04-09", "2026-04-16"],
    skipSlots: [],
  },

  "noisy-le-sec": {
    city: "Noisy-le-Sec",
    cityShort: "Noisy-le-Sec",
    base: "noisy-le-sec",
    ficheSlug: "noisy-le-sec-93053",
    departement: "Seine-Saint-Denis",
    median: 4300,
    evolutionNote: "en hausse sur 5 ans, nœud ferroviaire de l'est en valorisation",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "4 500-5 100 €/m²", note: "RER E et tram T1, le plus prisé" },
      { nom: "Plateau d'Avron / limite Rosny", fourchette: "4 300-4 900 €/m²", note: "pavillonnaire sur les hauteurs" },
      { nom: "Petit-Noisy / Boissière", fourchette: "4 100-4 700 €/m²", note: "en mutation, future station M11" },
      { nom: "Londeau / La Renardière", fourchette: "3 800-4 400 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER E (gare de Noisy-le-Sec, Haussmann-Saint-Lazare en 15 minutes), le tram T1, la station Boissière du métro 11 prolongé en limite, et le canal de l'Ourcq au nord",
    contexte:
      "nœud ferroviaire historique de l'est (46 000 habitants), reconstruite après-guerre avec ses maisons préfabriquées expérimentales classées, RER E direct vers le cœur de Paris, tram T1, dans la dynamique de valorisation de l'axe Pantin-Romainville",
    rendement: "4,3-4,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 %",
    comparison: {
      city: "Pantin",
      base: "pantin",
      ficheSlug: "pantin-93055",
      price: 5900,
      angle:
        "Noisy-le-Sec, nœud ferroviaire encore accessible sur le RER E (4 300 €/m²), face à Pantin, le Brooklyn parisien déjà valorisé le long du canal (5 900 €/m²), deux étapes du même RER E à 1 600 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-02-25", "2026-03-04", "2026-03-11", "2026-03-18", "2026-03-25", "2026-04-01", "2026-04-08", "2026-04-15"],
    skipSlots: [],
  },

  "rosny-sous-bois": {
    city: "Rosny-sous-Bois",
    cityShort: "Rosny-sous-Bois",
    base: "rosny-sous-bois",
    ficheSlug: "rosny-sous-bois-93064",
    departement: "Seine-Saint-Denis",
    median: 4400,
    evolutionNote: "en hausse sur 5 ans, portée par l'arrivée du métro 11 et la ligne 15 Est",
    quartiers: [
      { nom: "Centre / Mairie", fourchette: "4 600-5 200 €/m²", note: "cœur de ville commerçant, le plus prisé" },
      { nom: "Bois-Perrier / Rosny 2", fourchette: "4 400-5 000 €/m²", note: "terminus du métro 11 prolongé, centre commercial régional, en valorisation" },
      { nom: "Plateau d'Avron", fourchette: "4 400-5 000 €/m²", note: "pavillonnaire sur les hauteurs, recherché" },
      { nom: "La Boissière / Les Marnaudes", fourchette: "4 000-4 600 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER E (gares Rosny-Bois-Perrier et Rosny-sous-Bois, Haussmann en 18 minutes), le métro 11 prolongé jusqu'à Rosny-Bois-Perrier, la future ligne 15 Est au même endroit, le centre commercial Rosny 2 et l'A86",
    contexte:
      "grande ville de l'est en pleine montée en desserte (47 000 habitants), centre commercial régional Rosny 2, terminus du métro 11 et future gare de la ligne 15 Est à Bois-Perrier, plateau d'Avron pavillonnaire, l'un des meilleurs potentiels transport de l'est",
    rendement: "4,2-4,7 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Montreuil",
      base: "montreuil",
      ficheSlug: "montreuil-93048",
      price: 5800,
      angle:
        "Rosny-sous-Bois, familiale et boostée par le métro 11 et la ligne 15 (4 400 €/m²), face à Montreuil, plus urbaine, créative et chère collée à Paris (5 800 €/m²), deux marchés de l'est à 1 400 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-02-24", "2026-03-03", "2026-03-10", "2026-03-17", "2026-03-24", "2026-03-31", "2026-04-07", "2026-04-14"],
    skipSlots: [],
  },

  "le-raincy": {
    city: "Le Raincy",
    cityShort: "Le Raincy",
    base: "le-raincy",
    ficheSlug: "le-raincy-93062",
    departement: "Seine-Saint-Denis",
    median: 5300,
    evolutionNote: "stable sur 5 ans, le marché bourgeois de l'est du 93",
    quartiers: [
      { nom: "Centre / Rond-Point Thiers", fourchette: "5 500-6 200 €/m²", note: "avenue de la Résistance commerçante, le plus prisé" },
      { nom: "Plateau / Église Notre-Dame", fourchette: "5 300-6 000 €/m²", note: "autour du chef-d'œuvre de béton des frères Perret, résidentiel chic" },
      { nom: "Villas / allées historiques", fourchette: "5 200-5 900 €/m²", note: "les allées pavillonnaires de l'ancien parc du château" },
      { nom: "Limite Villemomble / Gagny", fourchette: "5 000-5 700 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER E (gare Le Raincy-Villemomble-Montfermeil, Haussmann-Saint-Lazare en 20 minutes), les allées plantées de l'ancien parc princier, et un tissu commerçant dense sur l'avenue de la Résistance",
    contexte:
      "le Neuilly de l'est du 93 (15 000 habitants), ville-parc bourgeoise tracée dans l'ancien domaine princier, église Notre-Dame du Raincy des frères Perret classée, allées de villas, revenus parmi les plus élevés du département, l'exception premium de la Seine-Saint-Denis",
    rendement: "3,4-3,9 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 %",
    comparison: {
      city: "Rosny-sous-Bois",
      base: "rosny-sous-bois",
      ficheSlug: "rosny-sous-bois-93064",
      price: 4400,
      angle:
        "Le Raincy, ville-parc bourgeoise et son église Perret (5 300 €/m²), face à Rosny-sous-Bois, plus grande, plus commerçante et mieux desservie avec le métro 11 (4 400 €/m²), deux voisines de l'est aux profils opposés",
    },
    datasetCount: 176,
    dates: ["2026-02-23", "2026-03-02", "2026-03-09", "2026-03-16", "2026-03-23", "2026-03-30", "2026-04-06", "2026-04-13"],
    skipSlots: [],
  },

  // Batch double sud-est Essonne RER C/D (août 2026). 7 fiches créées ; Évry a déjà vivre/prix/investir.
  // NB : Corbeil-Essonnes pas encore dans le dataset (code INSEE 91174, libre depuis la correction du code d'Étampes).
  "athis-mons": {
    city: "Athis-Mons",
    cityShort: "Athis-Mons",
    base: "athis-mons",
    ficheSlug: "athis-mons-91027",
    departement: "Essonne",
    median: 3100,
    evolutionNote: "en légère hausse sur 5 ans, marché accessible aux portes d'Orly",
    quartiers: [
      { nom: "Centre / Mairie", fourchette: "3 300-3 800 €/m²", note: "cœur de ville, le plus prisé" },
      { nom: "Plateau / Val", fourchette: "3 100-3 600 €/m²", note: "pavillonnaire familial" },
      { nom: "Gare / Juvisy", fourchette: "3 000-3 500 €/m²", note: "proche du grand pôle RER de Juvisy" },
      { nom: "Mons / bords de Seine", fourchette: "2 900-3 400 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER C (gare d'Athis-Mons, Bibliothèque François-Mitterrand en 22 minutes), le pôle RER C-D de Juvisy en limite, le tram T7 vers Orly et Villejuif, et l'aéroport d'Orly à dix minutes",
    contexte:
      "ville familiale des coteaux de Seine aux portes d'Orly (36 000 habitants), pavillonnaire accessible autour de 3 100 €/m², terrasse panoramique sur la vallée, marché de primo-accédants et de personnels de la plateforme aéroportuaire",
    rendement: "4,8-5,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-8 % (marché négociable)",
    comparison: {
      city: "Juvisy-sur-Orge",
      base: "juvisy-sur-orge",
      ficheSlug: "juvisy-sur-orge-91326",
      price: 3300,
      angle:
        "Athis-Mons, pavillonnaire des coteaux proche d'Orly (3 100 €/m²), face à Juvisy-sur-Orge, plus dense autour de son grand pôle RER C-D (3 300 €/m²), deux voisines accessibles de la vallée de la Seine",
    },
    datasetCount: 176,
    dates: ["2026-03-05", "2026-03-12", "2026-03-19", "2026-03-26", "2026-04-02", "2026-04-09", "2026-04-16", "2026-04-23"],
    skipSlots: [],
  },

  "juvisy-sur-orge": {
    city: "Juvisy-sur-Orge",
    cityShort: "Juvisy",
    base: "juvisy-sur-orge",
    ficheSlug: "juvisy-sur-orge-91326",
    departement: "Essonne",
    median: 3300,
    evolutionNote: "en hausse sur 5 ans, portée par son pôle gare majeur",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "3 500-4 000 €/m²", note: "autour de l'un des plus grands pôles RER d'Île-de-France, le plus prisé" },
      { nom: "Observatoire / Parc", fourchette: "3 300-3 800 €/m²", note: "hauteurs résidentielles près de l'observatoire Flammarion" },
      { nom: "Seine / Port-aux-Cerises", fourchette: "3 200-3 700 €/m²", note: "près des berges et de la base de loisirs" },
      { nom: "Plateau", fourchette: "3 100-3 600 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le pôle de Juvisy, l'un des plus grands nœuds RER d'Île-de-France (RER C et RER D, Gare de Lyon en 20 minutes, Bibliothèque en 18), le tram T7 vers Orly, et un réseau de bus dense vers toute l'Essonne nord",
    contexte:
      "petite ville dense autour d'un pôle ferroviaire majeur (17 500 habitants), gare historique refaite, observatoire de Camille Flammarion, à cheval entre Seine et Orge, le meilleur rapport desserte-prix du RER C-D sud avec deux lignes directes",
    rendement: "4,8-5,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 %",
    comparison: {
      city: "Savigny-sur-Orge",
      base: "savigny-sur-orge",
      ficheSlug: "savigny-sur-orge-91589",
      price: 3200,
      angle:
        "Juvisy-sur-Orge, dense et ultra-connectée avec ses deux RER (3 300 €/m²), face à Savigny-sur-Orge, plus pavillonnaire une gare plus loin (3 200 €/m²), deux façons d'habiter la vallée de l'Orge au même budget",
    },
    datasetCount: 176,
    dates: ["2026-03-04", "2026-03-11", "2026-03-18", "2026-03-25", "2026-04-01", "2026-04-08", "2026-04-15", "2026-04-22"],
    skipSlots: [],
  },

  draveil: {
    city: "Draveil",
    cityShort: "Draveil",
    base: "draveil",
    ficheSlug: "draveil-91201",
    departement: "Essonne",
    median: 3300,
    evolutionNote: "stable sur 5 ans, marché nature entre Seine et forêt",
    quartiers: [
      { nom: "Centre / Mairie", fourchette: "3 500-4 000 €/m²", note: "cœur de ville, le plus prisé" },
      { nom: "Paris-Jardins", fourchette: "3 400-3 900 €/m²", note: "cité-jardin historique classée, unique en France" },
      { nom: "Bords de Seine / Port aux Cerises", fourchette: "3 300-3 800 €/m²", note: "près de la base de loisirs" },
      { nom: "Danton / Mazières", fourchette: "3 000-3 500 €/m²", note: "le plus abordable" },
    ],
    transport:
      "les gares RER D de Juvisy et de Vigneux toutes proches (Gare de Lyon en 25-30 minutes), la base de loisirs du Port aux Cerises, les bords de Seine et la forêt de Sénart en lisière",
    contexte:
      "ville nature entre Seine et forêt de Sénart (29 500 habitants), célèbre cité-jardin Paris-Jardins fondée en 1911, base de loisirs du Port aux Cerises, profil famille qui privilégie l'espace et la verdure, à condition d'accepter la gare dans la ville d'à côté",
    rendement: "4,5-5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-8 % (marché négociable)",
    comparison: {
      city: "Vigneux-sur-Seine",
      base: "vigneux-sur-seine",
      ficheSlug: "vigneux-sur-seine-91657",
      price: 2900,
      angle:
        "Draveil, verte et bourgeoise avec sa cité-jardin (3 300 €/m²), face à Vigneux-sur-Seine, plus simple mais avec sa propre gare RER D (2 900 €/m²), deux voisines de Seine à arbitrer entre cadre et desserte",
    },
    datasetCount: 176,
    dates: ["2026-03-03", "2026-03-10", "2026-03-17", "2026-03-24", "2026-03-31", "2026-04-07", "2026-04-14", "2026-04-21"],
    skipSlots: [],
  },

  brunoy: {
    city: "Brunoy",
    cityShort: "Brunoy",
    base: "brunoy",
    ficheSlug: "brunoy-91114",
    departement: "Essonne",
    median: 3400,
    evolutionNote: "stable sur 5 ans, marché familial du Val d'Yerres",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "3 600-4 100 €/m²", note: "cœur de ville commerçant autour du RER D, le plus prisé" },
      { nom: "Bords de l'Yerres", fourchette: "3 500-4 000 €/m²", note: "près de la rivière et du pont Perronet" },
      { nom: "Pyramide / forêt de Sénart", fourchette: "3 400-3 900 €/m²", note: "pavillonnaire en lisière de forêt" },
      { nom: "Les Bosserons / Plateau", fourchette: "3 200-3 700 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER D (gare de Brunoy, Gare de Lyon en 30 minutes), la vallée de l'Yerres et ses berges, et la forêt de Sénart qui borde la ville",
    contexte:
      "ville bourgeoise du Val d'Yerres entre rivière et forêt (26 500 habitants), vieux centre autour de l'église Saint-Médard et du pont Perronet, marchés et commerces, profil famille établie qui cherche le charme de vallée à 30 minutes de Gare de Lyon",
    rendement: "4,4-4,9 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 %",
    comparison: {
      city: "Yerres",
      base: "yerres",
      ficheSlug: "yerres-91691",
      price: 4100,
      angle:
        "Brunoy, charmante et plus accessible au bord de la même rivière (3 400 €/m²), face à Yerres, la voisine Caillebotte plus cotée (4 100 €/m²), deux villes du Val d'Yerres à 700 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-03-02", "2026-03-09", "2026-03-16", "2026-03-23", "2026-03-30", "2026-04-06", "2026-04-13", "2026-04-20"],
    skipSlots: [],
  },

  montgeron: {
    city: "Montgeron",
    cityShort: "Montgeron",
    base: "montgeron",
    ficheSlug: "montgeron-91421",
    departement: "Essonne",
    median: 3500,
    evolutionNote: "stable sur 5 ans, marché familial en lisière de Sénart",
    quartiers: [
      { nom: "Centre / Avenue de la République", fourchette: "3 700-4 200 €/m²", note: "axe commerçant et gare RER D, le plus prisé" },
      { nom: "Lisière de Sénart / Pelouse", fourchette: "3 600-4 100 €/m²", note: "pavillonnaire contre la forêt, la célèbre Pelouse plantée" },
      { nom: "Glacière / Gibraltar", fourchette: "3 400-3 900 €/m²", note: "résidentiel" },
      { nom: "La Forêt / Oly", fourchette: "3 200-3 700 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER D (gare de Montgeron-Crosne, Gare de Lyon en 25 minutes), la Pelouse historique qui traverse la ville, et la forêt de Sénart aux portes des maisons",
    contexte:
      "ville pavillonnaire en lisière de la forêt de Sénart (24 000 habitants), la Pelouse plantée d'un kilomètre comme colonne vertébrale, peinte par les impressionnistes, profil famille sportive et nature à 25 minutes de Gare de Lyon",
    rendement: "4,3-4,8 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 %",
    comparison: {
      city: "Brunoy",
      base: "brunoy",
      ficheSlug: "brunoy-91114",
      price: 3400,
      angle:
        "Montgeron, tirée au cordeau le long de sa Pelouse et de la forêt (3 500 €/m²), face à Brunoy, plus vallonnée au bord de l'Yerres (3 400 €/m²), deux voisines du RER D au coude à coude",
    },
    datasetCount: 176,
    dates: ["2026-03-01", "2026-03-08", "2026-03-15", "2026-03-22", "2026-03-29", "2026-04-05", "2026-04-12", "2026-04-19"],
    skipSlots: [],
  },

  "vigneux-sur-seine": {
    city: "Vigneux-sur-Seine",
    cityShort: "Vigneux",
    base: "vigneux-sur-seine",
    ficheSlug: "vigneux-sur-seine-91657",
    departement: "Essonne",
    median: 2900,
    evolutionNote: "en hausse sur 5 ans, l'un des marchés les plus accessibles avec gare",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "3 100-3 600 €/m²", note: "autour du RER D, le plus prisé" },
      { nom: "Lac Montalbot / Seine", fourchette: "2 900-3 400 €/m²", note: "près du lac et des berges" },
      { nom: "La Croix Blanche", fourchette: "2 800-3 300 €/m²", note: "pavillonnaire" },
      { nom: "Les Bergeries", fourchette: "2 600-3 100 €/m²", note: "grands ensembles en rénovation, le plus abordable" },
    ],
    transport:
      "le RER D (gare de Vigneux-sur-Seine, Gare de Lyon en 30 minutes), le lac Montalbot et les berges de Seine, et la proximité de Draveil et du Port aux Cerises",
    contexte:
      "ville populaire des bords de Seine (32 000 habitants), lac Montalbot et étangs, marché parmi les plus accessibles d'Île-de-France avec une gare RER : moins de 3 000 €/m² à 30 minutes de Gare de Lyon, terrain de chasse des primo-accédants",
    rendement: "5-5,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-8 % (marché négociable)",
    comparison: {
      city: "Montgeron",
      base: "montgeron",
      ficheSlug: "montgeron-91421",
      price: 3500,
      angle:
        "Vigneux-sur-Seine, la plus accessible avec sa gare et son lac (2 900 €/m²), face à Montgeron, plus établie le long de sa Pelouse (3 500 €/m²), deux étapes du RER D à 600 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-02-28", "2026-03-07", "2026-03-14", "2026-03-21", "2026-03-28", "2026-04-04", "2026-04-11", "2026-04-18"],
    skipSlots: [],
  },

  "ris-orangis": {
    city: "Ris-Orangis",
    cityShort: "Ris-Orangis",
    base: "ris-orangis",
    ficheSlug: "ris-orangis-91521",
    departement: "Essonne",
    median: 2800,
    evolutionNote: "en hausse sur 5 ans, marché accessible aux portes d'Évry",
    quartiers: [
      { nom: "Centre / Mairie", fourchette: "3 000-3 500 €/m²", note: "cœur de ville, le plus prisé" },
      { nom: "Bords de Seine / Docks", fourchette: "2 900-3 400 €/m²", note: "anciens docks des vins en reconversion" },
      { nom: "Gare / Orangis-Bois de l'Épine", fourchette: "2 800-3 300 €/m²", note: "deux gares RER D, pratique" },
      { nom: "Le Plateau", fourchette: "2 600-3 100 €/m²", note: "le plus abordable" },
    ],
    transport:
      "deux gares du RER D (Ris-Orangis et Orangis-Bois de l'Épine, Gare de Lyon en 35 minutes), les berges de Seine et les anciens docks en reconversion, et l'A6 toute proche",
    contexte:
      "ville populaire des bords de Seine aux portes d'Évry (30 000 habitants), anciens docks des vins de Paris en reconversion, deux gares RER, marché sous les 3 000 €/m² prisé des primo-accédants qui travaillent sur le pôle d'Évry",
    rendement: "5-5,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-8 %",
    comparison: {
      city: "Évry-Courcouronnes",
      base: "evry-courcouronnes",
      ficheSlug: "evry-courcouronnes-91228",
      price: 3100,
      angle:
        "Ris-Orangis, résidentielle au bord de la Seine (2 800 €/m²), face à Évry-Courcouronnes, la préfecture équipée avec université et cathédrale (3 100 €/m²), deux voisines du RER D à 300 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-02-27", "2026-03-06", "2026-03-13", "2026-03-20", "2026-03-27", "2026-04-03", "2026-04-10", "2026-04-17"],
    skipSlots: [],
  },

  "evry-courcouronnes": {
    city: "Évry-Courcouronnes",
    cityShort: "Évry",
    base: "evry-courcouronnes",
    ficheSlug: "evry-courcouronnes-91228",
    departement: "Essonne",
    median: 3100,
    evolutionNote: "en hausse sur 5 ans, préfecture de l'Essonne en renouveau",
    quartiers: [
      { nom: "Centre urbain / Cathédrale", fourchette: "3 300-3 800 €/m²", note: "autour de la cathédrale Mario Botta et de l'agora, le plus équipé" },
      { nom: "Évry Village", fourchette: "3 200-3 700 €/m²", note: "le vieux bourg au bord de la Seine, le plus prisé" },
      { nom: "Parc aux Lièvres / Université", fourchette: "3 000-3 500 €/m²", note: "campus Paris-Saclay-Évry, étudiant" },
      { nom: "Courcouronnes / Canal", fourchette: "2 800-3 300 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER D (gares Évry-Courcouronnes, Bras de Fer et Orangis-Bois de l'Épine, Gare de Lyon en 35 minutes), l'A6 directe, l'université d'Évry Paris-Saclay et le pôle Genopole",
    contexte:
      "préfecture de l'Essonne née ville nouvelle (69 000 habitants), cathédrale de Mario Botta unique au monde, université et biocluster Genopole, grand pôle d'emploi du sud francilien, marché accessible en renouveau urbain",
    rendement: "5-5,5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 %",
    comparison: {
      city: "Créteil",
      base: "creteil",
      ficheSlug: "creteil-94028",
      price: 4800,
      angle:
        "Évry-Courcouronnes, préfecture accessible du sud avec université et Genopole (3 100 €/m²), face à Créteil, préfecture de la petite couronne avec métro et lac (4 800 €/m²), le duel des deux préfectures à 1 700 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-02-26", "2026-03-05", "2026-03-12", "2026-03-19", "2026-03-26", "2026-04-02", "2026-04-09", "2026-04-16"],
    skipSlots: ["vivre", "s1", "s4"],
  },

  // Batch double vallée de Montmorency / Val-d'Oise (août 2026). 7 fiches créées ; Argenteuil déjà en base.
  argenteuil: {
    city: "Argenteuil",
    cityShort: "Argenteuil",
    base: "argenteuil",
    ficheSlug: "argenteuil-95018",
    departement: "Val-d'Oise",
    median: 3450,
    evolutionNote: "en hausse sur 5 ans, la grande ville accessible de la boucle de Seine",
    quartiers: [
      { nom: "Centre / Mairie", fourchette: "3 700-4 200 €/m²", note: "cœur de ville commerçant près de la gare, le plus prisé" },
      { nom: "Coteaux / Orgemont", fourchette: "3 400-3 900 €/m²", note: "hauteurs pavillonnaires, vues sur Paris" },
      { nom: "Val d'Argenteuil", fourchette: "3 000-3 500 €/m²", note: "en renouvellement urbain" },
      { nom: "Bords de Seine / Colombes", fourchette: "3 400-3 900 €/m²", note: "berges peintes par les impressionnistes, en mutation" },
      { nom: "Val Notre-Dame / Utrillo", fourchette: "3 200-3 700 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le Transilien J (gares d'Argenteuil et Val d'Argenteuil, Saint-Lazare en 12-15 minutes), le tram T2 à proximité au pont de Bezons, l'A15 et l'A86",
    contexte:
      "troisième ville d'Île-de-France (110 000 habitants), berges de Seine peintes par Monet et Caillebotte, coteaux avec vues sur Paris, marché parmi les plus accessibles de la petite couronne élargie à 15 minutes de Saint-Lazare, gros volume de transactions",
    rendement: "4,8-5,3 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-8 %",
    comparison: {
      city: "Sannois",
      base: "sannois",
      ficheSlug: "sannois-95582",
      price: 3900,
      angle:
        "Argenteuil, immense et accessible au bord de la Seine (3 450 €/m²), face à Sannois, plus petite et pavillonnaire sur ses hauteurs (3 900 €/m²), deux voisines du Transilien J à comparer selon le profil",
    },
    datasetCount: 176,
    dates: ["2026-04-06", "2026-04-13", "2026-04-20", "2026-04-27", "2026-05-04", "2026-05-11", "2026-05-18", "2026-05-25"],
    skipSlots: [],
  },

  sannois: {
    city: "Sannois",
    cityShort: "Sannois",
    base: "sannois",
    ficheSlug: "sannois-95582",
    departement: "Val-d'Oise",
    median: 3900,
    evolutionNote: "en hausse sur 5 ans, marché pavillonnaire familial",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "4 100-4 600 €/m²", note: "autour du Transilien J, commerces, le plus prisé" },
      { nom: "Moulin / Coteaux", fourchette: "3 900-4 400 €/m²", note: "hauteurs autour du moulin historique, vues" },
      { nom: "Voltaire / Gabriel Péri", fourchette: "3 700-4 200 €/m²", note: "pavillonnaire" },
      { nom: "Bas de Sannois / limite Argenteuil", fourchette: "3 500-4 000 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le Transilien J (gare de Sannois, Saint-Lazare en 20 minutes), le moulin de Sannois et les buttes du Parisis, et l'A15 toute proche",
    contexte:
      "ville pavillonnaire des buttes du Parisis (27 000 habitants), moulin à vent historique et vues sur Paris depuis les coteaux, profil famille primo-accédante qui veut une maison à 20 minutes de Saint-Lazare",
    rendement: "4,5-5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-7 %",
    comparison: {
      city: "Ermont",
      base: "ermont",
      ficheSlug: "ermont-95219",
      price: 4000,
      angle:
        "Sannois, pavillonnaire sur ses buttes avec son moulin (3 900 €/m²), face à Ermont, mieux connectée avec son hub à trois lignes (4 000 €/m²), deux voisines de la vallée au même budget",
    },
    datasetCount: 176,
    dates: ["2026-04-05", "2026-04-12", "2026-04-19", "2026-04-26", "2026-05-03", "2026-05-10", "2026-05-17", "2026-05-24"],
    skipSlots: [],
  },

  ermont: {
    city: "Ermont",
    cityShort: "Ermont",
    base: "ermont",
    ficheSlug: "ermont-95219",
    departement: "Val-d'Oise",
    median: 4000,
    evolutionNote: "en hausse sur 5 ans, portée par le hub Ermont-Eaubonne",
    quartiers: [
      { nom: "Ermont-Eaubonne / Gare", fourchette: "4 200-4 700 €/m²", note: "autour du hub à trois lignes, le plus prisé" },
      { nom: "Centre / Mairie", fourchette: "4 000-4 500 €/m²", note: "cœur de ville commerçant" },
      { nom: "Cernay", fourchette: "3 900-4 400 €/m²", note: "pavillonnaire, gare Cernay" },
      { nom: "Passerelles / Espérances", fourchette: "3 700-4 200 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le hub d'Ermont-Eaubonne, l'un des mieux desservis du Val-d'Oise (Transilien H vers Gare du Nord en 15 minutes, Transilien J vers Saint-Lazare, RER C vers les Invalides), plus les gares de Cernay et Gros Noyer",
    contexte:
      "ville familiale au cœur de la vallée de Montmorency (29 000 habitants), hub ferroviaire à trois lignes qui donne le choix entre Gare du Nord, Saint-Lazare et les Invalides, marché porté par les familles qui veulent la desserte sans le prix de la petite couronne",
    rendement: "4,4-4,9 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-7 %",
    comparison: {
      city: "Franconville",
      base: "franconville",
      ficheSlug: "franconville-95252",
      price: 3700,
      angle:
        "Ermont, hub à trois lignes au cœur de la vallée (4 000 €/m²), face à Franconville, plus grande et plus abordable une gare plus loin (3 700 €/m²), l'arbitrage desserte-prix du Transilien H",
    },
    datasetCount: 176,
    dates: ["2026-04-04", "2026-04-11", "2026-04-18", "2026-04-25", "2026-05-02", "2026-05-09", "2026-05-16", "2026-05-23"],
    skipSlots: [],
  },

  franconville: {
    city: "Franconville",
    cityShort: "Franconville",
    base: "franconville",
    ficheSlug: "franconville-95252",
    departement: "Val-d'Oise",
    median: 3700,
    evolutionNote: "stable sur 5 ans, grand marché familial de la vallée",
    quartiers: [
      { nom: "Centre / Gare", fourchette: "3 900-4 400 €/m²", note: "Transilien H et J, commerces, le plus prisé" },
      { nom: "Épine-Guyon", fourchette: "3 600-4 100 €/m²", note: "pavillonnaire familial" },
      { nom: "Montédour / Hautes-Bornes", fourchette: "3 500-4 000 €/m²", note: "résidentiel" },
      { nom: "Fontaine-Bertin / Mare des Noues", fourchette: "3 300-3 800 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le Transilien H et J (gare de Franconville-Le Plessis-Bouchard, Gare du Nord en 20 minutes et Saint-Lazare en 25), les buttes du Parisis et l'A15 directe",
    contexte:
      "grande ville familiale de la vallée de Montmorency (37 000 habitants), tissu pavillonnaire dominant, centre commercial et marché, profil primo-accédant et famille qui arbitre entre les deux gares parisiennes",
    rendement: "4,6-5,1 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-7 %",
    comparison: {
      city: "Taverny",
      base: "taverny",
      ficheSlug: "taverny-95607",
      price: 3600,
      angle:
        "Franconville, grande et pratique sur deux lignes (3 700 €/m²), face à Taverny, plus verte en lisière de la forêt de Montmorency (3 600 €/m²), deux options famille du Transilien H au coude à coude",
    },
    datasetCount: 176,
    dates: ["2026-04-03", "2026-04-10", "2026-04-17", "2026-04-24", "2026-05-01", "2026-05-08", "2026-05-15", "2026-05-22"],
    skipSlots: [],
  },

  taverny: {
    city: "Taverny",
    cityShort: "Taverny",
    base: "taverny",
    ficheSlug: "taverny-95607",
    departement: "Val-d'Oise",
    median: 3600,
    evolutionNote: "stable sur 5 ans, marché nature en lisière de forêt",
    quartiers: [
      { nom: "Centre / Notre-Dame", fourchette: "3 800-4 300 €/m²", note: "cœur de ville autour de l'église classée, le plus prisé" },
      { nom: "Lisière forêt de Montmorency", fourchette: "3 700-4 200 €/m²", note: "pavillonnaire contre les bois" },
      { nom: "Vaucelles", fourchette: "3 500-4 000 €/m²", note: "quartier gare, pratique" },
      { nom: "Les Sarments / Plessis", fourchette: "3 300-3 800 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le Transilien H (gares de Taverny et Vaucelles, Gare du Nord en 25-30 minutes), la forêt domaniale de Montmorency (2 000 hectares) en lisière directe, et l'A115",
    contexte:
      "ville familiale en lisière de la forêt de Montmorency (27 000 habitants), église Notre-Dame classée du XIIIe siècle, sentiers et châtaigniers à la porte des maisons, profil famille nature qui garde un train direct pour Gare du Nord",
    rendement: "4,5-5 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "5-7 %",
    comparison: {
      city: "Enghien-les-Bains",
      base: "enghien-les-bains",
      ficheSlug: "enghien-les-bains-95210",
      price: 5800,
      angle:
        "Taverny, nature et accessible contre la forêt (3 600 €/m²), face à Enghien-les-Bains, la station thermale chic autour de son lac (5 800 €/m²), les deux extrêmes de la même ligne H à 2 200 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-04-02", "2026-04-09", "2026-04-16", "2026-04-23", "2026-04-30", "2026-05-07", "2026-05-14", "2026-05-21"],
    skipSlots: [],
  },

  "enghien-les-bains": {
    city: "Enghien-les-Bains",
    cityShort: "Enghien",
    base: "enghien-les-bains",
    ficheSlug: "enghien-les-bains-95210",
    departement: "Val-d'Oise",
    median: 5800,
    evolutionNote: "stable sur 5 ans, la station thermale premium du nord parisien",
    quartiers: [
      { nom: "Tour du lac", fourchette: "6 200-7 200 €/m²", note: "villas et immeubles de standing face au lac, le plus prestigieux" },
      { nom: "Centre / Casino", fourchette: "5 800-6 600 €/m²", note: "autour du casino, des thermes et des commerces" },
      { nom: "Gare / Coteaux", fourchette: "5 500-6 300 €/m²", note: "pratique, Gare du Nord en 12 minutes" },
      { nom: "Ormesson / limite Deuil", fourchette: "5 200-6 000 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le Transilien H (gare d'Enghien-les-Bains, Gare du Nord en 12 minutes), le lac de 43 hectares, et la seule station thermale et le seul casino d'Île-de-France",
    contexte:
      "unique station thermale d'Île-de-France (12 000 habitants), lac romantique, casino le plus important de France, thermes, villas Belle Époque, l'adresse premium incontestée du nord parisien à 12 minutes de Gare du Nord",
    rendement: "3,5-4 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "3-5 % (marché tendu de petite taille)",
    comparison: {
      city: "Saint-Gratien",
      base: "saint-gratien",
      ficheSlug: "saint-gratien-95555",
      price: 4100,
      angle:
        "Enghien-les-Bains, thermale et chic autour de son lac (5 800 €/m²), face à Saint-Gratien, sa voisine résidentielle au bord du même lac côté ouest (4 100 €/m²), 1 700 € d'écart pour un plan d'eau partagé",
    },
    datasetCount: 176,
    dates: ["2026-04-01", "2026-04-08", "2026-04-15", "2026-04-22", "2026-04-29", "2026-05-06", "2026-05-13", "2026-05-20"],
    skipSlots: [],
  },

  "saint-gratien": {
    city: "Saint-Gratien",
    cityShort: "Saint-Gratien",
    base: "saint-gratien",
    ficheSlug: "saint-gratien-95555",
    departement: "Val-d'Oise",
    median: 4100,
    evolutionNote: "en hausse sur 5 ans, marché résidentiel au bord du lac d'Enghien",
    quartiers: [
      { nom: "Bords du lac / limite Enghien", fourchette: "4 400-4 900 €/m²", note: "le plus proche du lac, le plus prisé" },
      { nom: "Centre / Mairie", fourchette: "4 100-4 600 €/m²", note: "commerces, RER C" },
      { nom: "Raguenets", fourchette: "3 800-4 300 €/m²", note: "résidentiel en renouvellement" },
      { nom: "Plaine / limite Argenteuil", fourchette: "3 700-4 200 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le RER C (gare de Saint-Gratien, Porte Maillot et les Invalides directs), le lac d'Enghien en voisin immédiat, et les bus vers la gare d'Enghien (Transilien H)",
    contexte:
      "ville résidentielle sur la rive ouest du lac d'Enghien (21 000 habitants), profil famille qui veut le cadre du lac sans le prix d'Enghien, RER C direct vers l'ouest parisien, marché en valorisation continue",
    rendement: "4,4-4,9 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Eaubonne",
      base: "eaubonne",
      ficheSlug: "eaubonne-95203",
      price: 4300,
      angle:
        "Saint-Gratien, au bord du lac sur le RER C (4 100 €/m²), face à Eaubonne, plus bourgeoise autour de son hub à trois lignes (4 300 €/m²), deux valeurs sûres de la vallée à 200 € d'écart",
    },
    datasetCount: 176,
    dates: ["2026-03-31", "2026-04-07", "2026-04-14", "2026-04-21", "2026-04-28", "2026-05-05", "2026-05-12", "2026-05-19"],
    skipSlots: [],
  },

  eaubonne: {
    city: "Eaubonne",
    cityShort: "Eaubonne",
    base: "eaubonne",
    ficheSlug: "eaubonne-95203",
    departement: "Val-d'Oise",
    median: 4300,
    evolutionNote: "en hausse sur 5 ans, la valeur bourgeoise de la vallée de Montmorency",
    quartiers: [
      { nom: "Centre / Hôtel de ville", fourchette: "4 500-5 000 €/m²", note: "avenues plantées et belles demeures, le plus prisé" },
      { nom: "Ermont-Eaubonne / Gare", fourchette: "4 300-4 800 €/m²", note: "autour du hub à trois lignes" },
      { nom: "Mont d'Eaubonne", fourchette: "4 100-4 600 €/m²", note: "pavillonnaire sur les hauteurs" },
      { nom: "Flammarion / limite Saint-Gratien", fourchette: "3 900-4 400 €/m²", note: "le plus abordable" },
    ],
    transport:
      "le hub d'Ermont-Eaubonne (Transilien H vers Gare du Nord en 15 minutes, Transilien J vers Saint-Lazare, RER C vers les Invalides), et les avenues plantées héritées du lotissement historique",
    contexte:
      "ville bourgeoise de la vallée de Montmorency (25 500 habitants), avenues plantées et villas du lotissement du XIXe, hôpital Simone Veil, profil famille établie qui veut le triple choix de lignes du hub Ermont-Eaubonne",
    rendement: "4,2-4,7 % brut",
    fraisNotaire: "7,5-8 %",
    negoMargin: "4-6 %",
    comparison: {
      city: "Ermont",
      base: "ermont",
      ficheSlug: "ermont-95219",
      price: 4000,
      angle:
        "Eaubonne, bourgeoise avec ses avenues plantées (4 300 €/m²), face à Ermont, plus commerçante de l'autre côté du même hub (4 000 €/m²), les deux copropriétaires de la meilleure gare de la vallée",
    },
    datasetCount: 176,
    dates: ["2026-03-30", "2026-04-06", "2026-04-13", "2026-04-20", "2026-04-27", "2026-05-04", "2026-05-11", "2026-05-18"],
    skipSlots: [],
  },
};
