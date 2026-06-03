#!/usr/bin/env tsx
/**
 * Générateur de Hub ville : transforme une config (city-hubs.config.ts) en
 * jusqu'à 8 briefs standardisés (pilier + S1-S7) insérés dans lib/blog-posts.ts.
 *
 * Encode le playbook une fois pour toutes : slugs, titres, catégories, angle
 * par satellite, CTA acheteur variés, interliens, data moat DVF par quartier.
 * Gap-aware : ignore les slots de skipSlots ET tout slug déjà présent.
 *
 * Usage :
 *   npm run scaffold-hub <base>     ex: npm run scaffold-hub saint-maur
 *
 * Après : npm run regenerate-blog -- <slug> (par nouveau slug), puis
 * npm run generate-blog-images, puis npm run build.
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { CITY_HUBS, type CityHubConfig, type HubSlot } from "./city-hubs.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Section = { titre: string; contenu: string };
type Brief = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingMinutes: number;
  category: string;
  brief: {
    audience: string;
    angle: string;
    ouverture: string;
    structure: string;
    sections: Section[];
    references: string[];
  };
};

// ── helpers ────────────────────────────────────────────────────────────────

function quartiersList(c: CityHubConfig): string {
  return c.quartiers.map((q) => `${q.nom} (${q.fourchette}, ${q.note})`).join(" ; ");
}

function fiche(c: CityHubConfig): string {
  return `[${c.cityShort}](/vivre-a/${c.ficheSlug})`;
}

function lien(slug: string, texte: string): string {
  return `[${texte}](/blog/${slug})`;
}

// CTA acheteur : pools variés (milieu + bas), choisis par index de slot
const CTA_MID = (c: CityHubConfig, i: number): string => {
  const pool = [
    `Aside milieu d'article : 'Pas sûr que ${c.cityShort} colle à ton budget ? Lance le quiz Trouve ta ville idéale, en 4 clics on calcule la surface que tu peux viser ici et on te propose des alternatives si le ticket est trop haut. Bouton iris en bas à droite.' Ton aide concrète, jamais d'agent.`,
    `Aside milieu d'article : 'Tu veux comparer ${c.cityShort} à ses voisines sur le prix m2 réel et le trajet ? Le comparateur croise les données DVF sur ${c.datasetCount} communes, tu pondères tes critères : ouvrir [le comparateur](/comparer).' Pas d'agent.`,
    `Aside milieu d'article : 'Une question précise sur un quartier de ${c.cityShort} ? Le concierge IA (bouton iris en bas à droite) répond en moins d'une minute à partir des données réelles.' Pas d'agent.`,
  ];
  return pool[i % pool.length];
};
const CTA_BOTTOM = (c: CityHubConfig, i: number): string => {
  const pool = [
    `Encart fin, fond gris : 'Compare ${c.cityShort} aux autres communes sur prix, trajet et qualité de vie : ouvrir [le comparateur](/comparer).' Aucune mention d'agent.`,
    `Encart fin, fond gris : 'Tu hésites encore sur la commune ? Lance le quiz Trouve ta ville idéale, on calcule ta surface possible à ${c.cityShort} et on te propose 3 communes qui matchent ton budget et ton trajet.' Bouton concierge iris. Pas d'agent.`,
    `Encart fin, fond gris : 'Garde la main : pondère tes critères toi-même sur le comparateur et vois où ${c.cityShort} se classe pour TON projet : ouvrir [le comparateur](/comparer).' Pas d'agent.`,
  ];
  return pool[i % pool.length];
};

// ── builders par slot ────────────────────────────────────────────────────

const BUILDERS: Record<HubSlot, (c: CityHubConfig) => Brief> = {
  pilier: (c) => ({
    slug: `acheter-${c.base}-2026-guide-complet`,
    title: `Acheter à ${c.city} en 2026 : le guide complet`,
    description: `${c.median} €/m² médian, ${c.transport.split(",")[0]}. Marché, quartiers, transport, écoles, budget : tout ce qu'il faut savoir avant d'acheter à ${c.cityShort}.`,
    publishedAt: c.dates[0],
    readingMinutes: 10,
    category: "guide",
    brief: {
      audience: `Acquéreur 32-55 ans, couple ou famille, qui vise ${c.cityShort} et veut une vue d'ensemble honnête avant de creuser quartier par quartier.`,
      angle: `Money page ${c.cityShort} : poser le décor complet (marché 2026, quartiers en bref, transport, écoles, profils acheteurs, budget) et router vers les guides détaillés. Pas de carte de prix fine ici (rôle de l'article prix par quartier). Synthèse claire, zéro survente.`,
      ouverture: `Constat : pourquoi ${c.cityShort} attire, en une phrase incarnée qui cite ${c.contexte.split(",")[0]}.`,
      structure: "Méthodique : marché, quartiers en bref, transport, écoles, qui achète, atout différenciant, verdict avec liens.",
      sections: [
        { titre: "Intro (200 mots, prête à reprendre)", contenu: `Intro de 200 mots, tutoiement, voix incarnée, sans em-dash. Camper ${c.city} : ${c.contexte}. Prix médian ${c.median} €/m², ${c.evolutionNote}. Desserte : ${c.transport}. Annoncer que ce guide pose le décor (marché, quartiers, transport, écoles, budget) et que les articles détaillés font le reste. Honnête sur le ticket d'entrée.` },
        { titre: `${c.cityShort} en 2026 : l'état du marché`, contenu: `Médian ${c.median} €/m², ${c.evolutionNote}. Volumes, délai de vente, dynamique. Conclure sur le type de marché (report familial, valeur, etc.).` },
        { titre: "Les quartiers en un coup d'oeil", contenu: `Panorama bref : ${quartiersList(c)}. Pour le détail rue par rue, renvoyer vers ${lien(`prix-immobilier-${c.base}-2026-par-quartier`, "le guide des prix par quartier")}.` },
        { titre: "Le transport", contenu: `Détailler : ${c.transport}. Expliquer ce que ça change au quotidien et son effet sur les prix.` },
        { titre: "Écoles et cadre de vie", contenu: `${c.contexte}. Pourquoi c'est un moteur d'achat familial qui tient les prix.` },
        { titre: "Qui achète et à quel budget", contenu: `Profil dominant (famille cadres, primo, etc.), budget type pour un 3-4 pièces au médian ${c.median} €/m², apport, origine des acheteurs.` },
        { titre: "CTA acheteur (encart milieu d'article)", contenu: CTA_MID(c, 0) },
        { titre: "Le verdict, et par où continuer", contenu: `Synthèse honnête. Router vers ${lien(`prix-immobilier-${c.base}-2026-par-quartier`, "prix par quartier")}, ${lien(`meilleur-quartier-${c.base}-acheter-2026`, "meilleur quartier pour acheter")}, et ${lien(`${c.base}-ou-${c.comparison.base}-acheter-2026`, `${c.cityShort} ou ${c.comparison.city}`)}.` },
        { titre: "CTA acheteur (bas d'article)", contenu: CTA_BOTTOM(c, 0) },
      ],
      references: [c.city],
    },
  }),
  s1: (c) => ({
    slug: `prix-immobilier-${c.base}-2026-par-quartier`,
    title: `Prix immobilier ${c.city} 2026 : le vrai prix par quartier`,
    description: `${c.median} €/m² de médiane, mais l'écart entre quartiers change tout. La grille réelle quartier par quartier, données DVF et commentaire sans filtre.`,
    publishedAt: c.dates[1],
    readingMinutes: 9,
    category: "tendance",
    brief: {
      audience: `Acquéreur décidé sur ${c.cityShort} qui veut savoir où son budget passe vraiment, rue par rue, sans le vernis des annonces.`,
      angle: `Data moat : grille de prix réelle par quartier croisée DVF plus annonces, commentaire honnête surcote/sous-cote. Ce que MeilleursAgents ne fait pas (un seul chiffre).`,
      ouverture: `Statistique : '${c.median} €/m² de médiane à ${c.cityShort}, mais d'un quartier à l'autre tu n'achètes pas la même ville.'`,
      structure: "Méthodique : sources DVF, grille par quartier, écarts, où c'est justifié, où il reste de la marge, verdict.",
      sections: [
        { titre: "Intro (200 mots, prête à reprendre)", contenu: `Intro 200 mots, tutoiement, sans em-dash. Poser que la médiane ${c.median} €/m² ne sert à rien sans le quartier. Citer l'écart entre le plus cher (${c.quartiers[0].nom}) et le plus abordable (${c.quartiers[c.quartiers.length - 1].nom}). Annoncer données DVF (18 derniers mois) croisées annonces (qui surévaluent de 3-8 %), et qu'on dit où le prix est justifié et où c'est la prime de nom.` },
        { titre: "Les sources et la méthode", contenu: "DVF data.gouv (transactions récentes) croisé annonces SeLoger/PAP. Les annonces surévaluent de 3-8 % vs signé : on raisonne sur le signé. Médianes par quartier, fourchettes (volumes limités)." },
        ...c.quartiers.map((q) => ({ titre: `${q.nom} : ${q.fourchette}`, contenu: `${q.note}. Profil d'acheteur, justification du prix (atout concret) ou surcote, marge de revalorisation.` })),
        { titre: "Où le prix est justifié, où c'est la prime de nom", contenu: "Distinguer les quartiers où le prix paie un atout réel (transport, eau, calme, école) de ceux surcotés sur le seul prestige. Conseil : raisonner en minutes réelles à pied de la gare et des atouts, pas en étiquette." },
        { titre: "CTA acheteur (encart milieu d'article)", contenu: CTA_MID(c, 1) },
        { titre: "Le verdict prix 2026", contenu: `Où est la marge restante, où c'est le plafond. Renvoyer vers ${lien(`meilleur-quartier-${c.base}-acheter-2026`, "meilleur quartier pour acheter")} et la fiche ${fiche(c)}.` },
        { titre: "CTA acheteur (bas d'article)", contenu: CTA_BOTTOM(c, 1) },
      ],
      references: [c.city],
    },
  }),
  s2: (c) => ({
    slug: `meilleur-quartier-${c.base}-acheter-2026`,
    title: `Meilleur quartier de ${c.city} pour acheter en 2026`,
    description: `Famille, primo, investisseur, calme ou proximité gare : à ${c.cityShort} le meilleur quartier dépend de ton projet. Le classement par profil, sans langue de bois.`,
    publishedAt: c.dates[2],
    readingMinutes: 9,
    category: "guide",
    brief: {
      audience: `Acquéreur qui sait que ce sera ${c.cityShort} mais hésite entre les quartiers, veut un classement orienté décision selon SON profil.`,
      angle: "Classement décision : à chaque profil son meilleur quartier, avec le pourquoi. Distinct de l'article prix (descriptif) : ici on tranche. Renvoyer au prix par quartier pour les chiffres.",
      ouverture: `Question retournée : 'Le meilleur quartier de ${c.cityShort} n'existe pas dans l'absolu. Il existe pour ton projet.'`,
      structure: "Décomposition par profil : critère, famille, primo, prestige, proximité gare, le quartier qui monte, verdict synthèse.",
      sections: [
        { titre: "Intro (200 mots, prête à reprendre)", contenu: `Intro 200 mots, tutoiement, sans em-dash. Poser qu'à ${c.cityShort} le vrai arbitrage n'est pas le risque (faible partout) mais le compromis budget/atouts/transport. Quartiers en jeu : ${c.quartiers.map((q) => q.nom).join(", ")}. Annoncer qu'on tranche par profil, qu'on assume une opinion, et qu'on renvoie au guide prix pour les chiffres.` },
        { titre: "Le seul critère qui compte : ton projet", contenu: `Poser le cadre et lister les profils traités. Renvoyer vers ${lien(`prix-immobilier-${c.base}-2026-par-quartier`, "le détail des prix par quartier")}.` },
        { titre: "Si tu es une famille", contenu: `Quel(s) quartier(s) viser (calme, école, espace). Citer les quartiers pertinents avec fourchettes.` },
        { titre: "Si tu es primo-accédant", contenu: `Le meilleur ticket d'entrée : ${c.quartiers[c.quartiers.length - 1].nom} et secteurs abordables. Argument prix vs reste de la commune.` },
        { titre: "Si tu cherches le prestige et la valeur refuge", contenu: `${c.quartiers[0].nom} et secteurs premium : tu paies le plein tarif mais le bien se revend toujours.` },
        { titre: "Si le trajet est ta priorité", contenu: `Quartiers proches des gares (${c.transport.split(",")[0]}). Gain quotidien réel.` },
        { titre: "Le quartier qui monte", contenu: "Le secteur en valorisation (proximité projet transport, requalification). Pari raisonnable à 7-10 ans." },
        { titre: "CTA acheteur (encart milieu d'article)", contenu: CTA_MID(c, 2) },
        { titre: "Le verdict par profil", contenu: `Synthèse en prose (un quartier par profil). Renvoyer vers ${lien(`${c.base}-ou-${c.comparison.base}-acheter-2026`, `${c.cityShort} ou ${c.comparison.city}`)} si l'acheteur hésite de commune.` },
        { titre: "CTA acheteur (bas d'article)", contenu: CTA_BOTTOM(c, 2) },
      ],
      references: [c.city],
    },
  }),
  s3: (c) => ({
    slug: `quartiers-eviter-${c.base}-achat-2026`,
    title: `${c.city} : les quartiers où je n'achèterais pas (et pourquoi)`,
    description: `À ${c.cityShort}, le vrai risque n'est pas toujours là où on croit. Surcote, nuisances, charges : les pièges réels, et les faux quartiers à éviter qui sont des opportunités.`,
    publishedAt: c.dates[3],
    readingMinutes: 9,
    category: "guide",
    brief: {
      audience: `Acquéreur prudent qui veut connaître les pièges avant d'offrir et ne pas surpayer. Cherche un avis franc, pas un argumentaire.`,
      angle: `Anti-bullshit honnête mais JUSTE et nuancé. Toujours 'à éviter pour qui / quel projet'. Inclure les faux à éviter (opportunités injustement boudées). Jamais de jugement social brut.`,
      ouverture: `Aveu : ce que 'à éviter' veut dire vraiment à ${c.cityShort} (souvent surpayer, pas l'insécurité).`,
      structure: "Thèse-antithèse : ce que à éviter veut dire ici, surcote, micro-nuisances, copros à charges, les faux à éviter, verdict.",
      sections: [
        { titre: "Intro (200 mots, prête à reprendre)", contenu: `Intro 200 mots, tutoiement, sans em-dash, honnête. Recadrer : le vrai risque à ${c.cityShort} est de surpayer (prime de nom), de subir une nuisance non anticipée, ou d'hériter de charges lourdes, pas l'insécurité. Annoncer qu'on dit où on paie trop cher pour ce qu'on a, où il y a une vraie marge, avec à chaque fois le pour qui.` },
        { titre: `Ce que à éviter veut dire à ${c.cityShort}`, contenu: "Recadrer factuellement (pas de peur). À éviter = surpayer, nuisance, charges. Article sur le bon achat." },
        { titre: "Le piège de la surcote de prestige", contenu: `Quartiers/rues vendus plus cher sur le nom sans atout concret. Vérifier ce que l'adresse apporte vraiment vs une rue voisine.` },
        { titre: "Les micro-nuisances à vérifier", contenu: "Axes passants, voie ferrée, bruit, qualité d'air, étages bas. La nuisance se joue à la rue près, pas au quartier." },
        { titre: "Les copropriétés à charges lourdes", contenu: "Immeubles anciens avec gardien/ascenseur/ravalements : charges qui plombent le budget réel. Demander 3 derniers PV d'AG, fonds travaux, DPE." },
        { titre: "Les faux quartiers à éviter (les opportunités)", contenu: `${c.quartiers[c.quartiers.length - 1].nom} et secteurs boudés par réflexe : moins chers, mêmes atouts de fond, dynamique positive. Pour primo/investisseur, le meilleur rapport.` },
        { titre: "CTA acheteur (encart milieu d'article)", contenu: CTA_MID(c, 0) },
        { titre: "Le verdict : où je mettrais mon argent", contenu: `Synthèse : fuir la surcote sans atout, vérifier nuisances et charges, ne pas snober les quartiers abordables. Renvoyer vers ${lien(`meilleur-quartier-${c.base}-acheter-2026`, "meilleur quartier pour acheter")}.` },
        { titre: "CTA acheteur (bas d'article)", contenu: CTA_BOTTOM(c, 0) },
      ],
      references: [c.city],
    },
  }),
  s4: (c) => ({
    slug: `investir-${c.base}-rendement-locatif-2026`,
    title: `Investir à ${c.city} en 2026 : rendement réel par quartier`,
    description: `${c.rendement}, c'est l'ordre de grandeur. Demande locative, valeur refuge, montages : où, comment et pour quel profil investir à ${c.cityShort} a du sens.`,
    publishedAt: c.dates[4],
    readingMinutes: 10,
    category: "tendance",
    brief: {
      audience: `Investisseur 35-60 ans, capacité 300-700 k€, qui pèse rendement vs sécurité du capital et demande locative.`,
      angle: `Dire la vérité sur le rendement (${c.rendement}). Mettre en avant demande locative et valeur, comparer nu / meublé LMNP / colocation, où le rendement est le moins mauvais vs valeur refuge.`,
      ouverture: `Contre-évidence : un rendement modeste mais une demande locative qui ne faiblit pas et un capital protégé.`,
      structure: "Méthodique : vérité rendement, demande locative, valeur refuge vs rendement, montages, stratégie par quartier, calcul concret, verdict.",
      sections: [
        { titre: "Intro (200 mots, prête à reprendre)", contenu: `Intro 200 mots, tutoiement, sans em-dash. Annoncer le rendement réel à ${c.cityShort} (${c.rendement} brut, moins net), assumer que ce n'est pas du cash-flow. Mettre en avant la demande locative solide (familles, cadres, ${c.transport.split(",")[0]}) et la liquidité à la revente. Investissement de protection/valorisation. Annoncer qu'on voit où le rendement est le moins mauvais, quel montage, et le calcul sur un T2.` },
        { titre: `La vérité sur le rendement à ${c.cityShort}`, contenu: `${c.rendement} brut, moins net après charges/TF/vacance. Comparer à la grande couronne (5-7 %). Assumer. Faible vacance et liquidité compensent en partie.` },
        { titre: "Une demande locative solide", contenu: `Qui loue (familles, cadres via ${c.transport.split(",")[0]}, jeunes actifs). Loyers, vacance faible. Le vrai argument : sécurité du revenu.` },
        { titre: "Valeur refuge vs rendement : choisir son camp", contenu: `${c.quartiers[0].nom} = valeur refuge, rendement minimal. ${c.quartiers[c.quartiers.length - 1].nom} = rendement un peu meilleur, pari valorisation.` },
        { titre: "Nu, meublé LMNP ou colocation ?", contenu: "Comparer les 3 : simplicité vs fiscalité (LMNP amortissement) vs rendement colocation. Recommander selon le profil de la commune." },
        { titre: "Le calcul réel sur un T2", contenu: `Exemple chiffré honnête à partir du prix d'un quartier abordable et d'un loyer réaliste. Brut puis net après charges/TF/gestion.` },
        { titre: "CTA acheteur (encart milieu d'article)", contenu: CTA_MID(c, 1) },
        { titre: "Le verdict investisseur", contenu: `Pour qui ${c.cityShort} a du sens (patrimonial, transmission) et pour qui non (qui vit des loyers). Renvoyer vers ${lien(`prix-immobilier-${c.base}-2026-par-quartier`, "le guide prix par quartier")}.` },
        { titre: "CTA acheteur (bas d'article)", contenu: CTA_BOTTOM(c, 1) },
      ],
      references: [c.city],
    },
  }),
  s5: (c) => ({
    slug: `quitter-paris-pour-${c.base}-arbitrage-2026`,
    title: `Quitter Paris pour ${c.city} : le vrai calcul en 2026`,
    description: `${c.cityShort} face à Paris : ce que tu gagnes vraiment (surface, cadre, écoles) et ce que tu ne gagnes pas. Le calcul honnête, et pour qui le move vaut le coup.`,
    publishedAt: c.dates[5],
    readingMinutes: 10,
    category: "guide",
    brief: {
      audience: `Parisien en couple ou jeune famille qui étouffe en appartement et envisage ${c.cityShort}.`,
      angle: `Pont éditorial HONNÊTE. Dire le vrai gain (surface, cadre, écoles, transport) et ne pas survendre le gain budget. Dire qui y gagne et qui ferait mieux de rester à Paris.`,
      ouverture: `Scène concrète d'un Parisien qui découvre ${c.cityShort} et son cadre.`,
      structure: "Récit-arbitrage : est-ce vraiment quitter Paris, le calcul prix vs Paris, l'atout cadre, écoles, transport, qui gagne qui reste, verdict.",
      sections: [
        { titre: "Intro (200 mots, prête à reprendre)", contenu: `Intro 200 mots, tutoiement, sans em-dash, honnête. Décrire l'arbitrage Paris vers ${c.cityShort} : ${c.contexte}. Desserte ${c.transport}. Dire franchement si le gain est surtout qualité de vie (cadre, surface, écoles) plus que budget au médian ${c.median} €/m². Annoncer qui réussit le move et qui ferait mieux de rester.` },
        { titre: `${c.cityShort}, est-ce vraiment quitter Paris ?`, contenu: `Situer la distance/temps réels et le degré de rupture. Cadrer l'audience.` },
        { titre: "Le calcul prix vs Paris", contenu: `Revente d'un 2-3 pièces parisien (~10 500-11 000 €/m²) = quelle surface à ${c.cityShort} (${c.median} €/m²). Chiffrer le gain de surface réel.` },
        { titre: "L'atout qui change tout", contenu: `${c.contexte}. L'argument numéro un du move au quotidien.` },
        { titre: "Écoles et familles", contenu: "Carte scolaire, ambiance, autonomie des enfants. Souvent le déclencheur du move au moment du collège." },
        { titre: "Le transport au quotidien", contenu: `${c.transport}. Réalité du trajet, confort, fréquence.` },
        { titre: "Qui y gagne, qui ferait mieux de rester à Paris", contenu: "Verdict nuancé par profil : familles/cadres vs célibataires vie nocturne vs chasseurs d'économie pure." },
        { titre: "CTA acheteur (encart milieu d'article)", contenu: CTA_MID(c, 2) },
        { titre: "Le verdict du move", contenu: `Synthèse honnête. Renvoyer vers ${lien(`acheter-${c.base}-2026-guide-complet`, "le guide complet")} et ${lien(`${c.base}-ou-${c.comparison.base}-acheter-2026`, `${c.cityShort} ou ${c.comparison.city}`)}.` },
        { titre: "CTA acheteur (bas d'article)", contenu: CTA_BOTTOM(c, 2) },
      ],
      references: [c.city],
    },
  }),
  s6: (c) => ({
    slug: `frais-notaire-negociation-achat-${c.base}`,
    title: `Acheter à ${c.city} : frais, notaire et négociation réelle`,
    description: `Frais de notaire à ${c.fraisNotaire}, marge de négo ${c.negoMargin}. Le coût total réel d'un achat à ${c.cityShort}, les coûts cachés et la méthode pour ne pas surpayer.`,
    publishedAt: c.dates[6],
    readingMinutes: 9,
    category: "finance",
    brief: {
      audience: `Acheteur en phase d'offre à ${c.cityShort}, qui veut le coût total réel et comprendre la marge de négo.`,
      angle: `Phase transaction concrète. Frais notaire ancien ${c.fraisNotaire} chiffrés, marge négo réelle ${c.negoMargin}, coûts cachés (copro, parking, DPE), méthode.`,
      ouverture: `Constat chiffré sur le coût réel au-delà du prix affiché.`,
      structure: "Méthodique : combien coûtent les frais, marge de négo, coûts cachés, timing, erreurs primo, verdict.",
      sections: [
        { titre: "Intro (200 mots, prête à reprendre)", contenu: `Intro 200 mots, tutoiement, sans em-dash. Poser que le prix affiché n'est pas le coût réel : frais notaire ${c.fraisNotaire} (chiffrer sur un bien type). Marge de négo ${c.negoMargin}. Annoncer qu'on déroule les frais, la négo réelle par type de bien, les coûts cachés et la méthode pour ne pas surpayer ni perdre le bien.` },
        { titre: "Combien coûtent vraiment les frais de notaire", contenu: `Ancien ${c.fraisNotaire}. Calcul chiffré sur deux montants types. Détailler droits de mutation, émoluments, débours. Neuf à 2-3 % si dispo.` },
        { titre: `Pourquoi la négo est ce qu'elle est à ${c.cityShort}`, contenu: `Marge réaliste ${c.negoMargin}. Expliquer selon tension du marché et type de bien (ancien à rénover, passoire DPE = plus de marge).` },
        { titre: "Les coûts cachés des copropriétés", contenu: "Charges (gardien, ascenseur, ravalements), fonds travaux, DPE passoire. Demander les PV d'AG. Intégrer au budget réel." },
        { titre: "Le parking et les autres postes", contenu: "Parking (prime à l'achat mais revente facilitée), travaux, taxe foncière locale. Postes à anticiper." },
        { titre: "La méthode pour ne pas surpayer ni perdre le bien", contenu: "Accord de principe banque avant de chercher, dossier prêt, réactivité. Selon la tension, négocier ou dégainer vite." },
        { titre: "CTA acheteur (encart milieu d'article)", contenu: CTA_MID(c, 0) },
        { titre: "Le verdict transaction", contenu: `Budget frais inclus, marge réaliste, vigilance charges. Renvoyer vers ${lien(`acheter-${c.base}-2026-guide-complet`, "le guide complet")} et ${lien(`prix-immobilier-${c.base}-2026-par-quartier`, "les prix par quartier")}.` },
        { titre: "CTA acheteur (bas d'article)", contenu: CTA_BOTTOM(c, 0) },
      ],
      references: [c.city],
    },
  }),
  s7: (c) => ({
    slug: `${c.base}-ou-${c.comparison.base}-acheter-2026`,
    title: `${c.city} ou ${c.comparison.city} : où acheter en 2026`,
    description: `${c.comparison.angle}. Le match prix, transport, cadre de vie, écoles et investissement, pour trancher selon ton profil.`,
    publishedAt: c.dates[7],
    readingMinutes: 10,
    category: "guide",
    brief: {
      audience: `Acquéreur qui hésite entre ${c.cityShort} et ${c.comparison.city}, deux options proches, et veut trancher.`,
      angle: `Comparaison 1v1 honnête : ${c.comparison.angle}. Match sur prix, transport, cadre, écoles, invest, puis pour qui l'un, pour qui l'autre.`,
      ouverture: `Mise en scène du dilemme entre les deux communes.`,
      structure: "Comparaison : prix, transport, cadre de vie, écoles, invest, pour qui l'un/l'autre, verdict.",
      sections: [
        { titre: "Intro (200 mots, prête à reprendre)", contenu: `Intro 200 mots, tutoiement, sans em-dash. Poser le duel : ${c.comparison.angle}. ${c.cityShort} ${c.median} €/m² vs ${c.comparison.city} ${c.comparison.price} €/m². Annoncer qu'on compare point par point et qu'on tranche par profil, sans favori de principe.` },
        { titre: "Le match prix", contenu: `${c.cityShort} ${c.median} €/m² vs ${c.comparison.city} ${c.comparison.price} €/m². Ce que l'écart paie réellement.` },
        { titre: "Le match transport", contenu: `Comparer les dessertes : ${c.transport} côté ${c.cityShort}. Avantage selon ta destination quotidienne.` },
        { titre: "Le match cadre de vie", contenu: `${c.contexte} côté ${c.cityShort}. Décrire le contraste d'ambiance avec ${c.comparison.city}.` },
        { titre: "Le match écoles", contenu: "Comparer carte scolaire et établissements réputés des deux communes." },
        { titre: "Le match investissement", contenu: `Rendement et valorisation comparés (${c.rendement} côté ${c.cityShort}). Qui a le meilleur potentiel.` },
        { titre: "CTA acheteur (encart milieu d'article)", contenu: CTA_MID(c, 1) },
        { titre: `Pour qui ${c.cityShort}, pour qui ${c.comparison.city}`, contenu: `Verdict par profil. Linker les deux fiches ${fiche(c)} et [${c.comparison.city}](/vivre-a/${c.comparison.ficheSlug}).` },
        { titre: "CTA acheteur (bas d'article)", contenu: CTA_BOTTOM(c, 1) },
      ],
      references: [c.city, c.comparison.city],
    },
  }),
};

// Règle : chaque ville = 7 articles, S1 à S7. Le pilier (guide "acheter X")
// n'est PAS généré par défaut (la fiche /vivre-a ou un article "acheter X"
// existant joue ce rôle). Mettre includePilier: true dans la config pour
// l'ajouter en bonus (8 articles).
const DEFAULT_SLOTS: HubSlot[] = ["s1", "s2", "s3", "s4", "s5", "s6", "s7"];

// ── main ──────────────────────────────────────────────────────────────────

function main(): void {
  const key = process.argv[2];
  if (!key || !CITY_HUBS[key]) {
    console.error(`Usage: npm run scaffold-hub <base>\nVilles dispo : ${Object.keys(CITY_HUBS).join(", ")}`);
    process.exit(1);
  }
  const c = CITY_HUBS[key];
  const postsPath = path.resolve(__dirname, "..", "lib", "blog-posts.ts");
  const src = fs.readFileSync(postsPath, "utf-8");

  // slugs déjà présents (anti-cannibalisation + idempotence).
  // Matche les 2 styles de clé : `slug: "..."` (écrit main) ET `"slug": "..."`
  // (style JSON produit par ce générateur), sinon les re-runs dupliquent.
  const existing = new Set(
    [...src.matchAll(/"?slug"?\s*:\s*"([^"]+)"/g)].map((m) => m[1]),
  );

  const skip = new Set(c.skipSlots ?? []);
  const slots: HubSlot[] = c.includePilier
    ? ["pilier", ...DEFAULT_SLOTS]
    : DEFAULT_SLOTS;
  const briefs: Brief[] = [];
  for (const slot of slots) {
    if (skip.has(slot)) continue;
    const b = BUILDERS[slot](c);
    if (existing.has(b.slug)) {
      console.log(`skip (déjà présent) : ${b.slug}`);
      continue;
    }
    briefs.push(b);
  }

  if (briefs.length === 0) {
    console.log("Rien à insérer (tous les slots existent déjà ou sont skippés).");
    return;
  }

  // Sérialisation TS valide via JSON, ré-indentée pour tenir dans le tableau.
  const entriesStr = briefs
    .map((b) => {
      const json = JSON.stringify(b, null, 2);
      return json
        .split("\n")
        .map((line) => "  " + line)
        .join("\n");
    })
    .join(",\n");

  // Insertion avant le `];` qui ferme BLOG_POSTS (juste avant BLOG_POSTS_BY_SLUG).
  const marker = "\n];\n\nexport const BLOG_POSTS_BY_SLUG";
  const idx = src.indexOf(marker);
  if (idx === -1) {
    console.error("Marqueur de fin BLOG_POSTS introuvable, insertion annulée.");
    process.exit(1);
  }
  // La dernière entrée a déjà une virgule de fin : ne pas en ajouter une 2e
  // (sinon élision de tableau -> élément undefined).
  const before = src.slice(0, idx);
  const sep = before.trimEnd().endsWith(",") ? "\n" : ",\n";
  const out = before + sep + entriesStr + src.slice(idx);
  fs.writeFileSync(postsPath, out);

  console.log(`\n✅ ${briefs.length} briefs insérés pour ${c.city} :`);
  briefs.forEach((b) => console.log(`   ${b.slug}`));
  console.log(`\nÉtapes suivantes :`);
  console.log(`   for s in ${briefs.map((b) => b.slug).join(" ")}; do npm run regenerate-blog -- "$s"; done`);
  console.log(`   npm run generate-blog-images && npm run build`);
}

main();
