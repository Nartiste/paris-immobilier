import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowRightLeft } from "lucide-react";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { communeToSlug } from "@/lib/slug";
import { computeCommuneScore } from "@/lib/scoring";
import { DEFAULT_WEIGHTS } from "@/lib/types";
import CityFooter from "@/components/CityFooter";
import ComparerPicker from "./ComparerPicker";

export const metadata: Metadata = {
  title: "Comparer 2 villes près de Paris : prix, transports, qualité de vie",
  description:
    "Compare deux communes côte à côte sur leurs prix immobiliers, temps de trajet vers Paris, qualité de vie et indicateurs économiques. Données réelles INSEE et DVF.",
  alternates: { canonical: "/comparer" },
  openGraph: {
    title: "Comparer 2 villes près de Paris",
    description:
      "Compare deux communes côte à côte : prix, transports, qualité de vie. Aide à la décision pour quitter Paris.",
    type: "website",
    locale: "fr_FR",
    url: "/comparer",
  },
};

export default async function ComparerIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const initialA = from
    ? SAMPLE_COMMUNES.find((c) => c.code_insee === from) ?? null
    : null;

  // Suggestions pré-cuisinées : 6 paires populaires
  const suggestions: { a: string; b: string }[] = [
    { a: "94080", b: "94067" }, // Vincennes vs Saint-Mandé
    { a: "78551", b: "78646" }, // Saint-Germain vs Versailles
    { a: "78361", b: "94081" }, // Mantes-la-Jolie vs Vitry-sur-Seine
    { a: "94081", b: "94017" }, // Vitry vs Champigny (futurs GPE)
    { a: "94068", b: "94058" }, // Saint-Maur vs Le Perreux
    { a: "92012", b: "92044" }, // Boulogne vs Levallois
  ];

  const ranked = SAMPLE_COMMUNES.map((c) => ({
    commune: c,
    score: computeCommuneScore(c, DEFAULT_WEIGHTS, "absolu", "acheteur").total,
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const validSuggestions = suggestions
    .map(({ a, b }) => {
      const ca = SAMPLE_COMMUNES.find((c) => c.code_insee === a);
      const cb = SAMPLE_COMMUNES.find((c) => c.code_insee === b);
      if (!ca || !cb) return null;
      return { ca, cb, slug: `${communeToSlug(ca)}-vs-${communeToSlug(cb)}` };
    })
    .filter(Boolean) as { ca: typeof SAMPLE_COMMUNES[number]; cb: typeof SAMPLE_COMMUNES[number]; slug: string }[];

  return (
    <div className="min-h-screen bg-brand-blanc">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-iris-soft via-white to-brand-vert-soft px-5 pt-12 pb-10 sm:px-6">
        <div
          aria-hidden
          className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-iris/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-wide text-brand-iris-strong shadow-[0_2px_8px_rgba(157,140,242,0.15)] backdrop-blur">
            <ArrowRightLeft className="h-3 w-3" />
            Comparateur côte à côte
          </span>
          <h1 className="font-display mt-4 text-3xl font-medium leading-[1.1] tracking-tight text-brand-bleu sm:text-[2.4rem]">
            Compare 2 villes,{" "}
            <span className="italic text-brand-iris">choisis sereinement</span>.
          </h1>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-brand-bleu/80">
            Choisis 2 communes parmi les {SAMPLE_COMMUNES.length} couvertes :
            prix médian, temps de trajet vers Paris, lignes de transport,
            qualité de vie, rendement locatif, espaces verts, évolution prix.
            Tout côte à côte sur une page, sans bullshit immobilier.
          </p>
        </div>
      </section>

      {/* PICKER */}
      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-6">
        <ComparerPicker communes={SAMPLE_COMMUNES} initialA={initialA} />
      </section>

      {/* SUGGESTIONS POPULAIRES */}
      {validSuggestions.length > 0 && (
        <section className="mx-auto max-w-4xl px-5 pb-10 sm:px-6">
          <h2 className="text-lg font-semibold tracking-tight text-brand-bleu">
            Comparaisons populaires
          </h2>
          <p className="mt-1 text-xs text-brand-bleu/60">
            Les paires les plus pertinentes selon le profil de chaque commune.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {validSuggestions.map(({ ca, cb, slug }) => (
              <Link
                key={slug}
                href={`/comparer/${slug}`}
                className="group flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(82,98,122,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(82,98,122,0.1)]"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-brand-bleu">
                    {ca.nom}
                  </div>
                  <ArrowRightLeft className="h-3.5 w-3.5 text-brand-iris" />
                  <div className="text-sm font-medium text-brand-bleu">
                    {cb.nom}
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-brand-bleu/30 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-iris" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* TOP COMMUNES POUR DÉMARRER */}
      <section className="mx-auto max-w-4xl px-5 pb-12 sm:px-6">
        <h2 className="text-lg font-semibold tracking-tight text-brand-bleu">
          Démarrer depuis les mieux notées
        </h2>
        <p className="mt-1 text-xs text-brand-bleu/60">
          Clique sur une commune pour ouvrir sa fiche, puis utilise le bouton
          « Comparer » de la fiche.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {ranked.map((r) => (
            <Link
              key={r.commune.code_insee}
              href={`/vivre-a/${communeToSlug(r.commune)}`}
              className="rounded-2xl bg-white px-3 py-3 shadow-[0_2px_8px_rgba(82,98,122,0.04)] transition-all hover:bg-brand-iris-soft/40"
            >
              <div className="text-sm font-medium text-brand-bleu">
                {r.commune.nom}
              </div>
              <div className="mt-0.5 text-[11px] text-brand-bleu/50">
                {r.commune.temps_trajet_paris_min} min · score {r.score}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CityFooter />
    </div>
  );
}
