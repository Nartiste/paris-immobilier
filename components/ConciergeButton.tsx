"use client";

import { Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { track } from "@/lib/analytics";

export default function ConciergeButton() {
  const { conciergeOpen, setConciergeOpen } = useAppStore();

  if (conciergeOpen) return null;

  return (
    <button
      onClick={() => {
        setConciergeOpen(true);
        track("concierge_open");
      }}
      className="concierge-button group fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-gradient-to-br from-brand-iris to-brand-iris-strong px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(157,140,242,0.5)] transition-all hover:scale-[1.05] hover:shadow-[0_12px_32px_rgba(157,140,242,0.65)]"
      aria-label="Ouvrir le concierge IA"
    >
      {/* Halo pulsant en arrière-plan (sous le bouton) */}
      <span
        aria-hidden
        className="concierge-halo absolute inset-0 rounded-full bg-brand-iris"
        style={{ zIndex: -1 }}
      />
      <Sparkles className="concierge-wiggle relative h-4 w-4" />
      <span className="relative hidden sm:inline">Concierge IA</span>
      {/* Petit dot de notification */}
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-white shadow-sm" />
      </span>
    </button>
  );
}
