"use client";

import { TrendingUp } from "lucide-react";
import type { Commune, Weights, ScoreMode, Profile } from "@/lib/types";
import { computeCommuneScore, scoreToColor } from "@/lib/scoring";
import { formatEuros } from "@/lib/utils";

type Props = {
  communes: Commune[];
  weights: Weights;
  mode: ScoreMode;
  profile: Profile;
  budgetMax: number | null;
  tempsMaxParis: number;
  onSelect: (insee: string) => void;
  /** Si true : rendu plat sans wrapper (pour usage dans un MobileSheet). */
  flat?: boolean;
};

export default function TopRanking({
  communes,
  weights,
  mode,
  profile,
  budgetMax,
  tempsMaxParis,
  onSelect,
  flat = false,
}: Props) {
  const ranked = communes
    .filter((c) => c.temps_trajet_paris_min <= tempsMaxParis)
    .filter((c) =>
      budgetMax == null
        ? true
        : profile === "acheteur"
          ? (c.prix_m2_median ?? 0) <= budgetMax
          : (c.loyer_m2_median ?? 0) <= budgetMax,
    )
    .map((c) => ({
      commune: c,
      score: computeCommuneScore(c, weights, mode, profile),
    }))
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 10);

  const list = (
    <ol className={flat ? "py-1" : "max-h-72 overflow-y-auto py-1"}>
      {ranked.map(({ commune, score }, i) => (
        <li key={commune.code_insee}>
          <button
            onClick={() => onSelect(commune.code_insee)}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-neutral-50 lg:py-1.5"
          >
            <span className="w-5 text-center text-xs font-semibold text-neutral-400 tabular-nums">
              {i + 1}
            </span>
            <span className="flex-1 truncate text-sm text-neutral-900">
              {commune.nom}
            </span>
            <span className="text-[10px] text-emerald-700 tabular-nums">
              {commune.temps_trajet_paris_min}min
            </span>
            <span className="hidden text-[10px] text-neutral-400 sm:inline">
              {profile === "acheteur"
                ? `${formatEuros(commune.prix_m2_median)}/m²`
                : `${formatEuros(commune.loyer_m2_median)}/m²`}
            </span>
            <span
              className="ml-1 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white"
              style={{ backgroundColor: scoreToColor(score.total) }}
            >
              {score.total}
            </span>
          </button>
        </li>
      ))}
      {ranked.length === 0 && (
        <li className="px-4 py-3 text-xs text-neutral-500">
          Aucune commune ne correspond à vos critères.
        </li>
      )}
    </ol>
  );

  if (flat) return list;

  return (
    <div className="absolute bottom-4 left-4 z-10 hidden w-[300px] rounded-xl border border-neutral-200 bg-white shadow-xl lg:block">
      <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-2.5">
        <TrendingUp className="h-4 w-4 text-emerald-600" />
        <span className="text-sm font-semibold text-neutral-900">
          Top 10 communes
        </span>
      </div>
      {list}
    </div>
  );
}
