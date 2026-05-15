#!/usr/bin/env tsx
/**
 * Régénère le contenu des articles de blog avec Claude Opus 4.7,
 * en imposant un style humain pour passer sous le radar des détecteurs IA.
 *
 * Usage :
 *   npm run regenerate-blog               # tous les articles
 *   npm run regenerate-blog <slug>        # un seul (ex : top-10-villes-pour-quitter-paris-2026)
 *
 * Le script écrit le résultat dans lib/blog-content.ts en mode incrémental
 * (sauvegarde après chaque article, sûr en cas de crash).
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

import { BLOG_POSTS } from "../lib/blog-posts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charge .env.local
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
  console.error("❌ ANTHROPIC_API_KEY manquante dans .env.local");
  console.error("   Ajoute la ligne : ANTHROPIC_API_KEY=sk-ant-...");
  process.exit(1);
}

const client = new Anthropic();

const SYSTEM = `Tu écris pour "Vivre près de Paris", un site qui aide les Parisiens à choisir une commune où s'installer. Tu es un journaliste expérimenté, pas un copywriter. Tu écris comme un humain qui a vécu ces sujets.

# OBJECTIF DE STYLE

Le texte doit passer sous le radar des détecteurs IA (Originality.ai, GPTZero, Helpful Content Update de Google). Pour ça il faut un français vivant, irrégulier, avec du sang dans les veines.

# INTERDICTIONS ABSOLUES (zéro exception)

1. **Tiret cadratin (—) interdit.** Jamais. C'est l'empreinte numéro un d'un texte IA. Si tu as besoin d'incise, utilise une virgule, des parenthèses, ou coupe la phrase.
2. **Tournures stéréotypées bannies** (banlist élargie) : "il convient de", "qui plus est", "force est de constater", "en somme", "en définitive", "il est important de noter", "à l'heure actuelle", "dans un monde où", "à l'ère de", "pour conclure", "rappelons-le", "in fine", "à n'en pas douter", "de fait", "à juste titre", "de la plus haute importance", "de manière générale", "il n'en demeure pas moins que", "il est crucial de", "il s'agit de", "non sans rappeler", "à bien des égards", "au demeurant", "loin s'en faut", "tant s'en faut", "il va sans dire que", "fort de", "à l'aune de", "à l'heure où", "dans cette optique", "dans cette perspective", "il est indéniable que", "nul ne peut nier", "il est primordial", "c'est ainsi que", "c'est dire si".
3. **Adverbes en "-ment" excessifs** : "véritablement", "réellement", "particulièrement", "notamment" en transition. Vire-les.
4. **Verbes mous** : remplace "permettre de", "constituer", "représenter", "s'avérer" par des verbes concrets.
5. **Rythme à trois stéréotypé** : pas de "X, Y et Z" sur trois éléments à la suite trois fois dans le même paragraphe. Mélange les longueurs.
6. **Listes à puces excessives** : maximum 1 ou 2 listes par article, et seulement si vraiment justifié. Le reste en prose.
7. **Pas d'introduction qui résume l'article** ("Dans cet article, nous allons voir..."). Tu rentres dans le vif.
8. **Pas de conclusion type** ("En conclusion", "Voilà", "Vous l'aurez compris"). La dernière phrase doit prolonger l'argument, pas le résumer.
9. **Ouverture imposée par le brief.** Le brief contient un champ 'ouverture' qui dicte le TYPE d'ouverture exigé (anecdote, statistique, scène, aveu, contre-évidence, etc.). Respecte-le à la lettre. Ne reprends pas une ouverture déjà utilisée par d'autres articles du même site.
10. **Structure narrative imposée par le brief.** Le brief contient un champ 'structure' qui dicte la forme générale (chronologique, comparaison, vignettes en cascade, FAQ, enquête, etc.). Respecte-le. Ne tombe pas systématiquement dans "intro + 7 H2 listés + conclusion".

# IMPÉRATIFS DE STYLE

1. **Tutoiement** ("tu", "ton", "tes"). Toujours.
2. **Phrases courtes mêlées à des longues.** Alterne. Un paragraphe peut commencer par une phrase de 4 mots. Le suivant peut faire 30 mots et serpenter. C'est la respiration qui fait humain.
3. **Voix incarnée.** Tu peux dire "j'ai vu", "on observe", "ça dépend", "soyons clairs", "à la fin de l'histoire". L'auteur a un point de vue.
4. **Détails sensoriels et concrets.** Au lieu de "la vie y est agréable", écris "le marché du samedi déborde sur la place jusqu'à 14h". Ancre dans le réel.
5. **Honnêteté intellectuelle.** Reconnais ce qui ne va pas, ce qui dépend, ce qui est subjectif. Ne survends pas.
6. **Chiffres précis quand ils existent.** "3 050 €/m²" et pas "environ 3 000 €". "Trajet 35 minutes" et pas "trajet rapide".
7. **Métaphores concrètes**, pas creuses. "C'est la grande couronne avec un coup de marteau qui décale tout" passe. "C'est un trésor caché" est mort.
8. **Connecteurs naturels** : "alors", "du coup", "sauf que", "cela dit", "à l'inverse", "pourtant", "et", "mais". Pas "ainsi", "par ailleurs", "en outre", "de surcroît".

# FORMAT MARKDOWN

- Pas de H1 (le titre est rendu séparément par le template).
- H2 = ## (au moins 5, idéalement 7-10 selon longueur).
- Paragraphes séparés par lignes vides.
- Italique avec * pour insister ponctuellement.
- Gras avec ** pour les mots-clés ou chiffres importants.
- Listes uniquement si elles servent vraiment (énumérations factuelles courtes), pas pour décorer.
- Pas de citations bloc (>), pas de tableaux.

# LONGUEUR

Cible : 1 500 à 1 800 mots. C'est la fourchette qui correspond à un article SEO de fond, ni light ni indigeste.

# LIVRABLE

Renvoie UNIQUEMENT le markdown du contenu. Pas de meta, pas de "Voici l'article :", pas de bloc \`\`\`. Tu commences par le premier paragraphe d'intro (sans H2 d'ouverture si c'est plus naturel) ou le premier H2. Tu finis par le dernier paragraphe.`;

type BriefSection = { titre: string; contenu: string };

async function generate(post: (typeof BLOG_POSTS)[number]): Promise<string> {
  const sectionsBlock = post.brief.sections
    .map((s: BriefSection, i: number) => `### Section ${i + 1} : ${s.titre}\n${s.contenu}`)
    .join("\n\n");

  const brief = post.brief as typeof post.brief & {
    ouverture?: string;
    structure?: string;
  };

  const userPrompt = `# Article à écrire

**Titre** : ${post.title}
**Description** : ${post.description}
**Longueur cible** : ${post.readingMinutes * 200} mots (~${post.readingMinutes} min de lecture)
**Catégorie** : ${post.category}

# Audience cible
${post.brief.audience}

# Angle / thèse
${post.brief.angle}
${brief.ouverture ? `\n# Ouverture imposée (type d'attaque exigé pour les 2-3 premières phrases)\n${brief.ouverture}\n` : ""}
${brief.structure ? `\n# Structure narrative imposée\n${brief.structure}\n` : ""}
# Plan détaillé (à respecter mais avec liberté de fusionner ou réorganiser si plus naturel)
${sectionsBlock}

${post.brief.references && post.brief.references.length > 0 ? `# Communes ou lignes à citer dans le texte\n${post.brief.references.join(", ")}` : ""}

# Consignes finales

- Écris en suivant le système de style à la lettre. C'est un texte humain pour Google, pas un essai pour un humain qui sait que c'est un robot.
- Ne signe pas l'article. Ne mentionne pas que tu es une IA.
- Ne pose aucune question rhétorique d'ouverture du genre "Tu te demandes... ?". Rentre dans le concret.
- Respecte le type d'ouverture imposé et la structure narrative imposée (s'ils sont indiqués).
- Va.`;

  console.log(`   Streaming Opus 4.7 (max_tokens 8192)...`);
  const stream = await client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 8192,
    system: SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });

  let text = "";
  let chunks = 0;
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      text += event.delta.text;
      chunks++;
      if (chunks % 30 === 0) process.stdout.write(".");
    }
  }
  process.stdout.write("\n");

  return text.trim();
}

function loadExisting(outPath: string): Record<string, string> {
  if (!fs.existsSync(outPath)) return {};
  try {
    const content = fs.readFileSync(outPath, "utf-8");
    const match = content.match(
      /export\s+const\s+BLOG_CONTENT\s*:\s*Record<string,\s*string>\s*=\s*({[\s\S]*?})\s*;/,
    );
    if (!match) return {};
    return Function(`return ${match[1]};`)() as Record<string, string>;
  } catch (err) {
    console.warn("Échec parsing existant, on repart à vide :", err);
    return {};
  }
}

function writeOutput(outPath: string, content: Record<string, string>): void {
  const entries = Object.keys(content)
    .sort()
    .map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(content[k])}`)
    .join(",\n");

  const ts = `// Auto-généré via scripts/regenerate-blog.ts (claude-opus-4-7)
// Pour régénérer un article : npm run regenerate-blog <slug>
// Pour tout régénérer : npm run regenerate-blog

export const BLOG_CONTENT: Record<string, string> = {
${entries}
};
`;

  fs.writeFileSync(outPath, ts);
}

async function main(): Promise<void> {
  const outPath = path.resolve(__dirname, "..", "lib", "blog-content.ts");
  const existing = loadExisting(outPath);

  const targetSlug = process.argv[2];
  const targets = targetSlug
    ? BLOG_POSTS.filter((p) => p.slug === targetSlug)
    : BLOG_POSTS;

  if (targets.length === 0) {
    console.error(`❌ Aucun article trouvé pour le slug "${targetSlug}"`);
    console.error(`Slugs disponibles : ${BLOG_POSTS.map((p) => p.slug).join(", ")}`);
    process.exit(1);
  }

  console.log(`📝 Régénération de ${targets.length} article(s) avec claude-opus-4-7\n`);

  for (let i = 0; i < targets.length; i++) {
    const post = targets[i];
    console.log(`[${i + 1}/${targets.length}] ${post.title}`);
    try {
      const t0 = Date.now();
      const content = await generate(post);
      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      const wc = content.split(/\s+/).length;
      existing[post.slug] = content;
      writeOutput(outPath, existing);
      console.log(`   ✓ ${wc} mots en ${dt}s, sauvegardé\n`);
    } catch (err) {
      console.error(`   ✗ ${err instanceof Error ? err.message : String(err)}\n`);
    }
  }

  console.log(`✅ Terminé. ${Object.keys(existing).length} articles dans ${path.relative(process.cwd(), outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
