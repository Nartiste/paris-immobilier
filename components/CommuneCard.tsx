"use client";

import { X, Train, Car, Clock } from "lucide-react";
import type { Commune } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { computeCommuneScore, scoreToColor, scoreToLabel } from "@/lib/scoring";
import { formatEuros, formatNumber, formatPercent } from "@/lib/utils";

type Props = {
  commune: Commune;
  onClose: () => void;
};

export default function CommuneCard({ commune, onClose }: Props) {
  const { weights, mode, profile } = useAppStore();
  const score = computeCommuneScore(commune, weights, mode, profile);
  const color = scoreToColor(score.total);

  const subScores: { key: keyof typeof score; label: string }[] = [
    { key: "tempsParis", label: "Accès Paris" },
    { key: "prix", label: profile === "acheteur" ? "Prix achat" : "Prix loyer" },
    { key: "qualiteVie", label: "Qualité de vie" },
    { key: "economie", label: "Économie" },
    { key: "education", label: "Éducation" },
    { key: "futurTransport", label: "Futurs transports" },
  ];

  const tcMin = commune.temps_trajet_tc_min;
  const carMin = commune.temps_trajet_voiture_min;

  return (
    <div className="absolute right-4 top-[76px] z-30 max-h-[calc(100vh-96px)] w-[340px] overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl">
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-neutral-900">
            {commune.nom}
          </h2>
          <p className="text-xs text-neutral-500">
            {commune.code_postal} · {commune.departement} ·{" "}
            {formatNumber(commune.population)} hab.
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <div
          className="flex items-baseline justify-between rounded-lg p-3"
          style={{ backgroundColor: `${color}18`, borderColor: color }}
        >
          <div>
            <div className="text-3xl font-bold tabular-nums" style={{ color }}>
              {score.total}
              <span className="text-base text-neutral-400">/100</span>
            </div>
            <div className="text-xs font-medium" style={{ color }}>
              {scoreToLabel(score.total)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-500">
              {profile === "acheteur" ? "Prix médian achat" : "Loyer médian"}
            </div>
            <div className="text-lg font-semibold text-neutral-900">
              {profile === "acheteur"
                ? `${formatEuros(commune.prix_m2_median)}/m²`
                : `${formatEuros(commune.loyer_m2_median)}/m²`}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 mb-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
            <Clock className="h-3.5 w-3.5" />
            Trajet vers Paris
          </div>
          <div className="text-lg font-bold tabular-nums text-neutral-900">
            {commune.temps_trajet_paris_min} min
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 rounded-md bg-white px-2 py-1.5 text-neutral-700">
            <Train className="h-3 w-3 text-emerald-600" />
            <span className="tabular-nums">{tcMin != null ? `${tcMin} min` : "—"}</span>
            {commune.ligne_principale && (
              <span className="ml-auto truncate text-neutral-500">
                {commune.ligne_principale}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-white px-2 py-1.5 text-neutral-700">
            <Car className="h-3 w-3 text-amber-600" />
            <span className="tabular-nums">{carMin != null ? `${carMin} min` : "—"}</span>
            <span className="ml-auto text-neutral-500">
              {commune.distance_paris_km} km
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 px-4 pb-2">
        {subScores.map(({ key, label }) => {
          const v = score[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-32 text-xs text-neutral-600">{label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${v}%`,
                    backgroundColor: scoreToColor(v),
                  }}
                />
              </div>
              <span className="w-8 text-right text-xs tabular-nums text-neutral-500">
                {v}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-neutral-100 p-4 text-xs">
        <Stat
          label="Évolution prix 5 ans"
          value={formatPercent(commune.prix_m2_evolution_5y)}
        />
        <Stat
          label="Rendement locatif"
          value={formatPercent(commune.rendement_locatif)}
        />
        <Stat label="Revenu médian" value={formatEuros(commune.revenu_median)} />
        <Stat
          label="Taux chômage"
          value={formatPercent(commune.taux_chomage)}
        />
        <Stat
          label="Distance gare"
          value={
            commune.distance_gare_km != null
              ? `${commune.distance_gare_km} km`
              : "—"
          }
        />
        <Stat
          label="Espaces verts"
          value={formatPercent(commune.espaces_verts_pct, 0)}
        />
        <Stat
          label="Transactions DVF"
          value={formatNumber(commune.nb_transactions)}
        />
        <Stat
          label="Bonus GPE"
          value={
            commune.bonus_gpe != null
              ? `${Math.round(commune.bonus_gpe * 100)}%`
              : "—"
          }
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-neutral-400">
        {label}
      </span>
      <span className="font-medium text-neutral-800">{value}</span>
    </div>
  );
}
