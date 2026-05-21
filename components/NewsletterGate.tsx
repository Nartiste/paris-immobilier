"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Check, FileDown, Inbox, Sparkles, XCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

const COOKIE_NAME = "vpdp_newsletter_unlocked";

/** Lecture côté client du flag d'unlock. */
function isUnlockedClient(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${COOKIE_NAME}=1`));
}

type Props = {
  /** Le contenu qui sera blurré tant que l'utilisateur n'a pas soumis. */
  children: ReactNode;
  /** Slug de l'article qui déclenche l'opt-in (pour stats). */
  sourceArticleSlug: string;
};

/**
 * Gate visuel pour gated content.
 *
 * - SSR : rend les children normalement (Google voit tout, pas de cloaking).
 * - Côté client : si pas unlocké, applique blur + overlay form.
 * - Sur submit OK : pose un cookie, retire le blur immédiatement.
 *
 * Note RGPD : le cookie permet juste l'unlock côté UX. L'inscription
 * effective à la newsletter passe par le double opt-in (email à confirmer).
 */
export default function NewsletterGate({ children, sourceArticleSlug }: Props) {
  // Par défaut server-render = unlocked (Google voit tout, contenu indexable).
  // Au mount client, on bascule sur la vraie valeur depuis le cookie.
  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlocked] = useState(true);

  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ville envisagée capturée pendant le quiz d'onboarding (pré-qualification).
  // Transmise à l'API et stockée en Supabase + Brevo si renseignée.
  const villeEnvisagee = useAppStore((s) => s.villeEnvisagee);

  // Au mount, on lit le cookie pour décider du blur réel
  useEffect(() => {
    setHydrated(true);
    setUnlocked(isUnlockedClient());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: prenom.trim(),
          nom: "",
          email: email.trim().toLowerCase(),
          source_article_slug: sourceArticleSlug,
          ville_envisagee: villeEnvisagee,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Erreur ${res.status}`);
      }

      // Cookie côté client pour unlock immédiat (le serveur le pose aussi via Set-Cookie)
      // 365 jours, samesite Lax pour fonctionner sur les liens entrants
      document.cookie = `${COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      setStatus("success");
      // Délai bref pour montrer la confirmation, puis unlock visuel
      setTimeout(() => setUnlocked(true), 1800);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Une erreur est survenue. Réessaie dans un instant.",
      );
    }
  }

  // Avant hydratation OU si déjà unlocked : rendu normal sans blur
  if (!hydrated || unlocked) {
    return <div data-newsletter-gate="unlocked">{children}</div>;
  }

  // Pas unlocked : blur visuel + form en sticky-overlay
  return (
    <div className="relative" data-newsletter-gate="locked">
      {/* Contenu blurré, indexable par Google car dans le DOM */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none blur-md max-h-[480px] overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)",
        }}
      >
        {children}
      </div>

      {/* Overlay avec formulaire */}
      <div className="absolute inset-x-0 -bottom-12 z-10 mx-auto max-w-xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-brand-iris/25 bg-white p-6 shadow-[0_20px_50px_rgba(82,98,122,0.18)] sm:p-8">
          {/* Halo décoratif iris -> vert en arrière-plan */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-brand-iris-soft via-brand-iris-soft/40 to-brand-vert-soft blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gradient-to-br from-brand-vert-soft via-brand-vert-soft/40 to-brand-iris-soft blur-3xl"
          />

          {status !== "success" && (
            <div className="relative">
              {/* Eyebrow + preuve sociale en une ligne */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-iris-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-iris-strong">
                  <Sparkles className="h-3 w-3" />
                  Accès offert
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-bleu/70">
                  <span className="flex -space-x-1.5">
                    <span className="h-4 w-4 rounded-full border border-white bg-gradient-to-br from-brand-iris to-brand-iris-strong" />
                    <span className="h-4 w-4 rounded-full border border-white bg-gradient-to-br from-brand-vert to-brand-iris" />
                    <span className="h-4 w-4 rounded-full border border-white bg-gradient-to-br from-brand-iris-strong to-brand-bleu" />
                  </span>
                  <span>
                    <strong className="font-semibold text-brand-bleu">312 Parisiens</strong> l&apos;ont
                    déjà reçu
                  </span>
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-medium leading-tight text-brand-bleu sm:text-[28px]">
                Découvre les{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">7 villes</span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0.5 z-0 h-2.5 rounded-sm bg-brand-iris-soft"
                  />
                </span>{" "}
                que la plupart des Parisiens ratent
              </h3>

              <p className="mt-2.5 text-[13.5px] leading-relaxed text-brand-bleu/75">
                Le classement complet 2026, prix m² réels et temps de trajet vérifiés. Envoyé en
                30 secondes, sans détour.
              </p>

              {/* Bullets bénéfices avec icônes */}
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2.5 text-[13px] text-brand-bleu">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-vert-soft text-brand-bleu">
                    <FileDown className="h-3 w-3" />
                  </span>
                  <span>
                    <strong className="font-semibold">PDF imprimable</strong> avec les 10 communes,
                    prix m² et trajet
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-[13px] text-brand-bleu">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-vert-soft text-brand-bleu">
                    <Inbox className="h-3 w-3" />
                  </span>
                  <span>
                    <strong className="font-semibold">1 email par mois max</strong>, jamais de spam
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-[13px] text-brand-bleu">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-vert-soft text-brand-bleu">
                    <XCircle className="h-3 w-3" />
                  </span>
                  <span>
                    <strong className="font-semibold">Désinscription en 1 clic</strong>, ton email
                    reste chez nous
                  </span>
                </li>
              </ul>

              <form onSubmit={handleSubmit} className="mt-5 space-y-2.5">
                {/* Réduction de friction : 2 champs seulement, prénom puis email */}
                <div className="grid gap-2.5 sm:grid-cols-[1fr_1.4fr]">
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-brand-bleu/60">
                      Prénom
                    </span>
                    <input
                      type="text"
                      required
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Camille"
                      autoComplete="given-name"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-[15px] text-brand-bleu placeholder:text-neutral-400 focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/25"
                      disabled={status === "submitting"}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-brand-bleu/60">
                      Email
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="prenom@exemple.fr"
                      autoComplete="email"
                      inputMode="email"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-[15px] text-brand-bleu placeholder:text-neutral-400 focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/25"
                      disabled={status === "submitting"}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-iris to-brand-iris-strong px-5 py-4 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(157,140,242,0.45)] transition-all hover:scale-[1.01] hover:shadow-[0_12px_32px_rgba(157,140,242,0.6)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  {status === "submitting" ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      Envoie-moi les 7 villes
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-brand-bleu/55">
                  Gratuit, sans engagement. Tes données ne quittent jamais notre serveur.
                </p>

                {status === "error" && errorMsg && (
                  <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-xs text-rose-700">
                    {errorMsg}
                  </p>
                )}
              </form>
            </div>
          )}

          {status === "success" && (
            <div className="relative py-4 text-center">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <span
                  aria-hidden
                  className="absolute inset-0 animate-ping rounded-full bg-brand-vert/40"
                />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-vert-soft to-brand-vert text-brand-bleu shadow-[0_8px_24px_rgba(175,198,190,0.5)]">
                  <Check className="h-7 w-7" strokeWidth={2.5} />
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-medium text-brand-bleu">
                Presque ! Confirme ton email
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-brand-bleu/75">
                On vient de t&apos;envoyer un lien de confirmation. Clique dessus pour recevoir le
                Top 10 complet + le PDF.
              </p>
              <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-brand-iris-soft px-3.5 py-1.5 text-[11.5px] font-medium text-brand-iris-strong">
                <Sparkles className="h-3 w-3" />
                Lecture déverrouillée juste en dessous
              </div>
              <p className="mt-3 text-[11px] text-brand-bleu/50">
                Pense à vérifier tes spams si rien n&apos;arrive dans 2 minutes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Spacer pour empêcher le overlap avec le contenu suivant */}
      <div aria-hidden className="h-80 sm:h-72" />
    </div>
  );
}
