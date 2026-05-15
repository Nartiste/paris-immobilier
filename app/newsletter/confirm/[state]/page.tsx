import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, AlertCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Confirmation newsletter",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ state: string }>;
};

const TOP_10_SLUG = "top-10-villes-pour-quitter-paris-2026";

export default async function ConfirmStatePage({ params }: Props) {
  const { state } = await params;

  if (state !== "ok" && state !== "invalid") notFound();

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-brand-iris-soft/60 via-white to-brand-vert-soft/40 px-5 py-16 sm:px-7">
      <div className="mx-auto w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(82,98,122,0.10)] sm:p-10">
        {state === "ok" ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-7 w-7" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-medium leading-tight text-brand-bleu sm:text-4xl">
              Inscription confirmée
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-700">
              Tu vas recevoir le <strong>Top 10 des villes pour quitter Paris</strong> dans ta boîte mail dans les minutes qui viennent, avec le PDF en pièce jointe.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Pas besoin d'attendre : tu peux déjà lire l'article complet sur le site.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={`/blog/${TOP_10_SLUG}`}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-bleu px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)] transition-transform hover:scale-[1.02]"
              >
                Lire le Top 10 maintenant
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-neutral-100 px-5 py-3 text-sm font-medium text-brand-bleu transition-transform hover:scale-[1.02]"
              >
                Retour à l'accueil
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-medium leading-tight text-brand-bleu sm:text-4xl">
              Lien invalide ou expiré
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-700">
              Ce lien de confirmation n'est plus actif. Il a peut-être déjà été utilisé, ou il a été désinscrit.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Tu peux te ré-inscrire à tout moment depuis n'importe quel article du blog.
            </p>
            <div className="mt-6">
              <Link
                href={`/blog/${TOP_10_SLUG}`}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-bleu px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)] transition-transform hover:scale-[1.02]"
              >
                Aller au Top 10
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [{ state: "ok" }, { state: "invalid" }];
}
