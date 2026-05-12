"use client";

import { Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { track } from "@/lib/analytics";

/**
 * Bouton qui ouvre manuellement le quiz d'onboarding.
 * Placé dans le hero pour que les visiteurs récurrents (qui ont déjà skippé
 * ou complété) puissent relancer le quiz et reconfigurer leurs critères.
 */
export default function OnboardingTriggerButton({
  variant = "primary",
}: {
  variant?: "primary" | "ghost";
}) {
  const setOnboardingOpen = useAppStore((s) => s.setOnboardingOpen);

  const handleClick = () => {
    track("concierge_open", { source: "trigger-button" });
    setOnboardingOpen(true);
  };

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
