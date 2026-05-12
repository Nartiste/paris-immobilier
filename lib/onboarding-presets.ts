/**
 * Mappings entre les réponses du quiz d'onboarding et les paramètres du
 * store Zustand. Centralise toute la logique de "personnalisation par profil"
 * pour qu'on puisse l'auditer/ajuster sans toucher au composant UI.
 */

import type { Profile, Weights } from "./types";

export type ProfilType =
  | "celibataire"
  | "couple"
  | "famille"
  | "retraite"
  | "investisseur";

export type FrequenceParis =
  | "quotidien" // tous les jours
  | "hybride" // 8-12 fois/mois
  | "occasionnel" // 1-4 fois/mois
  | "jamais"; // full-remote

export type BudgetMode = "m2_achat" | "mensualite" | "loyer";

export type CritereId =
  | "tempsParis"
  | "prix"
  | "qualiteVie"
  | "economie"
  | "education"
  | "futurTransport";

export type OnboardingAnswers = {
  profil: ProfilType;
  frequenceParis: FrequenceParis;
  /** Temps de trajet max acceptable vers Paris (en minutes) */
  tempsMaxParis: number;
  budgetMode: BudgetMode;
  budgetValue: number;
  /** Pour mode mensualité ou loyer : surface visée (m²) */
  surfaceVisee?: number;
  /** 2 critères prioritaires choisis */
  criteresPrioritaires: CritereId[];
};

// ============ MAPPING : profil → pondérations par défaut ============
// Les 2 critères prioritaires choisis viennent ENSUITE écraser ce préset
// (les 2 critères choisis montent à 30+, les autres restent à leur valeur
// de profil mais sont rééquilibrés pour que la somme reste cohérente).

const WEIGHTS_BY_PROFIL: Record<ProfilType, Weights> = {
  celibataire: {
    tempsParis: 40,
    prix: 25,
    qualiteVie: 15,
    economie: 5,
    education: 5,
    futurTransport: 10,
  },
  couple: {
    tempsParis: 30,
    prix: 25,
    qualiteVie: 20,
    economie: 5,
    education: 10,
    futurTransport: 10,
  },
  famille: {
    tempsParis: 25,
    prix: 20,
    qualiteVie: 20,
    economie: 5,
    education: 20,
    futurTransport: 10,
  },
  retraite: {
    tempsParis: 15,
    prix: 25,
    qualiteVie: 35,
    economie: 5,
    education: 5,
    futurTransport: 15,
  },
  investisseur: {
    tempsParis: 20,
    prix: 30,
    qualiteVie: 10,
    economie: 10,
    education: 5,
    futurTransport: 25,
  },
};

// ============ MAPPING : fréquence Paris → temps max + profile ============

export function inferTempsMaxParis(freq: FrequenceParis): number {
  switch (freq) {
    case "quotidien":
      return 45;
    case "hybride":
      return 90;
    case "occasionnel":
      return 120;
    case "jamais":
      return 180;
  }
}

// ============ MAPPING : budget mode → budgetMax + profile ============

/**
 * Convertit une mensualité d'emprunt en prix m² max.
 * Hypothèse : prêt 20 ans à 4 % d'intérêt, surface visée par défaut 60 m².
 *
 * Formule capital empruntable :
 *   C = M × ((1 - (1+r)^-n) / r)
 *   avec r = taux mensuel = 4%/12 ≈ 0.00333, n = 240 mensualités
 */
export function mensualiteToM2(
  mensualite: number,
  surface: number,
): number {
  const r = 0.04 / 12;
  const n = 240;
  const capital = mensualite * ((1 - Math.pow(1 + r, -n)) / r);
  return Math.round(capital / surface);
}

/**
 * Convertit un loyer total max en loyer m² max.
 */
export function loyerToM2(loyer: number, surface: number): number {
  return Math.round((loyer / surface) * 10) / 10;
}

export function computeBudgetMax(answers: OnboardingAnswers): {
  budgetMax: number;
  profile: Profile;
} {
  const surface = answers.surfaceVisee ?? 60;
  switch (answers.budgetMode) {
    case "m2_achat":
      return { budgetMax: answers.budgetValue, profile: "acheteur" };
    case "mensualite":
      return {
        budgetMax: mensualiteToM2(answers.budgetValue, surface),
        profile: "acheteur",
      };
    case "loyer":
      return {
        budgetMax: loyerToM2(answers.budgetValue, surface),
        profile: "locataire",
      };
  }
}

// ============ Inférence campagne TGV ============

export function inferShowCampagne(
  profil: ProfilType,
  freq: FrequenceParis,
): boolean {
  // Active campagne si le profil tolère un grand éloignement Paris
  if (freq === "jamais") return true;
  if (freq === "occasionnel" && (profil === "retraite" || profil === "famille")) {
    return true;
  }
  return false;
}

// ============ Pondérations finales (profil + critères prioritaires) ============

/**
 * Construit la pondération finale :
 * - Part du préset par profil
 * - Booste les 2 critères choisis comme prioritaires (×1.5)
 * - Réduit les non-prioritaires pour garder une somme proche de 100
 */
export function computeFinalWeights(answers: OnboardingAnswers): Weights {
  const base = { ...WEIGHTS_BY_PROFIL[answers.profil] };

  // Boost des 2 critères choisis
  for (const c of answers.criteresPrioritaires) {
    base[c] = Math.round(base[c] * 1.5);
  }

  // Renormaliser pour que la somme reste proche de 100
  const total = Object.values(base).reduce((sum, v) => sum + v, 0);
  const factor = 100 / total;
  const final: Weights = {
    tempsParis: Math.round(base.tempsParis * factor),
    prix: Math.round(base.prix * factor),
    qualiteVie: Math.round(base.qualiteVie * factor),
    economie: Math.round(base.economie * factor),
    education: Math.round(base.education * factor),
    futurTransport: Math.round(base.futurTransport * factor),
  };
  return final;
}

// ============ Résultat appliqué au store ============

export type OnboardingResult = {
  weights: Weights;
  budgetMax: number;
  profile: Profile;
  tempsMaxParis: number;
  showCampagne: boolean;
};

export function computeOnboardingResult(
  answers: OnboardingAnswers,
): OnboardingResult {
  const { budgetMax, profile } = computeBudgetMax(answers);
  return {
    weights: computeFinalWeights(answers),
    budgetMax,
    profile,
    // Le user choisit explicitement maintenant (step 3 du quiz).
    // inferTempsMaxParis reste utilisé pour pré-remplir le slider.
    tempsMaxParis: answers.tempsMaxParis,
    showCampagne: inferShowCampagne(answers.profil, answers.frequenceParis),
  };
}

// ============ Labels affichables ============

export const PROFIL_LABELS: Record<ProfilType, string> = {
  celibataire: "Célibataire",
  couple: "Couple",
  famille: "Famille avec enfants",
  retraite: "Jeune retraité·e",
  investisseur: "Investisseur locatif",
};

export const FREQUENCE_LABELS: Record<FrequenceParis, string> = {
  quotidien: "Tous les jours",
  hybride: "8 à 12 fois par mois",
  occasionnel: "1 à 4 fois par mois",
  jamais: "Jamais (full-remote)",
};

export const BUDGET_MODE_LABELS: Record<BudgetMode, string> = {
  m2_achat: "Prix m² achat",
  mensualite: "Mensualité emprunt",
  loyer: "Loyer max / mois",
};

export const CRITERE_LABELS: Record<CritereId, { label: string; hint: string }> = {
  tempsParis: { label: "Trajet vers Paris", hint: "Temps porte-à-porte rapide" },
  prix: { label: "Prix immobilier", hint: "Prix au m² (achat ou location)" },
  qualiteVie: { label: "Qualité de vie", hint: "Commerces, médecins, espaces verts" },
  economie: { label: "Économie locale", hint: "Revenu médian, emploi" },
  education: { label: "Éducation", hint: "Densité d'écoles" },
  futurTransport: {
    label: "Futurs transports",
    hint: "Bonus Grand Paris Express",
  },
};
