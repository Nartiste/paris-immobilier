"use client";

import { Sliders, ListOrdered } from "lucide-react";
import { useAppStore } from "@/lib/store";

/**
 * Barre flottante mobile-only avec 2 boutons : Filtres + Top 10.
 * Le bouton Concierge est dans son propre composant (bas-droite).
 *
 * Visible < lg seulement (la sidebar et le top ranking sont déjà visibles
 * en desktop).
 */
export default function MobileControls() {
  const {
    mobileFiltersOpen,
    setMobileFiltersOpen,
    mobileTopOpen,
    setMobileTopOpen,
    conciergeOpen,
  } = useAppStore();

  // Si l'un des sheets est déjà ouvert, masquer la barre
  if (mobileFiltersOpen || mobileTopOpen || conciergeOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 z-30 flex gap-2 lg:hidden">
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-medium text-neutral-800 shadow-lg ring-1 ring-neutral-200 hover:bg-neutral-50"
        aria-label="Ouvrir les filtres"
      >
        <Sliders className="h-3.5 w-3.5" />
        Filtres
      </button>
      <button
        onClick={() => setMobileTopOpen(true)}
        className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-medium text-neutral-800 shadow-lg ring-1 ring-neutral-200 hover:bg-neutral-50"
        aria-label="Voir le top 10"
      >
        <ListOrdered className="h-3.5 w-3.5" />
        Top 10
      </button>
    </div>
  );
}
