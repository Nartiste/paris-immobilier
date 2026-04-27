/**
 * Métadonnées des articles de blog.
 *
 * Chaque article a un brief structuré qui guide la génération AI dans
 * `app/api/admin/blog-content/route.ts`. Le contenu lui-même vit dans
 * `lib/blog-content.ts` (auto-généré).
 */

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** Date ISO de publication */
  publishedAt: string;
  /** Temps de lecture estimé en minutes */
  readingMinutes: number;
  /** Catégorie pour filtrage */
  category: "guide" | "transport" | "finance" | "persona" | "tendance";
  /** Brief envoyé au modèle pour générer le contenu */
  brief: {
    /** Audience cible précise */
    audience: string;
    /** Angle / thèse principale */
    angle: string;
    /** Sections attendues (le modèle peut adapter mais c'est la structure) */
    sections: { titre: string; contenu: string }[];
    /** Communes ou lignes à mentionner si possible */
    references?: string[];
  };
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "top-10-villes-pour-quitter-paris-2026",
    title: "Top 10 des villes pour quitter Paris en 2026",
    description:
      "On a passé 80 communes au crible : prix m², trajet, qualité de vie, transports. Voici les 10 villes qui sortent du lot pour les Parisiens en 2026.",
    publishedAt: "2026-04-22",
    readingMinutes: 8,
    category: "guide",
    brief: {
      audience:
        "Parisien 28-45 ans en réflexion sur son déménagement, plutôt cadre, qui hésite entre rester et bouger.",
      angle:
        "Présenter un classement honnête de 10 villes qui combinent prix accessible (par rapport à Paris), trajet raisonnable et qualité de vie. Mélanger petite couronne, grande couronne et province.",
      sections: [
        {
          titre: "Pourquoi ce classement",
          contenu:
            "Expliquer la méthodo : prix m² médian DVF, temps de trajet réel SNCF/IDFM, qualité de vie pondérée, bonus GPE. Reconnaître la subjectivité (chaque profil pondère différemment).",
        },
        {
          titre: "1. Mâcon — la province en 1h40 par TGV",
          contenu:
            "Mâcon (Saône-et-Loire) à 100 minutes par TGV de Paris. ~2100 €/m², pour ceux qui cherchent un changement radical de cadre de vie tout en gardant l'accès à Paris pour le télétravail hybride.",
        },
        {
          titre: "2. Reims — la grande surprise du TGV Est",
          contenu:
            "Reims à 46 min de Paris en TGV. Ville moyenne dynamique, prix raisonnable (~3000 €/m²), gastronomie + vignobles. Idéal pour télétravailleurs.",
        },
        {
          titre: "3. Saint-Germain-en-Laye — le standing accessible",
          contenu:
            "Yvelines, RER A, 35 min de Paris. ~7100 €/m². Familles aisées qui veulent forêt + château + écoles + lien Paris.",
        },
        {
          titre: "4. Mantes-la-Jolie — le rendement maximal",
          contenu:
            "Yvelines, Transilien J, 32 min. ~2400 €/m². Prochain RER E. Investissement locatif > 6,5 % brut, prix vraiment accessibles.",
        },
        {
          titre: "5. Versailles — l'éternel valeur sûre",
          contenu:
            "Yvelines, RER C + Transilien U, 35 min. ~7400 €/m². Familles qui veulent l'art de vivre, le patrimoine, sans renoncer à Paris.",
        },
        {
          titre: "6. Vincennes — le quartier qui n'en est pas un",
          contenu:
            "Val-de-Marne, M1 + RER A, 16 min. ~9200 €/m² (cher mais moins que Paris 11e/12e). Familles aisées qui veulent rester ultra-proches.",
        },
        {
          titre: "7. Tours — la province assumée",
          contenu:
            "Indre-et-Loire, TGV 1h10. ~2500 €/m². Ville étudiante, gastronomie, Loire à vélo. Pour ceux qui veulent vraiment changer de vie.",
        },
        {
          titre: "8. Champigny-sur-Marne — le pari du Grand Paris Express",
          contenu:
            "Val-de-Marne, RER A + future ligne 15 (2026). ~5500 €/m². Investisseurs, primo-accédants pariant sur la valorisation GPE.",
        },
        {
          titre: "9. Le Mans — TGV à 54 minutes",
          contenu:
            "Sarthe, TGV. ~2000 €/m². Ville moyenne attachante, abbaye, festival des 24 Heures. Couples cherchant un pied-à-terre maison.",
        },
        {
          titre: "10. Saint-Maur-des-Fossés — la pépite du 94",
          contenu:
            "Val-de-Marne, RER A, 28 min. ~6800 €/m². Ambiance résidentielle pavillonnaire au bord de la Marne, écoles solides.",
        },
        {
          titre: "Comment choisir entre ces villes ?",
          contenu:
            "Petit guide de décision selon profil (jeune actif / famille / télétravailleur / investisseur). Renvoyer vers les 3 pages persona du site.",
        },
        {
          titre: "Et après ?",
          contenu:
            "Inviter à utiliser le comparateur interactif et le concierge IA pour affiner. Pas d'appel commercial, ton informatif.",
        },
      ],
      references: [
        "Mâcon",
        "Reims",
        "Saint-Germain-en-Laye",
        "Mantes-la-Jolie",
        "Versailles",
        "Vincennes",
        "Tours",
        "Champigny-sur-Marne",
        "Le Mans",
        "Saint-Maur-des-Fossés",
      ],
    },
  },
  {
    slug: "combien-coute-vraiment-quitter-paris-budget",
    title: "Combien ça coûte vraiment de quitter Paris : le budget complet",
    description:
      "Le déménagement, c'est l'iceberg qui cache la vraie dépense. On chiffre tout : crédit, frais d'agence, déco, transports, école, fiscalité.",
    publishedAt: "2026-04-15",
    readingMinutes: 9,
    category: "finance",
    brief: {
      audience:
        "Parisien qui a une idée vague du coût mais sous-estime les frais cachés. Profil cadre 30-45 ans, primo-accédant ou changeant pour plus grand.",
      angle:
        "Décomposer honnêtement le coût total d'un déménagement, en chiffrant chaque poste. Casser le mythe que 'c'est moins cher qu'à Paris' sans nuance. Aider à anticiper les surprises.",
      sections: [
        {
          titre: "Le prix au m² n'est qu'un début",
          contenu:
            "Pourquoi le prix d'achat affiché ne représente que 70-75 % du coût total. Frais de notaire (7-8 %), frais d'agence (4-7 %), travaux probables, déco/équipement, gros électroménager.",
        },
        {
          titre: "Le crédit immobilier : taux + durée + assurance",
          contenu:
            "Taux de crédit moyen mai 2026 (~3,5-4 %). Calcul d'une mensualité pour un bien de 350k€ sur 25 ans. Coût total du crédit (assurance comprise). Pourquoi un courtier (cf. Pretto) peut faire gagner 0,3-0,5 %.",
        },
        {
          titre: "Le déménagement physique",
          contenu:
            "Coût d'un déménagement IDF → grande couronne (~1500-3000 €), IDF → province (~2500-5000 €). Cartons, location véhicule, congés à poser. Ne pas sous-estimer.",
        },
        {
          titre: "Les transports : le poste qui change tout",
          contenu:
            "Pass Navigato à 88 €/mois. Mais si tu vas à Reims en TGV 2 jours/semaine : 250-400 €/mois aller-retour selon abonnement Forfait Liberté ou TGV Pro. Calcul comparatif Paris vs banlieue vs province.",
        },
        {
          titre: "L'école : un coût caché en province",
          contenu:
            "Écoles publiques gratuites, mais : transport scolaire dans certaines communes rurales, cantine plus chère qu'à Paris, frais d'inscription au club de sport. Coût annuel typique pour un enfant en banlieue ~500-1500 €.",
        },
        {
          titre: "L'impôt foncier : la grande surprise",
          contenu:
            "À Paris, taxe foncière modérée (~12-15 €/m²). En banlieue ouest aisée, peut grimper à 25-35 €/m². En province, variable mais souvent en dessous de Paris. Calcul concret pour 80 m² à Versailles vs Reims.",
        },
        {
          titre: "Voiture obligatoire ?",
          contenu:
            "En grande couronne ou province, souvent oui. Coût annuel d'une voiture (carburant + assurance + entretien) ~3000-5000 €/an. À ajouter au budget.",
        },
        {
          titre: "Le coût émotionnel : l'oublié des budgets",
          contenu:
            "Sortir de Paris, c'est aussi reconstruire un réseau social, perdre certaines opportunités spontanées. Pas chiffrable mais réel. À anticiper.",
        },
        {
          titre: "Calcul total : exemple concret",
          contenu:
            "Cas pratique : famille de 4, achat 75 m² à Boulogne-Billancourt vs 110 m² à Versailles. Comparaison sur 10 ans. Conclusion nuancée.",
        },
      ],
    },
  },
  {
    slug: "rer-b-rer-e-comparaison-fiabilite",
    title: "RER B ou RER E : laquelle choisir pour vivre près de Paris ?",
    description:
      "Tout sépare ces deux lignes : ponctualité, modernité, communes desservies. On démêle laquelle correspond à ton profil.",
    publishedAt: "2026-04-08",
    readingMinutes: 7,
    category: "transport",
    brief: {
      audience:
        "Personne qui hésite entre s'installer sur l'axe RER B (Antony, Bourg-la-Reine, Sceaux, Aulnay, Drancy) ou RER E (Noisy-le-Sec, Bondy, Chelles, Mantes-la-Jolie après EOLE).",
      angle:
        "Comparaison frontale et factuelle entre une ligne historiquement saturée (RER B) et une ligne moderne (RER E prolongée en 2024). Aider l'utilisateur à choisir en connaissance de cause.",
      sections: [
        {
          titre: "Deux lignes, deux mondes",
          contenu:
            "Présentation rapide : RER B (1977, 900k voy/jour, MI79 vétuste, 2 exploitants RATP+SNCF) vs RER E (1999, prolongé 2024, RER NG moderne, exploitant unique SNCF).",
        },
        {
          titre: "Ponctualité : la différence est brutale",
          contenu:
            "Stats 2024 réelles : RER B autour de 78 % de ponctualité 5 minutes, RER E à 92 %. Conséquence concrète sur la vie quotidienne (1 retard par semaine vs 1 par mois).",
        },
        {
          titre: "Communes desservies : le RER B couvre plus de territoire",
          contenu:
            "RER B : Aéroport CDG, Stade de France, Sciences Po, Massy, Antony… RER E : axe est-ouest plus court mais 2024 ouvre Nanterre/Mantes. Avantage RER B en couverture, RER E en qualité.",
        },
        {
          titre: "Prix immobiliers : le marché a déjà arbitré",
          contenu:
            "Gares RER B : prix sous-cotés à cause de la mauvaise réputation (Aulnay 2300 €/m², Drancy 2800 €/m²). Gares RER E : prix tendent vers le haut (Chelles 3500 €/m²). Effet RER E sur Mantes (2400 €/m²) attendu mais pas encore complètement intégré.",
        },
        {
          titre: "Pour qui le RER B reste rationnel",
          contenu:
            "Investisseurs visant le rendement (rendement brut > 6 % sur certaines gares), familles à budget contraint qui acceptent l'inconfort, personnes qui n'ont pas besoin de présentiel quotidien.",
        },
        {
          titre: "Pour qui le RER E est l'évidence",
          contenu:
            "Cadres en présentiel régulier, familles avec enfants en bas âge (importance de la ponctualité), profils qui valorisent confort + tranquillité sur prix.",
        },
        {
          titre: "Et si on attendait NEXTEO ?",
          contenu:
            "Le projet NEXTEO de modernisation du RER B est planifié vers 2030. Cela peut valoir le coup d'attendre pour les communes du RER B sud. Risque : retards probables.",
        },
        {
          titre: "Notre verdict en une phrase",
          contenu:
            "Si tu travailles à Paris en présentiel régulier et que ton budget permet le choix : RER E. Si tu cherches le rendement immobilier ou un budget contraint : RER B reste défendable.",
        },
      ],
      references: [
        "Aulnay-sous-Bois",
        "Drancy",
        "Chelles",
        "Mantes-la-Jolie",
        "Bondy",
      ],
    },
  },
  {
    slug: "quitter-paris-teletravail-comment-choisir",
    title: "Quitter Paris en télétravail : comment choisir ta ville en 2026",
    description:
      "Tu vas au bureau 2 jours par semaine. Le bon arbitrage entre temps de trajet et coût de la vie n'est plus le même qu'avant. Mode d'emploi.",
    publishedAt: "2026-04-01",
    readingMinutes: 8,
    category: "persona",
    brief: {
      audience:
        "Cadre 30-45 ans en télétravail hybride 2-3 jours/semaine, qui veut optimiser le rapport qualité de vie / budget en élargissant la zone géographique acceptable.",
      angle:
        "Donner la grille de décision spécifique aux télétravailleurs : la fiabilité des transports compte plus que le temps de trajet, le budget gagne en importance, certaines villes deviennent réalistes là où elles ne l'étaient pas il y a 5 ans.",
      sections: [
        {
          titre: "Le télétravail change la donne géographique",
          contenu:
            "Avant 2020, vivre à 1h30 de Paris en présentiel quotidien = enfer. En 2026, avec 2 jours/semaine au bureau, c'est 8 trajets/mois → tout à fait gérable. Cela ouvre Reims, Le Mans, Tours, Mâcon, Orléans en plus du périmètre IDF classique.",
        },
        {
          titre: "Critère #1 : la fiabilité, pas le temps",
          contenu:
            "Un RER B à 22 minutes mais ponctualité 78 % est pire qu'un Transilien J à 35 minutes ponctualité 92 %. Un jour de présentiel raté à cause d'un incident transport, c'est socialement coûteux.",
        },
        {
          titre: "Critère #2 : la fréquence en heure de pointe",
          contenu:
            "Si ton train passe toutes les 10 minutes, un retard est rattrapable. S'il passe toutes les 30 minutes (Transilien R, Intercités POLT), un retard te plante 30 min en plus.",
        },
        {
          titre: "Critère #3 : la 1re classe TGV change tout",
          contenu:
            "Si tu fais 8 trajets/mois sur TGV Est ou Sud-Est, l'abonnement Forfait Liberté en 1re classe (~250 €/mois) te donne du wifi correct, de l'espace pour bosser, du calme. Tu transformes le trajet en heures productives.",
        },
        {
          titre: "Critère #4 : qualité de l'environnement domestique",
          contenu:
            "Tu passes 3-4 jours/semaine à la maison. La vraie pièce à vivre, le coin bureau, la lumière naturelle, le calme deviennent essentiels. À surface égale, une maison provinciale écrase un appartement parisien.",
        },
        {
          titre: "Comparaison concrète : 3 scénarios",
          contenu:
            "Scénario A : Boulogne-Billancourt 60 m² 9000 €/m² = 540k€. Scénario B : Versailles 80 m² 7400 €/m² = 590k€. Scénario C : Reims 110 m² 3000 €/m² = 330k€ + 250 €/mois TGV. Tableau comparatif.",
        },
        {
          titre: "Les pièges à éviter",
          contenu:
            "1) Surestimer ta capacité à faire 1h30 de trajet (la fatigue s'accumule). 2) Sous-estimer l'importance d'un train direct. 3) Ne pas tester la liaison sur 1 mois avant de signer. 4) Oublier le coût annuel d'un abonnement TGV (3000 €/an).",
        },
        {
          titre: "Notre top 5 télétravail",
          contenu:
            "Reims, Tours, Le Mans, Mantes-la-Jolie, Vendôme. Pour chacune, 1 ligne de justification.",
        },
      ],
      references: ["Reims", "Tours", "Le Mans", "Mantes-la-Jolie", "Vendôme"],
    },
  },
  {
    slug: "grand-paris-express-immobilier-2026",
    title: "Le Grand Paris Express change-t-il vraiment le marché immobilier ?",
    description:
      "Les nouvelles lignes 14, 15, 16, 17, 18 promettent une révolution. La réalité est plus nuancée. Bilan d'étape en 2026.",
    publishedAt: "2026-03-25",
    readingMinutes: 9,
    category: "tendance",
    brief: {
      audience:
        "Acheteur ou investisseur qui entend parler du Grand Paris Express depuis des années et veut comprendre où en est le projet et où placer son argent.",
      angle:
        "Faire le point factuel sur les ouvertures réelles, l'effet observé sur les prix, les communes où l'effet a été surévalué et celles où il reste à venir. Approche honnête, pas marketing.",
      sections: [
        {
          titre: "Où en est le Grand Paris Express en 2026",
          contenu:
            "Ligne 14 prolongée nord (Saint-Denis Pleyel) en 2024, sud (Aéroport d'Orly) en 2024. Ligne 15 sud (Pont-de-Sèvres ↔ Noisy-Champs) ouverte fin 2025. Ligne 16 et 17 nord en cours. Ligne 18 et 15 ouest/est : 2030+.",
        },
        {
          titre: "L'effet d'annonce vs l'effet d'ouverture",
          contenu:
            "Étude statistique sur 15 communes : prix grimpent dès l'annonce officielle (-10 ans avant), pic à mi-parcours, stabilisation 2-3 ans après ouverture. La hausse cumulée moyenne est de +18-25 % sur 10 ans.",
        },
        {
          titre: "Communes où le marché a déjà tout intégré",
          contenu:
            "Saint-Denis Pleyel, Villejuif IGR, Bagneux, Issy RER : prix au plafond, peu de marge à attendre. Les early-adopters ont gagné, ceux qui achètent maintenant paient le ticket plein.",
        },
        {
          titre: "Communes où il reste de la marge",
          contenu:
            "Champigny-Centre, Bry-Villiers-Champigny, Drancy-Bobigny, Aulnay : ouvertures plus tardives (2027-2030), médiatisation moindre, prix encore raisonnables.",
        },
        {
          titre: "Le ratio risque-rendement de l'investissement GPE",
          contenu:
            "Acheter une commune GPE en 2026, c'est parier sur 2 facteurs : ouverture effective de la gare (risque de retard) et qualité de vie après ouverture (peut décevoir si le quartier reste populaire).",
        },
        {
          titre: "Les pièges du discours commercial",
          contenu:
            "Promoteurs qui survendent l'effet GPE pour justifier des prix élevés sur du neuf. Vérifier toujours : date d'ouverture certifiée, calendrier passé du projet, prix médians DVF de la commune.",
        },
        {
          titre: "Les gagnants oubliés du GPE",
          contenu:
            "Mantes-la-Jolie (RER E EOLE 2026-2027), Noisy-le-Sec, Pantin (M5 + futurs trams), Le Bourget. Communes peu médiatisées où l'effet d'amélioration des transports est concret mais sous-coté.",
        },
        {
          titre: "Notre conseil en une phrase",
          contenu:
            "N'achète pas une commune juste pour le GPE. Achète parce que la commune te plaît ET le GPE est un bonus. La spéculation pure sur les futures gares se paye souvent au prix fort.",
        },
      ],
      references: [
        "Saint-Denis",
        "Villejuif",
        "Champigny-sur-Marne",
        "Mantes-la-Jolie",
        "Pantin",
      ],
    },
  },
];

export const BLOG_POSTS_BY_SLUG: Record<string, BlogPost> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p]),
);
