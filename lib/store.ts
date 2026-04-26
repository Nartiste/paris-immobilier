"use client";

import { create } from "zustand";
import { DEFAULT_WEIGHTS, type Profile, type ScoreMode, type Weights } from "./types";

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
  isPickingCompare: boolean;
  setPickingCompare: (v: boolean) => void;

  showGpe: boolean;
  toggleGpe: () => void;
};

export const useAppStore = create<AppState>((set) => ({
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
  isPickingCompare: false,
  setPickingCompare: (v) => set({ isPickingCompare: v }),

  showGpe: true,
  toggleGpe: () => set((s) => ({ showGpe: !s.showGpe })),
}));
