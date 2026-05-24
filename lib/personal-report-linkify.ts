/**
 * Post-traitement du markdown du rapport personnel pour transformer chaque
 * mention de commune en lien interne vers `/vivre-a/[slug]`.
 *
 * Pourquoi ici (pas dans le prompt Claude) :
 *  - Déterministe : on garantit le slug correct depuis le dataset, pas
 *    d'hallucination possible sur l'URL.
 *  - Rétro-actif : les rapports déjà en BDD bénéficient des liens dès le
 *    prochain rendu.
 *  - Robuste : on évite les doublons (si Claude a déjà mis un lien).
 *
 * Stratégie :
 *  - Tri par longueur de nom décroissante (Saint-Germain-en-Laye matché avant
 *    Saint-Germain) pour éviter les chevauchements.
 *  - On segmente le markdown autour des liens existants (`[texte](url)`) et on
 *    ne traite que les segments hors-liens.
 *  - Délimiteurs : on n'ajoute un lien que si le nom n'est pas collé à une
 *    lettre/chiffre/tiret (gère "à Vincennes", "Vincennes,", "Vincennes." mais
 *    pas "Vincennesville" ni l'intérieur d'un mot composé).
 *  - On ne linkifie chaque commune qu'**une fois** par rapport (la première
 *    occurrence). Évite la pollution visuelle quand Claude répète le nom 5×.
 */
import type { Commune } from "./types";
import { communeToSlug } from "./slug";

const MARKDOWN_LINK_RE = /(\[[^\]]+\]\([^)]+\))/g;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Injecte des liens markdown vers `/vivre-a/[slug]` pour chaque commune
 * citée dans le rapport. Une seule fois par commune (première occurrence).
 */
export function injectCommuneLinks(markdown: string, communes: Commune[]): string {
  // Tri par longueur décroissante pour matcher les noms longs en premier.
  const sorted = [...communes].sort((a, b) => b.nom.length - a.nom.length);

  // Découpe autour des liens markdown existants : indices pairs = texte
  // brut à traiter, indices impairs = liens à laisser tels quels.
  const parts = markdown.split(MARKDOWN_LINK_RE);
  const linkedAlready = new Set<string>();

  // Pré-scan : note les communes déjà liées dans le markdown source pour ne
  // pas les re-linker dans le texte brut.
  for (let i = 1; i < parts.length; i += 2) {
    const link = parts[i];
    for (const c of sorted) {
      if (link.includes(c.nom)) linkedAlready.add(c.code_insee);
    }
  }

  for (let i = 0; i < parts.length; i += 2) {
    let segment = parts[i];
    for (const c of sorted) {
      if (linkedAlready.has(c.code_insee)) continue;
      const slug = communeToSlug(c);
      // (?<![\p{L}\p{N}-]) : non précédé d'une lettre/chiffre/tiret
      // (?![\p{L}\p{N}-])  : non suivi d'une lettre/chiffre/tiret
      const re = new RegExp(
        `(?<![\\p{L}\\p{N}-])(${escapeRegex(c.nom)})(?![\\p{L}\\p{N}-])`,
        "u",
      );
      const match = re.exec(segment);
      if (match) {
        segment =
          segment.slice(0, match.index) +
          `[${match[1]}](/vivre-a/${slug})` +
          segment.slice(match.index + match[0].length);
        linkedAlready.add(c.code_insee);
      }
    }
    parts[i] = segment;
  }

  return parts.join("");
}
