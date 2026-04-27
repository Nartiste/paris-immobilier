import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Train, Car, MapPin, Euro, TrendingUp, Users } from "lucide-react";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { communeToSlug, slugToInsee } from "@/lib/slug";
import { computeCommuneScore, scoreToColor, scoreToLabel } from "@/lib/scoring";
import { DEFAULT_WEIGHTS } from "@/lib/types";
import { formatEuros, formatNumber, formatPercent } from "@/lib/utils";
import { buildCTAs } from "@/lib/monetize";
import { NARRATIVES } from "@/lib/city-narratives";
import { breadcrumbJsonLd } from "@/lib/seo";
import CityFooter from "@/components/CityFooter";
import TransportPanel from "@/components/TransportPanel";

export const dynamicParams = false;

export async function generateStaticParams() {
  return SAMPLE_COMMUNES.map((c) => ({ slug: communeToSlug(c) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insee = slugToInsee(slug);
  const commune = SAMPLE_COMMUNES.find((c) => c.code_insee === insee);
  if (!commune) {
    return { title: "Commune introuvable" };
  }

  const prix = commune.prix_m2_median ? `${formatEuros(commune.prix_m2_median)}/m²` : "";
  const temps = commune.temps_trajet_paris_min;

  const title = `Vivre à ${commune.nom} (${commune.code_postal}) — ${prix}, ${temps} min de Paris`;
  const description = `Tout savoir avant de s'installer à ${commune.nom} : prix immobilier ${prix}, temps de trajet ${temps} min vers Paris en ${commune.mode_principal}, qualité de vie, écoles, futures gares Grand Paris Express.`;

  const url = `/vivre-a/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_FR",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function VivreACommunePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insee = slugToInsee(slug);
  const commune = SAMPLE_COMMUNES.find((c) => c.code_insee === insee);

  if (!commune) {
    notFound();
  }

  const score = computeCommuneScore(commune, DEFAULT_WEIGHTS, "absolu", "acheteur");
  const color = scoreToColor(score.total);
  const ctas = buildCTAs(commune, "acheteur");

  // Communes voisines (mêmes département, distance Paris similaire)
  const voisines = SAMPLE_COMMUNES.filter(
    (c) =>
      c.code_insee !== commune.code_insee &&
      c.departement === commune.departement,
  )
    .sort(
      (a, b) =>
        Math.abs(a.temps_trajet_paris_min - commune.temps_trajet_paris_min) -
        Math.abs(b.temps_trajet_paris_min - commune.temps_trajet_paris_min),
    )
    .slice(0, 6);

  // Communes au temps de trajet équivalent (autres départements)
  const memeTemps = SAMPLE_COMMUNES.filter(
    (c) =>
      c.code_insee !== commune.code_insee &&
      c.departement !== commune.departement &&
      Math.abs(c.temps_trajet_paris_min - commune.temps_trajet_paris_min) <= 10,
  )
    .sort(
      (a, b) =>
        (a.prix_m2_median ?? 99999) - (b.prix_m2_median ?? 99999),
    )
    .slice(0, 6);

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: commune.nom,
    address: {
      "@type": "PostalAddress",
      postalCode: commune.code_postal,
      addressRegion: commune.region,
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: commune.lat,
      longitude: commune.lon,
    },
  };

  const breadcrumbsLd = breadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Communes", url: "/" },
    { name: commune.nom },
  ]);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />

      {/* HERO — gradient soft + score badge */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-emerald-50/30 px-5 pt-8 pb-10 sm:px-6">
        <div
          aria-hidden
          className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-violet-200/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl">
          <nav aria-label="Fil d'ariane" className="text-xs text-neutral-500">
            <Link href="/" className="hover:text-neutral-900">
              Accueil
            </Link>
            {" / "}
            <Link href="/" className="hover:text-neutral-900">
              Communes
            </Link>
            {" / "}
            <span className="text-neutral-900">{commune.nom}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
                Vivre à <span className="bg-gradient-to-br from-violet-700 to-purple-600 bg-clip-text text-transparent">{commune.nom}</span>
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                {commune.code_postal} · {commune.departement} · {commune.region}
              </p>
            </div>
            <div
              className="flex flex-col items-center rounded-2xl bg-white px-5 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
              style={{ borderTop: `3px solid ${color}` }}
            >
              <div className="text-3xl font-bold tabular-nums" style={{ color }}>
                {score.total}
                <span className="text-sm text-neutral-400">/100</span>
              </div>
              <div
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color }}
              >
                {scoreToLabel(score.total)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-5 py-8 sm:px-6">

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KPI
            icon={<Train className="h-4 w-4" />}
            label="Trajet Paris"
            value={`${commune.temps_trajet_paris_min} min`}
            sub={commune.ligne_principale ?? commune.mode_principal}
          />
          <KPI
            icon={<Euro className="h-4 w-4" />}
            label="Prix médian"
            value={
              commune.prix_m2_median != null
                ? `${formatEuros(commune.prix_m2_median)}/m²`
                : "—"
            }
            sub={
              commune.loyer_m2_median != null
                ? `Loyer ${formatEuros(commune.loyer_m2_median)}/m²`
                : undefined
            }
          />
          <KPI
            icon={<Users className="h-4 w-4" />}
            label="Population"
            value={formatNumber(commune.population)}
            sub={`Revenu médian ${formatEuros(commune.revenu_median ?? 0)}`}
          />
          <KPI
            icon={<TrendingUp className="h-4 w-4" />}
            label="Évolution prix 5 ans"
            value={formatPercent(commune.prix_m2_evolution_5y)}
            sub={`Rendement loc. ${formatPercent(commune.rendement_locatif)}`}
          />
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
            Vivre à {commune.nom}
          </h2>
          {NARRATIVES[commune.code_insee] ? (
            <div className="mt-4 space-y-4">
              {NARRATIVES[commune.code_insee]
                .split(/\n\n+/)
                .map((para, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-neutral-800"
                  >
                    {para}
                  </p>
                ))}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="text-sm leading-relaxed text-neutral-700">
                {commune.nom} est une commune de {formatNumber(commune.population)}{" "}
                habitants située dans {prepDept(commune.departement)} ({commune.region}),
                à {commune.distance_paris_km} km de Paris. Le trajet jusqu'au
                centre-ville parisien prend{" "}
                <strong>{commune.temps_trajet_paris_min} minutes</strong>
                {commune.ligne_principale ? ` via ${commune.ligne_principale}` : ""}
                {commune.temps_trajet_voiture_min
                  ? ` (et environ ${commune.temps_trajet_voiture_min} min en voiture hors trafic)`
                  : ""}
                .
              </p>
              {commune.prix_m2_median != null && (
                <p className="text-sm leading-relaxed text-neutral-700">
                  Côté immobilier, le prix médian au m² s'établit à{" "}
                  <strong>{formatEuros(commune.prix_m2_median)} €</strong>
                  {commune.prix_m2_evolution_5y != null
                    ? ` (évolution ${formatPercent(commune.prix_m2_evolution_5y)} sur 5 ans)`
                    : ""}
                  {commune.loyer_m2_median != null
                    ? `. À la location, comptez en moyenne ${formatEuros(commune.loyer_m2_median)} €/m², soit un rendement locatif brut de ${formatPercent(commune.rendement_locatif)}`
                    : ""}
                  .
                </p>
              )}
              {commune.bonus_gpe && commune.bonus_gpe > 0.4 && (
                <p className="text-sm leading-relaxed text-neutral-700">
                  <strong>Grand Paris Express</strong> : {commune.nom} bénéficie
                  de l'arrivée prochaine d'une ou plusieurs gares du nouveau
                  métro, ce qui devrait améliorer significativement son
                  accessibilité d'ici 2026-2030.
                </p>
              )}
            </div>
          )}
        </section>

        <div className="mt-10">
          <TransportPanel ligneStr={commune.ligne_principale} />
        </div>

        {ctas.length > 0 && (
          <section className="mt-10 rounded-2xl border border-brand-iris/20 bg-gradient-to-br from-violet-50 to-white p-5">
            <h2 className="text-base font-semibold text-neutral-900">
              Vous envisagez de vous installer à {commune.nom} ?
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Quelques étapes utiles avant de vous engager (liens partenaires sponsorisés).
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {ctas.map((cta) => (
                <a
                  key={cta.partner}
                  href={cta.url}
                  target="_blank"
                  rel="noopener sponsored"
                  className="rounded-2xl bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(124,58,237,0.12)]"
                >
                  <div className="text-sm font-medium text-neutral-900">{cta.label}</div>
                  <div className="text-[11px] text-neutral-500">{cta.description}</div>
                </a>
              ))}
            </div>
          </section>
        )}

        {voisines.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
              Communes voisines en {commune.departement}
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {voisines.map((v) => (
                <NeighborCard key={v.code_insee} commune={v} />
              ))}
            </div>
          </section>
        )}

        {memeTemps.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
              Autres communes à ~{commune.temps_trajet_paris_min} min de Paris
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {memeTemps.map((v) => (
                <NeighborCard key={v.code_insee} commune={v} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/comparer?from=${commune.code_insee}`}
            className="group flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand-iris-soft via-white to-brand-vert-soft p-6 shadow-[0_4px_20px_rgba(82,98,122,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(157,140,242,0.18)]"
          >
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-iris-strong">
                Comparer
              </div>
              <div className="mt-1 font-display text-lg font-medium leading-snug text-brand-bleu">
                {commune.nom} <span className="italic text-brand-iris">vs</span>{" "}
                une autre ville
              </div>
              <div className="mt-1 text-xs text-brand-bleu/60">
                Côte à côte, 9 critères
              </div>
            </div>
            <MapPin className="h-5 w-5 text-brand-iris transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/"
            className="group flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand-bleu to-brand-bleu/80 p-6 text-white shadow-[0_4px_20px_rgba(82,98,122,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(82,98,122,0.3)]"
          >
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-iris-soft">
                Carte interactive
              </div>
              <div className="mt-1 font-display text-lg font-medium leading-snug">
                Explore la France entière
              </div>
              <div className="mt-1 text-xs text-white/70">
                Filtre par budget + temps de trajet
              </div>
            </div>
            <MapPin className="h-5 w-5 text-white transition-transform group-hover:translate-x-0.5" />
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
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-400">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-neutral-900">{value}</div>
      {sub && <div className="text-[11px] text-neutral-500">{sub}</div>}
    </div>
  );
}

function NeighborCard({ commune }: { commune: import("@/lib/types").Commune }) {
  const slug = communeToSlug(commune);
  return (
    <Link
      href={`/vivre-a/${slug}`}
      className="block rounded-2xl bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-baseline justify-between">
        <span className="font-medium text-neutral-900">{commune.nom}</span>
        <span className="text-[10px] text-neutral-500">{commune.code_postal}</span>
      </div>
      <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
        <span className="inline-flex items-center gap-1">
          <Train className="h-3 w-3" />
          {commune.temps_trajet_paris_min} min
        </span>
        {commune.prix_m2_median != null && (
          <span className="inline-flex items-center gap-1">
            <Euro className="h-3 w-3" />
            {formatEuros(commune.prix_m2_median)}/m²
          </span>
        )}
      </div>
    </Link>
  );
}

function prepDept(d: string) {
  // small helper to use "le" / "la" / "les"
  const masc = ["Loiret", "Cher", "Loir-et-Cher", "Tarn", "Var", "Doubs"];
  if (masc.some((m) => d.includes(m))) return `le ${d}`;
  return `${d}`;
}
