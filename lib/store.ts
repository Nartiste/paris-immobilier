"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_WEIGHTS, type Profile, type ScoreMode, type Weights } from "./types";

export const FREE_COMPARISON_LIMIT = 3;

type AppState = {
  weights: Weights;
  setWeight: (key: keyof Weights, value: number) => void;
  resetWeights: () => void;

  mode: ScoreMode;
  setMode: (mode: ScoreMode) => void;

  profile: Profile;
  setProfile: (profile: Profile) => void;

  budgetMax: number | null;
  setBudgetMax: (value: number | null) => void;

  tempsMaxParis: number;
  setTempsMaxParis: (value: number) => void;

  selectedCommuneInsee: string | null;
  setSelectedCommune: (insee: string | null) => void;

  compareCommuneInsee: string | null;
  setCompareCommune: (insee: string | null) => void;

  showGpe: boolean;
  toggleGpe: () => void;

  /** Premium gating */
  isPremium: boolean;
  setPremium: (v: boolean) => void;
  comparisonsUsed: number;
  incrementComparisons: () => void;
  showPaywall: boolean;
  setShowPaywall: (v: boolean) => void;

  /** AI Concierge */
  conciergeOpen: boolean;
  setConciergeOpen: (v: boolean) => void;

  /** Mobile UI sheets */
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (v: boolean) => void;
  mobileTopOpen: boolean;
  setMobileTopOpen: (v: boolean) => void;

  /** Recherche d'adresse — découple AddressSearch du parent */
  pendingAddress: {
    insee: string;
    lat: number;
    lon: number;
    label: string;
  } | null;
  setPendingAddress: (a: AppState["pendingAddress"]) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      weights: DEFAULT_WEIGHTS,
      setWeight: (key, value) =>
        set((s) => ({ weights: { ...s.weights, [key]: value } })),
      resetWeights: () => set({ weights: DEFAULT_WEIGHTS }),

      mode: "rapport_qualite_prix",
      setMode: (mode) => set({ mode }),

      profile: "acheteur",
      setProfile: (profile) => set({ profile }),

      budgetMax: null,
      setBudgetMax: (value) => set({ budgetMax: value }),

      tempsMaxParis: 120,
      setTempsMaxParis: (value) => set({ tempsMaxParis: value }),

      selectedCommuneInsee: null,
      setSelectedCommune: (insee) => set({ selectedCommuneInsee: insee }),

      compareCommuneInsee: null,
      setCompareCommune: (insee) => set({ compareCommuneInsee: insee }),

      showGpe: true,
      toggleGpe: () => set((s) => ({ showGpe: !s.showGpe })),

      isPremium: false,
      setPremium: (v) => set({ isPremium: v }),
      comparisonsUsed: 0,
      incrementComparisons: () =>
        set((s) => ({ comparisonsUsed: s.comparisonsUsed + 1 })),
      showPaywall: false,
      setShowPaywall: (v) => set({ showPaywall: v }),

      conciergeOpen: false,
      setConciergeOpen: (v) => set({ conciergeOpen: v }),

      mobileFiltersOpen: false,
      setMobileFiltersOpen: (v) => set({ mobileFiltersOpen: v }),
      mobileTopOpen: false,
      setMobileTopOpen: (v) => set({ mobileTopOpen: v }),

      pendingAddress: null,
      setPendingAddress: (a) => set({ pendingAddress: a }),
    }),
    {
      name: "paris-immo-app",
      partialize: (s) => ({
        isPremium: s.isPremium,
        comparisonsUsed: s.comparisonsUsed,
        profile: s.profile,
        mode: s.mode,
        weights: s.weights,
      }),
    },
  ),
);
