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

/**
 * Tente d'extraire un budget en euros depuis un message utilisateur.
 * Reconnaît : "200k€", "200 000€", "350000 euros", "budget 400k", "1.5M€".
 */
function extractBudget(text: string): number | null {
  const norm = text.toLowerCase().replace(/\s+/g, " ");

  // M€ / millions
  const millionMatch = norm.match(/(\d+(?:[.,]\d+)?)\s*m(?:€|illions?)/);
  if (millionMatch) {
    return Math.round(parseFloat(millionMatch[1].replace(",", ".")) * 1_000_000);
  }

  // k€ / 200k
  const kMatch = norm.match(/(\d+(?:[.,]\d+)?)\s*k(?:€|euros?)?/);
  if (kMatch) {
    return Math.round(parseFloat(kMatch[1].replace(",", ".")) * 1000);
  }

  // 200 000 € ou 200000€
  const fullMatch = norm.match(/(\d{1,3}(?:[\s.]\d{3})+|\d{4,7})\s*(?:€|euros?)/);
  if (fullMatch) {
    return parseInt(fullMatch[1].replace(/[\s.]/g, ""), 10);
  }

  return null;
}

function compressCommunes(communes: Commune[]): string {
  // Compactifie pour économiser des tokens : 1 ligne = 1 commune.
  // Bloc STATIQUE (cacheable) — pas de budget, pas de calcul dynamique.
  return communes
    .filter((c) => c.prix_m2_median != null)
    .map((c) => {
      const prix = c.prix_m2_median!;
      const loyer = c.loyer_m2_median ?? "?";
      const temps = c.temps_trajet_paris_min;
      const mode = c.mode_principal;
      const ligne = c.ligne_principale ?? "";
      const pop = c.population;
      const rev = c.revenu_median ?? "?";
      const cho = c.taux_chomage ?? "?";
      const ev = c.espaces_verts_pct ?? "?";
      const gpe = c.bonus_gpe ? Math.round(c.bonus_gpe * 100) : 0;
      return `${c.code_insee}|${c.nom}|${c.departement}|prix${prix}€/m²|loyer${loyer}€|${temps}min(${mode}${ligne ? " " + ligne : ""})|${pop}hab|rev${rev}€|chom${cho}%|verts${ev}%|gpe${gpe}%`;
    })
    .join("\n");
}

/**
 * Bloc DYNAMIQUE (non caché) : surface≈Nm² par commune pour le budget
 * détecté. Calculé en TS, copié-collé par le modèle.
 */
function buildBudgetContext(communes: Commune[], budget: number): string {
  const formatBudget = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)} M€`
      : n >= 1000
        ? `${Math.round(n / 1000)} k€`
        : `${n} €`;

  const lines = communes
    .filter((c) => c.prix_m2_median != null && c.prix_m2_median > 0)
    .map((c) => `${c.code_insee}|${Math.round(budget / c.prix_m2_median!)}m²`)
    .join("\n");

  return `Budget détecté dans le message utilisateur : ${formatBudget(budget)} (${budget} €).

Surfaces théoriques possibles à ce budget, par commune (INSEE|m² approximatif arrondi à l'entier — déjà calculées, NE RECALCULE PAS) :
${lines}

Si tu mentionnes une surface dans une recommandation, copie-colle exactement la valeur de ce tableau.`;
}

const SYSTEM = `# RÈGLES ABSOLUES (à respecter quoi qu'il arrive)

1. TUTOIEMENT OBLIGATOIRE. Tu écris en utilisant « tu », « ton », « tes ». JAMAIS « vous ». Si tu vouvoies, c'est un échec.
2. RECOMMANDATIONS PROACTIVES. Dès qu'il y a UN seul critère exploitable (budget OU temps OU profil), tu listes 3 à 5 communes dans le champ "recommendations". Tu ne refuses jamais de recommander.
3. ZÉRO ARITHMÉTIQUE. Tu ne calcules JAMAIS un nombre. Tu ne mentionnes une surface m² QUE si tu trouves la valeur déjà calculée dans le bloc "Surfaces théoriques" — copie-colle exact, pas de math.
4. JSON BRUT. Ta sortie commence par { et finit par }. Aucun markdown, aucune balise \`\`\`, aucun texte hors JSON.

# Identité

Tu es le concierge IA de "Vivre près de Paris", un service qui aide les Parisiens à s'installer ailleurs en France en gardant un lien avec Paris.

# Ton

Tutoyant (cf. règle 1), pro mais accessible, factuel, complice. Pas d'émoji, jamais de ton commercial.

# Mission

- Comprendre le besoin (budget, temps de trajet vers Paris, profil familial, priorités).
- Recommander 3 à 5 communes concrètes basées sur les critères donnés, classées de la plus pertinente à la moins pertinente.
- Justifier chaque recommandation en 1-2 phrases factuelles citant les chiffres bruts (prix m², temps, surface si budget mentionné).
- Si tu manques d'info pour affiner, tu poses la question DANS le champ "follow_up", pas en intro et pas à la place des recos.

Format de réponse strict : JSON brut UNIQUEMENT, AUCUN bloc markdown,
AUCUNE balise \`\`\`, AUCUN texte avant ou après. Ta sortie doit
commencer par { et finir par } et être directement parsable par
JSON.parse(). Exemple exact :
{"intro": "...", "recommendations": [{"insee": "71270", "nom": "Mâcon", "score_match": 85, "raison": "..."}], "follow_up": "..."}

- intro : 1-2 phrases d'accroche tutoyante qui contextualisent ton choix (« Avec 200k€ et 1h max de Paris, tu vises clairement la grande couronne ouest. Voici mes pépites pour ce profil. »).
- recommendations : 3 à 5 entrées en règle générale. 0 uniquement si AUCUN critère exploitable n'a été fourni.
- score_match : ton estimation 0-100 du fit avec son besoin.
- follow_up : une question pour affiner (toujours présente, formulée en tutoiement). C'est ICI que tu poses tes questions, pas en intro.

Format des données ci-dessous (1 ligne = 1 commune) :
INSEE|Nom|Dept|prixX€/m²|loyerY€|Tmin(mode ligne)|popHAB|revR€|chomC%|vertsV%|gpeG%[|surface≈Nm² si budget détecté]

# RÈGLE MATHÉMATIQUE ABSOLUE

Tu N'ES PAS bon en arithmétique mentale. Pour cette raison :
- Tu N'EFFECTUES JAMAIS de division ou de multiplication toi-même.
- Si l'utilisateur a mentionné un budget, le champ "surface≈Nm²" est déjà
  pré-calculé pour toi à la fin de chaque ligne de la base. Cite cette
  valeur littéralement (par exemple "≈ 48 m²"), ne la recalcule pas.
- Si le champ "surface" est absent (pas de budget détecté), ne mentionne
  AUCUNE surface en m². Demande plutôt à l'utilisateur de préciser son
  budget pour que tu puisses lui donner cette info.
- Tu peux comparer des prix (X €/m² vs Y €/m²) car ce sont des valeurs
  brutes que tu copies, pas des calculs.
- Toute valeur que tu cites dans une recommandation DOIT exister telle
  quelle dans la ligne de données de la commune correspondante.`;

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

    // Détecte un budget dans n'importe quel message user pour pré-calculer
    // les surfaces possibles (le modèle ne fait pas l'arithmétique).
    const userMessages = messages.filter((m) => m.role === "user");
    const budget =
      userMessages
        .map((m) => extractBudget(m.content))
        .reverse()
        .find((b) => b != null) ?? null;

    const dataset = compressCommunes(SAMPLE_COMMUNES);

    // Bloc 1 : system prompt (cacheable, ne change pas)
    // Bloc 2 : dataset statique (cacheable, ne change pas)
    // Bloc 3 : contexte budget (dynamique, non caché) — uniquement si budget
    const systemBlocks: Anthropic.TextBlockParam[] = [
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
    ];

    if (budget != null) {
      systemBlocks.push({
        type: "text",
        text: buildBudgetContext(SAMPLE_COMMUNES, budget),
      });
    }

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemBlocks,
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
