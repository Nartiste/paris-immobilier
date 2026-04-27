/**
 * Route ADMIN TEMPORAIRE — à supprimer après usage.
 *
 * Génère les narrations éditoriales batch par batch (pour rester dans le
 * timeout Vercel Hobby de 60s).
 *
 * Sécurité : header `x-admin-secret` requis.
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import type { Commune } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const ADMIN_SECRET = "db371b5354bbc29158d343412a9d3ffb";

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

function userPrompt(commune: Commune): string {
  return `
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
Région : ${commune.region}
`.trim();
}

export async function POST(request: Request) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const offset = Number(url.searchParams.get("offset") ?? "0");
  const limit = Number(url.searchParams.get("limit") ?? "15");

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY missing" }, { status: 503 });
  }

  const client = new Anthropic();
  const batch = SAMPLE_COMMUNES.slice(offset, offset + limit);
  const narratives: Record<string, string> = {};
  const errors: { insee: string; nom: string; err: string }[] = [];

  for (const commune of batch) {
    try {
      const response = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 800,
        system: SYSTEM,
        messages: [{ role: "user", content: userPrompt(commune) }],
      });
      const block = response.content[0];
      if (block.type !== "text") throw new Error("Unexpected block type");
      narratives[commune.code_insee] = block.text.trim();
    } catch (err) {
      errors.push({
        insee: commune.code_insee,
        nom: commune.nom,
        err: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({
    narratives,
    errors,
    offset,
    processed: batch.length,
    total: SAMPLE_COMMUNES.length,
    hasMore: offset + batch.length < SAMPLE_COMMUNES.length,
  });
}
