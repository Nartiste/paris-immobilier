import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Train, Clock, Users, Calendar, Zap } from "lucide-react";
import {
  TRANSPORT_LINES,
  TRANSPORT_LINES_BY_ID,
  reputationColor,
  reputationLabel,
  matchLines,
} from "@/lib/transport-lines";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { communeToSlug } from "@/lib/slug";
import { formatEuros, formatNumber } from "@/lib/utils";
import CityFooter from "@/components/CityFooter";

export const dynamicParams = false;

export async function generateStaticParams() {
  return TRANSPORT_LINES.map((l) => ({ slug: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const line = TRANSPORT_LINES_BY_ID[slug];
  if (!line) return { title: "Ligne introuvable" };

  const title = `${line.code} : avis, réputation et communes desservies`;
  const description = `Tout savoir sur la ${line.code} : ${line.reputation.summary} Découvre la liste des communes desservies et leurs prix immobiliers.`;

  return {
    title,
    description,
    alternates: { canonical: `/lignes/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_FR",
      url: `/lignes/${slug}`,
    },
  };
}

export default async function LigneDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const line = TRANSPORT_LINES_BY_ID[slug];

  if (!line) {
    notFound();
  }

  // Communes desservies par cette ligne dans notre dataset
  const desservies = SAMPLE_COMMUNES.filter((c) => {
    const matched = matchLines(c.ligne_principale);
    return matched.some((l) => l.id === line.id);
  }).sort((a, b) => a.temps_trajet_paris_min - b.temps_trajet_paris_min);

  const cheapest = [...desservies]
    .filter((c) => c.prix_m2_median != null)
    .sort((a, b) => (a.prix_m2_median ?? 0) - (b.prix_m2_median ?? 0))
    .slice(0, 5);

  const fastest = [...desservies].slice(0, 5);

  const color = reputationColor(line.reputation.score);

  // FAQ JSON-LD pour GEO
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Quelle est la réputation de la ${line.code} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${line.reputation.summary} Note voyageurs : ${line.reputation.score}/5 (${reputationLabel(line.reputation.score)}).`,
        },
      },
      {
        "@type": "Question",
        name: `Quelle est la fréquence de la ${line.code} en heure de pointe ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: line.facts.frequencePointeMin
            ? `Un train toutes les ${line.facts.frequencePointeMin} minutes en heure de pointe.`
            : "Donnée non documentée.",
        },
      },
      {
        "@type": "Question",
        name: `Quelles communes sont desservies par la ${line.code} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Plus de ${desservies.length} communes du dataset Vivre près de Paris sont desservies par la ${line.code}. Parmi les plus proches de Paris : ${fastest
            .slice(0, 3)
            .map((c) => `${c.nom} (${c.temps_trajet_paris_min} min)`)
            .join(", ")}.`,
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
            Lignes
          </Link>
          {" / "}
          <span className="text-neutral-900">{line.code}</span>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              <Train className="h-8 w-8 text-neutral-700" />
              {line.code}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {line.type} · Vers {line.terminusParis} ·{" "}
              {line.facts.operateur ?? "—"}
            </p>
          </div>
          <div
            className="flex items-baseline gap-2 rounded-xl px-5 py-3"
            style={{ backgroundColor: `${color}15`, borderLeft: `3px solid ${color}` }}
          >
            <span className="text-3xl font-bold tabular-nums" style={{ color }}>
              {line.reputation.score}
              <span className="text-sm text-neutral-400">/5</span>
            </span>
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color }}
            >
              {reputationLabel(line.reputation.score)}
            </span>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
            La {line.code} en un coup d&apos;œil
          </h2>
          <p className="mt-2 text-base leading-relaxed text-neutral-700">
            {line.reputation.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {line.reputation.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {line.facts.nbStations != null && (
            <KPI
              icon={<Train className="h-4 w-4" />}
              label="Stations"
              value={line.facts.nbStations.toString()}
            />
          )}
          {line.facts.longueurKm != null && (
            <KPI
              icon={<Train className="h-4 w-4" />}
              label="Longueur"
              value={`${line.facts.longueurKm} km`}
            />
          )}
          {line.facts.voyageursParJour != null && (
            <KPI
              icon={<Users className="h-4 w-4" />}
              label="Voyageurs / jour"
              value={formatNumber(line.facts.voyageursParJour)}
            />
          )}
          {line.facts.frequencePointeMin != null && (
            <KPI
              icon={<Clock className="h-4 w-4" />}
              label="Fréquence pointe"
              value={`${line.facts.frequencePointeMin} min`}
            />
          )}
          {line.facts.miseEnService != null && (
            <KPI
              icon={<Calendar className="h-4 w-4" />}
              label="Mise en service"
              value={line.facts.miseEnService.toString()}
            />
          )}
          {line.facts.automatique && (
            <KPI
              icon={<Zap className="h-4 w-4" />}
              label="Conduite"
              value="Automatique"
            />
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
            Caractéristiques de la {line.code}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-neutral-700">
            {line.description}
          </p>
        </section>

        {fastest.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
              Communes les plus proches de Paris desservies par la {line.code}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Classées par temps de trajet vers Paris.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {fastest.map((c) => (
                <CommuneRow key={c.code_insee} commune={c} />
              ))}
            </div>
          </section>
        )}

        {cheapest.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
              Communes les moins chères desservies par la {line.code}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Classées par prix médian au m².
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cheapest.map((c) => (
                <CommuneRow key={c.code_insee} commune={c} />
              ))}
            </div>
          </section>
        )}

        {desservies.length > fastest.length && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
              Toutes les communes ({desservies.length})
            </h2>
            <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {desservies.map((c) => (
                <li key={c.code_insee}>
                  <Link
                    href={`/vivre-a/${communeToSlug(c)}`}
                    className="text-neutral-700 hover:text-neutral-900 hover:underline"
                  >
                    {c.nom}{" "}
                    <span className="text-xs text-neutral-400">
                      ({c.temps_trajet_paris_min} min)
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-700 p-7 text-center text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
          <p className="text-sm text-neutral-700">
            La {line.code} t&apos;intéresse pour t&apos;installer ?
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-transform hover:scale-[1.02]"
          >
            Comparer les communes desservies sur la carte
          </Link>
        </section>
      </article>

      <CityFooter />
    </div>
  );
}

function KPI({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-400">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-neutral-900">{value}</div>
    </div>
  );
}

function CommuneRow({
  commune,
}: {
  commune: import("@/lib/types").Commune;
}) {
  return (
    <Link
      href={`/vivre-a/${communeToSlug(commune)}`}
      className="block rounded-lg border border-neutral-200 bg-white p-3 hover:border-neutral-300 hover:bg-neutral-50"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-medium text-neutral-900">{commune.nom}</span>
        <span className="text-[10px] text-neutral-500">
          {commune.code_postal}
        </span>
      </div>
      <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
        <span>{commune.temps_trajet_paris_min} min</span>
        {commune.prix_m2_median != null && (
          <span>· {formatEuros(commune.prix_m2_median)}/m²</span>
        )}
      </div>
    </Link>
  );
}
