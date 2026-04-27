/**
 * Route ADMIN TEMPORAIRE — à supprimer après usage.
 *
 * Génère le contenu markdown d'UN article de blog via Claude Sonnet 4.6.
 * Envoyée par slug, retourne `{ slug, content }`.
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { BLOG_POSTS_BY_SLUG } from "@/lib/blog-posts";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const ADMIN_SECRET = "db371b5354bbc29158d343412a9d3ffb";

const SYSTEM = `Tu es un journaliste lifestyle qui écrit pour le site "Vivre près de Paris", à destination des Parisiens en réflexion sur leur déménagement.

Référence stylistique : un mix entre Le Monde Magazine, Konbini Lifestyle et le blog paris-jetequitte.com. Ton professionnel mais complice, factuel, avec du caractère, sans fioritures ni superlatifs creux.

# Règles absolues

1. TUTOIEMENT obligatoire ("tu", "ton", "tes"). JAMAIS "vous". Si tu vouvoies, c'est un échec.
2. ZÉRO INVENTION FACTUELLE. Tu n'inventes JAMAIS un nom de monument, de rue, de commerce, de personnage local, d'événement annuel, de chiffre. Si tu n'es pas absolument certain d'un fait spécifique : tu n'en parles pas.
3. CITATIONS DE CHIFFRES. Quand tu cites des chiffres (prix m², temps, %), ils doivent être plausibles et alignés avec les ordres de grandeur du marché 2026 français.
4. PAS d'arithmétique improvisée. Si tu écris "200k€ / 4000€/m² = ?", calcule LITTÉRALEMENT en notation longue : "200 000 ÷ 4 000 = 50, soit ≈ 50 m²". Vérifie deux fois.
5. LIENS INTERNES. Quand tu mentionnes une commune que le site couvre, mentionne juste son nom (l'éditeur ajoutera les liens). De même pour les lignes de transport.

# Format de sortie

Markdown propre, structuré ainsi :
- Pas de H1 (le titre est ajouté côté template).
- Sections en H2 (## Titre).
- Sous-sections en H3 (### Sous-titre) si pertinent.
- Paragraphes courts (3-5 phrases max).
- Listes à puces autorisées si vraiment utiles, parcimonieuses.
- **gras** pour les mots-clés ou chiffres importants.
- Pas d'emojis, pas de tableaux markdown sauf si vraiment nécessaire.
- Renvoie UNIQUEMENT le markdown, pas de bloc \`\`\`, pas de balise.

Cible : **1400-1900 mots**. Article dense, sans remplissage, mais qui prend le temps de développer chaque section. Mieux vaut traiter à fond les sections importantes que survoler tout.`;

function buildUserPrompt(slug: string): string {
  const post = BLOG_POSTS_BY_SLUG[slug];
  if (!post) throw new Error(`Unknown slug: ${slug}`);

  // Données factuelles à disposition pour ancrer l'article
  const referencedCommunes = (post.brief.references ?? [])
    .map((nom) => {
      const c = SAMPLE_COMMUNES.find(
        (x) =>
          x.nom.toLowerCase() === nom.toLowerCase() ||
          x.nom.toLowerCase().startsWith(nom.toLowerCase()),
      );
      if (!c) return null;
      return `- ${c.nom} (${c.code_postal}, ${c.departement}) : ${c.prix_m2_median ?? "?"}€/m², ${c.temps_trajet_paris_min} min de Paris${c.ligne_principale ? ` via ${c.ligne_principale}` : ""}, population ${c.population.toLocaleString("fr-FR")}, revenu médian ${c.revenu_median ?? "?"}€/an`;
    })
    .filter(Boolean)
    .join("\n");

  const sectionsBrief = post.brief.sections
    .map(
      (s, i) =>
        `${i + 1}. ${s.titre}\n   → ${s.contenu}`,
    )
    .join("\n\n");

  return `Tu vas rédiger un article de blog publié sur le site Vivre près de Paris.

# Métadonnées

- **Titre** : ${post.title}
- **Description** : ${post.description}
- **Catégorie** : ${post.category}
- **Audience** : ${post.brief.audience}
- **Angle** : ${post.brief.angle}

# Structure attendue (1500-2500 mots, ## titres en H2)

${sectionsBrief}

${
  referencedCommunes
    ? `# Données factuelles vérifiées sur les communes citées

${referencedCommunes}

Utilise ces chiffres tels quels — ne les modifie pas. Tu peux comparer à Paris (~10500€/m² médian intra-muros 2026).`
    : ""
}

# Consignes finales

- Démarre par un § d'accroche (sans titre H2) qui donne envie de lire.
- Enchaîne avec les sections dans l'ordre du brief, en H2 (tu peux reformuler les titres).
- Termine par une mini-conclusion ou ouverture (pas commerciale).
- Tutoiement, ton paris-jetequitte (pro complice).
- **1400-1900 mots**, dense en information.
- Renvoie UNIQUEMENT le markdown.`;
}

export async function POST(request: Request) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY missing" },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  if (!slug || !BLOG_POSTS_BY_SLUG[slug]) {
    return NextResponse.json(
      {
        error: "Missing or unknown slug",
        valid: Object.keys(BLOG_POSTS_BY_SLUG),
      },
      { status: 400 },
    );
  }

  try {
    const client = new Anthropic();
    // Streaming pour contourner le timeout Vercel 60s : le client reçoit
    // le texte au fur et à mesure. Si Sonnet finit avant 60s, l'article
    // entier est délivré même si la fonction meurt ensuite.
    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: "user", content: buildUserPrompt(slug) }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `\n\n[ERROR: ${err instanceof Error ? err.message : String(err)}]`,
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Slug": slug,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
