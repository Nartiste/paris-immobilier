#!/usr/bin/env tsx
/**
 * Génère le PDF du Top 10 à partir du contenu markdown.
 * Output : public/downloads/top-10-quitter-paris-2026.pdf
 *
 * Usage : npm run generate-pdf
 */

// @ts-expect-error - pdfkit n'a pas de typings ESM stricts compatibles tsx
import PDFDocument from "pdfkit";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { BLOG_CONTENT } from "../lib/blog-content.js";
import { BLOG_POSTS_BY_SLUG } from "../lib/blog-posts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SLUG = "top-10-villes-pour-quitter-paris-2026";

const COLORS = {
  bleu: "#52627A",
  iris: "#9D8CF2",
  irisStrong: "#7A6BD1",
  textDark: "#1A1A1A",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  bgSoft: "#FAFAFA",
};

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "li"; text: string; ordered: boolean; index: number };

/** Parse le markdown en blocs simples pour PDFKit. */
function parseMarkdown(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let paragraph = "";
  let listIndex = 0;
  let inOrderedList = false;
  let inUnorderedList = false;

  const flushParagraph = () => {
    const trimmed = paragraph.trim();
    if (trimmed) {
      blocks.push({ type: "p", text: trimmed });
    }
    paragraph = "";
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flushParagraph();
      listIndex = 0;
      inOrderedList = false;
      inUnorderedList = false;
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("### ")) {
      flushParagraph();
      listIndex = 0;
      inOrderedList = false;
      inUnorderedList = false;
      blocks.push({ type: "h3", text: line.slice(4).trim() });
    } else if (/^\s*\d+\.\s+/.test(line)) {
      flushParagraph();
      if (!inOrderedList) {
        listIndex = 0;
        inOrderedList = true;
        inUnorderedList = false;
      }
      listIndex++;
      blocks.push({
        type: "li",
        text: line.replace(/^\s*\d+\.\s+/, "").trim(),
        ordered: true,
        index: listIndex,
      });
    } else if (/^\s*[-*]\s+/.test(line)) {
      flushParagraph();
      if (!inUnorderedList) {
        inOrderedList = false;
        inUnorderedList = true;
      }
      blocks.push({
        type: "li",
        text: line.replace(/^\s*[-*]\s+/, "").trim(),
        ordered: false,
        index: 0,
      });
    } else if (line.trim() === "") {
      flushParagraph();
      inOrderedList = false;
      inUnorderedList = false;
    } else {
      // Paragraphe (concatène les lignes adjacentes)
      paragraph += (paragraph ? " " : "") + line;
    }
  }
  flushParagraph();

  return blocks;
}

/** Nettoie les marqueurs markdown inline (gras, italique, liens). */
function stripInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **gras**
    .replace(/\*([^*]+)\*/g, "$1") // *italique*
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [texte](url)
    .replace(/`([^`]+)`/g, "$1"); // `code`
}

function main(): void {
  const content = BLOG_CONTENT[SLUG];
  const meta = BLOG_POSTS_BY_SLUG[SLUG];

  if (!content || !meta) {
    console.error(`❌ Article ${SLUG} introuvable`);
    process.exit(1);
  }

  const outPath = path.resolve(
    __dirname,
    "..",
    "public",
    "downloads",
    "top-10-quitter-paris-2026.pdf",
  );
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 60, bottom: 60, left: 56, right: 56 },
    info: {
      Title: meta.title,
      Author: "Vivre près de Paris",
      Subject: meta.description,
      Keywords: "quitter Paris, immobilier, 2026, comparateur",
    },
  });

  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  // ============================================================
  // PAGE DE COUVERTURE
  // ============================================================
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.bgSoft);
  doc
    .rect(0, 0, doc.page.width, 12)
    .fill(COLORS.iris);
  doc
    .rect(0, 12, doc.page.width, 4)
    .fill(COLORS.irisStrong);

  doc.fillColor(COLORS.bleu);

  // Logo (texte)
  doc.font("Helvetica-Bold").fontSize(14);
  doc.text("VIVRE PRÈS DE PARIS", 56, 90);
  doc.font("Helvetica").fontSize(10).fillColor(COLORS.textMuted);
  doc.text("TROUVER OÙ S'INSTALLER", 56, 108);

  // Titre principal
  doc.fillColor(COLORS.bleu);
  doc.font("Helvetica-Bold").fontSize(40);
  doc.text("Top 10", 56, 220, { width: doc.page.width - 112 });
  doc.font("Helvetica-Bold").fontSize(28);
  doc.text("des villes pour", 56, 274);
  doc.fillColor(COLORS.irisStrong);
  doc.font("Helvetica-Oblique").fontSize(28);
  doc.text("quitter Paris", 56, 312);
  doc.fillColor(COLORS.bleu);
  doc.font("Helvetica-Bold").fontSize(28);
  doc.text("en 2026.", 56, 350);

  // Description
  doc.fillColor(COLORS.textMuted);
  doc.font("Helvetica").fontSize(13);
  doc.text(meta.description, 56, 430, {
    width: doc.page.width - 112,
    lineGap: 4,
  });

  // Pied de cover
  doc.fillColor(COLORS.textMuted).font("Helvetica").fontSize(10);
  doc.text(
    `Édition 2026 · ${new Date(meta.publishedAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`,
    56,
    doc.page.height - 120,
  );
  doc.fillColor(COLORS.irisStrong).font("Helvetica-Bold").fontSize(11);
  doc.text("vivre-pres-de-paris.fr", 56, doc.page.height - 100);

  // ============================================================
  // PAGES DE CONTENU
  // ============================================================
  doc.addPage();

  const blocks = parseMarkdown(content);
  const contentWidth = doc.page.width - 112;

  for (const block of blocks) {
    const cleanText = stripInline(block.text);

    // Détection saut de page nécessaire
    const remaining = doc.page.height - 80 - doc.y;

    if (block.type === "h2") {
      if (remaining < 80) doc.addPage();
      doc.moveDown(1.2);
      doc.fillColor(COLORS.bleu).font("Helvetica-Bold").fontSize(20);
      doc.text(cleanText, { width: contentWidth, lineGap: 2 });
      doc.moveDown(0.4);
      // Trait sous le H2
      const yLine = doc.y;
      doc
        .moveTo(56, yLine)
        .lineTo(56 + 40, yLine)
        .strokeColor(COLORS.iris)
        .lineWidth(2)
        .stroke();
      doc.moveDown(0.6);
    } else if (block.type === "h3") {
      if (remaining < 50) doc.addPage();
      doc.moveDown(0.6);
      doc.fillColor(COLORS.bleu).font("Helvetica-Bold").fontSize(13);
      doc.text(cleanText, { width: contentWidth });
      doc.moveDown(0.3);
    } else if (block.type === "p") {
      if (remaining < 40) doc.addPage();
      doc.fillColor(COLORS.textDark).font("Helvetica").fontSize(11);
      doc.text(cleanText, {
        width: contentWidth,
        lineGap: 3,
      });
      doc.moveDown(0.5);
    } else if (block.type === "li") {
      if (remaining < 30) doc.addPage();
      const prefix = block.ordered ? `${block.index}.  ` : "•  ";
      doc.fillColor(COLORS.textDark).font("Helvetica").fontSize(11);
      doc.text(`${prefix}${cleanText}`, {
        width: contentWidth,
        lineGap: 3,
        indent: 0,
      });
      doc.moveDown(0.2);
    }
  }

  // ============================================================
  // DERNIÈRE PAGE — CTA
  // ============================================================
  doc.addPage();
  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FFFFFF");
  doc.fillColor(COLORS.bleu);
  doc.font("Helvetica-Bold").fontSize(24);
  doc.text("Et maintenant ?", 56, 120, { width: contentWidth });

  doc.moveDown(0.5);
  doc.fillColor(COLORS.textDark).font("Helvetica").fontSize(12);
  doc.text(
    "Tu as les 10 villes en main. Pour aller plus loin, utilise notre comparateur interactif qui croise 86 communes IDF et 87 villages-gares TGV sur 6 critères que tu pondères toi-même.",
    {
      width: contentWidth,
      lineGap: 3,
    },
  );

  doc.moveDown(1.2);
  doc.fillColor(COLORS.irisStrong).font("Helvetica-Bold").fontSize(13);
  doc.text("→ Ouvrir le comparateur", 56, doc.y, {
    width: contentWidth,
    link: "https://vivre-pres-de-paris.fr/comparer",
    underline: true,
  });
  doc.moveDown(0.3);
  doc.text("→ Lire les autres articles du blog", 56, doc.y, {
    width: contentWidth,
    link: "https://vivre-pres-de-paris.fr/blog",
    underline: true,
  });
  doc.moveDown(0.3);
  doc.text("→ Parler au concierge IA", 56, doc.y, {
    width: contentWidth,
    link: "https://vivre-pres-de-paris.fr",
    underline: true,
  });

  doc.moveDown(3);
  doc.fillColor(COLORS.textMuted).font("Helvetica").fontSize(10);
  doc.text(
    "Ce guide est extrait du blog éditorial de Vivre près de Paris. Les chiffres et données présentés sont issus de sources publiques (INSEE, DVF, IDFM, Notaires de France). Édition 2026.",
    56,
    doc.y,
    { width: contentWidth, lineGap: 3 },
  );

  doc.end();

  stream.on("finish", () => {
    const size = fs.statSync(outPath).size;
    console.log(`✅ PDF généré : ${outPath}`);
    console.log(`   Taille : ${(size / 1024).toFixed(1)} KB`);
  });
}

main();
