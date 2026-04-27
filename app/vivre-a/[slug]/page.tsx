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

  // JSON-LD structuré (Place) pour le SEO
  const jsonLd = {
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

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-bold text-white">
              PI
            </div>
            <span className="text-sm font-semibold text-neutral-900">Paris Immobilier</span>
          </Link>
          <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
            Comparateur →
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-10">
        <nav aria-label="Fil d'ariane" className="mb-6 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">Accueil</Link>
          {" / "}
          <Link href="/" className="hover:text-neutral-900">Communes</Link>
          {" / "}
          <span className="text-neutral-900">{commune.nom}</span>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Vivre à {commune.nom}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {commune.code_postal} · {commune.departement} · {commune.region}
            </p>
          </div>
          <div
            className="flex flex-col items-center rounded-xl px-5 py-3"
            style={{ backgroundColor: `${color}15`, borderLeft: `3px solid ${color}` }}
          >
            <div className="text-3xl font-bold tabular-nums" style={{ color }}>
              {score.total}
              <span className="text-sm text-neutral-400">/100</span>
            </div>
            <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color }}>
              {scoreToLabel(score.total)}
            </div>
          </div>
        </div>

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

        <section className="mt-10 prose prose-neutral max-w-none">
          <h2 className="text-xl font-semibold text-neutral-900">
            S'installer à {commune.nom} : ce qu'il faut savoir
          </h2>
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
              <strong>Grand Paris Express</strong> : {commune.nom} bénéficie de
              l'arrivée prochaine d'une ou plusieurs gares du nouveau métro,
              ce qui devrait améliorer significativement son accessibilité d'ici
              2026-2030 — un facteur à anticiper dans une décision d'achat.
            </p>
          )}
        </section>

        {ctas.length > 0 && (
          <section className="mt-10 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5">
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
                  className="rounded-lg border border-neutral-200 bg-white p-3 hover:border-violet-300 hover:bg-violet-50/50"
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
            <h2 className="text-xl font-semibold text-neutral-900">
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
            <h2 className="text-xl font-semibold text-neutral-900">
              Autres communes à ~{commune.temps_trajet_paris_min} min de Paris
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {memeTemps.map((v) => (
                <NeighborCard key={v.code_insee} commune={v} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center">
          <p className="text-sm text-neutral-700">
            <MapPin className="mr-1 inline h-4 w-4" />
            Comparez {commune.nom} à n'importe quelle autre commune
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Ouvrir le comparateur interactif
          </Link>
        </section>
      </article>

      <footer className="border-t border-neutral-200 bg-neutral-50 py-8 text-center text-xs text-neutral-500">
        Sources : DVF (data.gouv.fr), INSEE FILOSOFI, SNCF Connect, MeilleursAgents.
        <br />
        Données indicatives, vérifiez toujours auprès des professionnels avant tout engagement.
      </footer>
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
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
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
      className="block rounded-lg border border-neutral-200 bg-white p-3 hover:border-neutral-300 hover:bg-neutral-50"
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
