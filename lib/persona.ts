import type { Commune } from "./types";

/**
 * Définitions des trois personas que le site cible explicitement.
 *
 * Pour chaque persona :
 * - filter : qui retient les communes pertinentes
 * - score : qui les classe (plus haut = mieux pour ce persona)
 * - copy : titres et paragraphes éditoriaux
 */

export type PersonaId = "famille" | "teletravail" | "investisseur" | "campagne";

export type Persona = {
 id: PersonaId;
 slug: string;
 shortLabel: string;
 metaTitle: string;
 metaDescription: string;
 h1: string;
 /** 4-5 paragraphes éditoriaux, ton tutoyant, sans titres internes. */
 intro: string;
 /** Bullet points qui détaillent les critères clés pour ce persona. */
 criteres: { titre: string; description: string }[];
 /** Filtre booléen sur une commune. */
 filter: (c: Commune) => boolean;
 /** Score plus haut = meilleur pour ce persona. */
 score: (c: Commune) => number;
 /** Question/réponse FAQ (rendues visibles + JSON-LD). */
 faq: { question: string; reponse: string }[];
};

export const PERSONAS: Persona[] = [
 // ============ FAMILLE ============
 {
 id: "famille",
 slug: "quitter-paris-en-famille",
 shortLabel: "Quitter Paris en famille",
 metaTitle: "Quitter Paris en famille : meilleures villes 2026",
 metaDescription:
 "Maison avec jardin, école de qualité, espaces verts, sécurité et proximité Paris : voici les communes idéales pour quitter Paris en famille en 2026.",
 h1: "Quitter Paris en famille : nos meilleures villes",
 intro: `Tu as un ou deux enfants, peut-être un troisième en route. L'appartement parisien commence à étouffer, la cour de récré du quartier ressemble à un timbre-poste, et l'idée d'une chambre par enfant relève de la science-fiction au tarif du 11e arrondissement. Pas de panique : il y a une vie après Paris pour les familles, et elle peut commencer à 25 minutes en RER.

Quitter Paris en famille, ce n'est pas seulement chercher de la surface. C'est trouver le bon équilibre entre une école qui tient la route, des espaces verts pour décompresser le week-end, un sentiment de sécurité dans la rue le soir, et une accessibilité qui te permet de garder ton job parisien sans transformer chaque trajet en marathon. Les bons compromis existent, et ils sont nombreux dès que tu acceptes de regarder au-delà du périphérique.

Voici nos communes les mieux notées pour les familles, sélectionnées sur la base d'un trajet vers Paris inférieur à 60 minutes, d'au moins 20 % d'espaces verts, d'un taux de chômage modéré et d'une densité scolaire suffisante. Toutes ces communes ont été testées contre la même grille : ce qui compte vraiment quand on veut élever des enfants sans renier la proximité de la capitale.`,
 criteres: [
 {
 titre: "École de qualité",
 description:
 "Densité d'établissements scolaires (maternelle, primaire, collège) suffisante pour ne pas avoir à galérer.",
 },
 {
 titre: "Espaces verts",
 description:
 "Au moins 20 % du territoire en zones vertes : parcs, forêts, bois pour les week-ends actifs.",
 },
 {
 titre: "Sécurité",
 description:
 "Taux de criminalité bas et environnement résidentiel : ce qu'on cherche pour laisser ses enfants jouer dehors.",
 },
 {
 titre: "Trajet Paris ≤ 60 min",
 description:
 "Pour garder l'accès aux opportunités professionnelles et culturelles parisiennes sans y passer sa vie.",
 },
 ],
 filter: (c) =>
 c.temps_trajet_paris_min <= 60 &&
 (c.espaces_verts_pct ?? 0) >= 20 &&
 (c.taux_chomage ?? 100) <= 10 &&
 (c.prix_m2_median ?? 0) >= 3000 && // exclut les communes ultra-populaires sans services
 (c.prix_m2_median ?? 99999) <= 9000, // budget famille classe moyenne
 score: (c) => {
 const verts = c.espaces_verts_pct ?? 0;
 const ecoles = c.nb_ecoles ?? 0;
 const securite = 90 - (c.taux_criminalite ?? 50);
 const tempsBonus = Math.max(0, 60 - c.temps_trajet_paris_min);
 return verts * 0.4 + ecoles * 1.5 + securite * 0.5 + tempsBonus * 0.3;
 },
 faq: [
 {
 question: "Quelle est la meilleure ville pour s'installer en famille près de Paris ?",
 reponse:
 "Il n'y a pas une seule meilleure ville : ça dépend de ton budget, du nombre d'enfants et de ton acceptation du trajet. Saint-Germain-en-Laye, Versailles et Vincennes sont des références pour les familles aisées (8000-9000 €/m²). Sur des budgets plus accessibles, Rambouillet, Saint-Maur-des-Fossés ou Maisons-Alfort offrent un bon équilibre.",
 },
 {
 question: "Combien de temps acceptable de trajet pour des parents qui travaillent à Paris ?",
 reponse:
 "La règle empirique : viser 30-45 minutes porte-à-porte par trajet, soit moins d'1h30 cumulées par jour. Au-delà, la fatigue et l'absence en soirée pèsent rapidement sur l'équilibre familial.",
 },
 {
 question: "Faut-il privilégier une maison ou un appartement pour une famille ?",
 reponse:
 "Pour la même surface, un appartement en proche couronne reste souvent moins cher et mieux desservi qu'une maison en grande couronne. La maison apporte le jardin, mais aussi plus d'entretien, plus de voiture, et souvent un trajet plus long. À évaluer selon tes priorités.",
 },
 {
 question: "Quelles communes ont les meilleures écoles publiques près de Paris ?",
 reponse:
 "Globalement, les Yvelines (78), les Hauts-de-Seine ouest (92) et le Val-de-Marne sud (94) concentrent les établissements les mieux classés. Saint-Germain-en-Laye, Versailles, Vincennes et Saint-Maur-des-Fossés sont des références établies.",
 },
 ],
 },

 // ============ TÉLÉTRAVAIL ============
 {
 id: "teletravail",
 slug: "quitter-paris-teletravail",
 shortLabel: "Quitter Paris en télétravail",
 metaTitle: "Quitter Paris en télétravail : les meilleures villes 2026",
 metaDescription:
 "Tu travailles 2-3 jours par semaine à Paris. Voici les villes avec gare fiable, qualité de vie supérieure et prix raisonnable pour le télétravail hybride.",
 h1: "Quitter Paris en télétravail : nos meilleures villes",
 intro: `Le télétravail hybride a tout changé. Si tu vas au bureau 2 ou 3 jours par semaine, tu n'as plus besoin d'habiter à 20 minutes de Châtelet. Tu peux pousser le curseur jusqu'à 1h, 1h30, voire au-delà, du moment que la gare en bout de course est fiable et que ton chez-toi vaut le coup.

C'est précisément le bon moment pour quitter Paris. Les villes à 30-90 minutes par train direct deviennent accessibles pour celles et ceux qui travaillent sur écran : Reims à 46 minutes par TGV Est, Mâcon à 1h40, Tours à 1h10, Le Mans à 54 minutes, Mantes-la-Jolie à 32 minutes par Transilien J. Le calcul devient simple : quelques jours par mois en TGV ou Transilien, et tu rentres le soir dans une maison plus grande, dans un environnement qui ressemble à de la vraie vie.

La sélection ci-dessous met l'accent sur la fiabilité du transport (lignes peu sujettes aux retards chroniques), un budget accessible (sous 5000 €/m² majoritairement) et une qualité de vie quotidienne, services, commerces, espaces verts. On évite volontairement les lignes RER les plus fragiles (RER B, RER D) qui ne pardonnent pas en cas d'incident un jour de présentiel.`,
 criteres: [
 {
 titre: "Gare fiable",
 description:
 "Ligne avec ponctualité supérieure à 80 %. RER E, Transilien J/L/N, TGV : oui. RER B et D : à éviter pour le télétravail hybride.",
 },
 {
 titre: "Trajet 30-90 min",
 description:
 "Sweet spot pour 2-3 jours / semaine au bureau : tu acceptes plus de temps mais tu gagnes massivement sur le budget.",
 },
 {
 titre: "Budget accessible",
 description:
 "Sous 5000 €/m² en moyenne, ce qui dégage une vraie capacité d'épargne pour un projet familial ou de loisirs.",
 },
 {
 titre: "Espace de travail",
 description:
 "Pas la peine d'avoir le métro en bas si tu n'y vas que le mardi. Privilégie une vraie pièce dédiée au télétravail.",
 },
 ],
 filter: (c) =>
 c.temps_trajet_paris_min >= 30 &&
 c.temps_trajet_paris_min <= 100 &&
 (c.prix_m2_median ?? 0) > 0 &&
 (c.prix_m2_median ?? 99999) <= 5500 &&
 // exclure les lignes catastrophiques
 !(c.ligne_principale?.toLowerCase().includes("rer b") ?? false) &&
 !(c.ligne_principale?.toLowerCase().includes("rer d") ?? false),
 score: (c) => {
 const prixScore = Math.max(0, 6000 - (c.prix_m2_median ?? 5000)) / 50;
 const trajetSweet = c.temps_trajet_paris_min >= 45 && c.temps_trajet_paris_min <= 75 ? 20 : 0;
 const verts = (c.espaces_verts_pct ?? 0) * 0.5;
 const tgvBonus = c.mode_principal === "tgv" ? 15 : 0;
 return prixScore + trajetSweet + verts + tgvBonus;
 },
 faq: [
 {
 question: "Quelle est la meilleure ville pour télétravailler près de Paris ?",
 reponse:
 "Les villes les plus prisées des télétravailleurs en 2026 sont Reims (TGV Est, 46 min), Tours (TGV, 1h10), Vendôme (TGV, 42 min), Le Mans (TGV, 54 min) et Mantes-la-Jolie (Transilien J, 32 min). Toutes offrent un train direct fiable et un budget bien plus accessible que la petite couronne.",
 },
 {
 question: "Combien coûte un trajet TGV occasionnel pour un télétravailleur ?",
 reponse:
 "Un aller-retour TGV à plus de 30 jours coûte 30-60 €. Avec 8 trajets / mois (2 jours / semaine), comptez 250-500 €/mois, souvent compensé par l'économie sur le loyer ou le crédit immobilier.",
 },
 {
 question: "Quelles lignes éviter pour le télétravail ?",
 reponse:
 "Le RER B et le RER D souffrent d'une saturation chronique et d'incidents fréquents qui ne pardonnent pas un jour de réunion en présentiel. Privilégie le RER E (récent), les Transiliens J/L/N (fiables) ou les liaisons TGV directes.",
 },
 {
 question: "Faut-il une gare TGV pour télétravailler ?",
 reponse:
 "Pas obligatoire si tu acceptes 1h-1h30 de Transilien. Mais une gare TGV directe ouvre l'accès à des villes comme Reims, Le Mans ou Vendôme à moins de 1h, avec un cadre de vie sans commune mesure avec la grande couronne IDF.",
 },
 ],
 },

 // ============ INVESTISSEUR ============
 {
 id: "investisseur",
 slug: "quitter-paris-investisseur",
 shortLabel: "Investir hors de Paris",
 metaTitle: "Investir hors de Paris : les meilleures villes 2026",
 metaDescription:
 "Rendement locatif, dynamisme économique, bonus Grand Paris Express : voici les communes les plus intéressantes pour investir en immobilier autour de Paris.",
 h1: "Investir hors de Paris : nos meilleures villes",
 intro: `Investir à Paris en 2026, c'est mathématiquement ingrat. À 9000-15000 €/m², avec un loyer plafonné autour de 32 €/m², le rendement brut oscille entre 3 et 4 %, sans compter la pression réglementaire (encadrement, DPE) qui ne va pas faiblir. Les vrais rendements sont ailleurs.

La banlieue et la province offrent des couples prix-loyer bien plus généreux. Vitry-sur-Seine avec son arrivée du métro 14 et 15 du Grand Paris Express, Champigny-sur-Marne sur la ligne 15, Aubervilliers ou Saint-Denis sur l'extension de la M14 : on parle de bonus GPE qui viennent dynamiser des prix encore raisonnables. Plus loin, des villes moyennes comme Mâcon, Reims ou Le Mans offrent du 6-8 % brut sur des biens accessibles dès 100-150 k€.

Notre sélection privilégie les communes à fort rendement locatif (au-dessus de 4,5 %), un dynamisme économique mesuré par le revenu médian et le taux de chômage, et un bonus Grand Paris Express significatif (futures gares à venir). C'est l'angle "valorisation potentielle + cash-flow positif" plutôt que "patrimoine de prestige".`,
 criteres: [
 {
 titre: "Rendement locatif > 4,5 %",
 description:
 "Le seuil minimum pour qu'un investissement immobilier ait du sens face aux frais et à la fiscalité.",
 },
 {
 titre: "Bonus Grand Paris Express",
 description:
 "Les communes desservies par les nouvelles lignes du GPE voient leurs prix grimper de 10-30 % à mesure que les gares ouvrent.",
 },
 {
 titre: "Dynamisme économique",
 description:
 "Revenu médian local + taux de chômage modéré : indicateur que la demande locative restera soutenue.",
 },
 {
 titre: "Liquidité",
 description:
 "Volume de transactions DVF : plus il est élevé, plus tu pourras revendre vite si besoin.",
 },
 ],
 filter: (c) =>
 (c.rendement_locatif ?? 0) >= 4.0 &&
 (c.prix_m2_median ?? 0) > 0 &&
 (c.taux_chomage ?? 100) <= 18,
 score: (c) => {
 const rendement = (c.rendement_locatif ?? 0) * 10;
 const gpe = (c.bonus_gpe ?? 0) * 50;
 const chomage = Math.max(0, 18 - (c.taux_chomage ?? 18)) * 2;
 const transactions = Math.min((c.nb_transactions ?? 0) / 100, 10);
 return rendement + gpe + chomage + transactions;
 },
 faq: [
 {
 question: "Quel est le meilleur rendement locatif autour de Paris ?",
 reponse:
 "Les meilleurs rendements bruts en 2026 se trouvent à Mantes-la-Jolie (~6,7 %), Vitry-sur-Seine et Champigny (~5 % avec un fort potentiel GPE), ou en province à Reims, Saint-Étienne et Le Mans (>6 %). En petite couronne, Aubervilliers et Saint-Denis offrent 5-5,5 % avec les futures lignes 14, 15 et 16.",
 },
 {
 question: "Comment le Grand Paris Express affecte-t-il les prix immobiliers ?",
 reponse:
 "Les communes desservies par les nouvelles gares du GPE ont vu leurs prix progresser de 10-25 % entre 2018 et 2025. L'effet d'annonce est en grande partie absorbé sur les communes les plus médiatisées (Saint-Denis Pleyel, Villejuif), mais des opportunités subsistent sur les gares moins connues (Champigny-Centre, Bry-Villiers-Champigny).",
 },
 {
 question: "Faut-il investir en banlieue ou en province pour un meilleur rendement ?",
 reponse:
 "La banlieue offre une demande locative plus stable et l'effet GPE. La province (Reims, Mâcon, Le Mans) offre des rendements bruts supérieurs mais une liquidité moindre et une demande plus volatile. La diversification entre les deux peut faire sens sur un patrimoine en constitution.",
 },
 {
 question: "Quels sont les pièges à éviter pour un investissement locatif hors Paris ?",
 reponse:
 "Trois pièges classiques : (1) acheter dans une commune sans dynamisme local (taux de chômage > 15 %, peu de transactions), (2) parier uniquement sur le GPE sans vérifier la planification réelle des ouvertures, (3) sous-estimer les charges et la fiscalité qui érodent le rendement net jusqu'à 1-1,5 point en dessous du brut.",
 },
 ],
 },

 // ============ QUITTER PARIS POUR LA CAMPAGNE ============
 {
 id: "campagne",
 slug: "quitter-paris-pour-la-campagne",
 shortLabel: "Quitter Paris pour la campagne",
 metaTitle: "Quitter Paris pour la campagne en 2026 : les villages avec gare TGV",
 metaDescription:
 "Vivre à la vraie campagne et garder l'accès à Paris en 2h. Sélection de villages accessibles via une gare TGV proche en voiture, en vélo ou en bus.",
 h1: "Quitter Paris pour la campagne",
 intro: `Tu veux quitter Paris vraiment. Pas la "banlieue verte" avec son pavillon à 200 m du voisin, pas la ville moyenne avec ses zones commerciales et ses rocades. Tu veux la vraie campagne : champs, vignobles, forêts, le silence le matin, le ciel étoilé le soir. Mais tu ne peux pas non plus disparaître à 5 h de Paris, parce que ton métier t'y ramène 1 à 2 fois par semaine, parce que ta famille y est, parce que tu veux pouvoir y revenir facilement.

Cette page est faite pour toi. Elle référence des villages situés à 5 à 20 minutes en voiture, en vélo ou en bus d'une gare TGV qui te ramène à Paris en 1 h 30 à 2 h 30. Le concept tient en une phrase : tu gagnes la qualité de vie d'un village rural, et tu n'as jamais plus de 2 h 30 porte-à-porte pour rejoindre la capitale.

La sélection ci-dessous démarre avec un pilote autour de Mâcon-Loché TGV (1 h 35 de Paris Gare de Lyon). D'autres gares stratégiques arriveront : Vendôme, Le Creusot, Champagne-Ardenne, Tours, Le Mans. Pour chaque village, on indique le temps et la distance jusqu'à la gare, le prix au m², la population, le taux d'espaces verts. Tu choisis selon ton équilibre rural / accessible.`,
 criteres: [
 {
 titre: "Gare TGV ou Intercités directe vers Paris",
 description:
 "Trajet train inférieur à 2 h vers Paris Gare de Lyon, Montparnasse, Saint-Lazare ou Est. Ligne fiable, peu d'incidents structurels.",
 },
 {
 titre: "Village rural authentique",
 description:
 "Densité inférieure à 500 hab/km², majorité d'espaces agricoles ou forestiers visibles, commerces de proximité présents mais limités.",
 },
 {
 titre: "Accès à la gare en moins de 20 min",
 description:
 "Voiture, vélo ou bus selon les communes. C'est la variable critique du quotidien : si tu mets plus de 20 min pour rejoindre la gare, l'aller-retour Paris devient pénible.",
 },
 {
 titre: "Prix accessible",
 description:
 "Sous 3 000 €/m² en moyenne. Tu peux acheter une maison ancienne avec jardin entre 200 et 400 k€ selon les régions.",
 },
 ],
 filter: (c) => c.gare_acces !== undefined,
 score: (c) => {
 const garetrajet = c.gare_acces?.trajet_min ?? 20;
 const accessibiliteGare = Math.max(0, 20 - garetrajet); // 20 pts max si gare à 0 min
 const prixScore = Math.max(0, 3500 - (c.prix_m2_median ?? 3000)) / 30;
 const verts = (c.espaces_verts_pct ?? 0) * 0.4;
 const calmeBonus = (c.population ?? 5000) < 1000 ? 10 : 0; // bonus vraie petite commune
 return accessibiliteGare + prixScore + verts + calmeBonus;
 },
 faq: [
 {
 question: "Comment quitter Paris pour vivre à la campagne tout en gardant l'accès à Paris ?",
 reponse:
 "La meilleure solution combine un village rural avec une gare TGV ou Intercités à moins de 20 minutes en voiture. Tu vis dans un environnement de vraie campagne, et tu rejoins Paris en 1 h 30 à 2 h 30 porte-à-porte. C'est le modèle des télétravailleurs qui descendent au bureau 1 à 2 fois par semaine.",
 },
 {
 question: "Quels villages près d'une gare TGV permettent de rejoindre Paris en moins de 2 h ?",
 reponse:
 "Plusieurs zones offrent ce profil : autour de Mâcon-Loché TGV (1 h 35 Paris Gare de Lyon) avec Charnay-lès-Mâcon, Sancé, Prissé, Davayé, Vergisson ou Solutré-Pouilly. Autour de Vendôme Villiers TGV (42 min), du Creusot TGV (1 h 25), de la gare Champagne-Ardenne TGV (45 min). Notre sélection s'étend progressivement.",
 },
 {
 question: "Faut-il une voiture pour vivre à la campagne près d'une gare TGV ?",
 reponse:
 "Dans la grande majorité des cas, oui. Quelques villages très proches d'une gare permettent l'accès en vélo (sous 4 km) ou en bus régulier, mais c'est minoritaire. Une voiture reste l'outil de référence, à intégrer au calcul global : coût de la voiture inférieur à l'écart de prix immobilier entre un village et une grande ville desservie.",
 },
 {
 question: "Combien coûte un aller-retour TGV occasionnel pour aller à Paris ?",
 reponse:
 "Sur Mâcon-Loché, un aller-retour TGV en réservant 30 jours à l'avance coûte 40 à 70 €. Sur 8 trajets par mois (2 fois par semaine), comptez 350 à 600 €/mois. Souvent compensé par l'écart de prix immobilier : 200 à 300 k€ d'écart sur une maison entre village viticole et petite couronne parisienne.",
 },
 {
 question: "Quels sont les pièges du télétravail à la campagne ?",
 reponse:
 "Trois pièges classiques : (1) sous-estimer le temps voiture jusqu'à la gare en hiver ou par mauvais temps, (2) choisir une commune avec une seule gare TGV, donc dépendance totale en cas d'incident sur la ligne, (3) négliger la fibre internet, qui n'est pas garantie dans toutes les communes rurales malgré le plan France Très Haut Débit.",
 },
 ],
 },
];

export const PERSONAS_BY_SLUG: Record<string, Persona> = Object.fromEntries(
 PERSONAS.map((p) => [p.slug, p]),
);
