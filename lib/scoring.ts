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

  // tempsParis : min 0 (Paris), max 120 min (≈ 2h en TGV/voiture).
  // Inversé : moins de temps = meilleur score.
  const tempsParis = normalize(commune.temps_trajet_paris_min, 0, 120, true);

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
    weights.tempsParis +
    weights.economie +
    weights.qualiteVie +
    weights.education +
    weights.futurTransport;

  const w = totalWeight > 0 ? totalWeight : 1;

  const weightedSum =
    (weights.prix * prix +
      weights.tempsParis * tempsParis +
      weights.economie * economie +
      weights.qualiteVie * qualiteVie +
      weights.education * education +
      weights.futurTransport * futurTransport) /
    w;

  let total = weightedSum;

  if (mode === "rapport_qualite_prix") {
    // Honore les pondérations utilisateur sur la partie qualité (sans le prix)
    // puis applique un biais 50/50 entre qualité pondérée et prix brut.
    const qualiteW =
      weights.tempsParis +
      weights.economie +
      weights.qualiteVie +
      weights.education +
      weights.futurTransport;
    const qw = qualiteW > 0 ? qualiteW : 1;
    const qualitePondere =
      (weights.tempsParis * tempsParis +
        weights.economie * economie +
        weights.qualiteVie * qualiteVie +
        weights.education * education +
        weights.futurTransport * futurTransport) /
      qw;
    const prixFactor = prix / 100;
    total = clamp(qualitePondere * 0.5 + prixFactor * 50);
  }

  return {
    total: Math.round(total),
    prix: Math.round(prix),
    tempsParis: Math.round(tempsParis),
    economie: Math.round(economie),
    qualiteVie: Math.round(qualiteVie),
    education: Math.round(education),
    futurTransport: Math.round(futurTransport),
  };
}

// Palette alignée sur la charte. L'iris (#9D8CF2) est réservé exclusivement
// aux marqueurs Grand Paris Express → distinction visuelle claire.
// Spectre communes : Vert Brume → Bleu Minéral → Rose poussiéreux.
export function scoreToColor(score: number): string {
  if (score >= 80) return "#4D9C7E"; // vert profond (excellent)
  if (score >= 70) return "#7BB89E"; // vert brume (très bon)
  if (score >= 60) return "#52627A"; // bleu minéral (bon)
  if (score >= 50) return "#8C9AAD"; // bleu minéral pâle (correct)
  if (score >= 40) return "#C97E7E"; // rose poussiéreux (moyen)
  return "#8B5A5A"; // gris-rouge profond (faible)
}

export function scoreToLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Très bon";
  if (score >= 60) return "Bon";
  if (score >= 50) return "Correct";
  if (score >= 40) return "Moyen";
  return "Faible";
}

/**
 * Renvoie "#ffffff" ou un brun-bleu foncé selon la luminance du fond,
 * pour garantir un ratio de contraste WCAG AA (>= 4.5:1) sur les badges
 * score et reputation. Utilise la formule de luminance relative L*.
 */
export function contrastTextOn(bgHex: string): string {
  const hex = bgHex.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  // Seuil empirique : si la luminance > 0.42, texte foncé garantit AA
  return L > 0.42 ? "#1f2937" : "#ffffff";
}
