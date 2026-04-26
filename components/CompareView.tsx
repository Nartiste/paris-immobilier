"use client";

import { X, ArrowRightLeft } from "lucide-react";
import type { Commune } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { computeCommuneScore, scoreToColor } from "@/lib/scoring";
import { formatEuros, formatNumber, formatPercent } from "@/lib/utils";

type Props = {
  a: Commune;
  b: Commune;
  onClose: () => void;
  onSwap: () => void;
};

export default function CompareView({ a, b, onClose, onSwap }: Props) {
  const { weights, mode, profile } = useAppStore();
  const sa = computeCommuneScore(a, weights, mode, profile);
  const sb = computeCommuneScore(b, weights, mode, profile);

  const rows: { label: string; va: string; vb: string; aBetter: boolean | null }[] = [
    {
      label: "Score global",
      va: `${sa.total}/100`,
      vb: `${sb.total}/100`,
      aBetter: sa.total === sb.total ? null : sa.total > sb.total,
    },
    {
      label: "Trajet Paris",
      va: `${a.temps_trajet_paris_min} min`,
      vb: `${b.temps_trajet_paris_min} min`,
      aBetter:
        a.temps_trajet_paris_min === b.temps_trajet_paris_min
          ? null
          : a.temps_trajet_paris_min < b.temps_trajet_paris_min,
    },
    {
      label: profile === "acheteur" ? "Prix m² achat" : "Loyer m²",
      va:
        profile === "acheteur"
          ? a.prix_m2_median != null ? `${formatEuros(a.prix_m2_median)}/m²` : "—"
          : a.loyer_m2_median != null ? `${formatEuros(a.loyer_m2_median)}/m²` : "—",
      vb:
        profile === "acheteur"
          ? b.prix_m2_median != null ? `${formatEuros(b.prix_m2_median)}/m²` : "—"
          : b.loyer_m2_median != null ? `${formatEuros(b.loyer_m2_median)}/m²` : "—",
      aBetter: (() => {
        const fa = profile === "acheteur" ? a.prix_m2_median : a.loyer_m2_median;
        const fb = profile === "acheteur" ? b.prix_m2_median : b.loyer_m2_median;
        if (fa == null || fb == null || fa === fb) return null;
        return fa < fb;
      })(),
    },
    {
      label: "Population",
      va: formatNumber(a.population),
      vb: formatNumber(b.population),
      aBetter: null,
    },
    {
      label: "Revenu médian",
      va: a.revenu_median != null ? formatEuros(a.revenu_median) : "—",
      vb: b.revenu_median != null ? formatEuros(b.revenu_median) : "—",
      aBetter:
        a.revenu_median != null && b.revenu_median != null && a.revenu_median !== b.revenu_median
          ? a.revenu_median > b.revenu_median
          : null,
    },
    {
      label: "Taux chômage",
      va: formatPercent(a.taux_chomage),
      vb: formatPercent(b.taux_chomage),
      aBetter:
        a.taux_chomage != null && b.taux_chomage != null && a.taux_chomage !== b.taux_chomage
          ? a.taux_chomage < b.taux_chomage
          : null,
    },
    {
      label: "Rendement locatif",
      va: formatPercent(a.rendement_locatif),
      vb: formatPercent(b.rendement_locatif),
      aBetter:
        a.rendement_locatif != null && b.rendement_locatif != null && a.rendement_locatif !== b.rendement_locatif
          ? a.rendement_locatif > b.rendement_locatif
          : null,
    },
    {
      label: "Espaces verts",
      va: formatPercent(a.espaces_verts_pct, 0),
      vb: formatPercent(b.espaces_verts_pct, 0),
      aBetter:
        a.espaces_verts_pct != null && b.espaces_verts_pct != null && a.espaces_verts_pct !== b.espaces_verts_pct
          ? a.espaces_verts_pct > b.espaces_verts_pct
          : null,
    },
  ];

  const subRows: { key: keyof typeof sa; label: string }[] = [
    { key: "tempsParis", label: "Accès Paris" },
    { key: "prix", label: profile === "acheteur" ? "Prix achat" : "Prix loyer" },
    { key: "qualiteVie", label: "Qualité de vie" },
    { key: "economie", label: "Économie" },
    { key: "education", label: "Éducation" },
    { key: "futurTransport", label: "Futurs transports" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-2xl max-h-[calc(100vh-32px)] overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-3">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-neutral-500" />
            <h2 className="text-sm font-semibold text-neutral-900">Comparaison</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onSwap}
              className="rounded-md px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
              title="Inverser"
            >
              Inverser
            </button>
            <button
              onClick={onClose}
              className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-b border-neutral-100 p-4">
          <CityHeader commune={a} score={sa.total} />
          <CityHeader commune={b} score={sb.total} />
        </div>

        <div className="px-4 py-3">
          <div className="mb-2 text-[10px] uppercase tracking-wider text-neutral-400">
            Indicateurs clés
          </div>
          <div className="space-y-1.5">
            {rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[1fr_140px_140px] items-center gap-2 text-xs">
                <span className="text-neutral-600">{r.label}</span>
                <span
                  className={`text-right font-medium tabular-nums ${
                    r.aBetter === true ? "text-emerald-700" : "text-neutral-800"
                  }`}
                >
                  {r.va}
                </span>
                <span
                  className={`text-right font-medium tabular-nums ${
                    r.aBetter === false ? "text-emerald-700" : "text-neutral-800"
                  }`}
                >
                  {r.vb}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-100 px-4 py-3">
          <div className="mb-2 text-[10px] uppercase tracking-wider text-neutral-400">
            Sous-scores
          </div>
          <div className="space-y-2">
            {subRows.map(({ key, label }) => {
              const va = sa[key] as number;
              const vb = sb[key] as number;
              return (
                <div key={key}>
                  <div className="mb-0.5 flex items-center justify-between text-xs">
                    <span className="text-neutral-600">{label}</span>
                    <span className="tabular-nums text-neutral-500">
                      {va} vs {vb}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <ScoreBar value={va} />
                    <ScoreBar value={vb} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CityHeader({ commune, score }: { commune: Commune; score: number }) {
  const color = scoreToColor(score);
  return (
    <div
      className="rounded-lg p-3"
      style={{ backgroundColor: `${color}12`, borderLeft: `3px solid ${color}` }}
    >
      <div className="truncate text-sm font-semibold text-neutral-900">{commune.nom}</div>
      <div className="text-[11px] text-neutral-500">
        {commune.code_postal} · {commune.departement}
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums" style={{ color }}>
        {score}
        <span className="text-sm text-neutral-400">/100</span>
      </div>
    </div>
  );
}

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: scoreToColor(value) }}
      />
    </div>
  );
}
