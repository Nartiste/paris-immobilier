/**
 * Programme partenariat agents immobiliers locaux.
 *
 * Pour chaque zone géographique (clé = département tel qu'il apparaît dans
 * Commune.departement), on définit un agent référent dont la fiche est mise
 * en avant sur les pages /vivre-a/[slug] des communes de la zone.
 *
 * Premier beta-testeur : Jérémy Lange (Capifrance), Haute-Savoie + Savoie.
 * Le modèle est conçu pour se dupliquer : nouveau département → ajouter une
 * entrée → l'encart "Référent local" apparaît automatiquement sur toutes les
 * fiches communes du département.
 *
 * Transparence : on assume le partenariat éditorial (mentionné dans la card).
 * On ne cache pas l'affiliation. Aucune commission visiteur, aucun
 * engagement.
 */

export type LocalReferent = {
  /** Prénom affiché. */
  prenom: string;
  /** Nom de famille affiché. */
  nom: string;
  /** Enseigne / réseau (ex: "Capifrance", "Stéphane Plaza Immobilier"). */
  agency: string;
  /** Zone couverte, en français, pour le tag "Référent local". */
  zone: string;
  /** URL de la fiche/page de l'agent (avec UTM idéalement). */
  url: string;
  /** 2 phrases max, ton honnête, pas commercial. */
  blurb: string;
};

export const LOCAL_REFERENTS_BY_DEPT: Record<string, LocalReferent> = {
  "Haute-Savoie": {
    prenom: "Jérémy",
    nom: "Lange",
    agency: "Capifrance",
    zone: "Annecy, Aix-les-Bains, bassin chambérien",
    url: "https://jeremy-lange.capifrance.fr/fr",
    blurb:
      "Jérémy connaît la zone Annecy / bassin chambérien depuis l'intérieur. Il accompagne en priorité les arrivants qui envisagent un achat ou un investissement dans les Alpes du Nord, et il sait dire non quand le projet ne tient pas debout sur le papier.",
  },
  "Savoie": {
    prenom: "Jérémy",
    nom: "Lange",
    agency: "Capifrance",
    zone: "Annecy, Aix-les-Bains, bassin chambérien",
    url: "https://jeremy-lange.capifrance.fr/fr",
    blurb:
      "Jérémy connaît la zone Annecy / bassin chambérien depuis l'intérieur. Il accompagne en priorité les arrivants qui envisagent un achat ou un investissement dans les Alpes du Nord, et il sait dire non quand le projet ne tient pas debout sur le papier.",
  },
};

export function getReferentForCommune(
  departement: string,
): LocalReferent | null {
  return LOCAL_REFERENTS_BY_DEPT[departement] ?? null;
}
