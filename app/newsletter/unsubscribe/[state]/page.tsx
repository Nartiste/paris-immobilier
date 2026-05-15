import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Désinscription newsletter",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ state: string }>;
};

export default async function UnsubscribeStatePage({ params }: Props) {
  const { state } = await params;

  if (state !== "ok" && state !== "invalid") notFound();

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-neutral-50 px-5 py-16 sm:px-7">
      <div className="mx-auto w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(82,98,122,0.10)] sm:p-10">
        {state === "ok" ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
              <Check className="h-7 w-7" />
            </div>
            <h1 className="mt-6 font-display text-2xl font-medium leading-tight text-brand-bleu sm:text-3xl">
              Désinscription effective
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-700">
              Tu ne recevras plus aucun email de Vivre près de Paris. Tes données restent dans notre base pour respecter les obligations RGPD (preuve du consentement initial et de la désinscription).
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Pour une suppression totale, contacte <a href="mailto:contact@prception.co" className="underline">contact@prception.co</a>.
            </p>
            <div className="mt-6">
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
            <h1 className="mt-6 font-display text-2xl font-medium leading-tight text-brand-bleu sm:text-3xl">
              Lien invalide
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-700">
              Ce lien de désinscription n'est plus valide. Si tu reçois encore nos emails sans le vouloir, écris-nous à <a href="mailto:contact@prception.co" className="underline">contact@prception.co</a>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [{ state: "ok" }, { state: "invalid" }];
}
