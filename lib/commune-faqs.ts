import type { Commune } from "./types";
import { formatEuros, formatPercent } from "./utils";

export type FAQ = { question: string; answer: string };

/**
 * Génère 5-6 FAQ contextualisées par commune pour rich snippets Google
 * + ancrage GEO/LLM. Les questions ciblent les requêtes longue traîne :
 * "prix m² [commune]", "temps trajet [commune] Paris", etc.
 */
export function buildCommuneFAQs(commune: Commune): FAQ[] {
  const faqs: FAQ[] = [];
  const nom = commune.nom;
  const dep = commune.departement;
  const tc = commune.temps_trajet_tc_min ?? commune.temps_trajet_paris_min;
  const voiture = commune.temps_trajet_voiture_min;
  const ligne = commune.ligne_principale;
  const mode = modeLabel(commune.mode_principal);

  // 1. PRIX M² (la requête #1 sur ce type de page)
  if (commune.prix_m2_median != null) {
    const prix = formatEuros(commune.prix_m2_median);
    const evol = commune.prix_m2_evolution_5y;
    const evolText =
      evol != null && Math.abs(evol) > 0.005
        ? evol > 0
          ? ` Le prix a progressé de ${formatPercent(evol)} sur les cinq dernières années.`
          : ` Le prix a reculé de ${formatPercent(Math.abs(evol))} sur les cinq dernières années.`
        : evol != null
          ? " Le marché est resté stable sur cinq ans."
          : "";
    faqs.push({
      question: `Combien coûte un logement à ${nom} ?`,
      answer: `Le prix médian au mètre carré à ${nom} (${commune.code_postal}) s'établit à ${prix} €/m² en 2026, d'après les transactions DVF.${evolText} Pour un appartement de 70 m², compter environ ${formatEuros(commune.prix_m2_median * 70)} €.`,
    });
  }

  // 2. LOYER (pour les locataires + investisseurs)
  if (commune.loyer_m2_median != null) {
    const loyer = formatEuros(commune.loyer_m2_median);
    const rendement = commune.rendement_locatif != null ? formatPercent(commune.rendement_locatif) : null;
    faqs.push({
      question: `Quel est le loyer moyen à ${nom} ?`,
      answer: `Le loyer médian à ${nom} se situe autour de ${loyer} €/m². Pour un T3 de 65 m², compter approximativement ${formatEuros(commune.loyer_m2_median * 65)} € par mois hors charges.${rendement ? ` Le rendement locatif brut moyen y est de ${rendement}, ce qui en fait ${rendement.includes("-") ? "un marché tendu pour l'investisseur" : "une option à étudier pour un investissement locatif"}.` : ""}`,
    });
  }

  // 3. TRAJET PARIS
  const trajetParts: string[] = [];
  if (tc) trajetParts.push(`environ ${tc} minutes en transport en commun${ligne ? ` via ${ligne}` : ""}`);
  if (voiture) trajetParts.push(`${voiture} minutes en voiture hors heures de pointe`);
  if (trajetParts.length > 0) {
    faqs.push({
      question: `Combien de temps pour aller à Paris depuis ${nom} ?`,
      answer: `Depuis ${nom}, le trajet jusqu'au centre de Paris prend ${trajetParts.join(" ou ")}. La distance à vol d'oiseau est de ${commune.distance_paris_km} km. ${mode === "TGV" || mode === "Intercités" ? `${nom} est trop éloignée pour un trajet quotidien : la liaison ${mode} est adaptée à un télétravail dominant avec un à deux allers-retours hebdomadaires.` : `Le mode dominant est ${mode.toLowerCase()}, ce qui en fait une option ${tc <= 45 ? "viable pour un trajet quotidien" : "plus adaptée à un télétravail partiel"}.`}`,
    });
  }

  // 4. POUR QUI ?
  const profil = inferProfil(commune);
  faqs.push({
    question: `Pour qui ${nom} est-elle faite ?`,
    answer: profil,
  });

  // 5. GRAND PARIS EXPRESS (conditionnel)
  if (commune.bonus_gpe != null && commune.bonus_gpe > 0.4) {
    faqs.push({
      question: `Y a-t-il une gare du Grand Paris Express à ${nom} ?`,
      answer: `${nom} fait partie des communes desservies par le Grand Paris Express, le nouveau réseau de métro en cours de déploiement. La mise en service échelonnée entre 2026 et 2030 doit améliorer significativement l'accessibilité de la commune et soutenir la valeur immobilière à moyen terme.`,
    });
  }

  // 6. ÉCOLES / FAMILLES (si la commune a des données qualité de vie)
  if (commune.population && commune.population > 5000) {
    const verdure =
      commune.espaces_verts_pct != null && commune.espaces_verts_pct > 0.2
        ? ` Avec ${formatPercent(commune.espaces_verts_pct)} d'espaces verts, le cadre est plus aéré que la moyenne francilienne.`
        : "";
    faqs.push({
      question: `${nom} est-elle adaptée pour une famille avec enfants ?`,
      answer: `${nom} compte ${commune.population.toLocaleString("fr-FR")} habitants et dispose d'écoles publiques et privées du primaire au secondaire dans son territoire ou ses communes voisines.${verdure} Le revenu médian local est de ${formatEuros(commune.revenu_median ?? 0)} par an, ce qui donne une indication du profil sociologique général.`,
    });
  }

  return faqs;
}

/**
 * Schema.org FAQPage pour rich snippets Google.
 * https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function faqJsonLd(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

function modeLabel(m: Commune["mode_principal"]): string {
  switch (m) {
    case "rer":
      return "RER";
    case "transilien":
      return "Transilien";
    case "metro":
      return "métro";
    case "tgv":
      return "TGV";
    case "voiture":
      return "voiture";
    default:
      return "transport";
  }
}

function inferProfil(c: Commune): string {
  const tc = c.temps_trajet_tc_min ?? c.temps_trajet_paris_min;
  const prix = c.prix_m2_median ?? 0;
  const rendement = c.rendement_locatif ?? 0;
  const profils: string[] = [];

  if (tc <= 30 && prix > 5000) {
    profils.push("aux actifs parisiens cherchant à conserver un trajet quotidien court tout en gagnant en surface");
  } else if (tc > 30 && tc <= 60 && prix < 5000) {
    profils.push("aux familles voulant de l'espace pour un budget maîtrisé");
  } else if (tc > 60) {
    profils.push("aux télétravailleurs deux à trois jours par semaine, capables d'absorber un trajet long mais ponctuel");
  }

  if (c.bonus_gpe != null && c.bonus_gpe > 0.4) {
    profils.push("aux primo-accédants pariant sur la valorisation Grand Paris Express d'ici 2030");
  }

  if (rendement > 5.5) {
    profils.push("aux investisseurs locatifs en quête de rendement brut supérieur à la moyenne francilienne");
  }

  if (profils.length === 0) {
    profils.push("à un public mixte selon le profil — actifs, familles ou investisseurs");
  }

  return `${c.nom} convient particulièrement ${profils.join(", ainsi qu'")}. Le score global de la commune est calculé sur six critères pondérables sur cette page.`;
}
