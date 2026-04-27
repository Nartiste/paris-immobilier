/**
 * Liens d'affiliation contextualisés par commune.
 *
 * Les URLs de base et IDs viennent de variables d'environnement publiques.
 * Tu remplaces les placeholders par tes vrais liens partenaires une fois
 * les comptes ouverts (Pretto via Awin, Luko direct, Liberkeys direct).
 *
 * Si un partenaire n'est pas configuré, on retombe sur l'URL publique du
 * site partenaire avec un paramètre UTM — pas de lien cassé pour
 * l'utilisateur, et le clic est trackable côté analytique pour mesurer
 * le manque-à-gagner.
 */

import type { Commune } from "./types";

const SITE = "paris-immobilier";

function utm(source: string, content: string) {
  const params = new URLSearchParams({
    utm_source: SITE,
    utm_medium: "affiliate",
    utm_campaign: source,
    utm_content: content,
  });
  return params.toString();
}

export type Partner = "pretto" | "luko" | "liberkeys" | "moveasy";

export type CTA = {
  partner: Partner;
  label: string;
  description: string;
  url: string;
  expectedCommission: string;
};

export function buildCTAs(commune: Commune, profile: "acheteur" | "locataire"): CTA[] {
  const prettoBase =
    process.env.NEXT_PUBLIC_AFFILIATE_PRETTO_URL ?? "https://www.pretto.fr/capacite-emprunt/";
  const lukoBase =
    process.env.NEXT_PUBLIC_AFFILIATE_LUKO_URL ?? "https://fr.luko.eu/devis/";
  const liberkeysBase =
    process.env.NEXT_PUBLIC_AFFILIATE_LIBERKEYS_URL ?? "https://www.liberkeys.com/contact";
  const moveasyBase =
    process.env.NEXT_PUBLIC_AFFILIATE_MOVEASY_URL ?? "https://www.demeco.com/devis";

  const insee = commune.code_insee;
  const slug = commune.nom.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const ctas: CTA[] = [];

  if (profile === "acheteur") {
    ctas.push({
      partner: "pretto",
      label: "Calculer ma capacité d'emprunt",
      description: `Simulation gratuite à ${commune.nom}, taux 2026 actualisés.`,
      url: `${prettoBase}?${utm("pretto", insee)}&prefill_city=${slug}`,
      expectedCommission: "€80-250 par dossier",
    });
  }

  ctas.push({
    partner: "luko",
    label:
      profile === "acheteur"
        ? "Assurer mon futur logement"
        : "Mon assurance habitation",
    description: `Devis 100 % en ligne, résiliable à tout moment.`,
    url: `${lukoBase}?${utm("luko", insee)}&city=${slug}`,
    expectedCommission: "€15-35 par souscription",
  });

  ctas.push({
    partner: "liberkeys",
    label:
      profile === "acheteur"
        ? `Trouver un agent à ${commune.nom}`
        : `Voir les biens à louer à ${commune.nom}`,
    description: `Agence locale, frais réduits.`,
    url: `${liberkeysBase}?${utm("liberkeys", insee)}&q=${encodeURIComponent(commune.nom)}`,
    expectedCommission: "€30-80 par mise en relation",
  });

  if (profile === "acheteur" && commune.distance_paris_km && commune.distance_paris_km > 15) {
    ctas.push({
      partner: "moveasy",
      label: "Devis déménagement",
      description: `Plusieurs déménageurs comparés vers ${commune.nom}.`,
      url: `${moveasyBase}?${utm("moveasy", insee)}&dest=${slug}`,
      expectedCommission: "€15-40 par devis",
    });
  }

  return ctas;
}
