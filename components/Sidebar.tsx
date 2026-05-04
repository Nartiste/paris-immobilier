"use client";

import { Sliders, RotateCcw, Train, Clock } from "lucide-react";
import type { Weights } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const WEIGHT_LABELS: Record<keyof Weights, { label: string; hint: string }> = {
  tempsParis: {
    label: "Temps vers Paris",
    hint: "Temps de trajet (TC ou voiture) vers Paris intra-muros",
  },
  prix: { label: "Prix immobilier", hint: "Prix au m² (achat ou loyer selon profil)" },
  qualiteVie: {
    label: "Qualité de vie",
    hint: "Commerces, médecins, espaces verts, sécurité",
  },
  economie: { label: "Économie locale", hint: "Revenu médian, emploi" },
  education: { label: "Éducation", hint: "Densité d'écoles" },
  futurTransport: {
    label: "Futurs transports",
    hint: "Bonus Grand Paris Express + projets en cours",
  },
};

export default function Sidebar() {
  const {
    weights,
    setWeight,
    resetWeights,
    budgetMax,
    setBudgetMax,
    tempsMaxParis,
    setTempsMaxParis,
    showGpe,
    toggleGpe,
  } = useAppStore();

  return (
    <div className="flex w-full flex-col gap-5 bg-white p-4">
      <div>
        <label className="text-sm font-semibold text-neutral-900">
          Budget max (€/m²)
        </label>
        <input
          type="number"
          inputMode="numeric"
          value={budgetMax ?? ""}
          onChange={(e) =>
            setBudgetMax(e.target.value ? Number(e.target.value) : null)
          }
          placeholder="ex : 5000"
          className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
            <Sliders className="h-4 w-4" />
            Pondération des critères
          </h2>
          <button
            onClick={resetWeights}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
          >
            <RotateCcw className="h-3 w-3" />
            Réinit.
          </button>
        </div>

        {/* Filtre dur 'Temps max vers Paris' regroupé avec les pondérations
            mais visuellement distinct (encadré + accent iris) car il filtre
            les communes au lieu de pondérer leur score. */}
        <div className="mt-3 rounded-xl border border-brand-iris/25 bg-brand-iris-soft/30 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-brand-bleu">
              <Clock className="h-3.5 w-3.5" />
              Temps max vers Paris
            </span>
            <span className="tabular-nums font-semibold text-brand-iris-strong">
              {tempsMaxParis} min
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={tempsMaxParis}
            onChange={(e) => setTempsMaxParis(Number(e.target.value))}
            className="mt-2 w-full accent-brand-iris-strong"
            aria-label={`Temps maximum vers Paris : ${tempsMaxParis} minutes`}
          />
          <p className="mt-1 text-[10px] leading-tight text-brand-bleu/60">
            Filtre dur : exclut les communes au-delà de ce temps de trajet.
          </p>
        </div>

        <div className="mt-3 space-y-4">
          {(Object.keys(WEIGHT_LABELS) as (keyof Weights)[])
            // 'tempsParis' weight retiré : doublon avec le filtre dur ci-dessus.
            .filter((key) => key !== "tempsParis")
            .map((key) => (
            <div key={key}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-800">
                  {WEIGHT_LABELS[key].label}
                </span>
                <span className="tabular-nums text-neutral-500">
                  {weights[key]}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights[key]}
                onChange={(e) => setWeight(key, Number(e.target.value))}
                className="mt-1 w-full accent-neutral-900"
                aria-label={`Pondération ${WEIGHT_LABELS[key].label} : ${weights[key]} sur 50`}
              />
              <p className="mt-0.5 text-[10px] leading-tight text-neutral-400">
                {WEIGHT_LABELS[key].hint}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-4">
        <button
          onClick={toggleGpe}
          className={cn(
            "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
            showGpe
              ? "bg-brand-iris-soft text-brand-iris-strong shadow-[0_1px_3px_rgba(157,140,242,0.2)]"
              : "border border-neutral-200 bg-white text-neutral-700",
          )}
        >
          <span className="flex items-center gap-2">
            <Train className="h-4 w-4" />
            Futures gares (GPE)
          </span>
          <span className="text-xs">{showGpe ? "Affichées" : "Masquées"}</span>
        </button>
      </div>

      <div className="rounded-lg bg-neutral-50 p-3 text-[11px] leading-relaxed text-neutral-600">
        <strong className="text-neutral-900">Sources :</strong> DVF (data.gouv.fr),
        INSEE BPE/FILOSOFI, BAN, Société des Grands Projets, OpenStreetMap.
      </div>
    </div>
  );
}
