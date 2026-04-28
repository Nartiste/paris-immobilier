import Link from "next/link";
import { Train, Euro, MapPin } from "lucide-react";
import type { Persona } from "@/lib/persona";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { communeToSlug } from "@/lib/slug";
import { formatEuros, formatPercent } from "@/lib/utils";
import CityFooter from "@/components/CityFooter";

type Props = {
  persona: Persona;
};

export default function PersonaPage({ persona }: Props) {
  const ranked = SAMPLE_COMMUNES.filter(persona.filter)
    .map((c) => ({ commune: c, score: persona.score(c) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  // FAQ JSON-LD pour GEO (LLMs)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: persona.faq.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.reponse,
      },
    })),
  };

  // Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: persona.h1,
    description: persona.metaDescription,
    inLanguage: "fr-FR",
    author: {
      "@type": "Organization",
      name: "Vivre près de Paris",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="mx-auto max-w-4xl px-6 py-10">
        <nav aria-label="Fil d'ariane" className="mb-6 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Accueil
          </Link>
          {" / "}
          <span className="text-neutral-900">{persona.shortLabel}</span>
        </nav>

        <h1 className="font-display text-3xl font-medium tracking-tight text-brand-bleu sm:text-4xl">
          {persona.h1}
        </h1>

        <div className="mt-6 space-y-4">
          {persona.intro.split(/\n\n+/).map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-neutral-800">
              {para}
            </p>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
            Les critères qui comptent vraiment
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {persona.criteres.map((c) => (
              <div
                key={c.titre}
                className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <div className="text-sm font-semibold text-neutral-900">
                  {c.titre}
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  {c.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
            Notre top {ranked.length} pour ce profil
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Communes classées selon les critères ci-dessus, sur la base de
            données réelles (DVF, INSEE FILOSOFI, SNCF Connect).
          </p>
          <div className="mt-6 space-y-3">
            {ranked.map(({ commune }, i) => (
              <Link
                key={commune.code_insee}
                href={`/vivre-a/${communeToSlug(commune)}`}
                className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white tabular-nums">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-base font-semibold text-neutral-900">
                      {commune.nom}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {commune.code_postal} · {commune.departement}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-700">
                    <span className="inline-flex items-center gap-1">
                      <Train className="h-3 w-3" />
                      {commune.temps_trajet_paris_min} min
                      {commune.ligne_principale && ` · ${commune.ligne_principale}`}
                    </span>
                    {commune.prix_m2_median != null && (
                      <span className="inline-flex items-center gap-1">
                        <Euro className="h-3 w-3" />
                        {formatEuros(commune.prix_m2_median)}/m²
                      </span>
                    )}
                    {commune.rendement_locatif != null && (
                      <span className="inline-flex items-center gap-1">
                        Rendement {formatPercent(commune.rendement_locatif)}
                      </span>
                    )}
                    {commune.espaces_verts_pct != null && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {Math.round(commune.espaces_verts_pct)}% verts
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-brand-bleu">
            Questions fréquentes
          </h2>
          <div className="mt-4 space-y-3">
            {persona.faq.map((q) => (
              <details
                key={q.question}
                className="group rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900">
                  {q.question}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  {q.reponse}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-bleu via-brand-bleu to-brand-iris p-7 text-center shadow-[0_8px_24px_rgba(82,98,122,0.18)]">
          <p className="text-base font-medium text-white">
            Tu veux affiner avec tes propres critères ?
          </p>
          <Link
            href="/comparer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-bleu shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-transform hover:scale-[1.02]"
          >
            Ouvrir le comparateur interactif
          </Link>
        </section>
      </article>

      <CityFooter />
    </div>
  );
}
