"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Lock, Sparkles, ArrowRight, Check } from "lucide-react";

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
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
          nom: nom.trim(),
          email: email.trim().toLowerCase(),
          source_article_slug: sourceArticleSlug,
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
      setTimeout(() => setUnlocked(true), 1500);
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
        <div className="rounded-3xl border border-brand-iris/30 bg-white p-6 shadow-[0_20px_50px_rgba(82,98,122,0.18)] sm:p-8">
          {status !== "success" && (
            <>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-iris text-white shadow-[0_4px_14px_rgba(157,140,242,0.4)]">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-iris-strong">
                  La suite par email
                </div>
              </div>

              <h3 className="mt-4 font-display text-2xl font-medium leading-snug text-brand-bleu sm:text-3xl">
                Reçois le Top 10 complet dans ta boîte mail
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                Les 10 communes classées avec prix m², trajet, profil cible et arbitrages. Plus le <strong>PDF imprimable</strong> et les évolutions à venir. 1 email/mois max, désinscription en 1 clic.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Prénom"
                    autoComplete="given-name"
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/20"
                    disabled={status === "submitting"}
                  />
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Nom"
                    autoComplete="family-name"
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/20"
                    disabled={status === "submitting"}
                  />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.fr"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-iris focus:outline-none focus:ring-2 focus:ring-brand-iris/20"
                  disabled={status === "submitting"}
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-bleu px-5 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)] transition-all hover:scale-[1.01] hover:bg-brand-bleu/95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <>Envoi…</>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      Recevoir le Top 10
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>

                {status === "error" && errorMsg && (
                  <p className="mt-2 rounded-xl bg-rose-50 px-4 py-2.5 text-xs text-rose-700">
                    {errorMsg}
                  </p>
                )}

                <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">
                  En t'inscrivant, tu acceptes de recevoir nos emails. Données stockées sécurisées (Supabase), jamais revendues. Conformément au RGPD, tu peux te désinscrire à tout moment.
                </p>
              </form>
            </>
          )}

          {status === "success" && (
            <div className="py-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-medium text-brand-bleu">
                Vérifie ta boîte mail
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                Un email de confirmation vient d'arriver. Clique sur le bouton pour recevoir le Top 10 complet.
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                En attendant, on déverrouille la lecture pour toi…
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Spacer pour empêcher le overlap avec le contenu suivant */}
      <div aria-hidden className="h-72 sm:h-64" />
    </div>
  );
}
