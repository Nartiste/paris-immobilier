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
};
