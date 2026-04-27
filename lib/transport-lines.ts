/**
 * Base factuelle sur les lignes de transport vers Paris.
 *
 * Sources consolidées (avril 2026) :
 * - SNCF Connect, Transilien (statistiques de ponctualité)
 * - RATP rapports annuels
 * - IDF Mobilités (qualité de service)
 * - presse spécialisée (Le Parisien transport, Ville Rail & Transports)
 *
 * Notation réputation 1-5 :
 *   5 = Excellent (moderne, ponctuel, peu chargé)
 *   4 = Bon (fiable, parfois chargé)
 *   3 = Correct (incidents réguliers, charge importante)
 *   2 = Difficile (saturation chronique, retards fréquents)
 *   1 = Catastrophique
 */

export type TransportType =
  | "RER"
  | "Transilien"
  | "Metro"
  | "Tram"
  | "TGV"
  | "Intercités";

export type ReputationTag =
  | "saturée"
  | "ponctualité dégradée"
  | "modernisée"
  | "automatique"
  | "moderne"
  | "fiable"
  | "fréquente"
  | "longue distance"
  | "vétuste"
  | "rénovation en cours"
  | "extension récente";

export type TransportLine = {
  /** Slug pour l'URL `/lignes/[slug]` */
  id: string;
  /** Code court ("RER B", "M14", "Transilien L") */
  code: string;
  /** Nom complet pour titres */
  name: string;
  type: TransportType;
  /** Gare ou terminus parisien principal */
  terminusParis: string;
  reputation: {
    /** 1-5, 5 = excellent */
    score: 1 | 2 | 3 | 4 | 5;
    tags: ReputationTag[];
    /** Résumé 1-2 phrases factuelles */
    summary: string;
  };
  facts: {
    nbStations?: number;
    longueurKm?: number;
    voyageursParJour?: number;
    miseEnService?: number;
    automatique?: boolean;
    /** Fréquence en heure de pointe (minutes) */
    frequencePointeMin?: number;
    operateur?: "RATP" | "SNCF" | "RATP+SNCF";
  };
  /** Texte libre 2-3 phrases sur les particularités */
  description: string;
};

export const TRANSPORT_LINES: TransportLine[] = [
  // ============ RER ============
  {
    id: "rer-a",
    code: "RER A",
    name: "RER A",
    type: "RER",
    terminusParis: "Châtelet-Les Halles",
    reputation: {
      score: 4,
      tags: ["saturée", "modernisée", "fréquente"],
      summary:
        "Ligne la plus fréquentée d'Europe (1,3 million de voyageurs/jour). Modernisée avec les rames MI09 à deux niveaux, elle reste très chargée mais relativement ponctuelle.",
    },
    facts: {
      nbStations: 46,
      longueurKm: 109,
      voyageursParJour: 1_300_000,
      miseEnService: 1969,
      frequencePointeMin: 2,
      operateur: "RATP+SNCF",
    },
    description:
      "Le RER A relie Saint-Germain-en-Laye et Cergy/Poissy à l'ouest aux branches de Marne-la-Vallée et Boissy-Saint-Léger à l'est. Sa branche centrale, qui traverse Paris d'ouest en est, est l'axe le plus rentable du réseau francilien. Cadencée toutes les 90 secondes en heure de pointe sur le tronçon central.",
  },
  {
    id: "rer-b",
    code: "RER B",
    name: "RER B",
    type: "RER",
    terminusParis: "Châtelet-Les Halles",
    reputation: {
      score: 2,
      tags: ["saturée", "ponctualité dégradée", "vétuste", "rénovation en cours"],
      summary:
        "Saturation chronique et matériel vieillissant. Ponctualité historiquement basse (75-80 %) avec des incidents quasi quotidiens. Modernisation MI20 en cours mais déploiement lent.",
    },
    facts: {
      nbStations: 47,
      longueurKm: 80,
      voyageursParJour: 900_000,
      miseEnService: 1977,
      frequencePointeMin: 3,
      operateur: "RATP+SNCF",
    },
    description:
      "Le RER B traverse Paris du nord au sud et dessert l'aéroport Roissy CDG ainsi que Massy-Palaiseau. C'est l'une des lignes les plus critiquées du réseau : matériel MI79 en fin de vie, branches en mixité avec le fret SNCF, opérée par deux exploitants (RATP et SNCF) sur le même tronçon. Le projet de modernisation NEXTEO est attendu pour la fin de la décennie.",
  },
  {
    id: "rer-c",
    code: "RER C",
    name: "RER C",
    type: "RER",
    terminusParis: "Saint-Michel-Notre-Dame",
    reputation: {
      score: 3,
      tags: ["longue distance", "ponctualité dégradée"],
      summary:
        "Ligne la plus longue du réseau RER (185 km, 84 gares) avec de nombreuses branches. Retards fréquents en banlieue sud, performances variables selon la branche.",
    },
    facts: {
      nbStations: 84,
      longueurKm: 185,
      voyageursParJour: 540_000,
      miseEnService: 1979,
      frequencePointeMin: 5,
      operateur: "SNCF",
    },
    description:
      "Le RER C relie Versailles, Pontoise et Massy-Palaiseau au nord-ouest aux Vallée-de-Chevreuse, Dourdan, Saint-Martin-d'Étampes et Versailles-Château au sud. Sa complexité — 7 branches — explique sa relative fragilité face aux incidents.",
  },
  {
    id: "rer-d",
    code: "RER D",
    name: "RER D",
    type: "RER",
    terminusParis: "Châtelet-Les Halles",
    reputation: {
      score: 2,
      tags: ["saturée", "ponctualité dégradée"],
      summary:
        "Ligne la plus dégradée du réseau RER selon les enquêtes voyageurs. Saturation extrême au sud, infrastructures sous-dimensionnées, ponctualité régulièrement sous les 80 %.",
    },
    facts: {
      nbStations: 59,
      longueurKm: 197,
      voyageursParJour: 615_000,
      miseEnService: 1987,
      frequencePointeMin: 6,
      operateur: "SNCF",
    },
    description:
      "Le RER D relie Creil et Orry-la-Ville au nord à Melun, Malesherbes et Corbeil-Essonnes au sud. Le projet RER d'Été (renforcement des fréquences) est régulièrement reporté. Une amélioration significative n'est pas attendue avant 2030.",
  },
  {
    id: "rer-e",
    code: "RER E",
    name: "RER E",
    type: "RER",
    terminusParis: "Haussmann-Saint-Lazare",
    reputation: {
      score: 5,
      tags: ["moderne", "fiable", "extension récente"],
      summary:
        "Ligne la plus récente et la plus fiable du réseau. Prolongement EOLE mis en service en 2024 jusqu'à Nanterre-La Folie, atteindra Mantes-la-Jolie d'ici 2026-2027. Matériel moderne (RER NG).",
    },
    facts: {
      nbStations: 22,
      longueurKm: 56,
      voyageursParJour: 380_000,
      miseEnService: 1999,
      frequencePointeMin: 4,
      operateur: "SNCF",
    },
    description:
      "Le RER E (EOLE) est la dernière ligne du RER ouverte. Son prolongement vers l'ouest à Nanterre puis Mantes-la-Jolie redessine la carte des temps de trajet vers Paris depuis l'ouest francilien. Avec son matériel récent et sa fréquence soutenue, c'est aujourd'hui la ligne RER la plus appréciée des voyageurs.",
  },

  // ============ Transilien (SNCF) ============
  {
    id: "transilien-h",
    code: "Transilien H",
    name: "Transilien H",
    type: "Transilien",
    terminusParis: "Gare du Nord",
    reputation: {
      score: 3,
      tags: ["fiable"],
      summary:
        "Ligne de banlieue nord vers Pontoise, Persan-Beaumont et Luzarches. Ponctualité correcte mais dépendante du nœud Saint-Lazare/Nord.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 10,
    },
    description:
      "Le Transilien H dessert le nord-ouest francilien : Sarcelles, Persan, Pontoise. Modernisation progressive du matériel.",
  },
  {
    id: "transilien-j",
    code: "Transilien J",
    name: "Transilien J",
    type: "Transilien",
    terminusParis: "Saint-Lazare",
    reputation: {
      score: 4,
      tags: ["modernisée", "fiable"],
      summary:
        "Réseau du nord-ouest depuis Saint-Lazare. Matériel rénové (Régio 2N), fréquence soutenue vers Mantes-la-Jolie.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 10,
    },
    description:
      "Le Transilien J relie Saint-Lazare à Mantes-la-Jolie, Gisors, Vernon et Évreux selon les branches. C'est la ligne historique de la banlieue ouest, avec des dessertes fréquentes vers Mantes.",
  },
  {
    id: "transilien-k",
    code: "Transilien K",
    name: "Transilien K",
    type: "Transilien",
    terminusParis: "Gare du Nord",
    reputation: {
      score: 3,
      tags: ["fiable"],
      summary:
        "Ligne courte vers Crépy-en-Valois (Oise). Trafic modéré, ponctualité correcte.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 30,
    },
    description:
      "Le Transilien K traverse la Seine-et-Marne nord pour rejoindre l'Oise. Faible fréquence mais service stable.",
  },
  {
    id: "transilien-l",
    code: "Transilien L",
    name: "Transilien L",
    type: "Transilien",
    terminusParis: "Saint-Lazare",
    reputation: {
      score: 4,
      tags: ["fiable", "modernisée"],
      summary:
        "Branches Saint-Cloud / Versailles-Rive-Droite / Cergy. Bonne ponctualité, matériel récent.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 10,
    },
    description:
      "Le Transilien L est apprécié pour sa régularité et la qualité de son matériel. Il dessert les communes huppées de l'ouest parisien (Saint-Cloud, Saint-Germain-en-Laye via la branche Versailles).",
  },
  {
    id: "transilien-n",
    code: "Transilien N",
    name: "Transilien N",
    type: "Transilien",
    terminusParis: "Montparnasse",
    reputation: {
      score: 4,
      tags: ["fiable"],
      summary:
        "Réseau Montparnasse vers Rambouillet, Mantes et Sèvres. Bonne ponctualité, fréquence correcte.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 15,
    },
    description:
      "Le Transilien N propose des trajets directs vers les Yvelines sud (Rambouillet) et la frange ouest. Matériel modernisé Régio 2N.",
  },
  {
    id: "transilien-p",
    code: "Transilien P",
    name: "Transilien P",
    type: "Transilien",
    terminusParis: "Gare de l'Est",
    reputation: {
      score: 3,
      tags: ["ponctualité dégradée"],
      summary:
        "Réseau Est vers Meaux, Provins, Coulommiers, La Ferté-Milon. Ponctualité variable selon la branche, certaines portions à voie unique.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 15,
    },
    description:
      "Le Transilien P couvre la Seine-et-Marne et l'Aisne. Le prolongement du RER E (EOLE) vers l'est devrait soulager certaines branches d'ici 2030.",
  },
  {
    id: "transilien-r",
    code: "Transilien R",
    name: "Transilien R",
    type: "Transilien",
    terminusParis: "Gare de Lyon",
    reputation: {
      score: 3,
      tags: ["longue distance"],
      summary:
        "Vers Sens, Montargis, Montereau. Faible fréquence (1 train/heure hors pointe), mais ponctualité acceptable.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 30,
    },
    description:
      "Le Transilien R dessert l'Essonne sud et le nord de l'Yonne et du Loiret. Solution intéressante pour ceux qui cherchent un cadre rural à 1 heure de Paris.",
  },
  {
    id: "transilien-u",
    code: "Transilien U",
    name: "Transilien U",
    type: "Transilien",
    terminusParis: "La Défense",
    reputation: {
      score: 4,
      tags: ["fiable"],
      summary:
        "Liaison directe La Défense ↔ La Verrière (Yvelines). Évite Paris intra-muros, très utile pour les actifs des Yvelines.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 15,
    },
    description:
      "Tangentielle ouest qui relie le pôle d'affaires de La Défense aux Yvelines centrales sans transit par Paris. Matériel Régio 2N.",
  },

  // ============ Métro RATP ============
  {
    id: "metro-1",
    code: "M1",
    name: "Métro 1",
    type: "Metro",
    terminusParis: "Château de Vincennes",
    reputation: {
      score: 5,
      tags: ["automatique", "moderne", "fiable", "fréquente"],
      summary:
        "Ligne automatique depuis 2012. Ponctualité quasi parfaite, fréquence très élevée (toutes les 85 secondes en pointe).",
    },
    facts: {
      nbStations: 25,
      longueurKm: 16.5,
      voyageursParJour: 760_000,
      miseEnService: 1900,
      automatique: true,
      frequencePointeMin: 1.5,
      operateur: "RATP",
    },
    description:
      "Première ligne automatique de plus de 100 ans, la M1 est un modèle d'efficacité. Elle dessert l'axe est-ouest historique de Paris (La Défense ↔ Vincennes).",
  },
  {
    id: "metro-14",
    code: "M14",
    name: "Métro 14",
    type: "Metro",
    terminusParis: "Olympiades / Saint-Denis Pleyel",
    reputation: {
      score: 5,
      tags: ["automatique", "moderne", "fiable", "extension récente"],
      summary:
        "Ligne automatique récente, prolongée en 2020 (Saint-Denis Pleyel) et 2024 (Aéroport d'Orly). Confort et ponctualité exemplaires.",
    },
    facts: {
      nbStations: 21,
      longueurKm: 27.8,
      voyageursParJour: 750_000,
      miseEnService: 1998,
      automatique: true,
      frequencePointeMin: 1.5,
      operateur: "RATP",
    },
    description:
      "Ligne 14, automatique depuis sa création, est devenue la dorsale nord-sud de Paris. Elle relie Saint-Denis Pleyel à Orly en 35 minutes, transformant l'accessibilité de plusieurs communes.",
  },
  {
    id: "metro-9",
    code: "M9",
    name: "Métro 9",
    type: "Metro",
    terminusParis: "Mairie de Montreuil",
    reputation: {
      score: 4,
      tags: ["fiable", "fréquente"],
      summary:
        "Une des lignes les plus longues du métro parisien. Fréquence soutenue, dessert Boulogne-Billancourt et Montreuil.",
    },
    facts: {
      nbStations: 37,
      longueurKm: 19.6,
      operateur: "RATP",
      frequencePointeMin: 2,
    },
    description:
      "La M9 traverse Paris d'ouest en est en passant par les beaux quartiers (16e, 8e). Elle est appréciée pour sa régularité.",
  },
  {
    id: "metro-13",
    code: "M13",
    name: "Métro 13",
    type: "Metro",
    terminusParis: "Châtillon-Montrouge",
    reputation: {
      score: 2,
      tags: ["saturée", "ponctualité dégradée"],
      summary:
        "Ligne historiquement saturée, particulièrement entre La Fourche et Châtelet en heure de pointe. Aucune amélioration majeure prévue à court terme.",
    },
    facts: {
      operateur: "RATP",
      frequencePointeMin: 2,
    },
    description:
      "La M13 dessert Saint-Denis et Asnières-sur-Seine au nord, Châtillon-Montrouge au sud. C'est l'une des lignes du réseau les plus chargées en pointe.",
  },

  // ============ TGV ============
  {
    id: "tgv-sud-est",
    code: "TGV Sud-Est",
    name: "TGV Sud-Est (Ouigo + inOui)",
    type: "TGV",
    terminusParis: "Gare de Lyon",
    reputation: {
      score: 5,
      tags: ["fréquente", "moderne", "fiable"],
      summary:
        "Axe TGV le plus fréquenté d'Europe. Lyon en 1h54, Marseille en 3h05. Ponctualité supérieure à 90 %.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 30,
    },
    description:
      "Le TGV Sud-Est relie Paris à Lyon, Marseille, Avignon, Aix-en-Provence, Nice, Mâcon, Dijon. Service quasi continu en journée. Idéal pour les communes situées sur l'axe (Mâcon, Le Creusot, Dijon) qui se retrouvent à 1h-2h de Paris.",
  },
  {
    id: "tgv-nord",
    code: "TGV Nord",
    name: "TGV Nord",
    type: "TGV",
    terminusParis: "Gare du Nord",
    reputation: {
      score: 5,
      tags: ["fréquente", "fiable"],
      summary:
        "Lille en 1h, Bruxelles en 1h22. Service très soutenu, ponctualité élevée.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 60,
    },
    description:
      "Le TGV Nord (LGV Nord) ouvre l'accès rapide à Lille, Calais, Dunkerque, Arras et au-delà (Bruxelles, Amsterdam, Londres via Eurostar).",
  },
  {
    id: "tgv-est",
    code: "TGV Est",
    name: "TGV Est",
    type: "TGV",
    terminusParis: "Gare de l'Est",
    reputation: {
      score: 5,
      tags: ["moderne", "fiable", "extension récente"],
      summary:
        "LGV ouverte en 2007, prolongée en 2016 jusqu'à Strasbourg. Reims à 46 min, Strasbourg à 1h46.",
    },
    facts: {
      operateur: "SNCF",
      miseEnService: 2007,
      frequencePointeMin: 60,
    },
    description:
      "Le TGV Est dessert Reims, Metz, Nancy, Strasbourg, Luxembourg et Francfort. C'est l'une des LGV les plus performantes de France grâce à un alignement direct.",
  },
  {
    id: "tgv-atlantique",
    code: "TGV Atlantique",
    name: "TGV Atlantique",
    type: "TGV",
    terminusParis: "Montparnasse",
    reputation: {
      score: 4,
      tags: ["fréquente", "fiable"],
      summary:
        "Bordeaux à 2h04, Rennes à 1h25, Nantes à 2h05. Service très fréquent vers l'ouest et le sud-ouest.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 60,
    },
    description:
      "Le TGV Atlantique part de Montparnasse et dessert l'ouest (Le Mans, Rennes, Brest), le sud-ouest (Tours, Bordeaux, Bayonne) et l'arc atlantique (La Rochelle, Nantes).",
  },

  // ============ Intercités ============
  {
    id: "intercites-normandie",
    code: "Intercités Normandie",
    name: "Intercités Normandie",
    type: "Intercités",
    terminusParis: "Saint-Lazare",
    reputation: {
      score: 4,
      tags: ["modernisée", "fiable"],
      summary:
        "Liaison rapide vers Caen, Le Havre, Cherbourg, Rouen, Évreux. Matériel Omneo Premium déployé en 2020-2023.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 60,
    },
    description:
      "Les Intercités Normandie permettent de rejoindre Caen en 2h, Le Havre en 2h05 et Rouen en 1h15. Une option crédible pour s'installer en Normandie tout en travaillant à Paris.",
  },
  {
    id: "intercites-polt",
    code: "Intercités POLT",
    name: "Intercités POLT (Paris-Orléans-Limoges-Toulouse)",
    type: "Intercités",
    terminusParis: "Austerlitz",
    reputation: {
      score: 3,
      tags: ["longue distance", "rénovation en cours"],
      summary:
        "Ancien fleuron en attente de rénovation. Limoges à 3h, Toulouse à 6h30. Matériel rénové en cours de déploiement.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 60,
    },
    description:
      "L'axe POLT dessert Orléans, Vierzon, Châteauroux, Limoges, Brive et Toulouse. La rénovation des rames est attendue d'ici 2027 pour une remise à niveau du service.",
  },
  {
    id: "intercites-centre",
    code: "Intercités Centre",
    name: "Intercités Centre-Val de Loire",
    type: "Intercités",
    terminusParis: "Austerlitz",
    reputation: {
      score: 3,
      tags: ["fiable"],
      summary:
        "Vers Orléans (1h), Tours (1h10), Bourges. Liaison régulière, fiable, matériel rénové.",
    },
    facts: {
      operateur: "SNCF",
      frequencePointeMin: 60,
    },
    description:
      "Service Intercités sur l'axe Paris-Orléans-Tours et Paris-Bourges-Nevers. Une option pour s'installer en Centre-Val de Loire avec un trajet matinal raisonnable.",
  },
];

/**
 * Index pour lookup rapide par id (slug).
 */
export const TRANSPORT_LINES_BY_ID: Record<string, TransportLine> =
  Object.fromEntries(TRANSPORT_LINES.map((l) => [l.id, l]));

/**
 * À partir d'une chaîne `ligne_principale` (issue de la base de communes),
 * essaie de retrouver les TransportLine correspondantes.
 *
 * Exemples d'entrée :
 *   "RER A" → [rer-a]
 *   "RER A, M14 (2024)" → [rer-a, metro-14]
 *   "Transilien L, U, T2" → [transilien-l, transilien-u]
 *   "TGV Sud-Est" → [tgv-sud-est]
 */
export function matchLines(ligneStr: string | null | undefined): TransportLine[] {
  if (!ligneStr) return [];
  const lower = ligneStr.toLowerCase();

  const matched: TransportLine[] = [];
  const seen = new Set<string>();

  for (const line of TRANSPORT_LINES) {
    const code = line.code.toLowerCase();
    if (lower.includes(code) && !seen.has(line.id)) {
      matched.push(line);
      seen.add(line.id);
    }
  }

  // Fallback : chercher M{N} pour les métros si pas matché
  for (const m of lower.matchAll(/\bm(\d+)\b/g)) {
    const id = `metro-${m[1]}`;
    if (TRANSPORT_LINES_BY_ID[id] && !seen.has(id)) {
      matched.push(TRANSPORT_LINES_BY_ID[id]);
      seen.add(id);
    }
  }

  return matched;
}

/**
 * Couleur Tailwind / CSS associée au score de réputation.
 */
export function reputationColor(score: 1 | 2 | 3 | 4 | 5): string {
  switch (score) {
    case 5:
      return "#16a34a"; // vert
    case 4:
      return "#65a30d"; // vert-jaune
    case 3:
      return "#ca8a04"; // jaune
    case 2:
      return "#ea580c"; // orange
    case 1:
      return "#dc2626"; // rouge
  }
}

export function reputationLabel(score: 1 | 2 | 3 | 4 | 5): string {
  switch (score) {
    case 5:
      return "Excellent";
    case 4:
      return "Bon";
    case 3:
      return "Correct";
    case 2:
      return "Difficile";
    case 1:
      return "Catastrophique";
  }
}
