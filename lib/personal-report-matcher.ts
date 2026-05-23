/**
 * Pré-sélection des communes candidates pour l'AI Personal Report.
 *
 * On filtre SAMPLE_COMMUNES selon les critères du quiz, on garde le top 10
 * et on l'envoie en contexte à Claude qui choisit raisonnablement 3 communes
 * finales avec un argumentaire personnalisé.
 *
 * On ne fait PAS de matching parfait ici — c'est juste un pré-filtre pour
 * réduire le nombre de tokens envoyés au modèle. Le scoring détaillé est
 * fait par Claude.
 */

import type { Commune } from "./types";
import type {
  BudgetMode,
  CritereId,
  FrequenceParis,
  ProfilType,
} from "./onboarding-presets";
import { mensualiteToM2, loyerToM2 } from "./onboarding-presets";

export type QuizAnswersForReport = {
  profil: ProfilType;
  frequenceParis: FrequenceParis;
  tempsMaxParis: number;
  budgetMode: BudgetMode;
  budgetValue: number;
  surfaceVisee?: number;
  criteresPrioritaires: CritereId[];
  villeEnvisagee?: string | null;
};

/** Convertit budgetValue en prix m² achat équivalent (pour mode m2_achat ou mensualité).
    Pour mode loyer, retourne 0 — le matching utilise loyer_m2_median séparément. */
export function getBudgetM2Max(answers: QuizAnswersForReport): number {
  const surface = answers.surfaceVisee ?? 60;
  switch (answers.budgetMode) {
    case "m2_achat":
      return answers.budgetValue;
    case "mensualite":
      return mensualiteToM2(answers.budgetValue, surface);
    case "loyer":
      // Pour mode loyer, on n'utilise pas budgetM2 dans le filtre principal.
      // On retourne quand même un ordre de grandeur (×200 mois) en cas de fallback.
      return loyerToM2(answers.budgetValue, surface) * 200;
    default:
      return answers.budgetValue;
  }
}

/**
 * Filtre + score brut des communes pour ne garder que 10 candidates pertinentes.
 * Score = somme pondérée des critères, biaisé sur les 2 critères prioritaires.
 */
export function selectCandidateCommunes(
  communes: Commune[],
  answers: QuizAnswersForReport,
  limit = 10,
): Commune[] {
  const budgetM2 = getBudgetM2Max(answers); // prix m² achat (équivalent)
  const tempsMax = answers.tempsMaxParis;
  const criteres = new Set(answers.criteresPrioritaires);
  const isLoyer = answers.budgetMode === "loyer";

  // 1) Filtre dur : temps de trajet
  const tolerance = 1.15; // tolère +15 % sur temps pour ne pas vider la liste
  let filtered = communes.filter(
    (c) =>
      c.temps_trajet_paris_min <= tempsMax * tolerance &&
      c.prix_m2_median != null,
  );

  // 2) Filtre dur sur budget (avec +25 % de tolérance pour ne pas vider).
  // Pour mode loyer : on compare au loyer m² (×surface). Pour achat/mensualité :
  // on compare au prix m².
  if (isLoyer) {
    const loyerMaxM2 = answers.budgetValue / (answers.surfaceVisee ?? 60);
    filtered = filtered.filter(
      (c) => (c.loyer_m2_median ?? Infinity) <= loyerMaxM2 * 1.25,
    );
  } else {
    filtered = filtered.filter(
      (c) => (c.prix_m2_median ?? Infinity) <= budgetM2 * 1.25,
    );
  }

  // Fallback si on a vidé : on relâche
  if (filtered.length < 5) {
    filtered = communes.filter(
      (c) => c.temps_trajet_paris_min <= tempsMax * 1.4 && c.prix_m2_median != null,
    );
  }

  // 3) Score brut : on pondère selon les 2 critères prioritaires
  const scored = filtered.map((c) => {
    let score = 0;

    // Temps trajet : inversé (moins c'est, mieux c'est)
    const tempsNorm = 1 - Math.min(c.temps_trajet_paris_min / tempsMax, 1);
    score += tempsNorm * (criteres.has("tempsParis") ? 35 : 15);

    // Prix : inversé. Pour loyer mode, on compare au loyer m² ; sinon prix achat.
    if (isLoyer) {
      const loyerMaxM2 = answers.budgetValue / (answers.surfaceVisee ?? 60);
      if (c.loyer_m2_median != null && loyerMaxM2 > 0) {
        const prixNorm = 1 - Math.min(c.loyer_m2_median / loyerMaxM2, 1);
        score += prixNorm * (criteres.has("prix") ? 30 : 10);
      }
    } else if (c.prix_m2_median != null && budgetM2 > 0) {
      const prixNorm = 1 - Math.min(c.prix_m2_median / budgetM2, 1);
      score += prixNorm * (criteres.has("prix") ? 30 : 10);
    }

    // Qualité de vie : espaces verts + commerces normalisés
    const ev = (c.espaces_verts_pct ?? 0) / 50;
    const com = (c.nb_commerces ?? 0) / 50;
    score += ((ev + com) / 2) * (criteres.has("qualiteVie") ? 25 : 10);

    // Économie : revenu médian, taux chômage inversé
    if (c.revenu_median != null) {
      const rev = Math.min(c.revenu_median / 40000, 1);
      score += rev * (criteres.has("economie") ? 20 : 5);
    }
    if (c.taux_chomage != null) {
      const cho = 1 - Math.min(c.taux_chomage / 15, 1);
      score += cho * (criteres.has("economie") ? 10 : 3);
    }

    // Education : nb écoles
    const ec = (c.nb_ecoles ?? 0) / 30;
    score += Math.min(ec, 1) * (criteres.has("education") ? 25 : 8);

    // Futurs transports : bonus GPE
    score += (c.bonus_gpe ?? 0) * (criteres.has("futurTransport") ? 25 : 8);

    // Boost ville envisagée si elle correspond exactement (par nom)
    const villeTarget = answers.villeEnvisagee?.replace(/^autre:/, "").trim().toLowerCase();
    if (villeTarget && c.nom.toLowerCase() === villeTarget) {
      score += 40;
    }

    return { commune: c, score };
  });

  // 4) Tri décroissant + slice
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.commune);
}

/**
 * Compresse une liste de communes au format ligne-par-ligne pour le prompt.
 * Format dense optimisé pour réduire les tokens.
 */
export function compressCommunesForReport(communes: Commune[]): string {
  return communes
    .map((c) => {
      const prix = c.prix_m2_median ?? "?";
      const loyer = c.loyer_m2_median ?? "?";
      const evo = c.prix_m2_evolution_5y != null ? `${c.prix_m2_evolution_5y > 0 ? "+" : ""}${c.prix_m2_evolution_5y}%/5ans` : "";
      const temps = c.temps_trajet_paris_min;
      const tc = c.temps_trajet_tc_min ?? "?";
      const voit = c.temps_trajet_voiture_min ?? "?";
      const mode = c.mode_principal;
      const ligne = c.ligne_principale ?? "";
      const pop = c.population;
      const rev = c.revenu_median ?? "?";
      const cho = c.taux_chomage ?? "?";
      const ec = c.nb_ecoles ?? "?";
      const med = c.nb_medecins ?? "?";
      const com = c.nb_commerces ?? "?";
      const ev = c.espaces_verts_pct ?? "?";
      const crim = c.taux_criminalite ?? "?";
      const gpe = c.bonus_gpe ? Math.round(c.bonus_gpe * 100) : 0;
      const rend = c.rendement_locatif ?? "?";
      return [
        `${c.code_insee}|${c.nom}(${c.code_postal})|${c.departement}`,
        `prix${prix}€/m²${evo ? " " + evo : ""}|loyer${loyer}€/m²|rendement${rend}%`,
        `trajet${temps}min(TC ${tc}min, voit ${voit}min, ${mode}${ligne ? " " + ligne : ""})`,
        `pop${pop}|revenu${rev}€|chômage${cho}%|écoles${ec}|médecins${med}|commerces${com}`,
        `verts${ev}%|criminalité${crim}|bonusGPE${gpe}%`,
      ].join("|");
    })
    .join("\n");
}
