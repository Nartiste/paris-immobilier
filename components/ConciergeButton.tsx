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
      className="group fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-brand-iris px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-brand-iris-strong hover:shadow-xl"
      aria-label="Ouvrir le concierge IA"
    >
      <Sparkles className="h-4 w-4" />
      <span className="hidden sm:inline">Concierge IA</span>
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-iris/60 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-iris-strong" />
      </span>
    </button>
  );
}
