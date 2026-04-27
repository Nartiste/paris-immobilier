import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Train, Euro, Users, TrendingUp } from "lucide-react";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { communeToSlug } from "@/lib/slug";
import { formatEuros, formatNumber, formatPercent } from "@/lib/utils";
import type { Commune } from "@/lib/types";
import CityFooter from "@/components/CityFooter";

/**
 * Pages de comparaison statiques entre 2 communes.
 *
 * Ciblent des recherches haut intent comme :
 *  - "Vincennes ou Saint-Mandé"
 *  - "Versailles ou Saint-Germain-en-Laye"
 *  - "Reims vs Le Mans pour quitter Paris"
 *
 * Stratégie : pour chaque commune, 3 voisines logiques (même département +
 * temps Paris similaire). Déduplication par paire ordonnée. ~150 pages.
 */

export const dynamicParams = false;

function pairKey(a: Commune, b: Commune): string {
  const [first, second] = [a, b].sort((x, y) =>
    x.code_insee.localeCompare(y.code_insee),
  );
  return `${communeToSlug(first)}-vs-${communeToSlug(second)}`;
}

function buildPairs(): { a: Commune; b: Commune; slug: string }[] {
  const pairs: { a: Commune; b: Commune; slug: string }[] = [];
  const seen = new Set<string>();

  for (const a of SAMPLE_COMMUNES) {
    // 3 voisines : même département en priorité, sinon temps similaire
    const candidates = SAMPLE_COMMUNES.filter(
      (c) => c.code_insee !== a.code_insee,
    )
      .map((c) => ({
        commune: c,
        // Score de proximité : même département + différence temps faible
        proximite:
          (c.departement === a.departement ? 10 : 0) -
          Math.abs(c.temps_trajet_paris_min - a.temps_trajet_paris_min) * 0.3,
      }))
      .sort((x, y) => y.proximite - x.proximite)
      .slice(0, 3)
      .map((x) => x.commune);

    for (const b of candidates) {
      const slug = pairKey(a, b);
      if (seen.has(slug)) continue;
      seen.add(slug);
      // Trier les éléments de la paire par INSEE pour cohérence
      const [first, second] = [a, b].sort((x, y) =>
        x.code_insee.localeCompare(y.code_insee),
      );
      pairs.push({ a: first, b: second, slug });
    }
  }
  return pairs;
}

const ALL_PAIRS = buildPairs();
const PAIRS_BY_SLUG: Record<string, { a: Commune; b: Commune }> =
  Object.fromEntries(ALL_PAIRS.map((p) => [p.slug, { a: p.a, b: p.b }]));

export async function generateStaticParams() {
  return ALL_PAIRS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pair = PAIRS_BY_SLUG[slug];
  if (!pair) return { title: "Comparaison introuvable" };

  const title = `${pair.a.nom} ou ${pair.b.nom} : laquelle choisir ?`;
  const description = `Comparaison ${pair.a.nom} vs ${pair.b.nom} : prix immobilier, transports, qualité de vie. Données réelles pour t'aider à décider où vivre près de Paris.`;

  return {
    title,
    description,
    alternates: { canonical: `/comparer/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_FR",
      url: `/comparer/${slug}`,
    },
  };
}

export default async function PageCompare({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pair = PAIRS_BY_SLUG[slug];
  if (!pair) notFound();

  const { a, b } = pair;

  // Verdicts simples par critère
  const better = (x: number | null | undefined, y: number | null | undefined, lower = false) => {
    if (x == null || y == null || x === y) return null;
    return (x < y) === lower ? "b" : "a";
  };

  const rows: {
    label: string;
    aValue: string;
    bValue: string;
    winner: "a" | "b" | null;
  }[] = [
    {
      label: "Prix m² achat",
      aValue:
        a.prix_m2_median != null ? `${formatEuros(a.prix_m2_median)}/m²` : "—",
      bValue:
        b.prix_m2_median != null ? `${formatEuros(b.prix_m2_median)}/m²` : "—",
      winner: better(a.prix_m2_median, b.prix_m2_median, true),
    },
    {
      label: "Loyer m²",
      aValue:
        a.loyer_m2_median != null ? `${formatEuros(a.loyer_m2_median)}/m²` : "—",
      bValue:
        b.loyer_m2_median != null ? `${formatEuros(b.loyer_m2_median)}/m²` : "—",
      winner: better(a.loyer_m2_median, b.loyer_m2_median, true),
    },
    {
      label: "Trajet Paris",
      aValue: `${a.temps_trajet_paris_min} min`,
      bValue: `${b.temps_trajet_paris_min} min`,
      winner: better(a.temps_trajet_paris_min, b.temps_trajet_paris_min, true),
    },
    {
      label: "Population",
      aValue: formatNumber(a.population),
      bValue: formatNumber(b.population),
      winner: null,
    },
    {
      label: "Revenu médian",
      aValue: a.revenu_median != null ? formatEuros(a.revenu_median) : "—",
      bValue: b.revenu_median != null ? formatEuros(b.revenu_median) : "—",
      winner: better(a.revenu_median, b.revenu_median),
    },
    {
      label: "Taux chômage",
      aValue: formatPercent(a.taux_chomage),
      bValue: formatPercent(b.taux_chomage),
      winner: better(a.taux_chomage, b.taux_chomage, true),
    },
    {
      label: "Rendement locatif",
      aValue: formatPercent(a.rendement_locatif),
      bValue: formatPercent(b.rendement_locatif),
      winner: better(a.rendement_locatif, b.rendement_locatif),
    },
    {
      label: "Espaces verts",
      aValue: formatPercent(a.espaces_verts_pct, 0),
      bValue: formatPercent(b.espaces_verts_pct, 0),
      winner: better(a.espaces_verts_pct, b.espaces_verts_pct),
    },
    {
      label: "Évolution prix 5 ans",
      aValue: formatPercent(a.prix_m2_evolution_5y),
      bValue: formatPercent(b.prix_m2_evolution_5y),
      winner: better(a.prix_m2_evolution_5y, b.prix_m2_evolution_5y),
    },
  ];

  const aWins = rows.filter((r) => r.winner === "a").length;
  const bWins = rows.filter((r) => r.winner === "b").length;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${a.nom} ou ${b.nom} : laquelle est la moins chère ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            a.prix_m2_median != null && b.prix_m2_median != null
              ? a.prix_m2_median < b.prix_m2_median
                ? `${a.nom} est moins chère, à ${formatEuros(a.prix_m2_median)}/m² contre ${formatEuros(b.prix_m2_median)}/m² pour ${b.nom}.`
                : `${b.nom} est moins chère, à ${formatEuros(b.prix_m2_median)}/m² contre ${formatEuros(a.prix_m2_median)}/m² pour ${a.nom}.`
              : "Données prix incomplètes pour répondre.",
        },
      },
      {
        "@type": "Question",
        name: `${a.nom} ou ${b.nom} : laquelle est la mieux desservie vers Paris ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            a.temps_trajet_paris_min < b.temps_trajet_paris_min
              ? `${a.nom} est plus rapide vers Paris (${a.temps_trajet_paris_min} min via ${a.ligne_principale ?? a.mode_principal}) contre ${b.temps_trajet_paris_min} min pour ${b.nom}.`
              : `${b.nom} est plus rapide vers Paris (${b.temps_trajet_paris_min} min via ${b.ligne_principale ?? b.mode_principal}) contre ${a.temps_trajet_paris_min} min pour ${a.nom}.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="mx-auto max-w-4xl px-6 py-10">
        <nav aria-label="Fil d'ariane" className="mb-6 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Accueil
          </Link>
          {" / "}
          <Link href="/" className="hover:text-neutral-900">
            Comparer
          </Link>
          {" / "}
          <span className="text-neutral-900">
            {a.nom} vs {b.nom}
          </span>
        </nav>

        <h1 className="font-display text-3xl font-medium tracking-tight text-brand-bleu sm:text-4xl">
          {a.nom} ou {b.nom} : laquelle choisir ?
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-700">
          Comparaison directe entre {a.nom} ({a.code_postal}) et {b.nom} (
          {b.code_postal}) sur le prix immobilier, le temps de trajet vers
          Paris, la qualité de vie et les indicateurs socio-économiques. Données
          INSEE FILOSOFI, DVF et SNCF Connect actualisées.
        </p>

        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <CommuneSummary commune={a} highlight={aWins > bWins} />
          <CommuneSummary commune={b} highlight={bWins > aWins} />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
            Comparaison critère par critère
          </h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-4 py-3 text-left">Critère</th>
                  <th className="px-4 py-3 text-right">{a.nom}</th>
                  <th className="px-4 py-3 text-right">{b.nom}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((r) => (
                  <tr key={r.label}>
                    <td className="px-4 py-3 text-neutral-700">{r.label}</td>
                    <td
                      className={`px-4 py-3 text-right font-medium tabular-nums ${
                        r.winner === "a"
                          ? "text-emerald-700"
                          : "text-neutral-800"
                      }`}
                    >
                      {r.aValue}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium tabular-nums ${
                        r.winner === "b"
                          ? "text-emerald-700"
                          : "text-neutral-800"
                      }`}
                    >
                      {r.bValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            En vert : la valeur la plus avantageuse pour le critère donné.
          </p>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            href={`/vivre-a/${communeToSlug(a)}`}
            className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 hover:border-neutral-300 hover:bg-neutral-100"
          >
            <div className="text-xs uppercase tracking-wider text-neutral-500">
              Fiche détaillée
            </div>
            <div className="mt-1 text-base font-semibold text-neutral-900">
              Vivre à {a.nom} →
            </div>
          </Link>
          <Link
            href={`/vivre-a/${communeToSlug(b)}`}
            className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 hover:border-neutral-300 hover:bg-neutral-100"
          >
            <div className="text-xs uppercase tracking-wider text-neutral-500">
              Fiche détaillée
            </div>
            <div className="mt-1 text-base font-semibold text-neutral-900">
              Vivre à {b.nom} →
            </div>
          </Link>
        </section>

        <section className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-700 p-7 text-center text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
          <p className="text-sm text-neutral-700">
            Comparer plus de villes avec tes propres critères ?
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-transform hover:scale-[1.02]"
          >
            Ouvrir le comparateur interactif
          </Link>
        </section>
      </article>

      <CityFooter />
    </div>
  );
}

function CommuneSummary({
  commune,
  highlight,
}: {
  commune: Commune;
  highlight: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-emerald-300 bg-emerald-50/30"
          : "border-neutral-200 bg-white"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-neutral-900">
          {commune.nom}
        </h3>
        <span className="text-xs text-neutral-500">{commune.code_postal}</span>
      </div>
      <div className="mt-2 space-y-1.5 text-xs text-neutral-700">
        <div className="inline-flex items-center gap-1.5">
          <Train className="h-3 w-3" />
          {commune.temps_trajet_paris_min} min de Paris
          {commune.ligne_principale && ` · ${commune.ligne_principale}`}
        </div>
        <div className="inline-flex items-center gap-1.5">
          <Users className="h-3 w-3" />
          {formatNumber(commune.population)} habitants
        </div>
        {commune.prix_m2_median != null && (
          <div className="inline-flex items-center gap-1.5">
            <Euro className="h-3 w-3" />
            {formatEuros(commune.prix_m2_median)}/m² médian
          </div>
        )}
        {commune.prix_m2_evolution_5y != null && (
          <div className="inline-flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3" />
            {formatPercent(commune.prix_m2_evolution_5y)} sur 5 ans
          </div>
        )}
      </div>
    </div>
  );
}
