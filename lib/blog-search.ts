/**
 * Construction des documents indexables pour la recherche client-side du blog.
 *
 * Stratégie :
 *  - On extrait pour chaque article les champs forts (titre, description, audience,
 *    angle, titres de sections) + 400 premiers caractères du contenu nettoyés du
 *    markdown.
 *  - L'index est construit côté client par MiniSearch (cf. components/BlogClientShell.tsx).
 *  - Taille payload : ~800 chars × 211 articles ≈ 170KB raw, ~50KB gzipped.
 *
 * On évite de balancer tout le contenu (1MB+) côté client : recall suffisant
 * pour 211 articles avec excerpt + métadonnées.
 */

import { PUBLISHED_BLOG_POSTS } from "./blog-published";
import { BLOG_CONTENT } from "./blog-content";

export type BlogSearchableDoc = {
  slug: string; // id pour MiniSearch
  title: string;
  description: string;
  body: string; // audience + angle + section titles + excerpt
};

/** Strip markdown to plain text — pas exhaustif mais suffisant pour la recherche. */
function stripMarkdown(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/`[^`]+`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → keep text
    .replace(/^[#>*-]+\s*/gm, "") // headings, blockquotes, list markers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/_{1,2}([^_]+)_{1,2}/g, "$1") // underscore emphasis
    .replace(/\s+/g, " ")
    .trim();
}

export function getBlogSearchDocs(): BlogSearchableDoc[] {
  return PUBLISHED_BLOG_POSTS.map((post) => {
    const briefParts: string[] = [];
    if (post.brief?.audience) briefParts.push(post.brief.audience);
    if (post.brief?.angle) briefParts.push(post.brief.angle);
    if (post.brief?.sections) {
      briefParts.push(...post.brief.sections.map((s) => s.titre));
    }

    const rawContent = BLOG_CONTENT[post.slug] ?? "";
    const excerpt = stripMarkdown(rawContent).slice(0, 400);

    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      body: [briefParts.join(" "), excerpt].filter(Boolean).join(" "),
    };
  });
}
