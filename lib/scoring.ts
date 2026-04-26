import type {
  Commune,
  CommuneScore,
  Profile,
  ScoreMode,
  Weights,
} from "./types";

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function normalize(
  value: number | null,
  min: number,
  max: number,
  invert = false,
): number {
  if (value == null || Number.isNaN(value)) return 50;
  const clamped = Math.max(min, Math.min(max, value));
  const ratio = (clamped - min) / (max - min);
  return clamp((invert ? 1 - ratio : ratio) * 100);
}

export function computeCommuneScore(
  commune: Commune,
  weights: Weights,
  mode: ScoreMode,
  profile: Profile,
): CommuneScore {
  const prix =
    profile === "acheteur"
      ? normalize(commune.prix_m2_median, 1500, 12000, true)
      : normalize(commune.loyer_m2_median, 8, 35, true);

  const transports = clamp(
    0.6 * normalize(commune.distance_gare_km, 0, 15, true) +
      0.4 * normalize(commune.distance_autoroute_km, 0, 25, true),
  );

  const economie = clamp(
    0.6 * normalize(commune.revenu_median, 18000, 45000) +
      0.4 * normalize(commune.taux_chomage, 5, 20, true),
  );

  const qualiteVie = clamp(
    0.3 * normalize(commune.nb_commerces, 0, 50) +
      0.2 * normalize(commune.nb_medecins, 0, 30) +
      0.2 * normalize(commune.espaces_verts_pct, 0, 60) +
      0.3 * normalize(commune.taux_criminalite, 20, 90, true),
  );

  const education = normalize(commune.nb_ecoles, 0, 30);

  const futurTransport = clamp((commune.bonus_gpe ?? 0) * 100);

  const totalWeight =
    weights.prix +
    weights.transports +
    weights.economie +
    weights.qualiteVie +
    weights.education +
    weights.futurTransport;

  const w = totalWeight > 0 ? totalWeight : 1;

  const weightedSum =
    (weights.prix * prix +
      weights.transports * transports +
      weights.economie * economie +
      weights.qualiteVie * qualiteVie +
      weights.education * education +
      weights.futurTransport * futurTransport) /
    w;

  let total = weightedSum;

  if (mode === "rapport_qualite_prix") {
    const qualiteAvg =
      (transports + economie + qualiteVie + education + futurTransport) / 5;
    const prixFactor = prix / 100;
    total = clamp(qualiteAvg * 0.5 + prixFactor * 50);
  }

  return {
    total: Math.round(total),
    prix: Math.round(prix),
    transports: Math.round(transports),
    economie: Math.round(economie),
    qualiteVie: Math.round(qualiteVie),
    education: Math.round(education),
    futurTransport: Math.round(futurTransport),
  };
}

export function scoreToColor(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 70) return "#65a30d";
  if (score >= 60) return "#ca8a04";
  if (score >= 50) return "#ea580c";
  if (score >= 40) return "#dc2626";
  return "#7f1d1d";
}

export function scoreToLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Très bon";
  if (score >= 60) return "Bon";
  if (score >= 50) return "Correct";
  if (score >= 40) return "Moyen";
  return "Faible";
}
