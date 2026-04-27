import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Train, Euro, MapPin } from "lucide-react";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { communeToSlug } from "@/lib/slug";
import { formatEuros, formatPercent } from "@/lib/utils";
import CityFooter from "@/components/CityFooter";

/**
 * Pages thématiques par temps de trajet vers Paris.
 * Cible des recherches très haut volume :
 *  - "ville à 30 minutes de Paris"
 *  - "ville à 45 min de Paris"
 *  - "ville à 1h de Paris"
 *  - "ville à 90 min de Paris"
 */

export const dynamicParams = false;

const BUCKETS: { temps: number; label: string; description: string }[] = [
  {
    temps: 15,
    label: "15 minutes",
    description:
      "Le tout premier cercle. Tu es à un saut de Paris, mais les prix s'en ressentent : la plupart des communes éligibles sont en petite couronne ouest et nord, à des prix souvent supérieurs à 7 000 €/m².",
  },
  {
    temps: 30,
    label: "30 minutes",
    description:
      "Le sweet spot des actifs parisiens : tu rentres en moins de 30 minutes, tu peux envisager une vie sociale parisienne sans planifier comme un général. Beaucoup de communes en petite couronne ou très bien desservies (M14, RER E, Transilien L).",
  },
  {
    temps: 45,
    label: "45 minutes",
    description:
      "Le compromis intelligent : tu pousses le curseur de 15 minutes par rapport à la zone bouchon, et tu gagnes massivement en pouvoir d'achat immobilier. Beaucoup de villes des Yvelines, Essonne et grande couronne entrent ici.",
  },
  {
    temps: 60,
    label: "1 heure",
    description:
      "Une heure porte-à-porte, c'est encore acceptable au quotidien si ton trajet est en train direct (Transilien moderne ou RER fiable). Tu accèdes à des villes secondaires où les budgets se relâchent vraiment.",
  },
  {
    temps: 90,
    label: "1 h 30",
    description:
      "Au-delà d'1h15-1h30, tu sors de la logique du quotidien et tu entres dans celle du télétravail hybride. Idéal pour 2-3 jours / semaine au bureau, mais à éviter en daily commute.",
  },
  {
    temps: 120,
    label: "2 heures",
    description:
      "Deux heures, c'est la frontière mentale. À ce niveau, on parle de villes moyennes desservies par TGV (Reims, Le Mans, Tours, Orléans) où tu vis vraiment en province tout en gardant un lien rapide avec la capitale.",
  },
];

export async function generateStaticParams() {
  return BUCKETS.map((b) => ({ temps: b.temps.toString() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ temps: string }>;
}): Promise<Metadata> {
  const { temps } = await params;
  const tempsNum = parseInt(temps, 10);
  const bucket = BUCKETS.find((b) => b.temps === tempsNum);
  if (!bucket) return { title: "Temps inconnu" };

  const title = `Vivre à ${bucket.label} de Paris : meilleures villes 2026`;
  const description = `Toutes les communes accessibles en ${bucket.label} ou moins depuis Paris : prix immobilier, transports, qualité de vie. Données INSEE et DVF actualisées.`;

  return {
    title,
    description,
    alternates: { canonical: `/a-${temps}-minutes-de-paris` },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_FR",
      url: `/a-${temps}-minutes-de-paris`,
    },
  };
}

export default async function PageTemps({
  params,
}: {
  params: Promise<{ temps: string }>;
}) {
  const { temps } = await params;
  const tempsNum = parseInt(temps, 10);
  const bucket = BUCKETS.find((b) => b.temps === tempsNum);
  if (!bucket) notFound();

  const tolerance = 3; // ±3 min around the target
  const minTemps = Math.max(0, tempsNum - 15);
  const matched = SAMPLE_COMMUNES.filter(
    (c) =>
      c.temps_trajet_paris_min <= tempsNum + tolerance &&
      c.temps_trajet_paris_min >= minTemps,
  )
    .sort((a, b) => a.temps_trajet_paris_min - b.temps_trajet_paris_min)
    .slice(0, 24);

  const cheapest = [...matched]
    .filter((c) => c.prix_m2_median != null)
    .sort((a, b) => (a.prix_m2_median ?? 0) - (b.prix_m2_median ?? 0))
    .slice(0, 6);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Quelles sont les villes à ${bucket.label} de Paris ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Plus de ${matched.length} communes du dataset Vivre près de Paris sont accessibles en ${bucket.label} ou moins depuis Paris en 2026. Parmi les plus abordables : ${cheapest
            .slice(0, 3)
            .map(
              (c) =>
                `${c.nom} (${formatEuros(c.prix_m2_median ?? 0)}/m², ${c.temps_trajet_paris_min} min)`,
            )
            .join(", ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `Quel mode de transport est le plus efficace pour ${bucket.label} de Paris ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            tempsNum <= 30
              ? "Métro, RER A/E (récents), Transiliens L et J. Évite RER B et D, peu fiables."
              : tempsNum <= 60
                ? "Transilien J/N/L et certains RER fiables (RER A, RER E). Pour les zones les plus éloignées, le TGV reste plus rapide qu'un RER lent."
                : "TGV ou Intercités pour les villes en province. Sur les lignes Atlantique, Sud-Est, Est et Nord, tu peux atteindre des villes moyennes en 1h-2h.",
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
          <span className="text-neutral-900">À {bucket.label} de Paris</span>
        </nav>

        <h1 className="font-display text-3xl font-medium tracking-tight text-brand-bleu sm:text-4xl">
          Les villes à {bucket.label} de Paris
        </h1>
        <p className="mt-3 text-base leading-relaxed text-neutral-700">
          {bucket.description}
        </p>

        {cheapest.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
              Les communes les plus abordables à {bucket.label} de Paris
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Triées par prix médian au m² croissant.
            </p>
            <div className="mt-4 space-y-3">
              {cheapest.map((c, i) => (
                <Link
                  key={c.code_insee}
                  href={`/vivre-a/${communeToSlug(c)}`}
                  className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white tabular-nums">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-base font-semibold text-neutral-900">
                        {c.nom}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {c.code_postal} · {c.departement}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-700">
                      <span className="inline-flex items-center gap-1">
                        <Train className="h-3 w-3" />
                        {c.temps_trajet_paris_min} min
                        {c.ligne_principale && ` · ${c.ligne_principale}`}
                      </span>
                      {c.prix_m2_median != null && (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <Euro className="h-3 w-3" />
                          {formatEuros(c.prix_m2_median)}/m²
                        </span>
                      )}
                      {c.rendement_locatif != null && (
                        <span>Rendement {formatPercent(c.rendement_locatif)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {matched.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
              Toutes les communes à {bucket.label} ou moins ({matched.length})
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Classées par temps de trajet croissant.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {matched.map((c) => (
                <Link
                  key={c.code_insee}
                  href={`/vivre-a/${communeToSlug(c)}`}
                  className="block rounded-lg border border-neutral-200 bg-white p-3 hover:border-neutral-300 hover:bg-neutral-50"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-neutral-900">
                      {c.nom}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {c.code_postal}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <Train className="h-3 w-3" />
                      {c.temps_trajet_paris_min} min
                    </span>
                    {c.prix_m2_median != null && (
                      <span>· {formatEuros(c.prix_m2_median)}/m²</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
            Voir aussi
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {BUCKETS.filter((b) => b.temps !== tempsNum).map((b) => (
              <Link
                key={b.temps}
                href={`/a-${b.temps}-minutes-de-paris`}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
              >
                {b.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-700 p-7 text-center text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
          <p className="text-sm text-neutral-700">
            <MapPin className="mr-1 inline h-4 w-4" />
            Affine ta recherche avec tes propres critères
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
