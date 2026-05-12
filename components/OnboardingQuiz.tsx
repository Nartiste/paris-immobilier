"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import {
  type BudgetMode,
  type CritereId,
  type FrequenceParis,
  type OnboardingAnswers,
  type ProfilType,
  BUDGET_MODE_LABELS,
  CRITERE_LABELS,
  FREQUENCE_LABELS,
  PROFIL_LABELS,
  computeOnboardingResult,
  inferTempsMaxParis,
} from "@/lib/onboarding-presets";
import { cn } from "@/lib/utils";

const STEPS = 5;

const PROFILS: ProfilType[] = [
  "celibataire",
  "couple",
  "famille",
  "retraite",
  "investisseur",
];

const FREQUENCES: FrequenceParis[] = [
  "quotidien",
  "hybride",
  "occasionnel",
  "jamais",
];

const BUDGET_MODES: BudgetMode[] = ["m2_achat", "mensualite", "loyer"];

const CRITERES: CritereId[] = [
  "tempsParis",
  "prix",
  "qualiteVie",
  "economie",
  "education",
  "futurTransport",
];

export default function OnboardingQuiz() {
  const {
    onboardingOpen,
    setOnboardingOpen,
    setOnboarded,
    setWeight,
    setBudgetMax,
    setProfile,
    setTempsMaxParis,
    setShowCampagne,
  } = useAppStore();

  const [step, setStep] = useState<number>(1);
  const [profil, setProfil] = useState<ProfilType | null>(null);
  const [frequence, setFrequence] = useState<FrequenceParis | null>(null);
  const [tempsMax, setTempsMax] = useState<number>(90);
  const [tempsMaxTouched, setTempsMaxTouched] = useState(false);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("m2_achat");
  const [budgetValue, setBudgetValue] = useState<number>(5000);
  const [surface, setSurface] = useState<number>(60);
  const [criteres, setCriteres] = useState<CritereId[]>([]);

  // Pré-remplit le slider temps max depuis la fréquence Paris choisie,
  // tant que l'utilisateur ne l'a pas touché manuellement.
  useEffect(() => {
    if (frequence && !tempsMaxTouched) {
      setTempsMax(inferTempsMaxParis(frequence));
    }
  }, [frequence, tempsMaxTouched]);

  if (!onboardingOpen) return null;

  const canNext =
    (step === 1 && profil !== null) ||
    (step === 2 && frequence !== null) ||
    (step === 3 && tempsMax >= 15) ||
    (step === 4 && budgetValue > 0) ||
    (step === 5 && criteres.length === 2);

  const handleClose = (skipped: boolean) => {
    track("concierge_open", { source: skipped ? "skip" : "complete" });
    setOnboarded(true);
    setOnboardingOpen(false);
  };

  const handleSubmit = () => {
    if (!profil || !frequence || criteres.length !== 2) return;
    const answers: OnboardingAnswers = {
      profil,
      frequenceParis: frequence,
      tempsMaxParis: tempsMax,
      budgetMode,
      budgetValue,
      surfaceVisee: surface,
      criteresPrioritaires: criteres,
    };
    const result = computeOnboardingResult(answers);

    // Applique au store Zustand
    setWeight("tempsParis", result.weights.tempsParis);
    setWeight("prix", result.weights.prix);
    setWeight("qualiteVie", result.weights.qualiteVie);
    setWeight("economie", result.weights.economie);
    setWeight("education", result.weights.education);
    setWeight("futurTransport", result.weights.futurTransport);
    setBudgetMax(result.budgetMax);
    setProfile(result.profile);
    setTempsMaxParis(result.tempsMaxParis);
    setShowCampagne(result.showCampagne);

    track("concierge_open", { source: "onboarding-complete" });
    handleClose(false);

    // Scroll vers le top 10 personnalisé
    setTimeout(() => {
      const el =
        document.getElementById("filtres") ||
        document.querySelector("[id^='top-']");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const toggleCritere = (c: CritereId) => {
    setCriteres((prev) =>
      prev.includes(c)
        ? prev.filter((x) => x !== c)
        : prev.length < 2
          ? [...prev, c]
          : prev,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_64px_rgba(82,98,122,0.25)]">
        {/* HEADER : timeline + close */}
        <div className="border-b border-neutral-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-iris-strong" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-iris-strong">
                Trouve ta ville idéale
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleClose(true)}
              className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Fermer le quiz"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {/* Timeline : 4 segments */}
            <div className="flex flex-1 gap-1.5">
              {Array.from({ length: STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all",
                    i + 1 <= step ? "bg-brand-iris-strong" : "bg-neutral-200",
                  )}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium tabular-nums text-neutral-500">
              {step}/{STEPS}
            </span>
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-6">
          {step === 1 && (
            <div>
              <h2 className="font-display text-xl font-medium text-brand-bleu">
                Quel est ton profil ?
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                On adapte les recommandations selon ta situation.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {PROFILS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProfil(p)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-all",
                      profil === p
                        ? "border-brand-iris-strong bg-brand-iris-soft text-brand-iris-strong shadow-[0_2px_8px_rgba(157,140,242,0.25)]"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300",
                    )}
                  >
                    {PROFIL_LABELS[p]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-xl font-medium text-brand-bleu">
                Tu vas à Paris combien de fois par mois ?
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Ça détermine la distance acceptable.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {FREQUENCES.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequence(f)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left text-sm transition-all",
                      frequence === f
                        ? "border-brand-iris-strong bg-brand-iris-soft text-brand-iris-strong shadow-[0_2px_8px_rgba(157,140,242,0.25)]"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300",
                    )}
                  >
                    {FREQUENCE_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-xl font-medium text-brand-bleu">
                Temps maximum vers Paris ?
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Au-delà de cette durée porte-à-porte, la commune sort du
                classement. Pré-réglé selon ta fréquence — ajuste si besoin.
              </p>
              <div className="mt-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-semibold tabular-nums text-brand-bleu">
                    {tempsMax}
                  </span>
                  <span className="text-sm text-neutral-500">minutes max</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={180}
                  step={5}
                  value={tempsMax}
                  onChange={(e) => {
                    setTempsMax(Number(e.target.value));
                    setTempsMaxTouched(true);
                  }}
                  className="mt-3 w-full accent-brand-iris-strong"
                />
                <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
                  <span>15 min</span>
                  <span>1 h</span>
                  <span>1 h 30</span>
                  <span>2 h</span>
                  <span>3 h</span>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-1.5">
                  {[45, 60, 90, 120].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setTempsMax(preset);
                        setTempsMaxTouched(true);
                      }}
                      className={cn(
                        "rounded-xl border px-2 py-1.5 text-xs font-medium transition-all",
                        tempsMax === preset
                          ? "border-brand-iris-strong bg-brand-iris-soft text-brand-iris-strong"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
                      )}
                    >
                      {preset < 60 ? `${preset} min` : `${preset / 60} h${preset % 60 ? ` ${preset % 60}` : ""}`.trim()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-display text-xl font-medium text-brand-bleu">
                Quel est ton budget ?
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Tu choisis le mode qui te parle le plus.
              </p>

              <div className="mt-5 flex gap-2">
                {BUDGET_MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setBudgetMode(m);
                      if (m === "m2_achat") setBudgetValue(5000);
                      if (m === "mensualite") setBudgetValue(1500);
                      if (m === "loyer") setBudgetValue(1200);
                    }}
                    className={cn(
                      "flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-all",
                      budgetMode === m
                        ? "border-brand-iris-strong bg-brand-iris-soft text-brand-iris-strong"
                        : "border-neutral-200 bg-white text-neutral-600",
                    )}
                  >
                    {BUDGET_MODE_LABELS[m]}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label className="text-sm text-neutral-700">
                  {budgetMode === "m2_achat" && "Prix maximum au m² (€)"}
                  {budgetMode === "mensualite" && "Mensualité maximum (€/mois)"}
                  {budgetMode === "loyer" && "Loyer maximum total (€/mois)"}
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={budgetValue}
                  onChange={(e) => setBudgetValue(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base font-semibold tabular-nums text-brand-bleu focus:border-brand-iris-strong focus:outline-none"
                />
              </div>

              {(budgetMode === "mensualite" || budgetMode === "loyer") && (
                <div className="mt-4">
                  <label className="text-sm text-neutral-700">
                    Surface visée (m²)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={surface}
                    onChange={(e) => setSurface(Number(e.target.value) || 60)}
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base font-semibold tabular-nums text-brand-bleu focus:border-brand-iris-strong focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Pour {budgetMode === "mensualite"
                      ? "convertir mensualité en prix m² (prêt 20 ans à 4 %)"
                      : "convertir loyer total en €/m² mensuel"}.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-display text-xl font-medium text-brand-bleu">
                Tes 2 critères les plus importants ?
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                On les pondère plus fort dans le classement. Choisis exactement{" "}
                <strong>2 critères</strong>.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {CRITERES.map((c) => {
                  const isSelected = criteres.includes(c);
                  const isDisabled = !isSelected && criteres.length >= 2;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCritere(c)}
                      disabled={isDisabled}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-left text-sm transition-all",
                        isSelected
                          ? "border-brand-iris-strong bg-brand-iris-soft text-brand-iris-strong shadow-[0_2px_8px_rgba(157,140,242,0.25)]"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300",
                        isDisabled && "opacity-40",
                      )}
                    >
                      <div className="font-medium">{CRITERE_LABELS[c].label}</div>
                      <div className="mt-0.5 text-[11px] text-neutral-500">
                        {CRITERE_LABELS[c].hint}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] tabular-nums text-neutral-400">
                {criteres.length}/2 sélectionnés
              </p>
            </div>
          )}
        </div>

        {/* FOOTER : navigation */}
        <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 px-6 py-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleClose(true)}
              className="rounded-2xl px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100"
            >
              Plus tard
            </button>
          )}

          {step < STEPS ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS, s + 1))}
              disabled={!canNext}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold transition-all",
                canNext
                  ? "bg-brand-bleu text-white shadow-[0_4px_14px_rgba(82,98,122,0.25)] hover:scale-[1.02]"
                  : "cursor-not-allowed bg-neutral-200 text-neutral-400",
              )}
            >
              Suivant
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canNext}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold transition-all",
                canNext
                  ? "bg-gradient-to-br from-brand-iris to-brand-iris-strong text-white shadow-[0_4px_14px_rgba(157,140,242,0.4)] hover:scale-[1.02]"
                  : "cursor-not-allowed bg-neutral-200 text-neutral-400",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Découvrir ma sélection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
