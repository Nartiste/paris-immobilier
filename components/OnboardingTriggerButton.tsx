"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { track } from "@/lib/analytics";

type Variant = "hero" | "primary" | "ghost";

/**
 * Bouton qui ouvre manuellement le quiz d'onboarding.
 *
 * - `hero` : variante XL pour la home, dominant visuellement.
 *   Premier élément actionnable au-dessus du fold, promesse + microcopy.
 * - `primary` : compact, gradient iris, utilisé dans les pillars.
 * - `ghost` : "Refaire le quiz" discret pour visiteurs récurrents.
 */
export default function OnboardingTriggerButton({
  variant = "primary",
  source = "trigger-button",
}: {
  variant?: Variant;
  source?: string;
}) {
  const setOnboardingOpen = useAppStore((s) => s.setOnboardingOpen);

  const handleClick = () => {
    track("concierge_open", { source });
    setOnboardingOpen(true);
  };

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="Lancer le quiz : trouve ta ville idéale en 4 clics"
        className="hero-cta group relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-iris via-brand-iris-strong to-brand-iris px-5 py-4 text-left text-white shadow-[0_10px_32px_rgba(122,102,224,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(122,102,224,0.55)] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-iris/40 sm:px-6 sm:py-5"
      >
        {/* Halo pulse subtil pour attirer l'œil sans agresser */}
        <span
          aria-hidden
          className="hero-cta-halo pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-white/40 group-hover:opacity-0"
        />
        {/* Gradient shimmer animé */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
        />
        <span className="relative flex items-center gap-3 sm:gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm sm:h-11 sm:w-11">
            <Sparkles className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
          </span>
          <span className="flex flex-1 flex-col">
            <span className="text-base font-semibold leading-tight sm:text-lg">
              Démasquer ma ville idéale
            </span>
            <span className="mt-0.5 text-[11px] font-medium text-white/85 sm:text-xs">
              Gratuit · 4 clics · Sans engagement
            </span>
          </span>
          <ArrowRight className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
        </span>
      </button>
    );
  }

  if (variant === "ghost") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 rounded-2xl border border-brand-iris/30 bg-white/80 px-4 py-2.5 text-sm font-medium text-brand-iris-strong shadow-[0_2px_8px_rgba(157,140,242,0.15)] backdrop-blur transition-all hover:scale-[1.02] hover:bg-brand-iris-soft/60"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Refaire le quiz
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-brand-iris to-brand-iris-strong px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(157,140,242,0.4)] transition-all hover:scale-[1.02]"
    >
      <Sparkles className="h-3.5 w-3.5" />
      Trouve ta ville idéale
    </button>
  );
}
