import Link from "next/link";
import { Train, Home as HomeIcon, Users, Sparkles } from "lucide-react";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { TRANSPORT_LINES, reputationColor } from "@/lib/transport-lines";
import { PERSONAS } from "@/lib/persona";
import { communeToSlug } from "@/lib/slug";
import { formatEuros } from "@/lib/utils";
import { computeCommuneScore } from "@/lib/scoring";
import { DEFAULT_WEIGHTS } from "@/lib/types";

/**
 * Sections statiques de la home, server-rendered → SEO + GEO friendly.
 *
 * Inclut :
 * - Hero avec H1
 * - Top 10 communes (calcul build-time)
 * - Cards par persona / par temps / par ligne
 * - Schema.org ItemList pour les recommandations
 *
 * Le layout extérieur (split-screen avec carte) est géré par HomeClient
 * + app/page.tsx.
 */
export default function HomeShell() {
  // Top 10 communes avec score absolu, calcul server-side au build
  const topCommunes = SAMPLE_COMMUNES.map((c) => ({
    commune: c,
    score: computeCommuneScore(c, DEFAULT_WEIGHTS, "absolu", "acheteur"),
  }))
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 10);

  const popularLines = TRANSPORT_LINES.filter(
    (l) =>
      ["RER", "Transilien", "TGV"].includes(l.type) &&
      l.reputation.score >= 3,
  ).slice(0, 12);

  // Schema.org ItemList des top communes — pour LLM search
  const topListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top 10 communes pour quitter Paris",
    numberOfItems: topCommunes.length,
    itemListElement: topCommunes.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `/vivre-a/${communeToSlug(t.commune)}`,
      name: t.commune.nom,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(topListJsonLd) }}
      />

      {/* HERO — H1 + accroche */}
      <section className="border-b border-neutral-100 px-5 py-8 sm:px-6 lg:py-10">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-700">
          80+ communes comparées · Données INSEE & DVF
        </div>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl">
          Tu veux quitter Paris ?{" "}
          <span className="text-violet-700">Compare 80+ communes</span> en un clin d&apos;œil.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">
          Prix immobilier réel (DVF), temps de trajet vers Paris (TGV, RER,
          voiture), qualité de vie, futures gares Grand Paris Express. Filtre
          selon tes critères, ouvre la carte interactive ou demande au
          concierge IA.
        </p>
      </section>

      {/* TOP 10 COMMUNES */}
      <section className="border-b border-neutral-100 px-5 py-7 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Top 10 des communes
          </h2>
          <Link
            href="/blog/top-10-villes-pour-quitter-paris-2026"
            className="text-xs text-neutral-500 hover:text-neutral-900"
          >
            Article →
          </Link>
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          Score absolu pondéré sur 6 critères. Clique pour ouvrir la fiche.
        </p>
        <ol className="mt-4 space-y-1">
          {topCommunes.map((t, i) => (
            <li key={t.commune.code_insee}>
              <Link
                href={`/vivre-a/${communeToSlug(t.commune)}`}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-50"
              >
                <span className="w-5 text-center text-xs font-semibold text-neutral-400 tabular-nums">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-neutral-900">
                  {t.commune.nom}
                </span>
                <span className="text-[11px] tabular-nums text-emerald-700">
                  {t.commune.temps_trajet_paris_min}min
                </span>
                {t.commune.prix_m2_median != null && (
                  <span className="hidden text-[11px] tabular-nums text-neutral-500 sm:inline">
                    {formatEuros(t.commune.prix_m2_median)}/m²
                  </span>
                )}
                <span
                  className="ml-1 rounded-md px-1.5 py-0.5 text-xs font-semibold text-white tabular-nums"
                  style={{ backgroundColor: reputationColor(Math.min(5, Math.max(1, Math.ceil(t.score.total / 20))) as 1 | 2 | 3 | 4 | 5) }}
                >
                  {t.score.total}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* PERSONAS */}
      <section className="border-b border-neutral-100 px-5 py-7 sm:px-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Tu te reconnais ici ?
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Sélections curatées selon ton profil de relocation.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {PERSONAS.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="rounded-xl border border-neutral-200 bg-white p-3 transition-colors hover:border-violet-300 hover:bg-violet-50/40"
            >
              <Users className="h-4 w-4 text-violet-600" />
              <div className="mt-2 text-sm font-semibold text-neutral-900">
                {p.shortLabel}
              </div>
              <div className="mt-1 text-[11px] leading-snug text-neutral-500">
                {p.metaDescription.slice(0, 90)}…
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PAR TEMPS DE TRAJET */}
      <section className="border-b border-neutral-100 px-5 py-7 sm:px-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Par temps de trajet vers Paris
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            { t: 15, label: "15 min" },
            { t: 30, label: "30 min" },
            { t: 45, label: "45 min" },
            { t: 60, label: "1 heure" },
            { t: 90, label: "1 h 30" },
            { t: 120, label: "2 heures" },
          ].map((b) => (
            <Link
              key={b.t}
              href={`/a-${b.t}-minutes-de-paris`}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-center hover:border-emerald-300 hover:bg-emerald-50/40"
            >
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-neutral-900">
                <HomeIcon className="h-3 w-3 text-emerald-600" />
                {b.label}
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500">de Paris</div>
            </Link>
          ))}
        </div>
      </section>

      {/* PAR LIGNE */}
      <section className="border-b border-neutral-100 px-5 py-7 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Par ligne de transport
          </h2>
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          Réputation, ponctualité, communes desservies — pour chaque ligne
          principale.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {popularLines.map((l) => (
            <Link
              key={l.id}
              href={`/lignes/${l.id}`}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-2.5 hover:border-neutral-300 hover:bg-neutral-50"
            >
              <Train className="h-3.5 w-3.5 text-neutral-500" />
              <span className="flex-1 truncate text-xs font-semibold text-neutral-900">
                {l.code}
              </span>
              <span
                className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white"
                style={{
                  backgroundColor: reputationColor(l.reputation.score),
                }}
              >
                {l.reputation.score}/5
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CONCIERGE IA tease */}
      <section className="border-b border-neutral-100 px-5 py-7 sm:px-6" id="concierge-tease">
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
          <div className="flex items-center gap-2 text-violet-700">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Concierge IA gratuit
            </span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-neutral-900">
            « J&apos;ai 350 k€, télétravail 2 j/semaine, où aller ? »
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">
            Décris ton projet en une phrase. Le concierge te recommande 3-5
            communes en quelques secondes, calcule la surface possible et
            justifie chaque choix.
          </p>
          <p className="mt-3 text-[11px] text-neutral-400">
            Bouton violet en bas-droite ↘
          </p>
        </div>
      </section>
    </>
  );
}
