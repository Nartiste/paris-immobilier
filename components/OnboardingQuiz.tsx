"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, X, Zap, Lock, Mail } from "lucide-react";
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

const STEPS = 6;

const PROFILS: ProfilType[] = [
  "celibataire",
  "couple",
  "famille",
  "retraite",
  "investisseur",
];

/** Liste curatée des villes à plus forte valeur de monétisation immobilière
    (densité d'agents locaux × prix m² élevés × flux ex-Parisiens documenté).
    "Autre" déclenche un input libre avec autocomplete INSEE pour capter toute commune française. */
const VILLES_ENVISAGEES: { value: string; label: string }[] = [
  { value: "Vincennes", label: "Vincennes" },
  { value: "Saint-Germain-en-Laye", label: "Saint-Germain-en-Laye" },
  { value: "Versailles", label: "Versailles" },
  { value: "Boulogne-Billancourt", label: "Boulogne-Billancourt" },
  { value: "Sceaux", label: "Sceaux" },
  { value: "Reims", label: "Reims" },
  { value: "Lyon", label: "Lyon" },
  { value: "Bordeaux", label: "Bordeaux" },
  { value: "Nantes", label: "Nantes" },
  { value: "pas-encore-decide", label: "Pas encore décidé" },
  { value: "autre", label: "Autre" },
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
  const router = useRouter();
  const {
    onboardingOpen,
    setOnboardingOpen,
    setOnboarded,
    setWeight,
    setBudgetMax,
    setProfile,
    setTempsMaxParis,
    setShowCampagne,
    setVilleEnvisagee,
  } = useAppStore();

  const [step, setStep] = useState<number>(1);
  const [generationStep, setGenerationStep] = useState<
    null | "uploading" | "analyzing" | "writing" | "done"
  >(null);
  const [profil, setProfil] = useState<ProfilType | null>(null);
  const [frequence, setFrequence] = useState<FrequenceParis | null>(null);
  const [tempsMax, setTempsMax] = useState<number>(90);
  const [tempsMaxTouched, setTempsMaxTouched] = useState(false);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("m2_achat");
  const [budgetValue, setBudgetValue] = useState<number>(5000);
  const [surface, setSurface] = useState<number>(60);
  const [criteres, setCriteres] = useState<CritereId[]>([]);
  const [villeChoix, setVilleChoix] = useState<string | null>(null);
  const [villeAutre, setVilleAutre] = useState<string>("");
  // Autocomplete villes via geo.api.gouv.fr (api publique, CORS ouvert)
  const [villeSuggestions, setVilleSuggestions] = useState<{ nom: string; dept: string }[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  // Email obligatoire avant validation (sauf si déjà unlock par cookie)
  const [prenom, setPrenom] = useState("");
  const [nomLead, setNomLead] = useState("");
  const [email, setEmail] = useState("");
  const [alreadyUnlocked, setAlreadyUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Détecte le cookie unlock côté client après hydratation
  useEffect(() => {
    if (typeof document === "undefined") return;
    const unlocked = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("vpdp_newsletter_unlocked=1"));
    setAlreadyUnlocked(unlocked);
  }, [onboardingOpen]);

  // Auto-advance après sélection sur les étapes QCM single-choice
  const advanceAfter = (delay = 200) => {
    setTimeout(() => setStep((s) => Math.min(STEPS, s + 1)), delay);
  };

  // Debounce autocomplete villes
  useEffect(() => {
    if (villeChoix !== "autre" || villeAutre.trim().length < 2) {
      setVilleSuggestions([]);
      return;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(villeAutre.trim())}&fields=nom,codeDepartement&boost=population&limit=8`;
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) return;
        const data: { nom: string; codeDepartement: string }[] = await res.json();
        setVilleSuggestions(data.map((c) => ({ nom: c.nom, dept: c.codeDepartement })));
        setSuggestionsOpen(true);
      } catch {
        // ignore (abort or network)
      }
    }, 250);
    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [villeAutre, villeChoix]);

  // Pré-remplit le slider temps max depuis la fréquence Paris choisie,
  // tant que l'utilisateur ne l'a pas touché manuellement.
  useEffect(() => {
    if (frequence && !tempsMaxTouched) {
      setTempsMax(inferTempsMaxParis(frequence));
    }
  }, [frequence, tempsMaxTouched]);

  // Important : on garde le composant monté pendant la génération même si
  // onboardingOpen passe à false ailleurs (pour afficher l'overlay de génération
  // jusqu'au redirect vers /mon-rapport).
  if (!onboardingOpen && !submitting) return null;

  const villeIsValid =
    villeChoix !== null && (villeChoix !== "autre" || villeAutre.trim().length > 0);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // On exige TOUJOURS le triplet prenom/nom/email pour générer le rapport perso,
  // même pour les revenants (qui auront un rapport régénéré avec leurs nouvelles réponses).
  const leadIsValid =
    prenom.trim().length > 0 &&
    nomLead.trim().length > 0 &&
    EMAIL_RE.test(email.trim());

  const canNext =
    (step === 1 && profil !== null) ||
    (step === 2 && frequence !== null) ||
    (step === 3 && tempsMax >= 15) ||
    (step === 4 && budgetValue > 0) ||
    (step === 5 && criteres.length === 2) ||
    (step === 6 && villeIsValid && leadIsValid);

  const handleClose = (skipped: boolean) => {
    track("concierge_open", { source: skipped ? "skip" : "complete" });
    setOnboarded(true);
    setOnboardingOpen(false);
  };

  const handleSubmit = async () => {
    if (!profil || !frequence || criteres.length !== 2) return;
    if (!villeIsValid || !leadIsValid) return;
    setSubmitError(null);

    const villeFinal =
      villeChoix === "autre" ? `autre:${villeAutre.trim()}` : (villeChoix as string);

    // Construit le payload quiz answers
    const quizAnswers = {
      profil,
      frequenceParis: frequence,
      tempsMaxParis: tempsMax,
      budgetMode,
      budgetValue,
      surfaceVisee: surface,
      criteresPrioritaires: criteres,
      villeEnvisagee: villeFinal,
    };

    // Si déjà unlocked : on applique juste (pas de génération de rapport pour un user existant)
    // SAUF si la flag REPORT_FOR_ALL = on génère même pour les revenants.
    // Pour conversion max : on génère TOUJOURS un rapport (chaque visite = nouveau rapport)
    setSubmitting(true);
    setGenerationStep("uploading");

    track("personal_report_submit", {
      profil: profil,
      frequence: frequence,
      budget_mode: budgetMode,
      budget: budgetValue,
      critere_1: criteres[0] ?? "",
      critere_2: criteres[1] ?? "",
      ville_envisagee: villeFinal,
    });

    try {
      // Étape progressive UI
      setTimeout(() => setGenerationStep("analyzing"), 1500);
      setTimeout(() => setGenerationStep("writing"), 4000);

      const res = await fetch("/api/personal-report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: prenom.trim(),
          nom: nomLead.trim(),
          email: email.trim().toLowerCase(),
          quizAnswers,
          source: "onboarding-quiz",
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Erreur ${res.status}`);
      }

      const data = (await res.json()) as { token: string; reportUrl: string };

      // Cookie unlock client-side
      document.cookie = `vpdp_newsletter_unlocked=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

      // Applique les pondérations Zustand SANS fermer le modal
      // (le modal reste monté pour afficher l'overlay jusqu'au redirect).
      const onboardingAnswersForStore: OnboardingAnswers = {
        profil,
        frequenceParis: frequence,
        tempsMaxParis: tempsMax,
        budgetMode,
        budgetValue,
        surfaceVisee: surface,
        criteresPrioritaires: criteres,
      };
      const result = computeOnboardingResult(onboardingAnswersForStore);
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
      setVilleEnvisagee(villeFinal);
      setOnboarded(true);

      track("concierge_open", { source: "onboarding-complete" });
      track("personal_report_generated", { token: data.token });

      setGenerationStep("done");

      // Redirige vers la page rapport. Le modal sera démonté quand la route change.
      router.push(`/mon-rapport/${data.token}`);

      // Ferme le modal après un petit délai pour éviter le flash visuel
      setTimeout(() => setOnboardingOpen(false), 100);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "La génération a échoué. Réessaie dans un instant.",
      );
      setSubmitting(false);
      setGenerationStep(null);
    }
  };

  const toggleCritere = (c: CritereId) => {
    setCriteres((prev) => {
      if (prev.includes(c)) return prev.filter((x) => x !== c);
      if (prev.length < 2) {
        const next = [...prev, c];
        // Auto-advance dès que les 2 critères sont sélectionnés
        if (next.length === 2) advanceAfter(350);
        return next;
      }
      return prev;
    });
  };

  // Overlay plein écran pendant la génération du rapport IA
  // Donne une impression de calcul personnalisé (4-15 secondes typiquement)
  if (submitting && generationStep) {
    const steps = [
      { key: "uploading", label: "On envoie ton profil…", chrono: "1 s" },
      // NB: 176 = COMMUNE_COUNT (lib/sample-data.ts). Codé en dur ici car ce
      // composant est "use client" : importer le dataset embarquerait tout
      // SAMPLE_COMMUNES dans le bundle client. À synchroniser à la main si le
      // dataset change.
      { key: "analyzing", label: `On scanne 176 communes contre tes critères…`, chrono: "5 s" },
      { key: "writing", label: `Le verdict se rédige pour ${prenom || "toi"}…`, chrono: "10 s" },
    ];
    const currentIdx = steps.findIndex((s) => s.key === generationStep);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-brand-bleu via-brand-iris-strong to-brand-iris p-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-center">
            <span className="relative flex h-16 w-16 items-center justify-center">
              <span
                aria-hidden
                className="absolute inset-0 animate-ping rounded-full bg-brand-iris/30"
              />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-iris to-brand-iris-strong text-white">
                <Sparkles className="h-7 w-7 animate-pulse" />
              </span>
            </span>
          </div>
          <h2 className="mt-5 text-center font-display text-xl font-medium text-brand-bleu">
            {prenom ? `${prenom}, on démasque ta ville` : "On démasque ta ville"}
          </h2>
          <p className="mt-1.5 text-center text-xs text-brand-bleu/65">
            176 communes au crible. Une seule sort. La tienne.
          </p>

          <ul className="mt-6 space-y-3">
            {steps.map((s, i) => {
              const isDone = i < currentIdx;
              const isActive = i === currentIdx;
              return (
                <li key={s.key} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-all",
                      isDone
                        ? "bg-emerald-100 text-emerald-700"
                        : isActive
                          ? "bg-brand-iris-soft text-brand-iris-strong"
                          : "bg-neutral-100 text-neutral-400",
                    )}
                  >
                    {isDone ? "✓" : isActive ? (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-brand-iris-strong" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-sm transition-colors",
                        isActive
                          ? "font-medium text-brand-bleu"
                          : isDone
                            ? "text-brand-bleu/60"
                            : "text-neutral-400",
                      )}
                    >
                      {s.label}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] tabular-nums",
                      isActive ? "text-brand-iris-strong" : "text-neutral-400",
                    )}
                  >
                    {s.chrono}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 rounded-2xl bg-brand-iris-soft/40 px-4 py-3">
            <p className="text-[11px] leading-relaxed text-brand-bleu/75">
              Pas de top 10 mou. Une recommandation. La tienne. Le calcul est unique à partir
              de tes 6 réponses au quiz.
            </p>
          </div>

          {submitError && (
            <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {submitError}
            </p>
          )}
        </div>
      </div>
    );
  }

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
                    onClick={() => {
                      setProfil(p);
                      advanceAfter();
                    }}
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
                    onClick={() => {
                      setFrequence(f);
                      advanceAfter();
                    }}
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
                      {preset < 60 ? `${preset} min` : `${Math.floor(preset / 60)} h${preset % 60 ? ` ${preset % 60}` : ""}`.trim()}
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

          {step === 6 && (
            <div>
              <h2 className="font-display text-xl font-medium text-brand-bleu">
                Quelle ville envisages-tu ?
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                On affine les recommandations avec ta destination cible. Pas obligé d'être fixé.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {VILLES_ENVISAGEES.map((v) => (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => {
                      setVilleChoix(v.value);
                      if (v.value !== "autre") {
                        setVilleAutre("");
                        setVilleSuggestions([]);
                      }
                    }}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-all",
                      villeChoix === v.value
                        ? "border-brand-iris-strong bg-brand-iris-soft text-brand-iris-strong shadow-[0_2px_8px_rgba(157,140,242,0.25)]"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300",
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              {villeChoix === "autre" && (
                <div className="relative mt-4">
                  <label className="text-sm text-neutral-700">
                    Précise (commune française)
                  </label>
                  <input
                    type="text"
                    value={villeAutre}
                    onChange={(e) => {
                      setVilleAutre(e.target.value);
                      setSuggestionsOpen(true);
                    }}
                    onFocus={() => setSuggestionsOpen(true)}
                    placeholder="Tape les premières lettres de la ville…"
                    autoFocus
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base text-brand-bleu focus:border-brand-iris-strong focus:outline-none"
                  />
                  {/* Dropdown autocomplete */}
                  {suggestionsOpen && villeSuggestions.length > 0 && (
                    <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(82,98,122,0.12)]">
                      {villeSuggestions.map((sugg, idx) => (
                        <li key={`${sugg.nom}-${idx}`}>
                          <button
                            type="button"
                            onClick={() => {
                              setVilleAutre(sugg.nom);
                              setSuggestionsOpen(false);
                            }}
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-neutral-800 transition-colors hover:bg-brand-iris-soft/40"
                          >
                            <span>{sugg.nom}</span>
                            <span className="text-[11px] text-neutral-400">
                              {sugg.dept}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-1 text-[11px] text-neutral-400">
                    Suggestions issues du Code Officiel Géographique INSEE.
                  </p>
                </div>
              )}

              {/* Formulaire email : on génère un rapport perso, même pour les revenants */}
              {villeIsValid && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-brand-iris/25 bg-gradient-to-br from-brand-iris-soft/40 via-white to-brand-vert-soft/30 p-5 shadow-[0_4px_16px_rgba(157,140,242,0.12)]">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-iris-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-iris-strong">
                      <Sparkles className="h-2.5 w-2.5" />
                      Le hack
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-brand-bleu/55">
                      Calcul en 30 secondes
                    </span>
                  </div>
                  <p className="mt-3 font-display text-base font-medium leading-snug text-brand-bleu">
                    On te dit où acheter (vraiment).
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-brand-bleu/75">
                    Pas de top 10 mou. <strong>Une recommandation. Ta recommandation.</strong> <strong>176 communes</strong> scannées
                    contre TES réponses : <strong>1 ville sort</strong>, plus 2 alternatives backup. Score de match, quartiers à viser, pièges à éviter.
                    <strong> Aucun autre Parisien n&apos;aura le même verdict.</strong>
                  </p>

                  <ul className="mt-3 space-y-1.5 text-[12px] leading-relaxed text-brand-bleu/80">
                    <li className="flex items-start gap-1.5">
                      <Zap className="mt-0.5 h-3 w-3 flex-shrink-0 text-brand-iris-strong" />
                      <span><strong>1 ville révélée</strong> (score sur 100) + 2 alternatives, calées sur TON profil</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Mail className="mt-0.5 h-3 w-3 flex-shrink-0 text-brand-iris-strong" />
                      <span>Envoyé par email + lien permanent que tu peux partager</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Lock className="mt-0.5 h-3 w-3 flex-shrink-0 text-brand-iris-strong" />
                      <span>1 email/mois max ensuite, désinscription en 1 clic</span>
                    </li>
                  </ul>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Prénom"
                      autoComplete="given-name"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-brand-bleu placeholder:text-neutral-400 focus:border-brand-iris-strong focus:outline-none focus:ring-2 focus:ring-brand-iris/20"
                      disabled={submitting}
                    />
                    <input
                      type="text"
                      required
                      value={nomLead}
                      onChange={(e) => setNomLead(e.target.value)}
                      placeholder="Nom"
                      autoComplete="family-name"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-brand-bleu placeholder:text-neutral-400 focus:border-brand-iris-strong focus:outline-none focus:ring-2 focus:ring-brand-iris/20"
                      disabled={submitting}
                    />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.fr"
                    autoComplete="email"
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-brand-bleu placeholder:text-neutral-400 focus:border-brand-iris-strong focus:outline-none focus:ring-2 focus:ring-brand-iris/20"
                    disabled={submitting}
                  />

                  {alreadyUnlocked && (
                    <p className="mt-2 text-[11px] text-brand-bleu/55">
                      Déjà inscrit ? On t&apos;envoie quand même ton nouveau verdict.
                    </p>
                  )}

                  {submitError && (
                    <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                      {submitError}
                    </p>
                  )}
                </div>
              )}
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
              disabled={!canNext || submitting}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold transition-all",
                canNext && !submitting
                  ? "bg-gradient-to-br from-brand-iris to-brand-iris-strong text-white shadow-[0_4px_14px_rgba(157,140,242,0.4)] hover:scale-[1.02]"
                  : "cursor-not-allowed bg-neutral-200 text-neutral-400",
              )}
            >
              {submitting ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Calcul…
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Trouve ta ville idéale
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
