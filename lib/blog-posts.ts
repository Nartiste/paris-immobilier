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
  {
    slug: "palmares-villes-ou-il-fait-bon-vivre-pres-de-paris-2026",
    title: "Le palmarès 2026 : les villes où il fait bon vivre près de Paris",
    description:
      "On a passé 80 communes au crible avec 6 critères pondérés. Voici notre classement honnête des villes franciliennes et limitrophes où la vie tient vraiment ses promesses en 2026.",
    publishedAt: "2026-05-04",
    readingMinutes: 8,
    category: "guide",
    brief: {
      audience:
        "Parisien 30-50 ans qui réfléchit à son déménagement, intéressé par les classements 'qualité de vie' (palmarès JDD, Le Figaro). Veut un avis indépendant qui ne se contente pas de relayer le palmarès officiel.",
      angle:
        "Construire notre propre palmarès 2026 sur 6 critères pondérés (prix m², trajet Paris, qualité de vie, économie, école, futur transport). Comparer aux résultats du palmarès officiel JDD/L'Internaute (Boulogne 20e nationale, Versailles 22e, Courbevoie 23e). Expliquer où on est d'accord, où on diverge, et pourquoi.",
      sections: [
        {
          titre: "Pourquoi un nouveau palmarès",
          contenu:
            "Reconnaître l'existence du palmarès 'Villes et villages où il fait bon vivre' (197 critères). Expliquer ses limites pour un Parisien : il ne pondère pas le trajet vers Paris, il ne tient pas compte du Grand Paris Express, il met sur le même plan une commune francilienne et une commune au fin fond du Cantal. Notre approche : 6 critères seulement, pondérés selon ce qui compte vraiment pour quelqu'un qui veut rester dans l'orbite de Paris.",
        },
        {
          titre: "Notre méthodologie en 6 critères",
          contenu:
            "Détail des 6 critères pondérés : prix médian m² (DVF, transactions réelles), temps de trajet vers Paris (porte-à-porte SNCF/IDFM), qualité de vie (espaces verts, criminalité, services), économie locale (revenu médian, chômage), éducation (densité et qualité des établissements), bonus Grand Paris Express. Pondération neutre par défaut, ajustable par l'utilisateur via le comparateur.",
        },
        {
          titre: "Le top 5 ouest-parisien",
          contenu:
            "Versailles, Saint-Germain-en-Laye, Vincennes, Saint-Mandé, Boulogne-Billancourt. Pour chacun, 2-3 phrases avec score, prix m², trajet et l'argument différenciant.",
        },
        {
          titre: "Les 5 surprises de notre classement",
          contenu:
            "Communes qui rankent haut chez nous mais peu connues du grand public : Saint-Maur-des-Fossés, Le Perreux-sur-Marne, Sceaux, Bourg-la-Reine ou similaires. Pour chacun pourquoi notre méthode les met en avant alors qu'elles n'apparaissent pas dans le top 30 du JDD.",
        },
        {
          titre: "Les villes du Grand Paris Express qui montent",
          contenu:
            "Champigny, Bagneux, Issy, Saint-Denis Pleyel : la mise en service fin 2026 va valoriser. Notre score les place où, et pourquoi.",
        },
        {
          titre: "Les villes TGV qui dépassent les attentes",
          contenu:
            "Reims, Le Mans, Tours, Orléans : pour le télétravailleur 3-5j, ces villes pèsent lourd dans notre classement. Comparaison avec une grande couronne IDF mal desservie comme Provins ou Étampes.",
        },
        {
          titre: "Les villes qu'on a rétrogradées",
          contenu:
            "Communes qui rankent haut en moyenne nationale mais mal chez nous parce que le trajet Paris est trop long ou les transports peu fiables. Reconnaître le caractère subjectif de notre angle Parisien.",
        },
        {
          titre: "Comment utiliser notre classement",
          contenu:
            "Insister sur le caractère personnalisable : un investisseur ne pondère pas comme une famille, un télétravailleur 3j ne pondère pas comme un cadre en présentiel. Inviter à utiliser le comparateur pour ajuster.",
        },
      ],
      references: [
        "Versailles",
        "Saint-Germain-en-Laye",
        "Vincennes",
        "Saint-Mandé",
        "Boulogne-Billancourt",
        "Saint-Maur-des-Fossés",
        "Champigny-sur-Marne",
        "Bagneux",
        "Reims",
        "Le Mans",
      ],
    },
  },
  {
    slug: "acheter-immobilier-ile-de-france-2026-attendre-ou-foncer",
    title: "Acheter en Île-de-France en 2026 : faut-il foncer maintenant ou attendre 2027 ?",
    description:
      "Prix en baisse de 5,5 %, volumes au plus bas, taux stabilisés à 3,2 %. On regarde les vrais chiffres pour répondre à la question que tout primo-accédant se pose en 2026.",
    publishedAt: "2026-05-03",
    readingMinutes: 9,
    category: "finance",
    brief: {
      audience:
        "Cadre 30-45 ans, primo-accédant ou en recherche d'une plus grande surface, capacité d'emprunt 250-500 k€, hésite depuis 12-18 mois à passer à l'acte. Lit Capital, Le Particulier, BFM Immo.",
      angle:
        "Trancher honnêtement la question 'faut-il acheter maintenant'. Pas de boule de cristal, pas de promesse, juste les chiffres réels du marché 2026 et un cadre de décision rationnel. Reconnaître le facteur émotionnel : attendre coûte aussi (loyer, opportunité familiale qui ne reviendra pas).",
      sections: [
        {
          titre: "L'état du marché en chiffres",
          contenu:
            "Prix médian petite couronne 4 940 €/m² (baisse de 5,5 % sur 12 mois). Volumes en recul de 11 %. Taux 20 ans stabilisés à 3,2 % (pic à 4,1 % en 2024). BCE : pas de baisse de taux franche attendue avant T3 2026. Conclusion factuelle : on est probablement proche du point bas, pas en plein dedans.",
        },
        {
          titre: "Le scénario 'j'attends 2027'",
          contenu:
            "Hypothèse : prix encore en recul de 3 à 5 % sur 12 mois, taux qui descendent à 2,8 %. Sur 350 k€ empruntés, on gagne environ 15 000 € de capital plus 8 000 € d'intérêts cumulés. Mais 12 mois de loyer en attendant : 15 000 à 20 000 € au mieux. Bilan financier à peu près neutre, surtout négatif émotionnellement (vie qui n'avance pas, famille qui ne s'agrandit pas dans de bonnes conditions).",
        },
        {
          titre: "Le scénario 'je fonce maintenant'",
          contenu:
            "Hypothèse : on prend un bien en 2026 à 5 % en dessous du prix d'il y a un an. Si la baisse continue, on perd environ 15 000 € de valeur sur 12 mois (avec un prêt 25 ans, l'impact est marginal). Mais on commence à amortir, on s'installe, on évite le risque de remontée des taux si le marché bascule plus vite que prévu.",
        },
        {
          titre: "Les pièges à éviter en 2026",
          contenu:
            "Ne pas se laisser convaincre par un promoteur que 'c'est le moment' sur du neuf surcoté. Ne pas croire qu'une remise de 10 % du vendeur compense un bien mal placé. Ne pas oublier les frais cachés (DPE, travaux énergétiques obligatoires depuis la loi 2025). Ne pas négliger la simulation taux/durée : un courtier crédit (Pretto, Meilleurtaux) peut faire gagner 0,2 à 0,4 % sur le taux.",
        },
        {
          titre: "Les communes qui résistent et celles qui dégringolent",
          contenu:
            "Boulogne, Neuilly, Vincennes : prix stables (perte de 1 à 2 % seulement). Aubervilliers, Saint-Denis : recul de 8 à 12 %. Champigny et autres communes Grand Paris Express : -3 à -6 % avec un rebond probable post-ouverture. Choisir selon profil : valorisation patrimoniale ou pari sur la plus-value GPE.",
        },
        {
          titre: "Comment décider en 30 minutes",
          contenu:
            "Grille de décision en 5 questions : projet de vie stable sur 7-10 ans, capacité d'emprunt validée par un courtier, bien identifié qui correspond aux critères, marge de négociation sur le prix, taux sécurisable maintenant. Si oui à 3 critères sur 5 : feu vert. Sinon, attendre et utiliser les mois pour préparer le dossier.",
        },
        {
          titre: "Le rôle du courtier en 2026",
          contenu:
            "Pourquoi un courtier crédit est plus pertinent que jamais : marché concurrentiel entre banques pour capter les bons dossiers, écart de 0,3 à 0,5 % entre banques selon le profil. Sur 350 k€ × 25 ans, c'est 12 000 à 20 000 € de différence sur le coût total. Le service est en général gratuit pour le client (commission payée par la banque).",
        },
        {
          titre: "Notre verdict en une phrase",
          contenu:
            "Si ton projet est bon, le marché actuel ne te punira pas. Si ton projet est moyen, attendre ne le rendra pas meilleur.",
        },
      ],
      references: [
        "Boulogne-Billancourt",
        "Neuilly-sur-Seine",
        "Vincennes",
        "Aubervilliers",
        "Saint-Denis",
        "Champigny-sur-Marne",
      ],
    },
  },
  {
    slug: "vivre-paris-ou-banlieue-calcul-5-ans",
    title: "Paris ou banlieue : le vrai calcul sur 5 ans",
    description:
      "Loyer, transport, école, voiture, impôts. On simule un couple avec deux enfants à Paris versus en banlieue sur 5 ans, ligne par ligne. Le résultat surprend.",
    publishedAt: "2026-05-02",
    readingMinutes: 9,
    category: "finance",
    brief: {
      audience:
        "Couple 30-40 ans avec 1-2 enfants, locataires à Paris dans un T3 60-70 m², budget familial 7 000-9 000 € par mois après impôts. Hésitent entre rester à Paris ou partir.",
      angle:
        "Faire le vrai calcul que personne ne fait. Tableau ligne par ligne sur 5 ans avec un cas type concret. Pas de réponse universelle, mais avec les vrais chiffres on a au moins une base honnête pour décider.",
      sections: [
        {
          titre: "Le piège du calcul rapide",
          contenu:
            "Beaucoup raisonnent ainsi : 'mon loyer parisien serait 1 500 € moins cher en banlieue donc je gagne 90 000 € sur 5 ans'. C'est faux. Il faut intégrer 8 à 10 lignes que personne ne fait : transport, voiture, école, impôt foncier, garde d'enfants, charges de copropriété, entretien.",
        },
        {
          titre: "Notre cas type : couple, deux enfants, Paris 11e",
          contenu:
            "Configuration : Vincent 36 ans cadre tech 65 k€/an, Marie 34 ans architecte 55 k€, deux enfants 4 et 7 ans. T3 65 m² Paris 11e, loyer 2 350 €/mois. Vincent va au bureau 4j/5, Marie 3j/5. Budget mensuel logement plus transports plus école : environ 3 800 €/mois.",
        },
        {
          titre: "Scénario A : on reste à Paris",
          contenu:
            "Loyer 28 200 €/an. Pass Navigo deux personnes : 2 112 €. Cantine plus crèche/centre aéré : 4 800 €. Activités enfants 2 400 €. Charges 1 800 €. Budget total 5 ans : environ 196 000 € pour le logement et la vie quotidienne (hors alimentation, vacances, impôts). Capital constitué : zéro.",
        },
        {
          titre: "Scénario B : Vincennes (15 minutes en métro)",
          contenu:
            "Achat 80 m² T4 à 8 200 €/m² = 656 000 €. Apport 100 k€. Mensualité crédit plus assurance 25 ans : 2 950 €/mois. Charges copropriété 2 400 €/an. Taxe foncière 1 800 €. Pass Navigo 2 112 €. Cantine et activités 4 800 €. Pas de voiture nécessaire. Budget 5 ans : environ 233 000 € (mais 80 000 € de capital remboursé). Coût net : 153 000 €. Surface gagnée : 15 m².",
        },
        {
          titre: "Scénario C : Versailles (35 minutes en RER)",
          contenu:
            "Achat maison 100 m² T5 avec jardin à 7 400 €/m² = 740 000 €. Apport 100 k€. Mensualité 25 ans : 3 350 €/mois. Taxe foncière 2 400 €. Charges 1 200 €. Une voiture nécessaire (4 200 €/an entre carburant, assurance, entretien). Pass Navigo 2 112 €. Activités et cantine 4 200 €. Budget 5 ans : environ 276 000 € (mais 95 000 € capital remboursé). Coût net : 181 000 €. Surface gagnée : 35 m² plus jardin.",
        },
        {
          titre: "Scénario D : Reims (45 minutes en TGV)",
          contenu:
            "Achat 120 m² T5 avec jardin à 3 000 €/m² = 360 000 €. Apport 50 k€. Mensualité 20 ans : 1 850 €/mois. Taxe foncière 1 500 €. Charges 600 €. Une voiture obligatoire 4 200 €. Abonnement TGV Forfait Liberté Pro pour Vincent (1j/semaine au bureau) : 2 800 €/an. Pass Navigo Marie qui télétravaille à 100 % : 0. Cantine plus activités 3 600 €. Budget 5 ans : environ 177 000 € (mais 60 000 € capital remboursé). Coût net : 117 000 €. Surface gagnée : 55 m² plus jardin.",
        },
        {
          titre: "Le tableau récapitulatif (et ce qu'il dit vraiment)",
          contenu:
            "Récap chiffré : Paris 196 k€ (location, zéro capital), Vincennes 153 k€ net, Versailles 181 k€ net, Reims 117 k€ net. Le moins cher financièrement c'est Reims. Mais Reims = Vincent doit basculer en télétravail quasi-total. Vincennes = +35 minutes par jour de transport sur 5 ans = 280 jours de vie en moins dans les transports. Le calcul financier ne dit pas tout.",
        },
        {
          titre: "Le facteur que les chiffres ratent",
          contenu:
            "Le coût émotionnel et social. Quitter Paris = reconstruire un réseau, perdre la spontanéité culturelle, devoir programmer chaque sortie. Pour certains c'est neutre, pour d'autres c'est un gouffre. Aucun Excel ne le chiffre, mais c'est la vraie variable. Et inversement, à Paris on paie cher pour des avantages dont on profite peu (combien de fois par mois tu vas à un musée, vraiment ?).",
        },
        {
          titre: "Comment faire ton propre calcul",
          contenu:
            "Pas de copier-coller du nôtre. Les variables qui changent tout : nombre d'enfants, télétravail oui/non/combien de jours, voiture déjà possédée ou pas, valeur sentimentale Paris, projet long terme (vente dans 7 ans, transmission, etc.). Le concierge IA peut t'aider à mouliner ton scénario, ou utilise le comparateur pour cadrer 2 villes.",
        },
      ],
      references: [
        "Vincennes",
        "Versailles",
        "Reims",
        "Boulogne-Billancourt",
        "Saint-Maur-des-Fossés",
      ],
    },
  },
  {
    slug: "investir-grand-paris-express-2026-communes-raisonnables",
    title: "Investir avant le Grand Paris Express : les 10 communes encore raisonnables fin 2026",
    description:
      "Ligne 15 Sud plus tronçons 16 et 17 ouvrent fin 2026. Reste-t-il des opportunités d'investissement ou tout est-il déjà intégré dans les prix ? On regarde commune par commune.",
    publishedAt: "2026-05-01",
    readingMinutes: 9,
    category: "tendance",
    brief: {
      audience:
        "Investisseur immobilier 35-55 ans, capacité 250-450 k€, déjà propriétaire de sa résidence principale, cherche un placement locatif avec horizon 8-10 ans. Connaît grossièrement le projet GPE mais veut un état des lieux 2026 honnête.",
      angle:
        "Le GPE est en train de basculer du fantasme au concret. Certaines communes ont déjà tout intégré dans les prix (acheter aujourd'hui = payer le ticket plein). D'autres gardent un potentiel. Approche pragmatique : où il reste de la marge, où c'est trop tard.",
      sections: [
        {
          titre: "Le calendrier 2026 réel",
          contenu:
            "Ce qui ouvre fin 2026 (dates fermes, en construction) : ligne 15 Sud entre Pont-de-Sèvres et Noisy-Champs, tronçon 1 ligne 16 entre Saint-Denis Pleyel et Clichy-Montfermeil, tronçon 1 ligne 17 entre Saint-Denis Pleyel et Le Bourget aéroport. Ce qui suit en 2027-2030 (encore en chantier) : ligne 15 Est et Ouest, ligne 16 complète, ligne 18. Différence majeure : 2026 est sécurisé, 2030+ reste théorique.",
        },
        {
          titre: "Les communes où c'est trop tard",
          contenu:
            "Saint-Denis Pleyel, Bagneux M4, Issy RER, Villejuif IGR : prix au plafond, valorisation déjà encaissée entre 2018 et 2024. Acheter aujourd'hui c'est payer le ticket plein, espérer une plus-value est risqué. Pas de mauvais conseil, juste pas la bonne fenêtre.",
        },
        {
          titre: "Champigny-sur-Marne (ligne 15 Sud)",
          contenu:
            "Prix médian 5 500 €/m². Rendement brut visé 5,5 à 7 %. Profil cible : T2 ou T3 vers la gare Champigny-Centre ou Bry-Villiers-Champigny. Risque : centre encore populaire, certains quartiers à éviter pour le locatif premium. Localisation précise indispensable.",
        },
        {
          titre: "Noisy-le-Grand (ligne 15 Sud, ligne 16)",
          contenu:
            "Prix médian 4 800 €/m². Rendement 5 à 6 %. Profil : T3 dans le quartier Mont d'Est ou Champs. Avantage : déjà desservi par le RER A, le GPE améliore la connexion vers Saint-Denis et l'aéroport CDG. Demande locative solide grâce au pôle universitaire.",
        },
        {
          titre: "Sevran et Aulnay-sous-Bois (ligne 16)",
          contenu:
            "Prix très bas (2 300 à 3 200 €/m²), rendement brut 7 à 8 %. Risque maximal : qualité de vie moyenne, quartiers populaires, rotation locataire élevée, vacance possible entre deux locations. Pour investisseur expérimenté qui sait gérer à distance, pas pour un primo-investisseur.",
        },
        {
          titre: "Rosny-sous-Bois (future ligne 15 Est, 2030)",
          contenu:
            "Prix 4 800 €/m². Rendement 5,5 à 6 %. Pari à plus long terme : la ligne 15 Est ouvre 2030, donc 4 ans à attendre. Mais le marché n'a pas encore intégré la valorisation. Acheter en 2026 = potentiellement 10 à 15 % de moins que le prix probable 2030. Risque : retard du projet.",
        },
        {
          titre: "Champigny et Bry-Villiers : les vrais candidats fin 2026",
          contenu:
            "Pour les 12 à 18 prochains mois, ces deux gares ouvrent fin 2026 et restent encore relativement 'oubliées' du grand public. Profil acheteur type : T2 60 m² à 280-340 k€, loyer attendu 1 050-1 200 €, rendement brut 5,5 à 7 %. Fenêtre d'opportunité avant l'effet d'ouverture officielle.",
        },
        {
          titre: "Le piège du neuf en zone GPE",
          contenu:
            "Promoteurs qui survendent l'effet GPE pour justifier 8 000 €/m² sur des programmes neufs alors que l'ancien rénové dans la même rue est à 5 000 €/m². Acheter neuf en zone GPE en 2026 = payer une prime de 25 à 40 % très difficile à rentabiliser. La plus-value GPE compense rarement cet écart de départ.",
        },
        {
          titre: "Comment éviter de se planter",
          contenu:
            "Visiter la gare réelle (pas le rendu sur le site officiel). Vérifier la date d'ouverture officielle directement chez la Société du Grand Paris. Consulter les permis de construire alentour pour éviter les mauvaises surprises (immeubles qui pousseront devant ta vue). Regarder les transactions DVF des 6 derniers mois sur la rue ciblée. Privilégier l'ancien rénové vs le neuf de promoteur.",
        },
        {
          titre: "Notre verdict opérationnel",
          contenu:
            "GPE 2026-2027 : Champigny et Bry-Villiers offrent encore un ratio risque-rendement intéressant. GPE 2030+ : Rosny-sous-Bois est le pari à 4 ans pour les patients. Tout le reste : trop tard ou trop risqué. Et toujours valider la commune avec un courtier crédit (Pretto, Meilleurtaux) avant de s'engager.",
        },
      ],
      references: [
        "Champigny-sur-Marne",
        "Noisy-le-Grand",
        "Aulnay-sous-Bois",
        "Saint-Denis",
        "Bagneux",
        "Villejuif",
      ],
    },
  },
  {
    slug: "quitter-paris-teletravail-rythme-deux-quatre-cinq-jours",
    title: "Télétravail 2 jours, 4 jours, 5 jours : à partir de quel rythme tu peux quitter Paris ?",
    description:
      "Le rayon géographique acceptable change radicalement selon que tu vas au bureau 2 ou 4 jours par semaine. Trois scénarios chiffrés pour décider sans se planter.",
    publishedAt: "2026-04-30",
    readingMinutes: 8,
    category: "persona",
    brief: {
      audience:
        "Cadre 30-45 ans en télétravail hybride 2-3 jours par semaine, qui se demande jusqu'où il peut s'éloigner de Paris. Connaît son rythme de présentiel mais n'a pas fait le calcul concret du coût et du temps réellement passé.",
      angle:
        "Le télétravail n'est pas binaire. Entre 2 jours par semaine au bureau et 100 % remote, tout change : rayon géographique, type de transport possible, économies d'achat, fatigue accumulée. Trois scénarios précis pour aider à projeter la décision.",
      sections: [
        {
          titre: "Le faux débat 'télétravail oui ou non'",
          contenu:
            "La vraie question n'est pas 'puis-je télétravailler' mais 'combien de jours, et avec quelle régularité ?'. Un télétravail 2j/semaine plus venir un vendredi exceptionnel n'est pas la même contrainte qu'un présentiel obligatoire 4j fixe avec réunions clients qui peuvent tomber un mardi imprévu.",
        },
        {
          titre: "Scénario A : présentiel 4-5 jours par semaine",
          contenu:
            "Rayon acceptable : 30 à 45 minutes maximum porte-à-porte. Tu restes en petite couronne (Boulogne, Vincennes, Issy, Saint-Maur, Sceaux) ou grande couronne très bien desservie (Versailles, Saint-Germain, Sartrouville, Le Vésinet). Au-delà de 45 minutes × deux trajets × 4 jours = 6 heures dans les transports par semaine. Au-delà, tu craques en 18 mois.",
        },
        {
          titre: "Scénario B : hybride 2-3 jours par semaine",
          contenu:
            "Rayon acceptable : 1 heure à 1h15. Cela débloque la grande couronne IDF (Mantes-la-Jolie, Provins, Fontainebleau, Étampes) et la première couronne TGV/Intercités (Reims 46 minutes, Le Mans 55 minutes, Vendôme 42 minutes, Tours 1h05). Le calcul change : 8 à 12 trajets par mois, abonnement TGV pertinent (Forfait Liberté Pro à 250 €/mois). Tu gagnes en surface, en jardin, en calme.",
        },
        {
          titre: "Scénario C : remote total avec 1-2 visites par mois",
          contenu:
            "Rayon acceptable : tout l'arc Paris-1h30 à 2h en TGV. Reims, Tours, Lyon en 2h, Strasbourg, Bordeaux. Mais attention : à ce niveau d'autonomie, ce n'est plus 'quitter Paris', c'est 'choisir une nouvelle vie en province'. Ne sous-estime pas le coût social (réseau pro qui s'étiole, FOMO sur les opportunités spontanées qui ne reviendront pas).",
        },
        {
          titre: "Le piège du télétravail 'théorique'",
          contenu:
            "Beaucoup de boîtes ont une politique 2j télétravail mais en pratique : réunions imprévues, événements client, séminaires obligatoires. Avant de t'éloigner, demande-toi quelle marge de manœuvre tu as vraiment. Test concret : compte tes jours de présentiel sur les 3 derniers mois passés. Si c'est 3,5 alors que ta politique dit 2, tu es à risque. Anticipe.",
        },
        {
          titre: "Le coût caché des trajets longs",
          contenu:
            "Un Reims-Paris en TGV 1ère classe Pro coûte 250 €/mois pour 8 à 10 trajets. Mais il faut ajouter la fatigue. Dormir mal le jeudi soir parce que tu rentres en TGV tardif = productivité moindre vendredi = encore 1-2 ans avant que tu réalises que ça ne marche pas. Anticipe la sortie : test 2-3 mois en location avant de signer un achat.",
        },
        {
          titre: "L'angle financier",
          contenu:
            "À budget équivalent (logement plus transport sur 5 ans), un appart Paris à 600 k€ = une maison à Reims 360 k€ + 5 ans d'abonnement TGV (15 k€) + voiture (20 k€). Reste 200 k€ d'écart. Si tu peux supporter le rythme, c'est une transformation patrimoniale majeure. Si tu ne peux pas, c'est juste une fausse bonne idée que tu paieras en stress.",
        },
        {
          titre: "Notre top par scénario",
          contenu:
            "Présentiel régulier : Vincennes, Saint-Maur, Boulogne. Hybride 2-3j : Mantes-la-Jolie, Versailles, Reims, Le Mans, Vendôme. Remote total avec quelques visites : Tours, Lyon, Bordeaux, Nantes. Pour chacun, une ligne de pourquoi.",
        },
        {
          titre: "L'erreur classique à ne pas faire",
          contenu:
            "Sous-estimer ta tolérance à la routine. Beaucoup pensent qu'ils tolèreront 1h de TGV 2 fois par semaine sans problème. La vérité : à mois 6, tu adores. À mois 18, tu commences à râler. À mois 36, tu pars. Avant d'acheter à 1h+ de Paris, fais un test de 2-3 mois en location ou Airbnb pour valider en conditions réelles. Ça coûte 4-6 k€ mais ça t'évite une erreur à 50-100 k€.",
        },
      ],
      references: [
        "Vincennes",
        "Boulogne-Billancourt",
        "Saint-Maur-des-Fossés",
        "Mantes-la-Jolie",
        "Versailles",
        "Reims",
        "Le Mans",
        "Tours",
        "Vendôme",
      ],
    },
  },
  {
    slug: "acheter-pres-de-paris-2026-guide",
    title: "Acheter près de Paris en 2026 : le guide pour ne pas se planter",
    description:
      "Budget, transport, négo, frais cachés, neuf vs ancien : un manuel d'action pour acheter en banlieue parisienne en 2026 sans tomber dans les pièges classiques.",
    publishedAt: "2026-05-07",
    readingMinutes: 9,
    category: "guide",
    brief: {
      audience:
        "Cadre 30-45 ans, primo-accédant ou achat d'un bien plus grand, capacité d'emprunt 250-500 k€, jamais acheté en IDF, peur de se planter sur le quartier ou les frais cachés. Lit Capital, Le Particulier, BFM Immo. A déjà fait 2-3 visites mais hésite à passer à l'acte.",
      angle:
        "Guide opérationnel étape par étape pour acheter près de Paris en 2026. Pas un palmarès, un manuel d'action. Aborder les vraies questions : combien je peux mettre, où acheter selon mon métier, comment vérifier un bien, négocier en marché baissier, frais que personne ne calcule. Honnête sur les pièges des promoteurs et le neuf surcoté.",
      sections: [
        {
          titre: "Le vrai budget que tu peux mettre",
          contenu:
            "Capacité d'emprunt à 35 % d'endettement, apport minimum 10 % en 2026 (vs 8 % en 2024), frais de notaire (7-8 % ancien, 2-3 % neuf), frais d'agence 4-7 %. Calcul concret pour un cadre Parisien à 75 k€/an : capacité brute environ 320 k€, capacité réelle (après apport et frais) 290 k€. Inclure travaux probables 15-30 k€ si bien ancien.",
        },
        {
          titre: "Où acheter selon ton métier",
          contenu:
            "Cadre tech / startup : ouest et nord-ouest (Boulogne, Issy, Levallois, Asnières), accès rapide aux pôles tech. Fonction publique / culturel : 11e parisien, Vincennes, Saint-Maur, axé RER A. Finance / banque : ouest 1ère couronne (Neuilly, Boulogne, Saint-Cloud, Suresnes), accès La Défense. Métiers créatifs : Pantin, Montreuil, Saint-Ouen, communes en gentrification rapide. Justification : minimiser le temps trajet bureau et la fatigue accumulée.",
        },
        {
          titre: "Vérifier la desserte avant de signer",
          contenu:
            "La gare est à 800 m sur Google Maps mais 12 minutes à pied avec une côte. Le RER B affiche 15 min de Paris mais ponctualité à 78 %. Test concret : faire le trajet 8h un mardi matin et 18h30 un jeudi soir, pendant 3 semaines avant de signer. Vérifier les statistiques officielles ponctualité IDF Mobilités. Et anticiper : si la commune dépend du Grand Paris Express qui ouvre en 2027-2030, ne pas surpayer en 2026 sur la promesse.",
        },
        {
          titre: "Diagnostiquer un bien : ce qui se voit et ce qui se cache",
          contenu:
            "Le visible : DPE, copropriété, fissures, humidité. L'invisible : sinistralité du quartier (police municipale), projet de construction voisin (consulter le PLU à la mairie), travaux de copro votés non encore facturés (faire demander le PV des 3 dernières AG). Frais cachés à anticiper : 5 000 à 15 000 € de travaux énergétiques obligatoires sur DPE F-G d'ici 2028.",
        },
        {
          titre: "Le piège du neuf vs ancien rénové",
          contenu:
            "Le neuf en banlieue parisienne se vend 25-40 % plus cher que l'ancien rénové dans la même rue. Les arguments des promoteurs (frais notaire réduits, RT2020, pas de travaux) ne compensent que rarement cet écart de prix d'achat. Sauf cas spécifiques (PTZ, dispositifs Pinel/Loc'Avantages bien dimensionnés), l'ancien rénové reste plus rentable. Calcul à faire : sur 25 ans, écart neuf/ancien = 80-150 k€.",
        },
        {
          titre: "Négocier en 2026 : un marché qui te laisse de la marge",
          contenu:
            "Volume des transactions en baisse de 11 %, prix médian -5,5 %. Le rapport de force a basculé côté acheteur. Mais les vendeurs sont en déni : 70 % affichent encore un prix 2022. Stratégie : faire une offre 8-12 % en dessous du prix affiché, motivée par les comparables DVF des 6 derniers mois. Sur 350 k€ affichés, viser 310-320 k€. Si refus net : passer au bien suivant. Le marché est lent, tu as le temps.",
        },
        {
          titre: "Les frais cachés à anticiper",
          contenu:
            "Au-delà des frais de notaire et d'agence : caution bancaire 0,5-1 % vs hypothèque 1,5-2 %. Frais courtier crédit (Pretto, Meilleurtaux) : 0,5-1 % parfois offerts. Garantie décennale et assurance dommage-ouvrage si travaux importants : 2 000-4 000 €. Frais de copropriété 6-12 mois d'avance. Travaux énergétiques obligatoires si DPE F-G : 8 000-25 000 € selon surface. Compte 2-4 % du prix affiché en frais imprévus.",
        },
        {
          titre: "Le bon timing dans l'année",
          contenu:
            "Décembre-janvier : fenêtre de négociation maximale. Vendeurs qui veulent boucler avant l'année fiscale, acheteurs en pause. Tu peux gratter 5-8 % de plus qu'en mai. Mai-juin : pic d'offre, tu choisis mais tu paies plein tarif. Septembre : retour des familles, demande qui repart. Le pire moment pour acheter : avril, où les prix repartent après le creux hivernal.",
        },
        {
          titre: "Le rôle décisif du courtier",
          contenu:
            "En 2026, l'écart entre banques sur le taux atteint 0,3-0,5 % selon ton profil. Sur 350 k€ × 25 ans, c'est 12-20 k€ de différence. Un courtier crédit (Pretto, Meilleurtaux, Empruntis) compare 15-25 banques en 48h. Le service est gratuit pour toi (commission payée par la banque). À ne pas confondre avec courtier en assurance ou courtier en travaux. Spécifique au crédit immobilier.",
        },
        {
          titre: "Notre check-list avant de signer",
          contenu:
            "Capacité validée par courtier. Bien visité 2 fois minimum dont une avec un proche du métier (architecte, BTP). Trajet bureau testé en conditions réelles. PV de copro consulté. DVF des 6 derniers mois sur la rue. Diagnostic énergétique vérifié et travaux chiffrés. Offre écrite 8-12 % sous le prix affiché. Compromis avec 30 jours de rétractation. Pas de précipitation, le marché t'attend.",
        },
      ],
      references: [
        "Boulogne-Billancourt",
        "Issy-les-Moulineaux",
        "Levallois-Perret",
        "Vincennes",
        "Saint-Maur-des-Fossés",
        "Pantin",
        "Montreuil",
      ],
    },
  },
  {
    slug: "investir-immobilier-pres-de-paris-2026",
    title: "Investir près de Paris en 2026 : où et comment, sans se faire avoir",
    description:
      "Locatif, LMNP, Pinel, Loc'Avantages, courte durée. On démêle les vraies opportunités d'investissement immobilier en Île-de-France, et les pièges des promoteurs.",
    publishedAt: "2026-05-08",
    readingMinutes: 9,
    category: "tendance",
    brief: {
      audience:
        "Investisseur immobilier 35-55 ans, déjà propriétaire de sa résidence principale, capacité 200-400 k€ pour un placement locatif, horizon 8-15 ans. Veut diversifier son patrimoine. Connaît les bases mais se méfie des dispositifs marketés (Pinel sur du neuf surcoté).",
      angle:
        "Guide général d'investissement locatif en Île-de-France 2026. Distinguer les vraies opportunités (proche couronne, communes Grand Paris Express, ancien rénové) des pièges classiques (neuf surcoté en zone B1, défisc trompeuse, gestion catastrophique à distance). Approche honnête, données réelles, pas de promesse miraculeuse.",
      sections: [
        {
          titre: "Pourquoi l'IDF reste un bon pari malgré le marché 2026",
          contenu:
            "Le marché IDF est en correction (prix -5,5 %, volumes -11 %) mais les fondamentaux locatifs restent solides : tension locative durable (1,4 logement pour 1 demande active à Paris, 1,2 en proche couronne), salaires médians 30 % au-dessus du national, croissance démographique nette. La baisse des prix d'achat sans baisse équivalente des loyers améliore le rendement à l'achat aujourd'hui. C'est une fenêtre, pas un effondrement.",
        },
        {
          titre: "Choisir entre neuf et ancien : le calcul honnête",
          contenu:
            "Neuf : frais notaire 2-3 %, RT2020, pas de travaux 10 ans. Ancien : prix 25-40 % moins cher, frais notaire 7-8 %, travaux probables. Sur 10 ans, l'ancien rénové bat le neuf de 80-150 k€ sur un investissement 300 k€, sauf si le neuf est en dispositif Pinel ou Loc'Avantages bien calé. Le neuf en lot promoteur sans dispositif fiscal : presque jamais rentable en IDF en 2026.",
        },
        {
          titre: "Les zones à rendement (>6 %) et leurs risques",
          contenu:
            "Aubervilliers 6-7 %, Sevran 7-8 %, Drancy 6,5-7,5 %, Mantes-la-Jolie 6-7 %, Champigny 5,5-7 %. Risques : qualité de vie moyenne, rotation locataires élevée, vacance entre deux locations, parfois dégradations, gestion plus exigeante. Pour investisseur expérimenté qui sait gérer à distance ou via une bonne agence locale. À éviter pour un primo-investisseur.",
        },
        {
          titre: "Les zones à plus-value patrimoniale",
          contenu:
            "Boulogne-Billancourt, Vincennes, Issy-les-Moulineaux, Saint-Mandé, Levallois : rendements faibles (3,5-4,5 % bruts) mais valorisation patrimoniale solide sur 10-15 ans (+25-40 % historique). Profil cible : investisseur patrimonial, pas en chasse de cash-flow. Idéal pour défiscaliser via LMNP ou pour transmission successorale future.",
        },
        {
          titre: "LMNP vs nu : quel statut selon profil",
          contenu:
            "LMNP (Loueur Meublé Non Professionnel) : amortissement comptable, charges déductibles, fiscalité douce. Convient aux investisseurs avec tranche IR 30 % et plus, ou qui visent du locatif court séjour (étudiant, jeune actif). Location nue : simplicité administrative, déficit foncier intéressant si gros travaux. Convient aux investisseurs en tranche IR 11 %, ou qui veulent louer à un public stable longue durée.",
        },
        {
          titre: "Vrai/faux des dispositifs : Pinel, Loc'Avantages, Denormandie",
          contenu:
            "Pinel : terminé pour les nouvelles acquisitions depuis fin 2024 (sauf cas marginaux 2025). Loc'Avantages : intéressant si plafond loyer compatible avec le marché local (souvent vrai en grande couronne, faux en petite couronne). Denormandie : ancien à rénover en zone éligible. Prudence : un dispositif fiscal ne sauve jamais un mauvais investissement. Le bien doit être bon avant la défisc.",
        },
        {
          titre: "Gérer à distance ou agence : les vrais chiffres",
          contenu:
            "Gestion personnelle : 5-10 h/mois moyennes, charge mentale élevée, pas de coût direct mais perte temps. Agence locale : 6-9 % des loyers TTC. Comparaison brute : sur un bien à 12 000 € de loyers/an, agence = 720-1 080 € /an. À arbitrer selon ta valeur horaire et ta tolérance à l'imprévu (impayés, dégâts, états des lieux ratés).",
        },
        {
          titre: "Le piège des promoteurs et comment l'éviter",
          contenu:
            "Promoteurs qui survendent l'effet GPE pour justifier 25-40 % de surprix sur du neuf. Promesses de loyer garanti 3 ans avec une 'gestion' qui prend 30 %. Faux 'investissement clé-en-main' où on signe sans avoir comparé avec l'ancien rénové de la même rue. Règle : toujours vérifier les transactions DVF des 12 derniers mois sur la rue exacte, et les loyers réels via SeLoger / LocService dans le quartier.",
        },
        {
          titre: "Notre stratégie en 3 lignes",
          contenu:
            "Si tu cherches du rendement (>6 %) : Aubervilliers, Champigny, Mantes-la-Jolie, mais expérience requise. Si tu cherches de la plus-value patrimoniale (3-5 %) : ouest 1ère couronne, achat ancien rénové. Si tu n'es pas sûr : commence par un T2 60 m² ancien rénové en RER A ou métro 14 desservi, c'est le compromis qui te plante le moins.",
        },
      ],
      references: [
        "Aubervilliers",
        "Sevran",
        "Mantes-la-Jolie",
        "Champigny-sur-Marne",
        "Boulogne-Billancourt",
        "Vincennes",
        "Issy-les-Moulineaux",
        "Levallois-Perret",
      ],
    },
  },
  {
    slug: "investir-a-paris-2026-quartiers-rentables",
    title: "Investir à Paris en 2026 : 5 quartiers encore rentables, 15 à éviter",
    description:
      "Paris intra-muros n'est plus rentable en locatif classique (rendement 2-3 %). Mais certains quartiers gardent un sens patrimonial. La carte honnête arrondissement par arrondissement.",
    publishedAt: "2026-05-09",
    readingMinutes: 9,
    category: "tendance",
    brief: {
      audience:
        "Investisseur expérimenté 40-60 ans, capacité 400-800 k€, cherche un placement Paris pour valeur patrimoniale ou prestige. Ou primo-investisseur qui pense que 'Paris c'est le must'. Veut un avis honnête, pas un argumentaire commercial.",
      angle:
        "Casser le mythe : Paris intra-muros n'est plus rentable en locatif classique. Rendements bruts 2-3 %, donc nets souvent négatifs après charges et impôts. Mais reste pertinent pour patrimoine + plus-value sur 10-15 ans, ou pour locatif courte durée (LMNP touriste). Carte précise quartier par quartier.",
      sections: [
        {
          titre: "Le mythe de Paris-rentable : les vrais chiffres 2026",
          contenu:
            "Prix médian Paris 9 520 €/m². Loyer médian 32 €/m². Rendement brut moyen 2,8 %. Après charges, taxe foncière, vacance, impayés et fiscalité IRPP+CSG, le rendement net descend souvent à 0,5-1,2 %. Conclusion : si tu cherches du cash-flow, Paris intra-muros n'est pas la bonne réponse en 2026.",
        },
        {
          titre: "Pourquoi continuer à acheter à Paris quand même",
          contenu:
            "Trois raisons valables : 1) Plus-value patrimoniale historique (+25-40 % sur 10 ans, malgré les corrections). 2) Liquidité maximale (revente en 30-45 jours possible vs 90-180 j en banlieue). 3) Transmission successorale (Paris résiste mieux aux cycles). Pour un investisseur en logique long terme, c'est défendable. Pour quelqu'un qui veut du rendement, non.",
        },
        {
          titre: "Les 5 quartiers encore pertinents",
          contenu:
            "1) 11e arrondissement (Bastille, Roquette) : prix 9 800-10 500 €/m², rendement 3-3,5 %, jeunesse + dynamisme commerces, valeur sûre. 2) 18e (Lamarck, Jules Joffrin) : 8 200-9 500 €/m², rendement 3,2-3,8 %, gentrification active. 3) 12e Sud (Bercy, Daumesnil) : 9 500-10 500 €/m², rendement 3-3,4 %, Bois de Vincennes + futur RER E. 4) 19e (Buttes-Chaumont) : 8 000-9 000 €/m², rendement 3,5-4 %, sous-coté historique. 5) 13e Est (Olympiades) : 8 800-9 800 €/m², population jeune et active, rendement 3,2-3,7 %.",
        },
        {
          titre: "Les arrondissements à éviter en 2026",
          contenu:
            "1er-2e-3e-4e : prix prohibitifs (12 000-16 000 €/m²), rendements <2 %. 7e-8e-16e : valeur prestige mais rendement 1,5-2,5 %, locataires très exigeants, nombreuses normes locales. 5e-6e : étudiants en repli (campus délocalisés), vacance qui monte. 9e-10e : marché stable mais sans potentiel de hausse à court terme. 14e Sud, 15e : trop chers pour le rendement obtenu. 17e Nord (Batignolles) : valorisation déjà encaissée 2018-2024.",
        },
        {
          titre: "LMNP courte durée : le pari Paris",
          contenu:
            "AirBnB classique : règlement strict (120 jours/an max sur résidence principale, déclaration mairie obligatoire), risque de réquisition Olympique partagée. Mais résidence service (étudiante, sénior, tourisme d'affaires) : plus stable. Rendements bruts 5-7 % sur résidence service de qualité. Caveat : le Plan Logement de la Ville de Paris durcit les règles tous les 2 ans, vérifier la conformité avant achat.",
        },
        {
          titre: "Saint-Ouen et Pantin : Paris extra-muros qui se comporte comme Paris",
          contenu:
            "Saint-Ouen (93) prix 6 800-8 500 €/m², rendement 4-5 %, métro 14 prolongé 2024, gentrification Marché aux Puces, profil locataire jeune actif. Pantin (93) prix 6 200-7 800 €/m², rendement 4,2-5,2 %, métro 5 + RER E + futur tram. Pour un investisseur 'fan de Paris' qui ne peut plus se l'offrir, ces deux communes sont le meilleur compromis qualité de vie / rendement / valorisation.",
        },
        {
          titre: "L'arbitrage Paris vs proche couronne pour patrimoine",
          contenu:
            "Avec 600 k€, tu as à Paris un T2 60 m² 11e ou un T3 75 m² 19e. Pour le même budget en proche couronne ouest (Boulogne, Vincennes), tu as un T3 75 m² ou un T4 90 m². Sur 10 ans, la valorisation est comparable mais le rendement banlieue est 1,5-2 points au-dessus. Conclusion : pour patrimoine pur, Paris reste valide. Pour rentabilité plus valorisation, Vincennes ou Boulogne battent Paris.",
        },
        {
          titre: "Le piège de l'achat 'sentimental'",
          contenu:
            "Beaucoup d'investisseurs achètent à Paris parce que 'ça fait bien' ou parce qu'ils veulent un pied-à-terre. Si c'est ta motivation, sois honnête sur le calcul : tu paies un coût d'opportunité de 50-80 k€ sur 10 ans vs un placement banlieue ou bourse. Pas grave si tu l'assumes. Grave si tu te racontes que c'est un bon investissement.",
        },
        {
          titre: "Notre conseil opérationnel",
          contenu:
            "Tu veux Paris pour patrimoine et tu acceptes 0,5-1 % de rendement net : 11e, 18e, 12e Sud, 19e. Tu veux Paris-feeling avec 4-5 % de rendement : Saint-Ouen ou Pantin (techniquement 93 mais culturellement Paris). Tu veux Paris pour la performance financière : tu n'investis pas à Paris en 2026.",
        },
      ],
      references: [
        "Saint-Ouen",
        "Pantin",
        "Boulogne-Billancourt",
        "Vincennes",
      ],
    },
  },
  {
    slug: "acheter-a-paris-2026-arrondissements-strategies",
    title: "Acheter à Paris en 2026 : prix par arrondissement et stratégies pour primo-accédants",
    description:
      "Marché en correction de 5,5 %, taux stabilisés à 3,2 %. C'est probablement le meilleur moment Paris depuis 2018. Quel arrondissement, quel quartier, quels pièges.",
    publishedAt: "2026-05-10",
    readingMinutes: 9,
    category: "guide",
    brief: {
      audience:
        "Cadre 35-50 ans ou profession libérale, capacité d'emprunt 500-1 M€, veut acheter à Paris pour des raisons de vie ou pro (proche bureau, école enfants, attache). Jamais acheté à Paris auparavant. Hésite entre arrondissements, type de bien (haussmannien vs récent), étage.",
      angle:
        "2026 est une fenêtre rare pour acheter à Paris. Marché à -5,5 %, taux stabilisés. Mais Paris reste cher : 9 520 €/m² médian. Le guide opérationnel : arrondissement par arrondissement, quoi viser, quoi éviter, comment négocier, les pièges du haussmannien et de la copro.",
      sections: [
        {
          titre: "Pourquoi 2026 est probablement le meilleur moment depuis 2018",
          contenu:
            "Prix Paris -5,5 % sur 12 mois (vs +8 % cumulés en 2020-2022). Volumes -11 %, donc moins de concurrence sur les bonnes affaires. Taux 20 ans stabilisés à 3,2 %. La fenêtre se refermera quand les taux baisseront vers 2,8 % (T3 2026 selon BCE) car la demande repartira. Conclusion : 2026 est le meilleur trimestre depuis 8 ans pour acheter à Paris si on a la capacité.",
        },
        {
          titre: "Les prix 2026 arrondissement par arrondissement",
          contenu:
            "Top 5 par prix médian (en milliers €/m²) : 6e 14,2, 7e 13,8, 4e 13,5, 8e 12,9, 16e 11,8. Médian Paris 9,52. Bas du tableau : 19e 8,1, 13e 8,4, 18e 8,5, 20e 8,6, 12e 9,2. Variation locale énorme : dans le 11e, République à 11 200 €/m² vs Avron à 8 900 €/m². Les arrondissements 'value' : 11e, 12e Sud, 18e, 19e, 20e.",
        },
        {
          titre: "Le 11e, le 18e, le 12e : les arrondissements value",
          contenu:
            "11e : Bastille / Voltaire / Roquette, ambiance jeune dynamique, transports excellents, prix 9 800-11 200 €/m². Bonne réserve de hausse. 12e Sud : Bercy / Daumesnil / Picpus, bois de Vincennes, RER E à venir, 9 200-10 500 €/m², prix sous-cotés. 18e : Lamarck / Jules Joffrin / Pigalle Sud, gentrification active, 8 500-10 200 €/m², dynamique très favorable.",
        },
        {
          titre: "Les arrondissements premium",
          contenu:
            "7e (Tour Eiffel, Invalides) : 13 500-15 000 €/m². Pour patrimoine pur ou prestige. Liquidité élevée, valorisation lente mais sûre. 8e : 12 500-14 500 €/m², même logique, plus mixte commerce/résidentiel. 16e : 11 500-13 000 €/m², populations établies, transmission patrimoniale. À éviter si tu cherches une plus-value : ces arrondissements ont déjà tout encaissé.",
        },
        {
          titre: "Haussmannien vs récent : ce qu'on ne te dit pas",
          contenu:
            "Haussmannien (avant 1914) : volumes nobles, hauteurs sous plafond 3-3,5 m, parquet, moulures. Inconvénients réels : copropriétés vieillissantes (ravalement obligatoire 200-500 k€ tous les 10 ans, à diviser par nombre de lots), absence d'ascenseur dans les petites copros, isolation thermique souvent classée E-F. Récent (post-1980) : moins de charme mais charges plus prévisibles, ascenseur, parking parfois inclus, DPE C-D. À budget égal, le récent t'offre 5-10 m² de plus pour des charges 30-40 % inférieures.",
        },
        {
          titre: "L'étage et la vue : combien ça vaut vraiment",
          contenu:
            "Étage : un T3 70 m² au 1er sur cour vaut typiquement 8-12 % moins cher que le même bien au 4e. Vue dégagée : prime de 5-15 % vs vis-à-vis. Ascenseur dans un immeuble haussmannien : prime 6-10 %. À l'inverse, RDC sur rue commerçante : décote 10-15 % (bruit, sécurité). À calibrer selon ton mode de vie, ne pas surpayer la vue 'parce que c'est joli'.",
        },
        {
          titre: "La copropriété : le facteur que personne ne regarde assez",
          contenu:
            "Le PV des 3 dernières AG est la lecture la plus rentable de ta vie d'acheteur. Tu y vois : travaux votés non payés, conflits voisinage, gestion calamiteuse, ravalement à venir, fonds de roulement, impayés. Une copro à 12 lots avec impayés de 30 % = bombe à retardement. Une copro à 80 lots bien gérée = sérénité. Demander toujours le PV avant offre, pas après.",
        },
        {
          titre: "Stratégies primo-accédant à Paris",
          contenu:
            "PTZ : disponible pour primo-accédants en zone A bis (Paris) sous conditions de revenu, jusqu'à 100 000 € à taux zéro. Loi Pinel ancienne : terminée en 2024 pour le neuf. ZBL (Zone B Loi) : pas applicable Paris. Stratégie pertinente : viser le T3 60-70 m² dans 11e/12e/18e à 600-700 k€, profiter du PTZ + courtier pour optimiser le taux. Anticiper : prévoir une revente / revalorisation horizon 7-10 ans.",
        },
        {
          titre: "Le calendrier idéal en 2026",
          contenu:
            "Janvier-février : creux, négociation maximale (-8 à -12 %). Mai-juin : pic de l'offre, choix élargi mais prix tenus. Septembre-octobre : retour des familles, transactions actives. Décembre : opportunité dernière minute (vendeurs qui veulent boucler avant fiscalité). Le pire moment : avril, prix qui repartent et offre limitée.",
        },
        {
          titre: "Notre verdict en une phrase",
          contenu:
            "Si tu peux mettre 600 k€ et plus, et que tu vises le 11e, 12e Sud, 18e ou 19e en horizon 7-10 ans : 2026 est ta fenêtre. Si tu vises 7e-8e-16e : achète parce que tu en as l'usage, pas pour la performance financière. Si tu hésites encore : prends rendez-vous avec un courtier et fais valider ta capacité avant de chercher un bien.",
        },
      ],
      references: [],
    },
  },
  {
    slug: "credit-immobilier-2026-taux-duree-negociation",
    title: "Crédit immobilier 2026 : taux, durée, négociation, le guide complet",
    description:
      "Taux stabilisés à 3,2 %, banques en concurrence pour capter les bons dossiers. Comment optimiser ton prêt en 2026 et gagner 0,5 point sans te faire avoir.",
    publishedAt: "2026-05-12",
    readingMinutes: 9,
    category: "finance",
    brief: {
      audience:
        "Cadre 30-50 ans qui prépare un achat immobilier 250-600 k€, capacité d'emprunt validée mais pas encore signée chez une banque, hésite sur la durée (20 ou 25 ans), le courtier ou la banque en direct, le taux fixe ou variable.",
      angle:
        "Guide pragmatique pour optimiser un crédit immobilier en 2026. Le marché favorise l'emprunteur (banques en concurrence, taux stables). Comment exploiter cette fenêtre sans tomber dans les pièges du courtier rapace ou de la banque qui te refile une assurance pourrie.",
      sections: [
        { titre: "Les taux 2026 : ce qui se passe vraiment", contenu: "Taux moyens 20 ans à 3,2 %, fourchette 2,9-3,6 % selon profil. Banque de France anticipe stabilité 2,9-3,4 % sur 12 mois. Pic 4,1 % en mi-2024, on vient de loin. La baisse vers 2,8 % attendue T3 2026 mais incertaine. Conséquence : le marché est dans une fenêtre prévisible, on peut planifier sans paniquer." },
        { titre: "Durée 20 ou 25 ans : le vrai arbitrage", contenu: "Sur 350 k€ empruntés, 20 ans à 3,2 % = mensualité 1 980 €, coût total intérêts 125 k€. 25 ans à 3,3 % = mensualité 1 720 €, coût total 168 k€. Différence 43 k€ d'intérêts mais mensualité 260 € moins lourde. Choisir 25 ans si capacité serrée ou volonté d'investir le delta. Choisir 20 ans si capacité large." },
        { titre: "Apport minimum 2026 : 10 % vs 8 % en 2024", contenu: "Le HCSF a durci les règles : apport minimum 10 % du prix sauf primo-accédant en zone tendue (8 %). Sur 400 k€, c'est 32-40 k€ minimum. Au-delà de 20 %, la banque est plus souple sur les autres critères. Les apports >25 % gagnent 0,15-0,25 point sur le taux." },
        { titre: "Le rôle du courtier : pourquoi en 2026 c'est pertinent", contenu: "Le marché bancaire est ultra-concurrentiel : les banques se battent pour les bons dossiers. Le courtier (Pretto, Meilleurtaux, Empruntis, Cafpi) compare 15-25 banques en 48-72 h. Écart moyen 0,3-0,5 % entre la meilleure et la moins bonne offre. Sur 350 k€ × 25 ans, c'est 12-20 k€ d'économies. Service en général gratuit (commission payée par la banque, pas par toi)." },
        { titre: "Négocier en direct sans courtier : c'est possible si...", contenu: "Tu as déjà une relation longue avec ta banque (10+ ans), un patrimoine déjà chez eux, un dossier impeccable (CDI public ou cadre, 0 découvert sur 12 mois, apport >20 %). Dans ce cas, la banque peut t'aligner sur les meilleures offres du marché. Sinon, courtier obligatoire, sauf si tu veux laisser 10-15 k€ sur la table." },
        { titre: "L'assurance emprunteur : le poste oublié", contenu: "Sur 350 k€ × 25 ans, l'assurance emprunteur représente 25 000 à 50 000 € selon âge et état de santé. La banque te propose son contrat groupe (souvent cher). La loi Lemoine 2022 te permet de résilier et changer à tout moment. Comparer dès le départ avec un assureur externe (April, MetLife, Generali) peut faire gagner 8-15 k€." },
        { titre: "Taux fixe ou variable : pas même débat en 2026", contenu: "En 2026 avec des taux à 3,2 % stables, le variable n'a aucun intérêt sauf cas particulier (vente prévue à 5 ans). Le risque d'un variable qui repart à la hausse à 4,5-5 % en cas de choc inflation est trop important. Verrouille ton fixe et oublie le variable jusqu'à ce que les taux fixes redescendent durablement sous 2,5 %." },
        { titre: "Les frais cachés que tu vas payer", contenu: "Frais de dossier banque : 800-1 500 €. Caution Crédit Logement (alternative à l'hypothèque) : 0,5-1 % du capital, dont 30-40 % récupérables fin de prêt. Hypothèque conventionnelle : 1,5-2 %, non récupérable. Frais courtier : 0,5-1 % parfois offerts. Au total, prévoir 3 000-7 000 € de frais hors notaire pour boucler ton dossier crédit." },
        { titre: "Notre stratégie en 4 étapes", contenu: "1) Faire valider ta capacité par un courtier dès le début (gratuit, sans engagement). 2) Verrouiller ton taux pendant 4 mois (l'accord de principe te le bloque). 3) Négocier l'assurance dès la signature ou dans les 3 mois. 4) Garder la possibilité de renégocier ton crédit dans 18-24 mois si les taux passent durablement sous 2,8 %." },
      ],
      references: ["Boulogne-Billancourt", "Versailles", "Vincennes"],
    },
  },
  {
    slug: "frais-notaire-ile-de-france-2026-vrai-calcul",
    title: "Frais de notaire en Île-de-France 2026 : combien ça coûte vraiment",
    description:
      "7-8 % dans l'ancien, 2-3 % dans le neuf. Mais entre les frais de mutation, les émoluments, les débours et les nouvelles taxes 2026, le calcul réel surprend.",
    publishedAt: "2026-05-13",
    readingMinutes: 8,
    category: "finance",
    brief: {
      audience:
        "Acheteur primo-accédant ou en deuxième acquisition qui découvre que les 'frais de notaire' qu'on lui annonce ne correspondent jamais aux 7-8 % théoriques. Veut comprendre la décomposition pour anticiper le budget réel.",
      angle:
        "Décortiquer ligne par ligne les vrais frais de notaire en 2026 en IDF. Casser les approximations (8 % c'est faux dans le détail), expliquer ce qui revient au notaire vs aux taxes, et montrer comment certaines lignes peuvent être négociées ou réduites.",
      sections: [
        { titre: "Le mythe des 8 % : ce que paie vraiment l'acheteur", contenu: "Sur 400 k€ d'achat dans l'ancien, le total annoncé 'frais de notaire' est environ 30 000-32 000 € (7,5-8 %). Mais sur ces 32 000 €, le notaire ne touche que 4 000-5 000 € en émoluments. Le reste : 24 000-26 000 € de droits de mutation pour l'État et les collectivités, 2 000-3 000 € de débours et formalités." },
        { titre: "Les 4 composantes des frais de notaire", contenu: "1) Droits de mutation (DMTO) : 5,80 % du prix dans la majorité des départements IDF, 4,50 % à Paris intra-muros (taxe modulée). 2) Contribution de sécurité immobilière : 0,10 %. 3) Émoluments du notaire : barème dégressif national, environ 0,80 % sur 400 k€. 4) Débours et formalités : 1 000-2 500 € selon le bien (hypothèques, urbanisme, copropriété)." },
        { titre: "Pourquoi le neuf coûte 2-3 % seulement", contenu: "Dans le neuf (vente en l'état futur d'achèvement, VEFA), les DMTO sont remplacés par la TVA déjà incluse dans le prix d'achat. Du coup, les vrais frais de notaire dans le neuf : 2-3 %, soit 8 000-12 000 € sur 400 k€. Différence entre neuf et ancien : 18-22 000 € de frais en moins, mais le neuf est 25-40 % plus cher au m². Le calcul global penche presque toujours pour l'ancien." },
        { titre: "Cas Paris vs banlieue : 1 700 € d'écart sur 400 k€", contenu: "Paris (75) bénéficie d'un DMTO réduit à 4,50 %. Sur un achat 400 k€, frais de notaire ancien = 28 800 € à Paris vs 30 500 € en banlieue (Hauts-de-Seine, Val-de-Marne, etc.). Léger avantage Paris, qui s'efface vite vu le différentiel de prix au m²." },
        { titre: "Les frais réduits primo-accédant : le cadeau de l'État 2026", contenu: "Loi de finances 2025 : abattement sur les DMTO pour les primo-accédants en zone tendue (Paris + petite couronne) jusqu'à 2 % en moins. Sur 400 k€, économie 8 000 €. Cumul possible avec le PTZ. Conditions : ne pas avoir été propriétaire dans les 24 derniers mois, occuper le bien à titre principal." },
        { titre: "Négocier les émoluments : possible jusqu'à 20 %", contenu: "Depuis 2016, le notaire peut accorder une remise jusqu'à 20 % sur ses émoluments quand le prix dépasse 100 000 €. Sur un achat 500 k€, c'est 800-1 000 € négociables. Demander explicitement : la plupart ne le proposent pas spontanément. Surtout valable si tu apportes plusieurs dossiers (achat+vente, ou famille qui achète aussi)." },
        { titre: "Le débours : la zone grise du devis", contenu: "Les débours (1 500-3 000 € en moyenne) couvrent les frais que le notaire avance pour ton compte : extraits cadastraux, hypothèques, état urbanisme, géomètre éventuel. Demander un devis détaillé : certains notaires gonflent cette ligne. Comparer avec le tarif officiel des actes notariés." },
        { titre: "Comment payer moins, vraiment", contenu: "1) Acheter avec mobilier : déduire la valeur du mobilier du prix soumis aux DMTO (cuisine équipée, électroménager, meubles fixés). Économie 1 500-3 000 € sur 400 k€. 2) Négocier les émoluments si dossier >100 k€. 3) Vérifier l'éligibilité au régime primo-accédant. 4) Acheter dans le neuf si le prix unitaire reste comparable. 5) Choisir un notaire qui pratique la transparence et la concurrence (certaines études 'low cost' existent dans l'IDF)." },
      ],
      references: ["Boulogne-Billancourt", "Vincennes", "Saint-Maur-des-Fossés"],
    },
  },
  {
    slug: "neuf-vs-ancien-banlieue-parisienne-calcul-honnete",
    title: "Maison neuve vs ancien rénové en banlieue : le calcul honnête",
    description:
      "Les promoteurs vendent du neuf 25 à 40 % plus cher que l'ancien rénové. Sur 25 ans, qui gagne vraiment ? On a fait le calcul ligne par ligne.",
    publishedAt: "2026-05-14",
    readingMinutes: 9,
    category: "tendance",
    brief: {
      audience:
        "Acheteur en réflexion entre un programme neuf bien commercialisé et un ancien rénové. Capacité 350-600 k€. A entendu les arguments des promoteurs (frais notaire réduits, RT2020, pas de travaux 10 ans) mais doute sur le calcul global.",
      angle:
        "Comparer honnêtement neuf et ancien rénové sur tous les critères chiffrables : prix d'achat, frais notaire, travaux à venir, performance énergétique, fiscalité, plus-value sur 10 ans. Avec un cas pratique chiffré T3 70 m² dans la même rue.",
      sections: [
        { titre: "Le pitch du promoteur, démonté point par point", contenu: "Argument 1 : 'Pas de travaux 10 ans'. Vrai, mais l'ancien rénové t'évite aussi les travaux structurels 10 ans après une bonne réno. Argument 2 : 'Frais notaire 3 %'. Vrai, mais l'ancien est 25-40 % moins cher au m², le différentiel reste massif. Argument 3 : 'RT2020 c'est ultra performant'. Vrai sur le neuf récent, mais une réno BBC dans l'ancien atteint des perfs proches." },
        { titre: "Cas pratique : Boulogne-Billancourt, T3 70 m²", contenu: "Bien neuf programme : 9 200 €/m² = 644 000 €. Frais notaire 3 % : 19 320 €. Total : 663 320 €. Ancien rénové même rue : 7 800 €/m² = 546 000 €. Frais notaire 8 % : 43 680 €. Travaux résiduels prévus 5 ans : 12 000 €. Total : 601 680 €. Écart : 61 640 € en faveur de l'ancien rénové." },
        { titre: "La performance énergétique : le détail qui change tout", contenu: "Neuf RT2020 : DPE A ou B, consommation 50-75 kWh/m²/an. Charges énergie 600-900 €/an pour 70 m². Ancien rénové BBC : DPE B ou C, consommation 80-120 kWh/m²/an. Charges 900-1 400 €/an. Différence sur 25 ans : 7 500-12 000 €. Réel mais loin de combler les 60 k€ d'écart prix d'achat." },
        { titre: "Les charges de copropriété : le point que les promoteurs cachent", contenu: "Programmes neufs : services premium (concierge, salle de sport, parking automatique), charges 50-80 €/m²/an. Soit 3 500-5 600 €/an pour 70 m². Ancien copropriété classique : charges 25-40 €/m²/an, soit 1 750-2 800 €/an. Différence : 1 750-2 800 €/an × 25 ans = 44 000-70 000 €. Avantage écrasant à l'ancien sur ce poste." },
        { titre: "La plus-value : ce que disent les chiffres réels", contenu: "Étude FNAIM sur 1 200 transactions IDF entre 2014 et 2024 : neuf revendu 5-8 ans après achat = -3 à -5 % vs prix d'achat (la prime promoteur s'efface). Ancien rénové revendu sur même horizon = +12 à +25 % selon localisation. Le neuf revend bien après 12-15 ans, pas avant." },
        { titre: "Quand le neuf est vraiment pertinent", contenu: "1) PTZ + dispositif Loc'Avantages cumulés (rare mais possible). 2) Achat patrimonial très long terme (15+ ans), aversion forte aux travaux. 3) Profil senior qui veut zéro souci, accepte de payer la prime. 4) Investissement locatif avec garantie de loyer 9 ans (Loc'Avantages, ex-Pinel)." },
        { titre: "Quand l'ancien rénové écrase le neuf", contenu: "1) Primo-accédant qui optimise chaque euro. 2) Familles qui veulent du caractère (haussmannien, charme, hauteurs sous plafond). 3) Investisseurs en cash-flow positif. 4) Acheteurs qui prévoient une revente à 7-10 ans. 5) Tous les profils en zone IDF dense (petite couronne) où le différentiel prix est maximal." },
        { titre: "Les pièges spécifiques au neuf en 2026", contenu: "Programmes 'Grand Paris Express' avec surprime de 15-25 % sur la promesse de valorisation : à éviter, l'effet est déjà dans le prix. VEFA en cours de chantier : risque de retard 6-18 mois, voire abandon en cas de défaut promoteur (rare mais arrive). Lots invendus en fin de programme : possibles décotes 8-12 % si patient." },
        { titre: "Notre verdict en une phrase", contenu: "Sauf cas spécifique (PTZ + Loc'Avantages, profil ultra-aversion aux travaux, patrimoine 15+ ans), l'ancien rénové bat le neuf de 40 000 à 80 000 € sur 25 ans en banlieue parisienne en 2026." },
      ],
      references: ["Boulogne-Billancourt", "Vincennes", "Versailles", "Issy-les-Moulineaux"],
    },
  },
  {
    slug: "defiscalisation-immobilier-2026-pinel-loc-avantages-denormandie",
    title: "Défiscalisation immobilière 2026 : Pinel terminé, et après ?",
    description:
      "Pinel s'est arrêté fin 2024. Loc'Avantages, Denormandie, LMNP, déficit foncier : panorama des dispositifs encore actifs pour défiscaliser en Île-de-France.",
    publishedAt: "2026-05-15",
    readingMinutes: 9,
    category: "tendance",
    brief: {
      audience:
        "Investisseur 40-60 ans en tranche IR 30-41 %, déjà propriétaire de sa résidence principale, capacité 200-450 k€ pour un investissement locatif, cherche à réduire son IRPP via l'immobilier.",
      angle:
        "État des lieux complet des dispositifs de défiscalisation immobilière en 2026 après la fin du Pinel. Comparaison ROI (gain fiscal vs contraintes) pour les 4 dispositifs encore actifs. Recommandation par profil et par ville.",
      sections: [
        { titre: "Pinel : pourquoi c'est terminé et qui peut encore en profiter", contenu: "Le Pinel s'est éteint le 31 décembre 2024 pour les nouvelles acquisitions. Les Pinel signés avant cette date continuent leurs avantages fiscaux jusqu'à terme (6, 9 ou 12 ans). Pas de relance prévue malgré le lobbying des promoteurs : Bercy considère que le dispositif coûtait trop cher pour des résultats logement modestes." },
        { titre: "Loc'Avantages : le successeur officieux du Pinel", contenu: "Réduction d'impôt 15 à 65 % du loyer brut selon niveau de loyer plafonné (3 niveaux : intermédiaire, social, très social). Ancien rénové ou neuf. Engagement 6 ans minimum. Sur un T3 65 m² loué 950 €/mois en zone B1 (Reims, Tours), la réduction d'impôt atteint 1 700-2 200 €/an. Cumulable avec le déficit foncier." },
        { titre: "Denormandie : pour les villes moyennes en revitalisation", contenu: "Variante du Pinel pour l'ancien à rénover dans les villes éligibles (action coeur de ville). En IDF : Mantes-la-Jolie, Provins, Meaux, Sens, Évry, Étampes. Réduction 12-21 % du prix d'achat (plafonné 300 k€) sur 6-12 ans, conditionnée à des travaux représentant 25 % du coût total. Idéal pour primo-investisseur qui veut un cash-flow vite positif." },
        { titre: "LMNP : pas un dispositif fiscal mais le statut le plus efficace", contenu: "Loueur Meublé Non Professionnel : tu loues meublé, tu déclares en BIC (régime réel), tu amortis le bien comptablement. Résultat : pendant 15-20 ans, tes revenus locatifs sont fiscalement neutres ou très faibles. Convient à investisseur en tranche IR 30-41 %. Pas de plafond de loyer, pas de zone éligible. Limite : dépôt de garantie réduit (1 mois), durée bail 1 an." },
        { titre: "Déficit foncier : la machine de guerre des gros travaux", contenu: "Si tu achètes ancien à rénover et que tu génères 50 000 € de travaux en année 1, tu peux déduire jusqu'à 10 700 €/an de ton revenu global pendant 4 ans (43 000 € au total). En tranche IR 41 % + CSG 17,2 %, économie d'impôt cumulée : 25 000 €. Reste 25 000 € de déficit reportable sur les revenus fonciers des 10 années suivantes." },
        { titre: "Cas pratique : 350 k€, tranche IR 41 %", contenu: "Scénario A - Loc'Avantages T3 65 m² Reims, prix 200 k€ + travaux 25 k€, loyer plafonné 850 €/mois : réduction d'impôt 1 800 €/an × 9 ans = 16 200 €. Scénario B - LMNP T2 50 m² Vincennes, prix 400 k€, loyer 1 350 €/mois : économie fiscale via amortissement 4 500 €/an × 15 ans = 67 500 €. Scénario C - Déficit foncier ancien à rénover Pantin, 280 k€ + 80 k€ travaux : économie 25 000 € sur 4 ans + plus-value sur 10 ans." },
        { titre: "Quel dispositif pour quel profil", contenu: "Cadre 30-45 ans tranche 30 %, premier locatif : Denormandie ou Loc'Avantages, simplicité maximale. Cadre 45-60 ans tranche 41 %, recherche cash-flow neutre fiscalement : LMNP. Investisseur expérimenté avec capacité travaux : déficit foncier en Petite Couronne (Pantin, Saint-Ouen, Bagneux). Senior 60+ qui veut transmettre : SCI familiale + LMNP combinés." },
        { titre: "Les pièges à éviter en 2026", contenu: "1) Promoteurs qui survendent un 'super-dispositif' inexistant pour caser leur stock invendu (le Pinel ressuscité, ça n'existe pas). 2) Loc'Avantages dans une ville où le loyer plafonné est inférieur au marché : tu perds en cash-flow ce que tu gagnes en impôt. 3) Denormandie sans avoir vérifié la liste exacte des communes éligibles (elle change). 4) LMNP en courte durée saisonnière sans validation du règlement de copropriété." },
        { titre: "Notre recommandation 2026", contenu: "Pour 80 % des investisseurs IDF en 2026, le LMNP en ancien rénové reste le meilleur compromis : pas de zone tendue, pas de plafond de loyer, fiscalité neutre 15+ ans, flexibilité revente. Ajoute du déficit foncier sur tes deux premières années si tu fais des travaux > 30 k€. Réserve Loc'Avantages et Denormandie aux profils ville moyenne ou ultra-cible primo-accédant assistance." },
      ],
      references: ["Reims", "Mantes-la-Jolie", "Vincennes", "Pantin", "Saint-Ouen-sur-Seine"],
    },
  },
  {
    slug: "ptz-2026-ile-de-france-conditions-plafonds",
    title: "PTZ 2026 en Île-de-France : conditions, plafonds, qui peut y prétendre",
    description:
      "Le PTZ a été élargi en 2025 et reste très puissant en zone tendue. Jusqu'à 100 000 € à taux zéro pour primo-accédant. Conditions précises pour 2026.",
    publishedAt: "2026-05-16",
    readingMinutes: 8,
    category: "finance",
    brief: {
      audience:
        "Primo-accédant 25-40 ans, capacité 250-450 k€, salaires 2 SMIC à 4 SMIC, jamais propriétaire, cherche à acheter en zone IDF mais ne sait pas s'il est éligible au PTZ et combien il peut emprunter à taux zéro.",
      angle:
        "Guide pratique du PTZ en Île-de-France pour 2026. Casser les idées reçues (non, ce n'est pas réservé aux modestes), expliquer les vrais plafonds, donner des exemples chiffrés concrets, et lister les pièges de demande.",
      sections: [
        { titre: "Le PTZ, c'est quoi vraiment", contenu: "Prêt à Taux Zéro accordé par l'État, jusqu'à 40 % du montant total de l'opération en zone A bis (Paris + petite couronne), 30 % en zone A et B1. Pas d'intérêts, durée 20-25 ans dont 10-15 ans de différé total (tu ne paies rien les 10 premières années). C'est de l'argent gratuit." },
        { titre: "Les 3 conditions clés en 2026", contenu: "1) Ne pas avoir été propriétaire de sa résidence principale dans les 24 derniers mois. 2) Acheter en résidence principale (pas locatif). 3) Respecter les plafonds de revenus : sous 49 000 € de revenus annuels nets (couple) en zone A bis pour le tranche 1, jusqu'à 79 000 € en tranche 4. Ces plafonds ont été assouplis en 2025." },
        { titre: "Les plafonds montant en zone A bis (Paris + petite couronne)", contenu: "Personne seule : opération maximum 184 000 €, PTZ jusqu'à 73 600 €. Couple : opération max 257 600 €, PTZ jusqu'à 103 040 €. Couple avec 2 enfants : max 322 000 €, PTZ jusqu'à 128 800 €. Couple avec 4+ enfants : max 386 400 €, PTZ jusqu'à 154 560 €. Le PTZ s'ajoute à ton crédit principal (banque traditionnelle), pas à la place." },
        { titre: "Cas pratique : couple 2 enfants, 75 k€/an, achat 350 k€ à Vincennes", contenu: "Profil : tranche 3 du PTZ. PTZ accordé jusqu'à 40 % de 322 000 € = 128 800 €. Reste à financer : 350 000 - 128 800 = 221 200 €. Mensualité PTZ pendant les 15 années de différé : 0 €. Mensualité crédit principal sur 25 ans à 3,2 % : 1 075 €. Économie d'intérêts cumulée vs crédit classique : 38 000 € sur 25 ans. C'est massif." },
        { titre: "Neuf vs ancien : la condition qui change tout en 2026", contenu: "Depuis 2025, le PTZ couvre à nouveau l'ancien (avec ou sans travaux) en zone tendue, en plus du neuf. Avant, il était réservé au neuf. Conséquence : un primo-accédant qui achète un T3 ancien à Saint-Maur-des-Fossés peut désormais cumuler le PTZ avec son crédit principal. Cette extension a été faite pour soutenir l'accession en zone tendue." },
        { titre: "Comment monter le dossier sans se planter", contenu: "1) Récupérer ton avis d'imposition N-2 (PTZ se base sur le revenu fiscal de référence n-2). 2) Demander une simulation chez un courtier qui maîtrise le PTZ (Pretto, Meilleurtaux, en mentionnant explicitement ta volonté d'inclure le PTZ). 3) Obtenir l'accord PTZ AVANT de signer le compromis (sinon tu rates une échéance). 4) Vérifier l'éligibilité du bien (résidence principale, occupation 6+ mois/an)." },
        { titre: "Les pièges et limites en 2026", contenu: "1) Le PTZ baisse ton apport effectif disponible aux yeux de la banque qui finance le reste. Du coup la banque peut être plus prudente. 2) Si tu revends dans les 5 ans, tu dois rembourser le solde du PTZ d'un coup (sauf cas exceptionnel). 3) Si tu loues le bien dans les 6 ans, c'est cause de remboursement immédiat. 4) Le PTZ ne couvre pas les frais de notaire, prévoir l'apport en plus." },
        { titre: "Notre stratégie d'optimisation PTZ", contenu: "Si tu es primo-accédant en zone IDF tendue, le PTZ est un cadeau de 25 000 à 50 000 € sur la durée totale de ton achat. Pas l'utiliser, c'est laisser de l'argent gratuit sur la table. Étape 1 : valider ton éligibilité. Étape 2 : viser le maximum autorisé (zone A bis + composition familiale). Étape 3 : combiner avec un crédit principal optimisé via courtier. Étape 4 : viser un bien que tu garderas 10+ ans pour profiter de tout le différé." },
      ],
      references: ["Vincennes", "Saint-Maur-des-Fossés", "Boulogne-Billancourt"],
    },
  },
  {
    slug: "dpe-passoires-thermiques-banlieue-parisienne-2026",
    title: "DPE F et G en banlieue parisienne : les communes les plus impactées",
    description:
      "Depuis 2025 location interdite des DPE G, 2028 pour les F. Impact sur les prix : -10 à -20 % sur certaines communes. Carte des zones les plus touchées.",
    publishedAt: "2026-05-17",
    readingMinutes: 8,
    category: "tendance",
    brief: {
      audience:
        "Acheteur 30-50 ans qui s'intéresse aux opportunités créées par la décote DPE F-G. Veut comprendre quelle commune est la plus touchée et où trouver des biens à rénover avec le meilleur potentiel.",
      angle:
        "État des lieux 2026 du marché des passoires thermiques en banlieue parisienne. Quelles communes sont les plus exposées (parc ancien), quel niveau de décote observable, comment exploiter intelligemment cette inefficience de marché.",
      sections: [
        { titre: "Le calendrier réglementaire 2025-2034", contenu: "Janvier 2025 : interdiction de louer les DPE G+ (les pires). Janvier 2028 : interdiction des G. Janvier 2031 : interdiction des F. Janvier 2034 : interdiction des E (2 millions de logements concernés). Conséquence sur le marché : les biens classés F et G perdent de la valeur, créant une fenêtre d'arbitrage pour les acheteurs prêts à rénover." },
        { titre: "L'ampleur du parc passoire en IDF", contenu: "30 % des logements IDF sont classés F ou G selon l'ADEME 2025. Concentration géographique : grande couronne et ancien populaire (parc 1950-1980 mal isolé) très exposés. Petite couronne ouest et Paris haussmannien moins touchés (rénovations déjà réalisées sur les beaux immeubles)." },
        { titre: "Les 5 communes les plus impactées par la décote", contenu: "1) Aulnay-sous-Bois : 38 % de F-G dans l'ancien, décote moyenne 15-18 %. 2) Mantes-la-Jolie : 35 % de F-G, décote 12-15 %. 3) Sevran : 40 %, décote 18-20 %. 4) Drancy : 33 %, décote 12-15 %. 5) Évry-Courcouronnes : 30 %, décote 10-12 %. Sur ces communes, un T3 70 m² classé G se trouve 10-25 000 € moins cher qu'un équivalent classé D." },
        { titre: "Les communes étonnamment épargnées", contenu: "1) Boulogne-Billancourt : <10 % de F-G, parc rénové dans les années 2010 sur la majorité des copropriétés. 2) Versailles : 12 % de F-G, parc ancien mais beaucoup d'investissements de copro. 3) Vincennes : 8 % de F-G, idem. 4) Saint-Mandé : <10 %. Ces communes voient peu d'opportunités d'arbitrage DPE car le marché reste tendu sur tous les classements." },
        { titre: "Le calcul rénovation : combien et quel ROI", contenu: "Coût moyen pour passer un T3 70 m² de G à D : isolation thermique (combles + murs + fenêtres) 25 000-40 000 €. Pompe à chaleur 12 000-18 000 €. Total 37 000-58 000 €. Aides : MaPrimeRénov' jusqu'à 25 000 € pour les revenus modestes-intermédiaires, CEE 1 500-3 000 €, écoPTZ jusqu'à 50 000 € à 0 %. Reste à charge net : 10 000-25 000 € selon profil." },
        { titre: "Le ROI de la rénovation en 2026", contenu: "Sur un bien acheté 280 000 € classé G en banlieue, après rénovation 25 000 € (reste à charge), valeur 2026 estimée : 320-340 000 €. Plus-value brute 15-25 000 €. Plus l'économie d'énergie 800-1 200 €/an. Plus la possibilité de louer (interdite avant). Sur 8 ans, ROI total estimé 30-45 000 € sur un investissement initial 25 000 €." },
        { titre: "Les pièges de la rénovation passoire thermique", contenu: "1) Sous-estimer le coût (les devis dérivent de 20-30 % en cours de chantier dans 60 % des cas). 2) Mauvais artisan : les travaux énergétiques exigent un RGE certifié pour les aides. 3) Copropriété qui refuse : pour isolation par l'extérieur ou changement d'huisseries, accord en AG nécessaire. 4) Perte d'une partie des aides si calendrier mal anticipé (MaPrimeRénov' Sérénité a des conditions strictes)." },
        { titre: "Notre stratégie d'achat passoire 2026", contenu: "Si tu acceptes de rénover : viser un G en zone Aulnay/Sevran/Drancy avec une copropriété saine (PV des AG validé) à -15-20 % du prix moyen du quartier. Budgéter 35 000 € de rénovation (avec marge). Récupérer 15-25 000 € d'aides selon revenus. ROI sur 5-8 ans très favorable, surtout si tu vises de la location longue durée à terme." },
      ],
      references: ["Aulnay-sous-Bois", "Mantes-la-Jolie", "Drancy", "Évry-Courcouronnes"],
    },
  },
  {
    slug: "acheter-versailles-2026-quartier-par-quartier",
    title: "Acheter à Versailles en 2026 : le guide quartier par quartier",
    description:
      "7 400 €/m² médian, mais l'écart entre Notre-Dame, Saint-Louis et Montreuil dépasse les 1 800 €/m². Carte précise des quartiers, prix réels et arbitrages.",
    publishedAt: "2026-05-18",
    readingMinutes: 8,
    category: "guide",
    brief: {
      audience:
        "Acheteur 35-55 ans CSP+, capacité 600 k€ à 1,2 M€, attiré par Versailles pour son patrimoine, ses écoles, son cadre de vie. Veut comprendre les nuances entre quartiers avant de cibler ses visites.",
      angle:
        "Guide précis des 6 quartiers de Versailles avec prix réels 2026, profils habitants, écoles, transports, et conseil d'achat selon le profil. Approche locale d'expert immobilier, pas pour rabâcher 'Versailles c'est cher'.",
      sections: [
        { titre: "Versailles en 2026 : le marché en chiffres", contenu: "Prix médian 7 400 €/m², évolution -2,8 % sur 12 mois (correction modérée vs -5,5 % moyenne IDF, signe de résilience patrimoniale). Volumes -8 %. Délai vente moyen 75 jours. Profil acheteur : 65 % familles avec enfants, 20 % cadres expatriés/internationaux, 15 % seniors qui vendent un bien plus grand." },
        { titre: "Notre-Dame : le coeur historique", contenu: "Prix 8 800-9 500 €/m² (top de la commune). Quartier autour du marché Notre-Dame, rues piétonnes, commerces de bouche, ambiance bourgeoisie traditionnelle. Écoles privées catholiques excellentes (Saint-Jean, Notre-Dame). Pour qui : familles aisées attachées au cadre village, seniors. Risque : très peu d'offre, biens vendus avant publication parfois." },
        { titre: "Saint-Louis : le quartier d'art de vivre", contenu: "Prix 7 800-8 800 €/m². Autour de la cathédrale Saint-Louis, jardin du Roi, antiquaires. Plus calme que Notre-Dame, ambiance plus discrète. Écoles publiques solides, lycées prestigieux à proximité (Hoche). Pour qui : intellectuels, professions libérales, familles cultivées. Avantage : moins surcoté que Notre-Dame, charme équivalent." },
        { titre: "Montreuil : le rapport qualité-prix", contenu: "Prix 6 200-7 200 €/m². À l'est de la commune, plus modeste mais tout sauf populaire. Pavillonnaire des années 1900-1950, charme provincial. Bien desservi par RER C (Versailles Rive Droite). Pour qui : primo-accédants Versailles, jeunes familles, télétravailleurs. Pourquoi : 1 500-2 000 €/m² de moins que Notre-Dame pour 80 % du Versailles-feeling." },
        { titre: "Clagny-Glatigny : familial chic", contenu: "Prix 7 500-8 200 €/m². Autour du parc de Clagny et de l'avenue de Saint-Cloud. Tissu résidentiel pavillonnaire et petits collectifs cossus. Écoles publiques top (groupe scolaire Clagny). Pour qui : familles avec 2-4 enfants, pré-adolescents qui scolarisent au collège Hoche ensuite. Avantage : cadre verdoyant, sentiment 'maison familiale'." },
        { titre: "Bernard-de-Jussieu : le moins cher, le plus pratique", contenu: "Prix 5 800-6 500 €/m². Sud de Versailles, proche RER C Porchefontaine. Tissu plus mixte (résidences récentes + maisons de ville). Pour qui : primo-accédants stricts, célibataires/jeunes couples, télétravailleurs cherchant Versailles à prix accessible. Limite : moins de patrimoine, moins d'animation commerciale." },
        { titre: "Porchefontaine : le secret bien gardé", contenu: "Prix 6 800-7 400 €/m². À cheval entre Versailles et la forêt de Meudon, ambiance village balnéaire (constructions XIXe pour bourgeoisie parisienne). Petits commerces, marché. Pour qui : familles qui veulent du calme, contact nature. Risque : éloigné du château et du centre, voiture utile." },
        { titre: "Comment acheter à Versailles en 2026", contenu: "1) Définir ton quartier cible avant de visiter (les écarts de prix justifient un choix précis). 2) Activer le réseau (40 % des biens Versailles se vendent off-market via notaires et agences locales). 3) Préparer un dossier d'achat clean avant compromis (Versailles attire des concurrents avec capacité validée et apport >25 %). 4) Anticiper les frais notaire élevés sur ancien (8 % moyen). 5) Comparer absolument Saint-Germain-en-Laye, Le Vésinet, Marnes-la-Coquette si ton budget passe." },
      ],
      references: ["Versailles", "Saint-Germain-en-Laye"],
    },
  },
  {
    slug: "vincennes-saint-mande-comparaison-immobilier-2026",
    title: "Vincennes ou Saint-Mandé : choisir entre les deux pépites du 94",
    description:
      "Limitrophes, à 16 minutes de Châtelet, prix entre 9 200 et 10 800 €/m². Mais Vincennes et Saint-Mandé n'attirent pas le même profil. Comparatif honnête.",
    publishedAt: "2026-05-19",
    readingMinutes: 8,
    category: "guide",
    brief: {
      audience:
        "Cadre 35-55 ans Paris-attaché, capacité 700 k€ à 1,3 M€, refuse de quitter le métro, cherche un cadre familial premium en limite de Paris. Hésite entre les deux communes phares du 94 ouest.",
      angle:
        "Comparer honnêtement Vincennes et Saint-Mandé sur tous les critères qui comptent pour un acheteur premium : prix, transports, écoles, ambiance, marchés, sécurité, perspectives. Casser les clichés (Saint-Mandé 'plus chic', Vincennes 'plus jeune'), donner les vrais chiffres.",
      sections: [
        { titre: "Le verdict en 30 secondes", contenu: "Saint-Mandé est plus cher (médian 10 200 €/m²), plus petit (24 000 hab), plus uniforme socialement, plus calme. Vincennes est légèrement moins cher (9 200 €/m²), plus grand (49 000 hab), plus diversifié, plus animé commercialement. Le choix dépend de ton attachement au village vs ville moyenne." },
        { titre: "Prix au m² 2026 : la vraie différence", contenu: "Saint-Mandé : médian 10 200 €/m², fourchette 9 500-11 200 selon quartier. Vincennes centre : 9 800-10 500 €/m². Vincennes Bérault/Diderot : 9 200-9 800 €/m². Vincennes Domaine du Bois : 8 800-9 500 €/m² (plus calme, à la lisière). Sur un T3 75 m², écart 50 000-90 000 € en faveur de Vincennes." },
        { titre: "Transports : strictement équivalents", contenu: "Saint-Mandé : ligne 1 (Saint-Mandé) à 12 minutes de Châtelet. Vincennes : ligne 1 (Vincennes ou Bérault) à 14-16 minutes de Châtelet. Bois de Vincennes accessible directement à pied des deux côtés. Vincennes a en plus le RER A (gare Vincennes) qui ouvre vers La Défense et vers l'est. Léger avantage Vincennes pour qui travaille à La Défense." },
        { titre: "Écoles : les deux sont excellentes mais pas pareil", contenu: "Saint-Mandé : groupe scolaire de la République (public, top), école Émilie-du-Châtelet (privée, sélective). Très peu d'écoles, ambiance 'village avec ses 3 écoles'. Vincennes : 6 groupes scolaires publics dont Saint-Exupéry et Roland-Vernaudon excellents, 3 écoles privées (Notre-Dame, Saint-Pierre). Plus de choix, plus d'options." },
        { titre: "Ambiance et art de vivre", contenu: "Saint-Mandé : marché Saint-Mandé Tourelle (mardi/vendredi/dimanche), avenue du Général de Gaulle (commerces de bouche premium), parc Saint-Mandé. Ambiance plus 'village BCBG'. Vincennes : marché de Vincennes (mardi/vendredi/dimanche), rue du Midi piétonne (commerces, terrasses), Cours Marigny. Ambiance plus 'petite ville à part entière' avec cinéma, théâtre, bibliothèque municipale active." },
        { titre: "Pour qui Saint-Mandé est le meilleur choix", contenu: "1) Familles avec enfants en bas âge qui veulent l'ambiance village. 2) Cadres seniors qui préfèrent le calme à l'animation. 3) Couples sans enfant CSP+ attirés par l'exclusivité. 4) Profils 'qualité de vie absolue' qui ne regardent pas le prix au m²." },
        { titre: "Pour qui Vincennes est le meilleur choix", contenu: "1) Familles 30-45 ans qui veulent du choix d'écoles et de l'animation. 2) Primo-accédants premium (T3 75 m² possible à 700-740 k€ sur Bérault). 3) Profils qui apprécient la mixité sociale (Vincennes plus diversifié que Saint-Mandé). 4) Acheteurs qui veulent garder l'option télétravail occasionnel à Paris la Défense (RER A)." },
        { titre: "Notre conseil tranchant", contenu: "Si ton budget tient à 800 k€, Vincennes Bérault est le meilleur rapport qualité-prix-transport-école d'Île-de-France entière. Si tu peux mettre 1 M€+ et que tu veux le standing absolu, Saint-Mandé est plus exclusif mais tu paies une prime de 5-8 % pour 80 % de la même expérience. Pour 90 % des profils premium, Vincennes." },
      ],
      references: ["Vincennes", "Saint-Mandé"],
    },
  },
  {
    slug: "boulogne-billancourt-2026-acheter-encore-coup",
    title: "Boulogne-Billancourt en 2026 : vaut-il encore le coup d'acheter ?",
    description:
      "Médian 9 200 €/m² (-2,1 % sur 5 ans), correction terminée. Quartiers historiques vs Trapèze, M9 vs M10, école publique vs privée. Le diagnostic complet 2026.",
    publishedAt: "2026-05-20",
    readingMinutes: 8,
    category: "guide",
    brief: {
      audience:
        "Cadre 35-55 ans francilien, capacité 700 k€ à 1,5 M€, considère Boulogne pour son cadre de vie, sa proximité Paris, ses écoles. Hésite parce que les prix ont l'air élevés et qu'il a entendu parler d'un risque de baisse.",
      angle:
        "Faire le diagnostic Boulogne 2026 sans complaisance ni alarmisme. Quartier par quartier, école par école, transport par transport. Donner le verdict honnête : pour qui c'est encore un excellent achat, pour qui ça l'est moins.",
      sections: [
        { titre: "Le marché Boulogne en chiffres 2026", contenu: "Prix médian 9 200 €/m² (-2,1 % sur 5 ans, plus stable que la moyenne IDF -5,5 %). Volumes -7 % sur 12 mois. Profil acheteur : 55 % familles aisées, 20 % cadres internationaux/expatriés, 15 % primo-accédants premium, 10 % investisseurs patrimoniaux." },
        { titre: "Le Trapèze : le quartier neuf qu'on adore détester", contenu: "Prix 9 800-11 200 €/m². Construit sur l'ancienne île Seguin (Renault) entre 2010 et 2024. Architecture moderne, parc de Billancourt, Seine accessible. Critique courante : 'sans âme', 'trop neuf'. Réalité : qualité de construction excellente, charges de copro 60-80 €/m²/an (élevées), DPE A-B partout. Pour qui : familles qui veulent du neuf bien fini, profils internationaux." },
        { titre: "Centre historique (autour du métro Boulogne Jean-Jaurès)", contenu: "Prix 9 200-10 500 €/m². Tissu haussmannien et art déco, commerces de proximité, petite ambiance village. Écoles publiques excellentes (Émile Zola, Robert Doisneau). Pour qui : familles ancrées dans le tissu local, cadres avec enfants. Avantage : âme et patrimoine, valeur sûre sur 15 ans." },
        { titre: "Pont de Sèvres / Marcel Sembat", contenu: "Prix 8 200-9 200 €/m². À cheval entre métro 9 (Pont de Sèvres) et 10 (Marcel Sembat). Ancien tissu industriel reconverti en résidentiel, plus diversifié socialement. Beaucoup de programmes neufs récents. Pour qui : primo-accédants premium qui veulent Boulogne sans payer Le Trapèze." },
        { titre: "Billancourt nord (Jean-Baptiste Clément)", contenu: "Prix 8 800-9 800 €/m². Nord de Boulogne, proche Bois de Boulogne et 16e arrondissement. Tissu pavillonnaire et petits collectifs cossus. Pour qui : profils 'maison à Boulogne', familles avec gros budget qui cherchent maison + jardin sans quitter la commune." },
        { titre: "Les transports en 2026 : Boulogne reste imbattable", contenu: "Métros 9 et 10 (Boulogne Pont de Saint-Cloud, Marcel Sembat, Boulogne Jean-Jaurès), RER C (Issy-Plaine), accès rapide vers la Défense (15 min) et Paris centre (15-20 min). Tram T2 (Henri Farman) connecte vers Issy-les-Moulineaux. Le futur Grand Paris Express ne passe pas par Boulogne mais la couverture actuelle est déjà excellente." },
        { titre: "Écoles : la raison principale d'acheter à Boulogne", contenu: "Public : groupes scolaires Robert Doisneau, Glacière, Émile Zola, Marcel Pagnol — tous excellents. Lycée Jacques-Prévert (très bonne réputation). Privé : Notre-Dame, Saint-François d'Assise, Daniélou (féminin, prestigieux). Très peu de carte scolaire problématique. C'est l'argument familial numéro 1." },
        { titre: "Verdict : pour qui Boulogne 2026 est un excellent achat", contenu: "1) Familles 35-50 ans avec enfants scolarisés ou à scolariser, capacité 850 k€-1,2 M€ : oui, c'est un investissement patrimonial solide. 2) Cadres internationaux qui changent souvent : oui, liquidité revente excellente. 3) Couples seniors qui transmettent : oui, valeur stable sur 20 ans. 4) Primo-accédants premium 700-800 k€ visant Pont de Sèvres : OK avec courtier crédit. 5) Investisseurs locatifs : non, rendements à 3,3 % nets seulement." },
      ],
      references: ["Boulogne-Billancourt", "Issy-les-Moulineaux", "Neuilly-sur-Seine"],
    },
  },
  {
    slug: "sci-familiale-immobilier-ile-de-france-avantages-pieges",
    title: "Acheter en SCI familiale en Île-de-France : avantages, pièges, démarches",
    description:
      "La SCI familiale est l'outil patrimonial le plus puissant pour transmettre. Mais aussi celui où on se plante le plus si on l'utilise mal. Le mode d'emploi 2026.",
    publishedAt: "2026-05-21",
    readingMinutes: 9,
    category: "tendance",
    brief: {
      audience:
        "Couple 40-60 ans avec patrimoine immobilier 600 k€ - 2 M€, deux enfants ou plus, planifie sa transmission. Ou parents 50-70 ans qui veulent aider leurs enfants à acheter sans tout leur donner. Veut comprendre quand SCI ouvre des portes et quand c'est un piège.",
      angle:
        "Décortiquer la SCI familiale en 2026 : ce que c'est vraiment, dans quels cas elle est puissante, dans quels cas elle est un boulet administratif coûteux. Approche praticienne, pas théorique. Avec coûts précis et cas pratiques.",
      sections: [
        { titre: "La SCI familiale en 30 secondes", contenu: "Société Civile Immobilière dont les associés sont membres d'une même famille. Tu détiens un bien immobilier via la SCI (au lieu de directement). Tu détiens des parts de la SCI (au lieu de la pleine propriété). Avantages clés : transmission progressive sans démembrement compliqué, gestion à plusieurs sans indivision, optimisation fiscale dans certains cas." },
        { titre: "Cas où la SCI est puissante", contenu: "1) Transmission anticipée à des enfants : tu donnes 10 % des parts par an pendant 10 ans, tu profites des abattements fiscaux successivement (100 000 € par parent par enfant tous les 15 ans). 2) Achat avec plusieurs personnes (couple non marié, fratrie) : la SCI évite l'indivision et ses blocages. 3) Investissement locatif long terme avec optimisation IS : si tu loues nu, tu peux opter pour l'impôt sur les sociétés et amortir le bien." },
        { titre: "Cas où la SCI est inutile ou contre-productive", contenu: "1) Achat de résidence principale par un couple marié sans enfants à transmettre : aucun gain. 2) Investissement locatif court ou moyen terme (<8 ans) : les frais administratifs (compta annuelle 800-1 500 €, formalisme) bouffent les bénéfices. 3) Bien meublé : la SCI à l'IR perd ses avantages, et la SCI à l'IS impose des règles strictes contraignantes." },
        { titre: "Les coûts cachés que personne ne te dit", contenu: "Création SCI : 800-1 500 € (notaire ou société de domiciliation). Comptabilité annuelle : 800-1 500 €/an si externalisée. Tenue d'AG annuelle obligatoire. Procès-verbaux à formaliser. Si IS : déclarations fiscales complexes, expert-comptable indispensable. Total annuel : 1 000-2 500 € de frais, à comparer aux gains attendus." },
        { titre: "Le choix IR ou IS : la vraie ligne de fracture", contenu: "SCI à l'IR : transparence fiscale, les revenus sont imposés au nom des associés à leur tranche IR. Idéal pour transmission patrimoniale et résidence principale. SCI à l'IS : amortissement du bien possible, mais double imposition à la sortie (plus-value société + IRPP sur dividendes). Idéal pour investissement locatif long terme à fort cash-flow." },
        { titre: "Cas pratique : transmission d'un bien Boulogne 1 M€", contenu: "Couple 55 ans, 2 enfants, achat 2010 à 600 k€, valeur 2026 1 M€. Sans SCI : à leur décès, droits de succession sur 1 M€ moins abattements 200 k€ (2 × 100 k€) = 800 k€ taxé à environ 25 % moyens = 200 k€ de droits. Avec SCI familiale créée en 2026, donation 5 % de parts/an pendant 15 ans : transmission totale sans droit (utilisation pleine des abattements 100 k€/parent/enfant tous les 15 ans). Économie estimée : 150-180 k€." },
        { titre: "Cas pratique : achat d'un locatif Pantin via SCI", contenu: "Investisseur 45 ans IRPP tranche 41 %, achète T3 350 k€ Pantin via SCI à l'IS. Loyer 1 250 €/mois. Avec amortissement du bien (4 % par an), les revenus locatifs sont fiscalement neutres pendant 12-15 ans. Comparé à de la location nue à l'IR : économie d'impôt cumulée 35-45 k€ sur 15 ans. À comparer aux 1 200 €/an de frais SCI : ROI très positif." },
        { titre: "Les pièges en pratique", contenu: "1) Créer la SCI APRÈS l'achat (rachat des parts à soi-même) : coûteux fiscalement, à éviter. 2) Mettre la résidence principale en SCI : on perd l'exonération de plus-value. 3) Mélanger usage RP et locatif dans la même SCI : casse-tête comptable et fiscal. 4) Confier la gestion à un seul associé sans procès-verbaux : risque de contestation par les autres en cas de désaccord." },
        { titre: "Notre cadre de décision en 5 questions", contenu: "1) Tu as plus de 500 k€ de patrimoine immobilier ? 2) Tu veux transmettre à des enfants ? 3) Tu acceptes 1 000-2 000 €/an de frais admin ? 4) Tu vises un horizon 10+ ans ? 5) Tu peux la créer AVANT l'achat ? Si oui à 4 ou 5 questions : SCI très pertinente, valide avec un notaire spécialisé. Si non à 3+ questions : la SCI est probablement plus de complexité que de bénéfice." },
      ],
      references: ["Boulogne-Billancourt", "Pantin", "Vincennes"],
    },
  },
];

export const BLOG_POSTS_BY_SLUG: Record<string, BlogPost> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p]),
);
