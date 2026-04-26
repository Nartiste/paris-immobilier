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

  selectedCommuneInsee: string | null;
  setSelectedCommune: (insee: string | null) => void;

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

  selectedCommuneInsee: null,
  setSelectedCommune: (insee) => set({ selectedCommuneInsee: insee }),

  showGpe: true,
  toggleGpe: () => set((s) => ({ showGpe: !s.showGpe })),
}));
