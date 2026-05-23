import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function MonRapportNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-iris-soft/40 via-white to-brand-vert-soft/30 px-5 py-20 sm:px-7">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-iris-soft text-brand-iris-strong">
          <Search className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-medium leading-tight text-brand-bleu sm:text-4xl">
          Ce rapport n&apos;existe pas
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-bleu/70">
          Le lien est peut-être expiré, mal copié, ou supprimé. Tu peux générer un nouveau rapport
          sur-mesure en 30 secondes via le quiz.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-brand-iris to-brand-iris-strong px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(157,140,242,0.4)] transition-all hover:scale-[1.02]"
        >
          Lancer le quiz et générer mon rapport
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
