import { ArrowUpRight, Award, MapPin } from "lucide-react";
import type { LocalReferent } from "@/lib/local-referents";

type Props = {
  referent: LocalReferent;
  communeNom: string;
};

/**
 * Encart "Référent local" affiché sur les fiches /vivre-a/[slug] des communes
 * couvertes par un agent partenaire (cf. lib/local-referents.ts).
 *
 * Design : gradient iris doux + halo, bouton CTA iris fort, disclosure
 * partenariat en bas pour la transparence.
 */
export default function LocalReferentCard({ referent, communeNom }: Props) {
  return (
    <section className="relative mt-10 overflow-hidden rounded-3xl border border-brand-iris/20 bg-gradient-to-br from-brand-iris-soft/55 via-white to-brand-vert-soft/40 p-6 shadow-[0_6px_24px_rgba(82,98,122,0.08)] sm:p-8">
      <div
        aria-hidden
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-iris/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-brand-vert/15 blur-3xl"
      />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-iris-strong shadow-[0_2px_8px_rgba(157,140,242,0.15)] backdrop-blur">
            <Award className="h-3 w-3" />
            Référent local
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-brand-bleu/65">
            <MapPin className="h-3 w-3" />
            {referent.zone}
          </span>
        </div>

        <h3 className="mt-5 font-display text-2xl font-medium leading-tight tracking-tight text-brand-bleu sm:text-3xl">
          Tu envisages {communeNom} ?{" "}
          <span className="italic text-brand-iris-strong">
            {referent.prenom} {referent.nom}
          </span>{" "}
          connaît le terrain.
        </h3>

        <p className="mt-2 text-sm text-brand-bleu/60">
          Agent immobilier indépendant chez {referent.agency}.
        </p>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-bleu/85">
          {referent.blurb}
        </p>

        <a
          href={referent.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-brand-iris to-brand-iris-strong px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(157,140,242,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(157,140,242,0.5)]"
        >
          Découvrir {referent.prenom} {referent.nom}
          <ArrowUpRight className="h-4 w-4" />
        </a>

        <p className="mt-5 text-[11px] leading-relaxed text-brand-bleu/55">
          Partenariat éditorial transparent. Aucune commission visiteur, aucun
          engagement. Vivre près de Paris met en avant des agents indépendants
          qui connaissent leur zone, à toi ensuite de juger.
        </p>
      </div>
    </section>
  );
}
