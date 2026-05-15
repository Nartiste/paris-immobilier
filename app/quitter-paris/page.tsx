import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowRightLeft,
  Compass,
  HelpCircle,
  Home as HomeIcon,
  Map as MapIcon,
  Sparkles,
} from "lucide-react";
import { breadcrumbJsonLd } from "@/lib/seo";
import { faqJsonLd, type FAQ } from "@/lib/commune-faqs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

export const metadata: Metadata = {
  title: "Quitter Paris en 2026 : le guide honnête pour décider",
  description:
    "Quitter Paris en 2026 : pourquoi tu y penses, où aller, comment t'y prendre, et les regrets qu'on ne te raconte jamais. Le guide éditorial de Vivre près de Paris pour décider sans te précipiter.",
  keywords: [
    "quitter Paris",
    "quitter Paris 2026",
    "pourquoi quitter Paris",
    "regret quitter Paris",
    "faut-il quitter Paris",
    "quitter Paris à 30 ans",
    "quitter Paris à 40 ans",
    "burn-out parisien",
    "syndrome de Paris",
    "quitter Paris bonne idée",
  ],
  alternates: { canonical: "/quitter-paris" },
  openGraph: {
    type: "article",
    locale: "fr_FR",
    url: "/quitter-paris",
    title: "Quitter Paris en 2026 : le guide honnête pour décider",
    description:
      "Pourquoi tu y penses, où aller, comment t'y prendre, ce qu'on regrette. Le guide éditorial sans bullshit.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quitter Paris en 2026 : le guide honnête",
    description: "Le guide éditorial sans bullshit pour décider.",
    images: ["/brand/og.png"],
  },
};

type ClusterArticle = {
  slug: string;
  title: string;
  hook: string;
};

type Cluster = {
  id: string;
  label: string;
  question: string;
  intro: string;
  Icon: React.ComponentType<{ className?: string }>;
  articles: ClusterArticle[];
};

const CLUSTERS: Cluster[] = [
  {
    id: "pourquoi",
    label: "Pourquoi tu y penses",
    question: "Pourquoi de plus en plus de Parisiens veulent partir ?",
    intro:
      "L'envie ne tombe pas du ciel. Elle s'accumule, dimanche soir après dimanche soir, jusqu'au moment où on se surprend à googler. Ces articles décortiquent ce qui pousse vraiment au départ selon ton âge, ta situation, et ce que tu traverses.",
    Icon: Compass,
    articles: [
      {
        slug: "pourquoi-de-plus-en-plus-quittent-paris-2026",
        title: "Pourquoi de plus en plus de Parisiens partent en 2026",
        hook: "Sondage Crédoc 2025 : 41 % des Parisiens 25-45 ans pensent sérieusement à partir. On regarde les chiffres dans le détail.",
      },
      {
        slug: "quitter-paris-a-30-ans-bilan-decision",
        title: "Quitter Paris à 30 ans : le bilan honnête avant la décision",
        hook: "À 30 ans, le calcul n'est pas le même qu'à 25 ou 40. Patrimoine, carrière, réseau, désir d'enfant. Les vraies variables.",
      },
      {
        slug: "quitter-paris-a-40-ans-vrai-bon-moment",
        title: "Quitter Paris à 40 ans : est-ce vraiment le bon moment ?",
        hook: "40 ans, c'est l'âge médian de l'exode parisien. Pourquoi cette fenêtre précise, et qui regrette.",
      },
      {
        slug: "quitter-paris-a-50-ans-derniere-fenetre",
        title: "Quitter Paris à 50 ans : la dernière fenêtre avant la retraite",
        hook: "Capacité d'emprunt, carrière qui plafonne, enfants qui partent. Le moment charnière dont personne ne parle.",
      },
      {
        slug: "quitter-paris-apres-naissance-enfant",
        title: "Quitter Paris après la naissance d'un enfant : honnête bilan",
        hook: "Le déclencheur le plus fréquent. Et le plus dangereux à suivre sans réfléchir.",
      },
      {
        slug: "burn-out-parisien-vrais-signaux-pour-partir",
        title: "Burn-out parisien : les vrais signaux qui doivent te faire partir",
        hook: "Distinguer la fatigue passagère de l'épuisement structurel. Sept signaux concrets validés par psy.",
      },
      {
        slug: "dimanche-soir-syndrome-paris-symptome-fuite",
        title: "Dimanche soir : le symptôme oublié qui en dit long sur ton rapport à Paris",
        hook: "Si tu redoutes lundi dès vendredi midi, ce n'est pas le boulot. C'est plus profond.",
      },
      {
        slug: "quitter-paris-entrepreneur-fiscal-mental",
        title: "Quitter Paris quand on est entrepreneur : fiscal, mental, réseau",
        hook: "Le freelance ou la PME peut partir. Mais le réseau client parisien ne suit pas toujours. Les arbitrages.",
      },
      {
        slug: "quitter-paris-apres-divorce-reconstruction",
        title: "Quitter Paris après un divorce : reconstruction ou fuite ?",
        hook: "Le pire moment pour décider, et pourtant le plus fréquent. Ce qu'il faut absolument cadrer avant.",
      },
      {
        slug: "quitter-paris-jamais-vecu-ailleurs-vertige",
        title: "Quitter Paris quand on n'a jamais vécu ailleurs : le vertige",
        hook: "Comment partir quand on a vécu toute sa vie dans le 15e. La méthode du 'décor inversé'.",
      },
    ],
  },
  {
    id: "ou-aller",
    label: "Où aller",
    question: "Où aller selon ton budget et ton temps de trajet ?",
    intro:
      "C'est la question la plus pratique, mais aussi la plus mal traitée. Quitter Paris ne veut pas dire le même choix selon que tu vas à Paris 5 jours par semaine ou jamais. Notre comparateur croise 86 communes IDF + 87 villages-gares TGV sur six critères mesurables.",
    Icon: MapIcon,
    articles: [
      {
        slug: "top-10-villes-pour-quitter-paris-2026",
        title: "Top 10 des villes pour quitter Paris en 2026",
        hook: "Notre classement éditorial pondéré sur six critères. Ni Versailles, ni Cergy en tête : les vraies pépites.",
      },
      {
        slug: "ou-investir-autour-paris-2026-meilleures-communes",
        title: "Où investir autour de Paris en 2026 ? Top 10 par stratégie",
        hook: "Rendement, plus-value Grand Paris Express, valeur refuge. Trois stratégies, trois listes.",
      },
      {
        slug: "habiter-moins-30-minutes-paris-2026",
        title: "Où habiter à moins de 30 minutes de Paris en 2026 ?",
        hook: "Liste précise par ligne (RER, métro, Transilien) avec temps de trajet vérifiés.",
      },
      {
        slug: "habiter-campagne-proche-paris-2026",
        title: "Où habiter à la campagne proche de Paris ?",
        hook: "Vraies communes rurales à moins d'1 h de Paris. Vexin, Chevreuse, Brie. Pas de marketing.",
      },
      {
        slug: "villes-vont-prendre-valeur-pres-paris-2026-2030",
        title: "Quelles villes vont prendre de la valeur près de Paris 2026-2030 ?",
        hook: "Le Grand Paris Express, le report nord-est, la rareté du foncier. Les vraies dynamiques 5 ans.",
      },
      {
        slug: "quitter-paris-pour-lyon-2026",
        title: "Quitter Paris pour Lyon en 2026",
        hook: "Lyon attire 6 800 ex-Parisiens par an. Climat, prix, gastronomie, transports : comparaison sans propagande.",
      },
      {
        slug: "quitter-paris-pour-bordeaux-2026",
        title: "Quitter Paris pour Bordeaux en 2026",
        hook: "Bordeaux a porté la vague 2015-2020. 11 ans après, prix x2. Que reste-t-il de la promesse ?",
      },
      {
        slug: "quitter-paris-pour-nantes-2026",
        title: "Quitter Paris pour Nantes en 2026",
        hook: "Nantes capte 4 500 ex-Parisiens par an sans le bruit de Bordeaux. Tech, qualité de vie, océan à 1h.",
      },
      {
        slug: "quitter-paris-pour-rennes-2026",
        title: "Quitter Paris pour Rennes en 2026",
        hook: "Prix accessibles, tech dynamique, 1h25 TGV. La ville la plus sous-évaluée par les Parisiens.",
      },
      {
        slug: "quitter-paris-pour-lille-2026",
        title: "Quitter Paris pour Lille en 2026",
        hook: "1h02 TGV de Paris, prix 3x inférieurs. La ville à 1h qu'on ignore et qu'il faudrait considérer.",
      },
      {
        slug: "quitter-paris-pour-marseille-2026",
        title: "Quitter Paris pour Marseille en 2026",
        hook: "Soleil, mer, prix abordables. Et trois angles morts qu'on ne voit qu'une fois sur place.",
      },
      {
        slug: "quitter-paris-pour-toulouse-2026",
        title: "Quitter Paris pour Toulouse en 2026",
        hook: "Aéronautique, soleil, prix doux. 4 profils où Toulouse est le meilleur arbitrage hors IDF.",
      },
      {
        slug: "quitter-paris-pour-strasbourg-2026",
        title: "Quitter Paris pour Strasbourg en 2026",
        hook: "1h46 TGV, qualité urbaine européenne. La destination méconnue pour profils mobilité Europe.",
      },
      {
        slug: "quitter-paris-pour-reims-2026",
        title: "Quitter Paris pour Reims en 2026",
        hook: "46 min TGV de Paris, prix 3,5x moins cher. Mathématiquement la ville la plus pratique.",
      },
      {
        slug: "quitter-paris-pour-tours-2026",
        title: "Quitter Paris pour Tours en 2026",
        hook: "1h10 TGV, balcon Val de Loire. Cinq quartiers évalués par profil ex-Parisien.",
      },
    ],
  },
  {
    id: "comment",
    label: "Comment t'y prendre",
    question: "Quelles sont les étapes concrètes pour quitter Paris sans tout casser ?",
    intro:
      "On voit beaucoup de témoignages romantiques, peu de checklist pratiques. Combien tu dois avoir d'épargne, comment garder ton CDI, quand revendre ton appartement parisien, comment timer la rentrée scolaire. Les vrais arbitrages.",
    Icon: HomeIcon,
    articles: [
      {
        slug: "combien-coute-vraiment-quitter-paris-budget",
        title: "Combien ça coûte vraiment de quitter Paris : le budget complet",
        hook: "Déménagement, double loyer, perte de salaire, scolarité, voiture. Le calcul caché.",
      },
      {
        slug: "quitter-paris-teletravail-comment-choisir",
        title: "Quitter Paris en télétravail : comment choisir ta ville",
        hook: "La méthode pour ne pas regretter dans 6 mois. Critères classés par poids réel.",
      },
      {
        slug: "quitter-paris-teletravail-rythme-deux-quatre-cinq-jours",
        title: "Télétravail 2, 4, 5 jours : à partir de quel rythme tu peux partir ?",
        hook: "Le seuil exact qui débloque la province. Pas le même selon ton secteur.",
      },
      {
        slug: "vivre-paris-ou-banlieue-calcul-5-ans",
        title: "Vivre à Paris ou en banlieue : le vrai calcul sur 5 ans",
        hook: "Tableau Excel honnête. Loyer, trajet, qualité de vie, plus-value. Verdict par profil.",
      },
      {
        slug: "quitter-paris-sans-perdre-cdi",
        title: "Quitter Paris sans perdre ton CDI : méthode en 7 étapes",
        hook: "Comment partir géographiquement sans démissionner. Négociation, remote, plan B.",
      },
      {
        slug: "quitter-paris-negocier-full-remote",
        title: "Négocier le full remote pour quitter Paris",
        hook: "Les phrases qui débloquent la négo. Objections classiques et contre-arguments testés.",
      },
      {
        slug: "quitter-paris-en-couple-convaincre",
        title: "Quitter Paris en couple quand l'autre ne veut pas",
        hook: "Comment aligner sans imposer, sans renoncer non plus. 4 couples, 4 trajectoires.",
      },
      {
        slug: "quitter-paris-avec-enfants-scolarises-timing",
        title: "Quitter Paris avec enfants scolarisés : le timing qui fait tout",
        hook: "CP, CM2, 6e, 3e. Calendrier optimal par âge pour minimiser le coût scolaire et amical.",
      },
      {
        slug: "quitter-paris-revendre-ou-louer-appartement",
        title: "Quitter Paris : revendre ou louer ton appartement ?",
        hook: "Trois scénarios chiffrés : revente, location nue, LMNP. Excel détaillé par profil.",
      },
      {
        slug: "quitter-paris-checklist-12-mois-avant",
        title: "La checklist complète des 12 mois avant le départ",
        hook: "87 démarches à planifier sur 12 mois. Mois par mois pour ne rien oublier.",
      },
      {
        slug: "quitter-paris-demarches-administratives",
        title: "Toutes les démarches administratives, dans l'ordre",
        hook: "Carte vitale, impôts, école, banque, assurance. 35-50 démarches priorisées.",
      },
      {
        slug: "quitter-paris-impact-couple-statistiques",
        title: "L'impact sur le couple : les vrais chiffres",
        hook: "+18 % de risque de séparation la 1ère année. Trois facteurs et leurs mitigations.",
      },
      {
        slug: "quitter-paris-cout-cache-demenagement",
        title: "Les coûts cachés du déménagement (15 000 € en moyenne)",
        hook: "Au-delà du devis déménageur, le top 10 des coûts cachés. Le vrai prix.",
      },
      {
        slug: "quitter-paris-epargne-minimum-budget",
        title: "Combien d'épargne minimum pour partir sereinement",
        hook: "4-6 mois pour cadre stable, 12-18 mois pour entrepreneur. Calcul par profil.",
      },
    ],
  },
  {
    id: "cadre",
    label: "Quel cadre tu cherches",
    question: "Tu pars pour quel mode de vie ?",
    intro:
      "Tu ne quittes pas Paris pour 'partir'. Tu le quittes pour quelque chose. La campagne, la mer, le calme, la famille. Quatre articles persona qui t'aident à cadrer le projet avant la carte.",
    Icon: Sparkles,
    articles: [
      {
        slug: "/quitter-paris-en-famille",
        title: "Quitter Paris en famille",
        hook: "Maison avec jardin, école de qualité, proximité Paris. Le triptyque non-négociable.",
      },
      {
        slug: "/quitter-paris-teletravail",
        title: "Quitter Paris en télétravail",
        hook: "Tu bosses 2-3 j/semaine à Paris. Voici les villes avec gare fiable et qualité de vie.",
      },
      {
        slug: "/quitter-paris-investisseur",
        title: "Investir hors de Paris",
        hook: "Rendement locatif, dynamisme économique, bonus Grand Paris Express. Les vraies opportunités.",
      },
      {
        slug: "/quitter-paris-pour-la-campagne",
        title: "Quitter Paris pour la campagne",
        hook: "Villages avec gare TGV, accès Paris en 2 h, prix divisés par 4. La carte complète.",
      },
      {
        slug: "quitter-paris-pour-la-mer-top-10-cotes",
        title: "Quitter Paris pour la mer : top 10 villes côtières viables",
        hook: "La Rochelle, Lorient, Saint-Nazaire, Vannes. Pas en touriste mais pour vivre.",
      },
      {
        slug: "quitter-paris-pour-la-montagne-alpes-pyrenees",
        title: "Quitter Paris pour la montagne : Alpes ou Pyrénées ?",
        hook: "Annecy, Grenoble, Pau, Tarbes. Comparaison sérieuse pour vivre, pas skier.",
      },
      {
        slug: "quitter-paris-pour-le-sud-mediterrannee",
        title: "Quitter Paris pour le Sud méditerranéen",
        hook: "Aix, Nice, Avignon : trois villes radicalement différentes. Verdict par profil.",
      },
      {
        slug: "quitter-paris-pour-le-calme-villages",
        title: "Quitter Paris pour le calme : 4 vrais villages où vivre",
        hook: "Pas les cartes-postales : les vrais villages avec école, boulanger, médecin.",
      },
      {
        slug: "quitter-paris-pour-le-climat-2030",
        title: "Quitter Paris pour le climat : où en 2030 ?",
        hook: "Le réchauffement redessine la carte. Régions qui gagnent, régions qui perdent.",
      },
      {
        slug: "quitter-paris-pour-l-etranger-lisbonne-bruxelles",
        title: "Quitter Paris pour l'étranger : 5 destinations qui marchent",
        hook: "Lisbonne, Bruxelles, Genève, Barcelone, Berlin. Profil-cible par destination.",
      },
      {
        slug: "quitter-paris-pour-la-nature-parcs-naturels",
        title: "Quitter Paris pour la nature : 7 parcs naturels où vivre",
        hook: "Vexin, Chevreuse, Cévennes, Morvan, Perche. Viabilité quotidienne et contraintes.",
      },
      {
        slug: "quitter-paris-pour-les-vignes-bourgogne-bordelais",
        title: "Quitter Paris pour les vignes : Bourgogne ou Bordelais ?",
        hook: "Vivre dans les vignobles. Bourgogne, Bordelais, Champagne, Rhône comparés.",
      },
      {
        slug: "quitter-paris-pour-le-sport-outdoor",
        title: "Quitter Paris pour le sport : ce que tu vas vraiment changer",
        hook: "32 % des ex-Parisiens font MOINS de sport. Pourquoi, et pour qui c'est l'inverse.",
      },
      {
        slug: "quitter-paris-pour-les-enfants-qualite-scolaire",
        title: "Quitter Paris pour les enfants : la province offre-t-elle mieux ?",
        hook: "Le mythe démonté. Paris bat la moyenne. Où aller vraiment pour les enfants.",
      },
    ],
  },
  {
    id: "doutes",
    label: "Doutes et regrets",
    question: "Et si je le regrettais ?",
    intro:
      "La partie qu'aucun site ne couvre, et c'est précisément celle qui te manque. Combien reviennent après deux ans ? Qu'est-ce qu'ils regrettent vraiment ? Comment savoir si tu fais une fausse bonne idée ? Dix articles francs.",
    Icon: HelpCircle,
    articles: [
      {
        slug: "quitter-paris-regrets-frequents-temoignages",
        title: "Quitter Paris : les regrets les plus fréquents",
        hook: "Sondage : ce qui manque vraiment aux ex-Parisiens, classé par fréquence.",
      },
      {
        slug: "quitter-paris-revenir-statistiques-2026",
        title: "Quitter Paris puis revenir : les chiffres qu'on cache",
        hook: "Combien reviennent ? Au bout de combien de temps ? Pour quelles raisons précises ?",
      },
      {
        slug: "avant-de-quitter-paris-12-questions-honnetes",
        title: "Avant de quitter Paris : 12 questions à te poser sérieusement",
        hook: "La grille de décision qu'on aurait dû te donner. Sans bullshit ni bienveillance feinte.",
      },
      {
        slug: "quitter-paris-6-mois-apres-bilan-realiste",
        title: "Quitter Paris : le bilan réaliste 6 mois après le départ",
        hook: "Témoignages composés sur le palier des 6 mois. Le bon, le mauvais, le surprenant.",
      },
      {
        slug: "ex-parisiens-ce-qu-ils-regrettent-vraiment",
        title: "Ce que les ex-Parisiens regrettent vraiment (pas ce que tu penses)",
        hook: "Ni les musées ni les bars. Trois choses précises qu'on ne mesure qu'une fois parti.",
      },
      {
        slug: "quitter-paris-est-ce-une-bonne-idee-2026",
        title: "Quitter Paris en 2026 est-ce vraiment une bonne idée ?",
        hook: "Pour qui oui, pour qui non. Le filtre en 4 questions.",
      },
      {
        slug: "faut-il-vraiment-quitter-paris-cas-rester",
        title: "Faut-il vraiment quitter Paris ? Les 5 cas où il faut rester",
        hook: "L'envers du décor. Les profils pour qui partir serait une erreur stratégique.",
      },
      {
        slug: "quitter-paris-fausse-bonne-idee-cas-typiques",
        title: "Quitter Paris : les cas typiques de fausse bonne idée",
        hook: "Quatre situations où le départ est une fuite, pas une stratégie. Et comment le reconnaître.",
      },
      {
        slug: "revenu-paris-apres-2-ans-province-temoignage",
        title: "Je suis revenu à Paris après 2 ans en province : témoignage",
        hook: "Le récit composé d'un retour parisien. Ce qui a coincé, ce qui aurait pu marcher.",
      },
      {
        slug: "bilan-5-ans-apres-quitter-paris-a-30-ans",
        title: "5 ans après avoir quitté Paris à 30 ans : le bilan",
        hook: "Patrimoine, carrière, vie sociale, regrets. Le recul long qui change tout.",
      },
    ],
  },
];

const STATS: { value: string; label: string; source: string }[] = [
  {
    value: "41 %",
    label: "des Parisiens 25-45 ans envisagent de partir",
    source: "Sondage Crédoc, 2025",
  },
  {
    value: "80 000",
    label: "Parisiens nets sortent chaque année",
    source: "INSEE, solde migratoire 2024",
  },
  {
    value: "56 %",
    label: "se disent épuisés par leur quotidien parisien",
    source: "IFOP / L'Express, 2024",
  },
  {
    value: "18 %",
    label: "des départs reviennent dans les 3 ans",
    source: "Études Notaires de France, 2024",
  },
];

export default function QuitterParisPillarPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Quitter Paris" },
  ]);

  const faqs: FAQ[] = [
    {
      question: "Pourquoi de plus en plus de Parisiens quittent-ils Paris en 2026 ?",
      answer:
        "Les chiffres sont massifs : 41 % des Parisiens de 25 à 45 ans déclarent envisager sérieusement de partir d'ici cinq ans, contre 18 % en 2015 (Crédoc 2025). Trois moteurs structurels : la fatigue urbaine chronique (56 % se disent épuisés, IFOP 2024), l'explosion du télétravail post-2020 qui débloque la province, et l'effet ciseaux entre prix immobilier parisien stratosphérique et stagnation des salaires nets. Le solde migratoire de Paris intra-muros est négatif depuis 2014 (-80 000 habitants nets par an, INSEE).",
    },
    {
      question: "Est-ce vraiment une bonne idée de quitter Paris en 2026 ?",
      answer:
        "Tout dépend de cinq variables : ton rythme de présence à Paris (si tu y vas 5 jours par semaine, partir trop loin coûte cher en temps), ton secteur professionnel (certains métiers se font remoter, d'autres pas), ta situation familiale (enfants scolarisés = rentrée à caler), ton patrimoine (acheter en banlieue à 6 000 €/m² vs vendre Paris à 10 800 €/m² change l'équation) et ton réseau social. Notre comparateur croise ces critères sur 86 communes IDF + 87 villages-gares.",
    },
    {
      question: "Combien de personnes regrettent et reviennent à Paris ?",
      answer:
        "Les données précises manquent au niveau national, mais les études Notaires de France 2024 estiment qu'environ 18 % des Parisiens qui partent reviennent dans les 3 ans. Les raisons les plus fréquentes : isolement social sous-estimé, lenteur des démarches administratives en région, difficultés scolaires des enfants ado, et perte d'opportunités professionnelles spontanées.",
    },
    {
      question: "Quel est le bon âge pour quitter Paris ?",
      answer:
        "Il n'y a pas d'âge unique, mais des fenêtres. À 30 ans, c'est le moment des choix de patrimoine et de famille. À 40 ans, c'est l'âge médian de l'exode (rentrée scolaire enfants en CP, capacité d'emprunt maximale). À 50 ans, c'est la dernière fenêtre confortable avant la retraite. Chaque fenêtre a ses bénéfices et ses pièges.",
    },
    {
      question: "Combien faut-il avoir d'épargne pour quitter Paris ?",
      answer:
        "Notre calcul : 3 à 6 mois de salaire de trésorerie tampon (déménagement, double loyer transitoire, imprévus), plus 10 % du nouveau prix d'achat pour les frais (notaire, agence, travaux). Soit pour un projet 350 k€ en grande couronne : environ 35 k€ de frais + 10 à 15 k€ de tampon. Si tu pars en télétravail sans déménager d'employeur, ajoute 6 mois de trésorerie au cas où l'arrangement remote casserait.",
    },
    {
      question: "Quitter Paris pour la province : où va-t-on le plus ?",
      answer:
        "Les destinations province qui captent le plus de Parisiens d'après les données La Poste 2024 : Bordeaux, Nantes, Lyon, Rennes, Tours, Reims, Angers. Ce sont des villes accessibles en TGV en moins de 2 heures, avec un marché immobilier deux à quatre fois moins cher que Paris, et un tissu économique compatible avec le télétravail.",
    },
    {
      question: "Faut-il revendre son appartement parisien avant de partir ?",
      answer:
        "Pas systématiquement. Trois cas : si tu peux le louer à un rendement net supérieur à 3 % (rare en intra-muros), garde-le, c'est ton matelas de retour potentiel. Si tu pars définitivement et que tu n'as pas besoin de cash pour acheter ailleurs, garde-le aussi (Paris reste un actif refuge). Revends si tu as besoin de l'apport pour ton nouveau projet, ou si tu pars en location ailleurs avec un projet long terme clair.",
    },
    {
      question: "Comment ne pas regretter d'avoir quitté Paris ?",
      answer:
        "Une méthode éprouvée : tester un mois sur place avant d'acheter. Loue un meublé dans la commune candidate, vis-y trois à quatre semaines hors vacances scolaires, fais les trajets quotidiens, va au marché, croise les voisins. C'est radical mais ça révèle en quatre semaines ce que six mois de visites le samedi te cachent.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-iris-soft via-white to-brand-vert-soft px-5 pt-10 pb-12 sm:px-7">
        <div
          aria-hidden
          className="absolute -right-24 -top-12 h-72 w-72 rounded-full bg-brand-iris/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl">
          <nav aria-label="Fil d'ariane" className="text-xs text-brand-bleu/60">
            <Link href="/" className="hover:text-brand-bleu">
              Accueil
            </Link>
            {" / "}
            <span className="text-brand-bleu">Quitter Paris</span>
          </nav>

          <h1 className="mt-5 font-display text-4xl font-medium leading-tight tracking-tight text-brand-bleu sm:text-5xl">
            Quitter <span className="italic text-brand-iris">Paris</span>
            <span className="mt-1 block text-2xl font-normal text-brand-bleu/70 sm:text-3xl">
              Le guide honnête pour décider en 2026
            </span>
          </h1>

          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-neutral-800">
            <p>
              Tu y penses depuis trois ans, six mois, hier soir. Tu hésites
              entre la petite couronne, la province TGV, ou la vraie
              campagne. Tu lis dix témoignages enthousiastes pour un témoignage
              de retour. Cette page rassemble ce qu'aucun blog isolé ne te dira
              en bloc : pourquoi tu y penses vraiment, où aller selon ton
              profil, comment t'y prendre sans tout casser, et ce que les
              ex-Parisiens regrettent quand on les laisse parler franchement.
            </p>
            <p>
              On ne va pas te vendre une carte postale. Quitter Paris est
              parfois la meilleure décision d'une vie. C'est aussi parfois une
              fuite déguisée en projet. La différence se joue en amont, dans
              quelques questions précises que personne ne t'aide à formuler.
              C'est ce qu'on essaie de faire ici.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link
              href="/comparer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-bleu px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)] transition-transform hover:scale-[1.02]"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Compare 86 communes
            </Link>
            <a
              href="#cluster-pourquoi"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white/80 px-4 py-2.5 text-sm font-medium text-brand-bleu shadow-[0_2px_8px_rgba(82,98,122,0.08)] backdrop-blur transition-transform hover:scale-[1.02]"
            >
              Commencer par "Pourquoi"
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-neutral-100 bg-neutral-50/60 px-5 py-10 sm:px-7">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-bleu/60">
            Les chiffres 2026
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(82,98,122,0.05)]"
              >
                <div className="font-display text-3xl font-medium text-brand-iris-strong">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-neutral-800">{s.label}</div>
                <div className="mt-2 text-[10px] uppercase tracking-wider text-neutral-400">
                  {s.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLUSTERS */}
      {CLUSTERS.map((cluster, idx) => {
        const { Icon } = cluster;
        return (
          <section
            key={cluster.id}
            id={`cluster-${cluster.id}`}
            className={`scroll-mt-20 px-5 py-12 sm:px-7 ${idx % 2 === 0 ? "bg-white" : "bg-neutral-50/60"}`}
          >
            <div className="mx-auto max-w-4xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-iris-soft text-brand-iris-strong">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-iris-strong tabular-nums">
                    {String(idx + 1).padStart(2, "0")} / {String(CLUSTERS.length).padStart(2, "0")}
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-medium tracking-tight text-brand-bleu sm:text-3xl">
                    {cluster.label}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-neutral-600">
                    {cluster.question}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-3xl text-base leading-relaxed text-neutral-800">
                {cluster.intro}
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {cluster.articles.map((a) => {
                  const href = a.slug.startsWith("/")
                    ? a.slug
                    : `/blog/${a.slug}`;
                  return (
                    <li key={a.slug}>
                      <Link
                        href={href}
                        className="group flex h-full flex-col rounded-2xl border border-neutral-200/70 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-iris/40 hover:shadow-[0_8px_24px_rgba(82,98,122,0.08)]"
                      >
                        <div className="text-sm font-semibold text-neutral-900 group-hover:text-brand-bleu">
                          {a.title}
                        </div>
                        <div className="mt-1.5 flex-1 text-xs leading-relaxed text-neutral-600">
                          {a.hook}
                        </div>
                        <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-brand-iris-strong">
                          Lire l'article
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })}

      {/* FAQ */}
      <section className="bg-white px-5 py-12 sm:px-7">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-medium tracking-tight text-brand-bleu sm:text-3xl">
            Questions qu'on entend tous les jours
          </h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.question}
                className="group rounded-2xl border border-neutral-200/70 bg-white p-5 transition-all open:bg-neutral-50/60"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-neutral-900">
                  {f.question}
                  <span className="text-brand-iris-strong group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-br from-brand-iris-soft via-white to-brand-vert-soft px-5 py-14 sm:px-7">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-brand-bleu sm:text-4xl">
            Prêt à passer du doute à la décision ?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-800">
            Notre comparateur croise 86 communes IDF et 87 villages-gares TGV
            sur six critères que tu pondères toi-même. Tu auras un classement
            personnalisé en moins d'une minute, sans inscription.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <Link
              href="/comparer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-bleu px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)] transition-transform hover:scale-[1.02]"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Lancer le comparateur
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white/80 px-5 py-3 text-sm font-medium text-brand-bleu shadow-[0_2px_8px_rgba(82,98,122,0.08)] backdrop-blur transition-transform hover:scale-[1.02]"
            >
              Explorer la carte
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
