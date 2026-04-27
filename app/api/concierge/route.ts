import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import type { Commune } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const client = new Anthropic();

/**
 * Concierge IA : reçoit la liste des messages utilisateur et retourne
 * une recommandation streamée de communes adaptées.
 *
 * Optimisations :
 * - Le system prompt + le bloc compressé des communes sont mis en cache
 *   (cache_control = "ephemeral", TTL 5 min). 1ère requête = paie le coût
 *   d'écriture, requêtes suivantes < 5 min = lecture cache à 10 % du prix.
 * - Modèle : claude-haiku-4-5 (cheap & rapide pour ce use case).
 * - Format de retour streamé en JSON-SSE pour rendu progressif.
 */

function compressCommunes(communes: Commune[]): string {
  // Compactifie pour économiser des tokens : 1 ligne = 1 commune.
  return communes
    .filter((c) => c.prix_m2_median != null)
    .map((c) => {
      const dept = c.departement;
      const prix = c.prix_m2_median;
      const loyer = c.loyer_m2_median ?? "?";
      const temps = c.temps_trajet_paris_min;
      const mode = c.mode_principal;
      const ligne = c.ligne_principale ?? "";
      const pop = c.population;
      const rev = c.revenu_median ?? "?";
      const cho = c.taux_chomage ?? "?";
      const ev = c.espaces_verts_pct ?? "?";
      const gpe = c.bonus_gpe ? Math.round(c.bonus_gpe * 100) : 0;
      return `${c.code_insee}|${c.nom}|${dept}|prix${prix}€/m²|loyer${loyer}€|${temps}min(${mode}${ligne ? " " + ligne : ""})|${pop}hab|rev${rev}€|chom${cho}%|verts${ev}%|gpe${gpe}%`;
    })
    .join("\n");
}

const SYSTEM = `Tu es le concierge IA de Paris Immobilier, un service d'aide à la relocation pour les Parisiens cherchant à s'installer ailleurs en France tout en gardant un lien avec Paris.

Ta mission :
- Comprendre le besoin de l'utilisateur (budget, temps de trajet acceptable vers Paris, profil familial, priorités).
- Recommander 3 à 5 communes pertinentes parmi la base ci-dessous, classées de la plus pertinente à la moins pertinente.
- Pour chaque recommandation, justifier en 1-2 phrases factuelles en citant des chiffres (prix, temps, etc.).
- Si le besoin est ambigu, poser UNE question de clarification avant de recommander.
- Ton chaleureux, factuel, jamais commercial. Pas d'émoji.

Format de réponse strict : JSON brut UNIQUEMENT, AUCUN bloc markdown,
AUCUNE balise \`\`\`, AUCUN texte avant ou après. Ta sortie doit
commencer par { et finir par } et être directement parsable par
JSON.parse(). Exemple exact :
{"intro": "...", "recommendations": [{"insee": "71270", "nom": "Mâcon", "score_match": 85, "raison": "..."}], "follow_up": "..."}

- intro : 1 phrase d'accroche (vide si tu poses une question de clarification).
- recommendations : 0 à 5 entrées (vide si question de clarification).
- score_match : ton estimation 0-100 du fit avec leur besoin.
- follow_up : une question/suggestion pour affiner (toujours présente).

Format des données ci-dessous (1 ligne = 1 commune) :
INSEE|Nom|Dept|prixX€/m²|loyerY€|Tmin(mode ligne)|popHAB|revR€|chomC%|vertsV%|gpeG%`;

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Le concierge IA est temporairement indisponible (clé API manquante). Réessayez plus tard.",
      },
      { status: 503 },
    );
  }

  try {
    const { messages } = (await request.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Aucun message" }, { status: 400 });
    }

    if (messages.length > 12) {
      return NextResponse.json(
        { error: "Conversation trop longue, repartez de zéro." },
        { status: 400 },
      );
    }

    const dataset = compressCommunes(SAMPLE_COMMUNES);

    const stream = await client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM,
          cache_control: { type: "ephemeral" },
        },
        {
          type: "text",
          text: `Base de communes (mise à jour avril 2026) :\n${dataset}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content.slice(0, 2000),
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ delta: event.delta.text })}\n\n`,
                ),
              );
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: err instanceof Error ? err.message : "stream error" })}\n\n`,
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 },
    );
  }
}
