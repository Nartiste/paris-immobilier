import type { Commune } from "./types";
import { SAMPLE_COMMUNES } from "./sample-data";

const PARIS_PRIX_M2 = 10500;
const PARIS_LOYER_M2 = 32;

export type CommuneStats = {
  prixVsParis: number | null;
  prixVsDept: number | null;
  trajetVsDept: number | null;
  rangPrix: { rang: number; total: number } | null;
};

/**
 * Calcule les stats comparatives d'une commune vs département + vs Paris.
 * Sert au bloc "En chiffres" pour ancrer la commune dans son contexte.
 */
export function computeCommuneStats(commune: Commune): CommuneStats {
  const sameDept = SAMPLE_COMMUNES.filter(
    (c) => c.departement === commune.departement && c.code_insee !== commune.code_insee,
  );

  const deptPrix =
    sameDept.length > 0
      ? sameDept.reduce((s, c) => s + (c.prix_m2_median ?? 0), 0) /
        sameDept.filter((c) => c.prix_m2_median != null).length
      : null;

  const deptTrajet =
    sameDept.length > 0
      ? sameDept.reduce((s, c) => s + c.temps_trajet_paris_min, 0) / sameDept.length
      : null;

  // Stats retournées en pourcentages (-66.7 = 66,7 % moins cher) pour
  // s'aligner avec formatPercent() qui n'applique pas de multiplication par 100.
  const prixVsParis =
    commune.prix_m2_median != null
      ? ((commune.prix_m2_median - PARIS_PRIX_M2) / PARIS_PRIX_M2) * 100
      : null;

  const prixVsDept =
    commune.prix_m2_median != null && deptPrix
      ? ((commune.prix_m2_median - deptPrix) / deptPrix) * 100
      : null;

  const trajetVsDept =
    deptTrajet != null
      ? ((commune.temps_trajet_paris_min - deptTrajet) / deptTrajet) * 100
      : null;

  // Rang prix (le moins cher = rang 1) parmi les communes du même département
  let rangPrix: CommuneStats["rangPrix"] = null;
  if (commune.prix_m2_median != null && sameDept.length > 0) {
    const allPrix = [commune, ...sameDept]
      .filter((c) => c.prix_m2_median != null)
      .sort((a, b) => (a.prix_m2_median ?? 0) - (b.prix_m2_median ?? 0));
    const idx = allPrix.findIndex((c) => c.code_insee === commune.code_insee);
    if (idx >= 0) {
      rangPrix = { rang: idx + 1, total: allPrix.length };
    }
  }

  return { prixVsParis, prixVsDept, trajetVsDept, rangPrix };
}
