import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Train, Euro, Sparkles, MapPin, ArrowRightLeft } from "lucide-react";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { TRANSPORT_LINES } from "@/lib/transport-lines";
import { PERSONAS } from "@/lib/persona";
import { communeToSlug } from "@/lib/slug";
import { computeCommuneScore, scoreToColor } from "@/lib/scoring";
import { DEFAULT_WEIGHTS, type Commune } from "@/lib/types";
import { formatEuros } from "@/lib/utils";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { faqJsonLd, type FAQ } from "@/lib/commune-faqs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

export const metadata: Metadata = {
  title: "Où vivre près de Paris ? Le guide 2026 des 86 meilleures communes",
  description:
    "Tu veux quitter Paris sans couper avec la capitale ? On compare 86 communes accessibles en 15 min à 2 h : prix immobilier, transports, qualité de vie, futures gares Grand Paris Express. Le guide complet 2026.",
  keywords: [
    "où vivre près de Paris",
    "où habiter près de Paris",
    "quitter Paris",
    "ville à 30 minutes de Paris",
    "ville à 45 minutes de Paris",
    "comparateur communes Île-de-France",
    "prix immobilier banlieue Paris",
    "Grand Paris Express",
    "ville TGV près de Paris",
    "meilleures villes pour quitter Paris 2026",
  ],
  alternates: { canonical: "/ou-vivre-pres-de-paris" },
  openGraph: {
    type: "article",
    locale: "fr_FR",
    url: "/ou-vivre-pres-de-paris",
    title: "Où vivre près de Paris ? Le guide 2026 des 86 meilleures communes",
    description:
      "Compare 86 communes pour quitter Paris : prix m², trajets, qualité de vie, futures gares Grand Paris Express.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Où vivre près de Paris ? Le guide 2026",
    description: "86 communes comparées : prix, trajets, qualité de vie.",
    images: ["/brand/og.png"],
  },
};

export default function OuVivreParisPage() {
  // === Top 10 par score absolu ===
  const ranked = SAMPLE_COMMUNES.map((c) => ({
    commune: c,
    score: computeCommuneScore(c, DEFAULT_WEIGHTS, "absolu", "acheteur").total,
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // === Stats globales ===
  const prixValues = SAMPLE_COMMUNES
    .map((c) => c.prix_m2_median)
    .filter((p): p is number => p != null)
    .sort((a, b) => a - b);
  const prixMin = prixValues[0];
  const prixMax = prixValues[prixValues.length - 1];
  const trajetMin = Math.min(...SAMPLE_COMMUNES.map((c) => c.temps_trajet_paris_min));
  const trajetMax = Math.max(...SAMPLE_COMMUNES.map((c) => c.temps_trajet_paris_min));

  // === Groupes par budget ===
  const budgetSous3000 = filterAndSort(SAMPLE_COMMUNES, (c) => (c.prix_m2_median ?? 99999) < 3000, "score").slice(0, 6);
  const budget3to5000 = filterAndSort(SAMPLE_COMMUNES, (c) => {
    const p = c.prix_m2_median ?? 0;
    return p >= 3000 && p < 5000;
  }, "score").slice(0, 6);
  const budgetPlus5000 = filterAndSort(SAMPLE_COMMUNES, (c) => (c.prix_m2_median ?? 0) >= 5000, "score").slice(0, 6);

  // === Groupes par temps de trajet ===
  const trajetBuckets = [
    { label: "15 min de Paris", max: 20, communes: filterAndSort(SAMPLE_COMMUNES, (c) => c.temps_trajet_paris_min <= 20, "score").slice(0, 5) },
    { label: "30 min de Paris", max: 32, communes: filterAndSort(SAMPLE_COMMUNES, (c) => c.temps_trajet_paris_min > 20 && c.temps_trajet_paris_min <= 32, "score").slice(0, 5) },
    { label: "45 min de Paris", max: 47, communes: filterAndSort(SAMPLE_COMMUNES, (c) => c.temps_trajet_paris_min > 32 && c.temps_trajet_paris_min <= 47, "score").slice(0, 5) },
    { label: "1 heure de Paris", max: 65, communes: filterAndSort(SAMPLE_COMMUNES, (c) => c.temps_trajet_paris_min > 47 && c.temps_trajet_paris_min <= 65, "score").slice(0, 5) },
    { label: "1 h 30 de Paris", max: 95, communes: filterAndSort(SAMPLE_COMMUNES, (c) => c.temps_trajet_paris_min > 65 && c.temps_trajet_paris_min <= 95, "score").slice(0, 5) },
    { label: "2 h de Paris", max: 130, communes: filterAndSort(SAMPLE_COMMUNES, (c) => c.temps_trajet_paris_min > 95, "score").slice(0, 5) },
  ];

  // === Par mode de transport ===
  const modeBuckets = [
    { label: "RER", description: "RER A, B, C, D, E", communes: filterAndSort(SAMPLE_COMMUNES, (c) => c.mode_principal === "rer", "score").slice(0, 5) },
    { label: "Transilien", description: "Lignes H, J, K, L, N, P, R, U", communes: filterAndSort(SAMPLE_COMMUNES, (c) => c.mode_principal === "transilien", "score").slice(0, 5) },
    { label: "Métro", description: "Lignes 1, 9, 13, 14", communes: filterAndSort(SAMPLE_COMMUNES, (c) => c.mode_principal === "metro", "score").slice(0, 5) },
    { label: "TGV / Intercités", description: "Province à grande vitesse", communes: filterAndSort(SAMPLE_COMMUNES, (c) => c.mode_principal === "tgv", "score").slice(0, 5) },
  ].filter((b) => b.communes.length > 0);

  // === Communes GPE ===
  const gpeCommunes = filterAndSort(SAMPLE_COMMUNES, (c) => (c.bonus_gpe ?? 0) > 0.4, "score").slice(0, 8);

  // === FAQs page-level ===
  const faqs: FAQ[] = [
    {
      question: "Quelle est la meilleure ville pour quitter Paris en 2026 ?",
      answer: `Il n'y a pas de réponse unique : tout dépend de ton budget, de ton temps de trajet maximum acceptable, et de ton profil (famille, télétravail, investisseur). Notre comparateur croise six critères pondérables pour ranker 86 communes. En tête actuellement : ${ranked.slice(0, 3).map((r) => r.commune.nom).join(", ")} — toutes accessibles en moins de 30 minutes du centre de Paris avec un score global supérieur à 65/100.`,
    },
    {
      question: "Quelle ville à 30 minutes de Paris choisir ?",
      answer: `Dans la fourchette 20 à 32 minutes vers Paris, les communes les mieux notées sont ${trajetBuckets[1].communes.slice(0, 4).map((c) => c.nom).join(", ")}. Ce sont des villes de petite couronne ou très bien desservies (M14, RER E, Transilien L), avec des prix immobiliers entre 4 000 et 7 000 €/m².`,
    },
    {
      question: "Combien coûte un logement en banlieue parisienne ?",
      answer: `Sur les 86 communes que nous étudions, le prix médian au m² varie de ${formatEuros(prixMin)} à ${formatEuros(prixMax)} €. Les communes les moins chères sont en province (Mâcon, Évreux, Soissons) accessibles en TGV ou Intercités. Les plus chères sont en petite couronne ouest (Neuilly-sur-Seine, Boulogne-Billancourt, Saint-Cloud).`,
    },
    {
      question: "Quelles sont les villes à acheter avant le Grand Paris Express ?",
      answer: `Les communes desservies par le Grand Paris Express qui n'ont pas encore vu leur prix exploser : ${gpeCommunes.slice(0, 5).map((c) => c.nom).join(", ")}. Ce sont des paris à 2-5 ans, le temps que les gares ouvrent (échelonnement entre 2026 et 2030).`,
    },
    {
      question: "Peut-on vivre près de Paris en télétravail ?",
      answer: `Oui, et c'est même le cas d'usage qui débloque le plus d'options. Dès que tu n'as plus besoin de faire Paris tous les jours, les villes accessibles en 1 h à 1 h 30 deviennent jouables — Reims, Tours, Orléans, Chartres. Les prix y sont 2 à 4 fois inférieurs à Paris pour des surfaces sans commune mesure.`,
    },
    {
      question: "Quelle ville pour acheter en banlieue parisienne avec un petit budget ?",
      answer: `Avec un budget sous 3 000 €/m², regarde les communes du nord et de l'est : ${budgetSous3000.slice(0, 5).map((c) => c.nom).join(", ")}. Tu y trouveras des trois-pièces de 65 m² entre 130 000 et 200 000 €.`,
    },
    {
      question: "Comment choisir entre acheter en Île-de-France ou en province ?",
      answer: `La règle simple : si tu vas à Paris plus de deux jours par semaine, reste en Île-de-France. Si tu y vas zéro à deux jours par semaine, la province ouvre des opportunités énormes — surface, qualité de vie, prix divisés. Une ville comme Reims (50 min en TGV) ou Tours (65 min en TGV) peut être plus pratique qu'une grande couronne IDF mal desservie.`,
    },
    {
      question: "Quelles villes ont les meilleures écoles pour les familles ?",
      answer: `Les communes que nous classons les mieux pour les familles combinent densité scolaire, espaces verts (>20 % du territoire) et sécurité. Voir notre sélection détaillée sur la page “Quitter Paris en famille”, qui classe les communes selon ces trois axes pondérés.`,
    },
    {
      question: "Le Grand Paris Express va-t-il faire monter les prix ?",
      answer: `Oui, c'est attendu. Les premières études Notaires de France montrent un effet d'anticipation de l'ordre de +5 à +12 % sur les communes desservies par les nouvelles gares, dès l'annonce ferme du calendrier. Les hausses fortes interviennent généralement 6 à 18 mois avant et après la mise en service. Échéance principale : 2026-2030.`,
    },
    {
      question: "Quelle est la ville la moins chère pour quitter Paris ?",
      answer: `${budgetSous3000[0]?.nom ?? "Plusieurs communes"} affiche un des prix médians les plus bas de notre dataset. Mais le “moins cher” isolé n'a pas de sens : il faut croiser avec le temps de trajet et la qualité de vie. Notre Top 10 prix bas + bonne accessibilité est consultable directement dans le comparateur.`,
    },
  ];

  // === JSON-LD ===
  const breadcrumbsLd = breadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Où vivre près de Paris" },
  ]);

  const faqLd = faqJsonLd(faqs);

  const topListLd = itemListJsonLd(
    ranked.map((r) => ({
      url: `/vivre-a/${communeToSlug(r.commune)}`,
      name: r.commune.nom,
    })),
    "Top 10 des meilleures communes pour quitter Paris en 2026",
  );

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Où vivre près de Paris ? Le guide 2026 des 86 meilleures communes",
    description:
      "Comparateur des 86 meilleures communes pour quitter Paris : prix immobilier, transports, qualité de vie, futures gares Grand Paris Express.",
    author: { "@type": "Organization", name: "Vivre près de Paris" },
    publisher: {
      "@type": "Organization",
      name: "Vivre près de Paris",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/icon-512.png` },
    },
    inLanguage: "fr-FR",
    datePublished: "2026-04-29",
    dateModified: new Date().toISOString().slice(0, 10),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/ou-vivre-pres-de-paris` },
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(topListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-iris-soft via-white to-brand-vert-soft px-5 pt-10 pb-12 sm:px-7">
        <div aria-hidden className="absolute -right-24 -top-12 h-72 w-72 rounded-full bg-brand-iris/15 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <nav aria-label="Fil d'ariane" className="text-xs text-brand-bleu/60">
            <Link href="/" className="hover:text-brand-bleu">Accueil</Link>
            {" / "}
            <span className="text-brand-bleu">Où vivre près de Paris</span>
          </nav>

          <h1 className="mt-5 font-display text-4xl font-medium leading-tight tracking-tight text-brand-bleu sm:text-5xl">
            Où vivre <span className="italic text-brand-iris">près de Paris</span> ?
            <span className="mt-1 block text-2xl font-normal text-brand-bleu/70 sm:text-3xl">
              Le guide 2026 des 86 meilleures communes
            </span>
          </h1>

          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-neutral-800">
            <p>
              Tu veux quitter Paris sans couper le cordon avec la capitale.
              Tu hésites entre la petite couronne, la grande couronne, ou
              une vraie ville de province à une heure de TGV. Tu cherches le bon
              équilibre entre prix immobilier, temps de trajet, qualité de
              vie et perspective d'investissement. Cette page rassemble la
              réponse pour 86 communes — chacune notée sur six critères,
              avec ses prix réels DVF, ses temps de trajet vérifiés, ses gares
              actuelles et futures.
            </p>
            <p>
              Pas de classement universel : c'est ton projet qui dicte le
              meilleur choix. Ci-dessous, on te donne les clés pour trier
              selon ton budget, ton temps de trajet acceptable, ton profil
              (famille, télétravail, investisseur) et ton mode de transport
              préféré.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <a
              href="#top-10"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-bleu px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)] transition-transform hover:scale-[1.02]"
            >
              Voir le top 10
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/comparer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-iris px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(157,140,242,0.4)] transition-transform hover:scale-[1.02]"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Comparer 2 villes
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-brand-bleu shadow-[0_2px_8px_rgba(82,98,122,0.08)] transition-transform hover:scale-[1.02]"
            >
              Carte interactive
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            <Stat label="Communes étudiées" value="86" sub="Île-de-France + couronne TGV" />
            <Stat label="Prix m²" value={`${formatEuros(prixMin)}–${formatEuros(prixMax)} €`} sub="Médianes DVF 2026" />
            <Stat label="Temps de trajet" value={`${trajetMin}–${trajetMax} min`} sub="Centre Paris porte-à-porte" />
            <Stat label="Sources" value="DVF · INSEE · SNCF" sub="Données officielles 2025-2026" />
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-5 py-12 sm:px-7">
        {/* SOMMAIRE */}
        <nav aria-label="Sommaire" className="mb-12 rounded-3xl bg-neutral-50 p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-bleu/60">
            Sommaire
          </p>
          <ol className="grid gap-1.5 text-sm text-brand-bleu sm:grid-cols-2">
            <li><a href="#pourquoi" className="hover:underline">1. Pourquoi quitter Paris en 2026 ?</a></li>
            <li><a href="#top-10" className="hover:underline">2. Top 10 des meilleures communes</a></li>
            <li><a href="#par-profil" className="hover:underline">3. Choisir selon ton profil</a></li>
            <li><a href="#par-budget" className="hover:underline">4. Choisir selon ton budget</a></li>
            <li><a href="#par-trajet" className="hover:underline">5. Choisir selon le temps de trajet</a></li>
            <li><a href="#par-mode" className="hover:underline">6. Choisir selon le mode de transport</a></li>
            <li><a href="#gpe" className="hover:underline">7. Le rôle du Grand Paris Express</a></li>
            <li><a href="#cout" className="hover:underline">8. Combien ça coûte de quitter Paris ?</a></li>
            <li><a href="#faq" className="hover:underline">9. Questions fréquentes</a></li>
          </ol>
        </nav>

        {/* POURQUOI */}
        <section id="pourquoi" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-bleu">
            Pourquoi quitter Paris en 2026 ?
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-neutral-800">
            <p>
              Le prix médian au m² à Paris intra-muros plafonne autour de
              10 500 € — un T3 de 65 m² dépasse les 680 000 €. À surface
              égale, beaucoup de communes accessibles à moins de 30 minutes
              proposent le même produit pour 2 à 4 fois moins. La promesse
              parisienne (proximité du travail, vie culturelle, services)
              s'est en grande partie déplacée vers ces communes au fil
              de la décennie.
            </p>
            <p>
              Trois facteurs structurels accélèrent le mouvement : la
              généralisation du télétravail (qui débloque les villes à 1 h
              de TGV), l'arrivée du Grand Paris Express (qui fait basculer
              une trentaine de communes de la grande couronne vers le statut
              de “20-30 minutes de Châtelet”), et la pression sur les
              budgets familiaux qui rend l'achat d'un T4 parisien
              inaccessible à la plupart des actifs en dessous de 35 ans.
            </p>
            <p>
              Quitter Paris ne veut plus dire renoncer à Paris. Bien choisi,
              le déménagement gagne du jour au lendemain entre 30 et 80 m²,
              divise les dépenses logement par deux, et conserve un accès
              quotidien à la capitale.
            </p>
          </div>
        </section>

        {/* TOP 10 */}
        <section id="top-10" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-bleu">
            Top 10 des meilleures communes pour quitter Paris
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Classement absolu pondéré sur six critères : prix, temps de
            trajet, économie locale, qualité de vie, éducation, futur
            transport. Source : nos calculs à partir des données DVF,
            INSEE et IDF Mobilités.
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-100">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-[11px] uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">#</th>
                  <th className="px-4 py-2.5 font-semibold">Commune</th>
                  <th className="px-4 py-2.5 font-semibold">Trajet</th>
                  <th className="px-4 py-2.5 font-semibold">Prix m²</th>
                  <th className="px-4 py-2.5 font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((r, i) => {
                  const color = scoreToColor(r.score);
                  return (
                    <tr key={r.commune.code_insee} className="border-t border-neutral-100 hover:bg-brand-iris-soft/30">
                      <td className="px-4 py-3 font-semibold text-neutral-400 tabular-nums">{i + 1}</td>
                      <td className="px-4 py-3">
                        <Link href={`/vivre-a/${communeToSlug(r.commune)}`} className="font-semibold text-brand-bleu hover:underline">
                          {r.commune.nom}
                        </Link>
                        <span className="ml-2 text-[11px] text-neutral-500">{r.commune.code_postal}</span>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-neutral-700">{r.commune.temps_trajet_paris_min} min</td>
                      <td className="px-4 py-3 tabular-nums text-neutral-700">
                        {r.commune.prix_m2_median != null ? `${formatEuros(r.commune.prix_m2_median)} €` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums" style={{ backgroundColor: `${color}22`, color }}>
                          {r.score}/100
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* PAR PROFIL */}
        <section id="par-profil" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-bleu">
            Choisir selon ton profil
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Trois sélections curatées selon ton projet de vie. Chaque page
            détaille les critères de notation et liste les meilleures
            communes par persona.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {PERSONAS.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="group rounded-3xl border border-brand-iris/15 bg-white p-5 shadow-[0_2px_8px_rgba(82,98,122,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(157,140,242,0.18)]"
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-iris-soft text-brand-bleu">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="font-display text-lg font-medium text-brand-bleu">
                  {p.shortLabel}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 line-clamp-3">
                  {p.metaDescription}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-iris-strong">
                  Voir la sélection
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* PAR BUDGET */}
        <section id="par-budget" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-bleu">
            Choisir selon ton budget
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Trois fourchettes de prix au m², avec les communes les mieux
            notées dans chacune.
          </p>

          <BudgetBlock
            anchor="budget-bas"
            title="Sous 3 000 €/m²"
            sub="Pour acheter grand avec un budget contraint — souvent province ou nord/est francilien"
            communes={budgetSous3000}
          />
          <BudgetBlock
            anchor="budget-mid"
            title="De 3 000 à 5 000 €/m²"
            sub="Le sweet spot des actifs parisiens : grande couronne IDF + petites villes accessibles en TER"
            communes={budget3to5000}
          />
          <BudgetBlock
            anchor="budget-haut"
            title="Au-dessus de 5 000 €/m²"
            sub="Petite couronne ouest et villes prisées — pour qui privilégie la proximité quotidienne de Paris"
            communes={budgetPlus5000}
          />
        </section>

        {/* PAR TRAJET */}
        <section id="par-trajet" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-bleu">
            Choisir selon le temps de trajet vers Paris
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            De la petite couronne (15 min en métro étendu) aux villes TGV à
            2 heures, voici une sélection par fourchette de durée.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {trajetBuckets.map((b) => (
              <div key={b.label} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <h3 className="font-semibold text-brand-bleu">{b.label}</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {b.communes.map((c) => (
                    <li key={c.code_insee}>
                      <Link href={`/vivre-a/${communeToSlug(c)}`} className="text-neutral-700 hover:text-brand-bleu hover:underline">
                        {c.nom}
                      </Link>
                      <span className="ml-2 text-[11px] text-neutral-400">
                        {c.prix_m2_median != null ? `${formatEuros(c.prix_m2_median)} €/m²` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* PAR MODE */}
        <section id="par-mode" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-bleu">
            Choisir selon le mode de transport
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            La fiabilité de ta ligne change radicalement ton expérience
            quotidienne. Voici les meilleures communes par mode dominant.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {modeBuckets.map((m) => (
              <div key={m.label} className="rounded-2xl border border-neutral-100 bg-white p-5">
                <div className="flex items-center gap-2">
                  <Train className="h-4 w-4 text-brand-iris" />
                  <h3 className="font-semibold text-brand-bleu">{m.label}</h3>
                </div>
                <p className="mt-1 text-[11px] text-neutral-500">{m.description}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {m.communes.map((c) => (
                    <li key={c.code_insee}>
                      <Link href={`/vivre-a/${communeToSlug(c)}`} className="text-neutral-700 hover:text-brand-bleu hover:underline">
                        {c.nom}
                      </Link>
                      <span className="ml-2 text-[11px] text-neutral-400">{c.temps_trajet_paris_min} min</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-neutral-500">
            Pour aller plus loin :{" "}
            {TRANSPORT_LINES.slice(0, 6).map((l, i) => (
              <span key={l.id}>
                <Link href={`/lignes/${l.id}`} className="text-brand-iris-strong hover:underline">
                  {l.code}
                </Link>
                {i < 5 ? ", " : ""}
              </span>
            ))}
            … fiches détaillées par ligne avec score de réputation.
          </p>
        </section>

        {/* GPE */}
        <section id="gpe" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-bleu">
            Le rôle du Grand Paris Express
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-neutral-800">
            <p>
              Le Grand Paris Express est le plus grand projet de transport
              en commun européen depuis 50 ans : 200 km de nouvelles lignes
              automatiques (M15, M16, M17, M18) et 68 nouvelles gares,
              déployées par étapes jusqu'à 2030. Pour qui cherche où vivre
              près de Paris, c'est l'événement structurant du marché
              immobilier des cinq prochaines années.
            </p>
            <p>
              Concrètement : une trentaine de communes de la première et
              deuxième couronne basculent du statut “éloignée mais bon
              prix” à “bien desservie” en l'espace d'une mise en service.
              Les études Notaires de France anticipent un effet prix de
              l'ordre de 5 à 12 % par étape, parfois plus pour les communes
              auparavant mal connectées.
            </p>
            <p>
              Stratégiquement, c'est la fenêtre d'achat la plus
              intéressante des dernières années — à condition de cibler
              les communes dont les gares ont une date d'ouverture ferme.
              Voici les nôtres :
            </p>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {gpeCommunes.map((c) => (
              <Link
                key={c.code_insee}
                href={`/vivre-a/${communeToSlug(c)}`}
                className="flex items-center justify-between rounded-2xl bg-brand-iris-soft/30 px-4 py-3 transition-colors hover:bg-brand-iris-soft/60"
              >
                <span className="font-medium text-brand-bleu">{c.nom}</span>
                <span className="text-xs text-brand-iris-strong">
                  {c.prix_m2_median != null ? `${formatEuros(c.prix_m2_median)} €/m²` : ""} · {c.temps_trajet_paris_min} min
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* COÛT */}
        <section id="cout" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-bleu">
            Combien ça coûte de quitter Paris ?
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-neutral-800">
            <p>
              Quitter Paris a un coût à la sortie qu'on sous-estime
              souvent. Au-delà du prix d'achat, compter :
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-neutral-700">
              <li>
                <strong>Frais de notaire</strong> : 7 à 8 % du prix
                d'achat dans l'ancien, 2 à 3 % dans le neuf.
              </li>
              <li>
                <strong>Frais de courtage crédit</strong> : 0,5 à 1 % du
                montant emprunté, parfois offerts.
              </li>
              <li>
                <strong>Déménagement</strong> : 1 500 à 5 000 € selon
                volume et distance.
              </li>
              <li>
                <strong>Travaux & équipement</strong> : 5 à 15 % du prix
                d'achat pour adapter le bien.
              </li>
              <li>
                <strong>Assurance habitation</strong> : 200 à 600 € par
                an selon surface et localisation.
              </li>
            </ul>
            <p>
              Voir notre article détaillé{" "}
              <Link
                href="/blog/combien-coute-vraiment-quitter-paris-budget"
                className="text-brand-iris-strong underline"
              >
                Combien ça coûte vraiment de quitter Paris : le budget complet
              </Link>{" "}
              pour des fourchettes chiffrées par typologie de projet.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-bleu">
            Questions fréquentes
          </h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.question}
                className="group rounded-2xl border border-neutral-100 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_4px_14px_rgba(82,98,122,0.08)]"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900 marker:hidden">
                  <span className="flex items-start justify-between gap-3">
                    <span>{f.question}</span>
                    <span className="mt-0.5 text-brand-bleu/40 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-bleu via-brand-bleu to-brand-iris p-8 text-center shadow-[0_8px_24px_rgba(82,98,122,0.18)]">
          <h2 className="font-display text-2xl font-medium text-white sm:text-3xl">
            Prêt à passer à l'action ?
          </h2>
          <p className="mt-3 text-base text-white/80">
            Compare deux villes côte à côte ou pose ta question au concierge IA.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/comparer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-bleu shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-transform hover:scale-[1.02]"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Ouvrir le comparateur
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition-transform hover:scale-[1.02] hover:bg-white/20"
            >
              <MapPin className="h-3.5 w-3.5" />
              Voir la carte
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}

// --- helpers ---

function filterAndSort(
  communes: Commune[],
  filter: (c: Commune) => boolean,
  by: "score" | "prix",
): Commune[] {
  return communes
    .filter(filter)
    .map((c) => ({
      c,
      key:
        by === "score"
          ? -computeCommuneScore(c, DEFAULT_WEIGHTS, "absolu", "acheteur").total
          : c.prix_m2_median ?? 99999,
    }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.c);
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_2px_8px_rgba(82,98,122,0.06)]">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-bleu/60">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-brand-bleu tabular-nums">
        {value}
      </div>
      <div className="text-[10px] text-neutral-500">{sub}</div>
    </div>
  );
}

function BudgetBlock({
  anchor,
  title,
  sub,
  communes,
}: {
  anchor: string;
  title: string;
  sub: string;
  communes: Commune[];
}) {
  return (
    <div id={anchor} className="mt-6 rounded-2xl border border-neutral-100 bg-white p-5 scroll-mt-24">
      <h3 className="font-display text-lg font-medium text-brand-bleu">
        {title}
      </h3>
      <p className="mt-1 text-xs text-neutral-500">{sub}</p>
      <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
        {communes.map((c) => (
          <li key={c.code_insee}>
            <Link href={`/vivre-a/${communeToSlug(c)}`} className="text-neutral-800 hover:text-brand-bleu hover:underline">
              {c.nom}
            </Link>
            <span className="ml-2 text-[11px] text-neutral-500 tabular-nums">
              {c.prix_m2_median != null ? `${formatEuros(c.prix_m2_median)} €/m²` : ""}
              {" · "}
              <Euro className="inline h-3 w-3" /> {c.temps_trajet_paris_min} min
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
