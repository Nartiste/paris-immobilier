import Link from "next/link";
import { Train, Sparkles, Map as MapIcon, ArrowRight } from "lucide-react";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { TRANSPORT_LINES, reputationColor } from "@/lib/transport-lines";
import { PERSONAS } from "@/lib/persona";
import { communeToSlug } from "@/lib/slug";
import { formatEuros } from "@/lib/utils";
import { computeCommuneScore, scoreToColor } from "@/lib/scoring";
import { DEFAULT_WEIGHTS } from "@/lib/types";

/**
 * Sections statiques de la home — server-rendered → SEO + GEO friendly.
 *
 * Style : inspiré Stripe + soft Neumorphism (gradient hero, rounded-2xl,
 * soft shadows au lieu de borders, typographie généreuse).
 */
export default function HomeShell() {
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

      {/* HERO — gradient soft + H1 serif élégant */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-iris-soft via-brand-blanc to-brand-vert-soft px-5 pt-12 pb-14 sm:px-7">
        <div
          aria-hidden
          className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-iris/25 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-brand-vert/25 blur-3xl"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-wide text-brand-iris-strong shadow-[0_2px_8px_rgba(157,140,242,0.15)] backdrop-blur">
            <Sparkles className="h-3 w-3" />
            80+ communes · DVF &amp; INSEE 2026
          </span>
          <h1 className="font-display mt-5 text-3xl font-medium leading-[1.05] tracking-tight text-brand-bleu sm:text-[2.6rem]">
            Tu veux quitter Paris ?<br />
            <span className="italic font-medium text-brand-iris">
              Trouve ton refuge
            </span>{" "}
            près de la capitale.
          </h1>
          <p className="mt-5 max-w-prose text-sm leading-relaxed text-brand-bleu/80">
            Prix immobilier réel, temps de trajet vers Paris (TGV, RER,
            voiture), qualité de vie, futures gares Grand Paris Express.
            Filtre selon tes critères, ouvre la carte interactive ou demande au
            concierge IA.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href="#filtres"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-bleu px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)] transition-transform hover:scale-[1.02]"
            >
              Affiner mes critères
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/blog/top-10-villes-pour-quitter-paris-2026"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white/80 px-4 py-2.5 text-sm font-medium text-brand-bleu shadow-[0_2px_8px_rgba(82,98,122,0.08)] backdrop-blur transition-transform hover:scale-[1.02]"
            >
              Lire le top 10
            </Link>
          </div>
        </div>
      </section>

      {/* TOP 10 COMMUNES */}
      <section className="bg-white px-5 py-10 sm:px-7">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
            Top 10 communes
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
        <ol className="mt-5 space-y-1.5">
          {topCommunes.map((t, i) => {
            const color = scoreToColor(t.score.total);
            return (
              <li key={t.commune.code_insee}>
                <Link
                  href={`/vivre-a/${communeToSlug(t.commune)}`}
                  className="flex items-center gap-3 rounded-2xl bg-neutral-50/60 px-3 py-2.5 transition-all hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold tabular-nums text-neutral-400 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate text-sm font-medium text-neutral-900">
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
                    className="ml-1 rounded-xl px-2 py-1 text-xs font-bold tabular-nums text-white shadow-sm"
                    style={{ backgroundColor: color }}
                  >
                    {t.score.total}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* PERSONAS */}
      <section className="bg-neutral-50/60 px-5 py-10 sm:px-7">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
          Tu te reconnais ici ?
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Sélections curatées selon ton profil de relocation.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {PERSONAS.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="group rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(124,58,237,0.12)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="mt-3 text-sm font-semibold text-neutral-900">
                {p.shortLabel}
              </div>
              <div className="mt-1 text-[11px] leading-snug text-neutral-500">
                {p.metaDescription.slice(0, 90)}…
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-violet-700 opacity-0 transition-opacity group-hover:opacity-100">
                Découvrir
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PAR TEMPS DE TRAJET */}
      <section className="bg-white px-5 py-10 sm:px-7">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
          Par temps de trajet vers Paris
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          De la petite couronne en 15 minutes aux villes TGV à 2 heures.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
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
              className="rounded-2xl bg-neutral-50/60 px-3 py-3 text-center transition-all hover:bg-white hover:shadow-[0_4px_16px_rgba(16,185,129,0.12)]"
            >
              <div className="text-sm font-bold text-neutral-900">
                {b.label}
              </div>
              <div className="mt-0.5 text-[10px] text-neutral-500">
                de Paris
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PAR LIGNE */}
      <section className="bg-neutral-50/60 px-5 py-10 sm:px-7">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
          Par ligne de transport
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Réputation, ponctualité, communes desservies — pour chaque ligne.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {popularLines.map((l) => (
            <Link
              key={l.id}
              href={`/lignes/${l.id}`}
              className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
            >
              <Train className="h-3.5 w-3.5 flex-shrink-0 text-neutral-500" />
              <span className="flex-1 truncate text-xs font-semibold text-neutral-900">
                {l.code}
              </span>
              <span
                className="rounded-lg px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm"
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
      <section className="bg-white px-5 py-10 sm:px-7">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-iris-soft via-white to-brand-vert-soft p-6 text-brand-bleu shadow-[0_4px_20px_rgba(82,98,122,0.06)]">
          <div
            aria-hidden
            className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-iris/15 blur-2xl"
          />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-brand-iris-strong">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                Concierge IA · Gratuit
              </span>
            </div>
            <h3 className="font-display mt-3 text-xl font-medium leading-snug">
              « J&apos;ai 350 k€, télétravail 2 j/semaine,{" "}
              <span className="italic text-brand-iris-strong">où aller</span> ? »
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-brand-bleu/80">
              Décris ton projet en une phrase. Le concierge te recommande 3-5
              communes, calcule la surface possible et justifie chaque choix.
            </p>
            <p className="mt-4 inline-flex items-center gap-1 text-[11px] text-brand-bleu/60">
              <Sparkles className="h-3 w-3 text-brand-iris" />
              Bouton iris en bas-droite ↘
            </p>
          </div>
        </div>
      </section>

      {/* CTA carte mobile (visible < lg, redondant mais rassurant) */}
      <section className="bg-white px-5 pb-6 pt-2 sm:px-7 lg:hidden">
        <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/60 px-4 py-3 text-center text-xs text-neutral-600">
          <MapIcon className="mr-1 inline h-3.5 w-3.5" />
          Carte interactive : bouton bas-gauche ↙
        </div>
      </section>
    </>
  );
}
