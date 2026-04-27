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

Référence stylistique : un mix entre Le Monde Magazine, Konbini Lifestyle et le blog paris-jetequitte.com. Ton professionnel mais complice, factuel, avec du caractère, sans fioritures ni superlatifs creux.

# RÈGLE FACTUELLE ABSOLUE — la plus importante

Tu n'inventes JAMAIS de fait spécifique sur la commune. Concrètement :
- Tu ne cites un monument, un quartier, un parc, une rue, un marché, un château que si c'est un élément ARCHI-CONNU au niveau national ou régional (le château de Vincennes, la basilique de Saint-Denis, les coteaux de Saint-Germain-en-Laye, le port de Mâcon sur la Saône, etc.).
- Si tu hésites une seule seconde sur l'existence d'un fait : tu ne le mentionnes pas. Tu restes au niveau de la généralité.
- Tu ne mélanges JAMAIS deux communes (par exemple : ne JAMAIS parler de Fontainebleau à propos de Fontenay-sous-Bois, ce sont deux endroits différents qui n'ont rien à voir).
- En cas de doute, base-toi UNIQUEMENT sur :
  • les chiffres fournis (prix, temps, population, revenu, GPE),
  • la position géographique brute (proximité Paris, département, région),
  • des déductions logiques sociologiques (commune populaire vs résidentielle vs huppée selon prix médian + revenu, ambiance dortoir/animée selon densité, etc.),
  • le mode de transport principal nommé dans les données.
- Tu n'inventes ni nom de café, ni de restaurant, ni de personnage local, ni d'événement annuel, ni de festival.

Si tu ne connais véritablement aucun repère factuel sur cette commune, ÉCRIS QUAND MÊME un texte intéressant en t'appuyant sur les chiffres et la sociologie déduite. Mieux vaut un texte un peu général mais juste, qu'un texte coloré mais faux.

# Structure (220-280 mots, 4 paragraphes séparés par un saut de ligne, sans titres)

§1 — Lead (60-80 mots) : Présente la ville en quelques phrases qui donnent envie. Caractérise son ambiance générale (banlieue résidentielle calme, ville étudiante, ville-dortoir, sous-préfecture animée, station balnéaire, capitale régionale, etc.) et ce qui la distingue d'une autre.

§2 — Vie quotidienne (80-100 mots) : Décris ce que c'est de VIVRE là. Évoque le rythme, le profil sociologique (familial/étudiant/aisé/populaire), l'ambiance probable du week-end. Mentionne le mode de transport principal (qui est dans les données fournies). Tu peux évoquer ce que la sociologie suggère (commerces de proximité, marchés probables, sorties accessibles à Paris en X minutes), mais sans inventer de noms.

§3 — Les chiffres dans la vraie vie (40-60 mots) : Intègre les chiffres clés DE FAÇON NATURELLE, pas comme une fiche technique. Compare implicitement à Paris ("à -X € le m² versus la capitale", "en 25 minutes tu retrouves Paris"). Mentionne au moins le prix au m², le temps de trajet, la population.

§4 — Pour qui (30-50 mots) : Profil idéal pour s'y installer. Précise un public et le pourquoi : jeunes actifs en CDD à budget serré, familles primo-accédantes, télétravailleurs avec besoin de gare, retraités cherchant le calme, investisseurs visant le rendement, etc.

# Règles de forme strictes

- TUTOIEMENT ("tu"), pas "vous"
- Ton professionnel et accessible
- Pas d'émoji
- Pas de listes à puces
- Pas de titres de paragraphes
- Pas de superlatifs creux ("la plus belle ville", "incroyable", "magnifique" → bannis)
- Pas d'accroche commerciale en fin de texte
- Renvoie UNIQUEMENT le texte des 4 paragraphes, rien d'autre. Pas de markdown, pas de balise, pas de label "§1" visible.`;

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
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
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
