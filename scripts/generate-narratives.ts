#!/usr/bin/env tsx
/**
 * Génère une narration éditoriale par commune via Claude Haiku 4.5.
 *
 * Usage :
 *   ANTHROPIC_API_KEY=sk-ant-... npm run narratives
 *
 * OU (avec .env.local en place) :
 *   npm run narratives
 *
 * Le script :
 * - Charge .env.local si présent (pour récupérer ANTHROPIC_API_KEY)
 * - Lit les narrations existantes dans lib/city-narratives.ts
 * - Génère uniquement celles manquantes (incrémental, on peut relancer)
 * - Écrit le résultat consolidé dans lib/city-narratives.ts
 *
 * Coût estimé : ~€0,002 par commune (~€0,16 pour les 80).
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { SAMPLE_COMMUNES } from "../lib/sample-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charge .env.local si présent (pour ANTHROPIC_API_KEY)
const envLocalPath = path.resolve(__dirname, "..", ".env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of content.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error(
    "❌ ANTHROPIC_API_KEY manquante. Ajoute-la dans .env.local ou en inline :",
  );
  console.error("   ANTHROPIC_API_KEY=sk-ant-... npm run narratives");
  process.exit(1);
}

const client = new Anthropic();

const SYSTEM = `Tu es un journaliste lifestyle qui écrit pour des Parisiens en réflexion sur leur déménagement, sur un site qui s'appelle "Vivre près de Paris".

Style à imiter : un mix entre Le Monde Magazine, Konbini Lifestyle et le site paris-jetequitte.com. Ton professionnel mais complice, factuel, avec du caractère, sans fioritures ni superlatifs creux.

Pour la commune fournie, écris un texte de 220-280 mots en 4 paragraphes (séparés par un saut de ligne, sans titres) :

§1 — Lead (60-80 mots) : Situe la ville en quelques phrases qui donnent envie. Évoque l'ambiance générale, ce qui la distingue d'une autre banlieue lambda, et 1 fait concret (un quartier, un patrimoine, une particularité).

§2 — Vie quotidienne (80-100 mots) : Décris ce que c'est de VIVRE là — quartiers typiques, ambiance du week-end, rythme. Mentionne 2-3 repères factuels SI tu en as la certitude (parc connu, marché, bâtiment patrimonial, ligne de transport principale). Si tu n'es pas sûr, reste général plutôt que d'inventer.

§3 — Les chiffres dans la vraie vie (40-60 mots) : Intègre les chiffres clés (prix au m², temps de trajet, population) DE FAÇON NATURELLE, pas comme une fiche technique. Compare implicitement à Paris (« à -X € le m² versus la capitale », « en 25 minutes tu retrouves la gare de Lyon », etc.).

§4 — Pour qui (30-50 mots) : Profil idéal pour s'y installer. Un public visé clair : jeunes actifs, familles avec enfants, télétravailleurs, primo-accédants, investisseurs locatifs, jeunes retraités, etc. Sois précis sur le pourquoi.

Règles strictes :
- TUTOIEMENT (« tu »), pas « vous »
- Ton professionnel et accessible, pas familier ni vulgaire
- Pas d'émoji
- Pas de listes à puces
- Pas de titres de paragraphes (juste un saut de ligne entre §)
- Pas de superlatifs creux : « la plus belle ville », « incroyable », « magnifique » → bannis
- N'invente pas de noms de rues, de bars, ou de personnages : reste général ou cite des éléments établis (le château de Vincennes, la basilique de Saint-Denis, etc.)
- Termine la narration sans phrase d'accroche commerciale

Renvoie UNIQUEMENT le texte des 4 paragraphes, rien d'autre. Pas de balise, pas de markdown, pas de label.`;

type Commune = (typeof SAMPLE_COMMUNES)[number];

async function generate(commune: Commune): Promise<string> {
  const isCampagne = "gare_acces" in commune && commune.gare_acces;
  const gareInfo = isCampagne
    ? `

⚠ CONTEXTE CAMPAGNE TGV — village rural accessible via une gare TGV/Intercités proche :
Gare de référence : ${commune.gare_acces!.nom}
Trajet depuis le village jusqu'à la gare : ${commune.gare_acces!.trajet_min} min en ${commune.gare_acces!.mode} (${commune.gare_acces!.distance_km} km)
→ Le total porte-à-porte vers Paris (${commune.temps_trajet_paris_min} min) inclut ce drive + le TGV/Intercités jusqu'à Paris + Paris last-mile.
→ Le concept éditorial est "Quitter Paris pour la campagne" : c'est un VRAI village rural (pas une banlieue), accessible 1-2 fois par semaine à Paris via TGV.
→ La narration doit refléter cette dualité : vraie ruralité + accès Paris.`
    : "";

  const userPrompt = `
Nom : ${commune.nom}
Code postal : ${commune.code_postal}
Département : ${commune.departement}
Population : ${commune.population.toLocaleString("fr-FR")} habitants
Prix m² médian (achat) : ${commune.prix_m2_median ?? "—"} €/m²
Loyer m² médian : ${commune.loyer_m2_median ?? "—"} €/m²
Évolution prix sur 5 ans : ${commune.prix_m2_evolution_5y ?? "—"} %
Trajet vers Paris (porte-à-porte) : ${commune.temps_trajet_paris_min} min
Mode principal : ${commune.mode_principal}${
    commune.ligne_principale ? ` (${commune.ligne_principale})` : ""
  }
Distance Paris : ${commune.distance_paris_km} km
Revenu médian : ${commune.revenu_median ?? "—"} €/an
Espaces verts : ${commune.espaces_verts_pct ?? "—"} % du territoire
Bonus Grand Paris Express : ${
    commune.bonus_gpe ? Math.round(commune.bonus_gpe * 100) : 0
  } %
Région : ${commune.region}${gareInfo}
`.trim();

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 800,
    system: SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response block type");
  return block.text.trim();
}

function loadExisting(outPath: string): Record<string, string> {
  if (!fs.existsSync(outPath)) return {};
  try {
    const content = fs.readFileSync(outPath, "utf-8");
    // Match the exported object literal
    const match = content.match(
      /export\s+const\s+NARRATIVES\s*:\s*Record<string,\s*string>\s*=\s*({[\s\S]*?})\s*;/,
    );
    if (!match) return {};
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return Function(`return ${match[1]};`)() as Record<string, string>;
  } catch (err) {
    console.warn("Failed to parse existing narratives, starting fresh:", err);
    return {};
  }
}

function writeOutput(outPath: string, narratives: Record<string, string>): void {
  const sortedKeys = Object.keys(narratives).sort();
  const entries = sortedKeys
    .map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(narratives[k])}`)
    .join(",\n");

  const ts = `// Auto-généré par scripts/generate-narratives.ts
// Pour régénérer une commune : supprime sa clé puis relance \`npm run narratives\`
// Pour tout régénérer : supprime ce fichier puis relance

export const NARRATIVES: Record<string, string> = {
${entries}
};
`;

  fs.writeFileSync(outPath, ts);
}

async function main(): Promise<void> {
  const outPath = path.resolve(__dirname, "..", "lib", "city-narratives.ts");
  const existing = loadExisting(outPath);

  console.log(`📚 Existantes : ${Object.keys(existing).length} narrations`);
  console.log(`🏙️  Communes totales : ${SAMPLE_COMMUNES.length}`);

  const toGenerate = SAMPLE_COMMUNES.filter((c) => !existing[c.code_insee]);
  console.log(`✏️  À générer : ${toGenerate.length}\n`);

  if (toGenerate.length === 0) {
    console.log("Tout est déjà généré. Pour régénérer, vide lib/city-narratives.ts.");
    return;
  }

  let done = 0;
  for (const commune of toGenerate) {
    process.stdout.write(
      `[${done + 1}/${toGenerate.length}] ${commune.nom.padEnd(30)} `,
    );
    try {
      const text = await generate(commune);
      existing[commune.code_insee] = text;
      console.log(`✓ ${text.length} chars`);
      // Write incrementally for crash safety
      writeOutput(outPath, existing);
    } catch (err) {
      console.log(`✗ ${err instanceof Error ? err.message : String(err)}`);
    }
    done++;
    // Petit délai pour ne pas hammer l'API
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(
    `\n✅ Terminé. ${Object.keys(existing).length} narrations enregistrées dans ${path.relative(process.cwd(), outPath)}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
