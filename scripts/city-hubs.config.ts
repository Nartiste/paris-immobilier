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
};
