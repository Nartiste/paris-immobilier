import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase";
import { brevoUpsertContact, brevoSendTemplate } from "@/lib/brevo";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import {
  selectCandidateCommunes,
  compressCommunesForReport,
  getBudgetM2Max,
  type QuizAnswersForReport,
} from "@/lib/personal-report-matcher";
import {
  PROFIL_LABELS,
  FREQUENCE_LABELS,
  CRITERE_LABELS,
  BUDGET_MODE_LABELS,
} from "@/lib/onboarding-presets";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

const COOKIE_NAME = "vpdp_newsletter_unlocked";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const client = new Anthropic();

/**
 * SYSTEM prompt pour générer un rapport ULTRA-PERSONNALISÉ.
 * Règles voix anti-IA héritées du reste du projet :
 *  - tutoiement systématique
 *  - pas d'em-dash, pas de phrases-tells ("plongée", "découverte", "univers")
 *  - français incarné, pas markéting
 */
const SYSTEM = `Tu es l'expert immobilier de Vivre près de Paris. Tu génères un RAPPORT ULTRA-PERSONNALISÉ pour chaque utilisateur basé sur ses réponses au quiz.

# Règles voix (absolues)

1. TUTOIEMENT SYSTÉMATIQUE. Tu écris en utilisant "tu", "ton", "tes". JAMAIS "vous".
2. PAS D'EM-DASH (—). Utilise virgules, deux-points, ou points.
3. PAS de phrases-tells type "plongée dans", "univers de", "découverte", "voyage", "magie", "incontournable", "à ne pas manquer", "véritable", "joyau", "pépite cachée", "coup de cœur".
4. Voix incarnée, factuelle, complice. Tu cites des chiffres bruts. Pas de ton commercial mielleux.
5. Pas d'émoji.

# Règle d'ultra-personnalisation (cœur du produit)

- Mentionne le prénom 4 à 6 fois dans le rapport.
- Cite explicitement les réponses du quiz au moins 5 fois (ex : "vu ton budget 5500 €/m²", "ton temps max de 60 minutes", "ta priorité éducation").
- Le rapport doit être IMPOSSIBLE à confondre avec celui d'un autre utilisateur. Aucun paragraphe générique.

# Règle arithmétique

- Tu N'EFFECTUES JAMAIS de division ou de multiplication. Tu cites les chiffres bruts du dataset.
- Si tu veux mentionner une surface ou un prix d'un T3 60m², calcule mentalement seulement les MULTIPLICATIONS SIMPLES (prix m² × surface). Si tu doutes, ne mentionne pas la valeur.

# Règle BUDGET (NON NÉGOCIABLE — règle de cohérence)

Le user fournit son **budget m² max calculé** (champ "Budget m² max recommandé"). Tu DOIS respecter cette discipline :

1. **Si la ville principale a un prix m² ≤ budget m² max × 1.25** : recommandation normale, présente comme "dans ton budget" ou "te laisse de l'air".

2. **Si la ville principale a un prix m² > budget m² max × 1.25** : c'est un COMPROMIS. Tu DOIS l'annoncer dans la première section avec une phrase du type "**Avertissement : à {prix}/m², cette ville dépasse ton budget. Voici ce que ça impliquerait concrètement…**" + expliquer (réduire surface visée, augmenter mensualité, ou accepter ville moins chère mais plus éloignée).

3. **Si TOUTES les candidates dépassent le budget** : ouvre le rapport par une phrase honnête type "**{prenom}, ton budget est très contraint pour {surface}m² en Île-de-France.**" et propose 1 ville en COMPROMIS minimal + 2 alternatives, en expliquant les arbitrages.

4. **JAMAIS** présenter une ville à 7100 €/m² comme "te laisse de l'air" quand le budget m² max est 1375 €/m². Ce serait une faute professionnelle. Le user te fait confiance pour des chiffres honnêtes.

# Format de réponse : LE VERDICT (Markdown strict)

C'est un VERDICT, pas une comparaison. UNE ville sort gagnante. Deux alternatives en backup au cas où. Anti-mou. Anti-marketing.

\`\`\`
# Ta ville : {Nom de la ville principale}

**Score de match : {X}/100**

## Pourquoi cette ville pour toi (et pas une autre)

{1 phrase punch qui résume le verdict en citant explicitement 2 réponses du quiz}

**Ton profil rappelé** : {1 ligne synthèse profil + besoins clés issus du quiz}

## Pourquoi {Nom} sort en tête

- Premier argument lié à un critère prioritaire du user (chiffré)
- Deuxième argument chiffré (prix m², trajet précis, etc.)
- Troisième argument lié à un critère secondaire
- Quatrième argument différenciant (école, GPE, tissu, etc.)

**Tes quartiers à viser dans {Nom}** : {3 quartiers spécifiques séparés par virgules}

**Les pièges à éviter** : {1-2 mises en garde concrètes, ex: "marché tendu, négocier hors agence"}

**Ta fenêtre d'achat** : {1 phrase sur le bon timing 2026 pour cette commune précise}

---

## Si tu veux comparer : 2 alternatives backup

### Backup 1 : {Nom alternatif 1} ({CP}) — Score {Y}/100

{1 paragraphe de 60-80 mots qui explique pourquoi cette commune arrive 2e pour CE profil. Citer au moins 1 réponse quiz. Citer 1-2 quartiers à viser.}

### Backup 2 : {Nom alternatif 2} ({CP}) — Score {Z}/100

{1 paragraphe de 60-80 mots, idem.}

---

## Et maintenant ?

{1 paragraphe court qui réaffirme le verdict ("{Nom} reste ton meilleur match"), explique que les backups sont des plans B et invite à utiliser le comparateur ou la fiche commune.}
\`\`\`

# Règles de longueur

- Total : 500 à 750 mots.
- Section principale (ville verdict) : 250-350 mots.
- Chaque backup : 60-80 mots seulement (pas un "top 3 déguisé" : c'est UN verdict + 2 alternatives en discret).
- Tu choisis 1 ville principale + 2 alternatives parmi celles fournies en contexte (top candidates pré-filtrées).
- Score principal entre 85 et 95. Scores backup entre 70 et 84.

# Format final

Tu retournes UNIQUEMENT le markdown du rapport. Pas de bloc \`\`\`markdown, pas d'intro hors-rapport, pas de commentaire de méta. Ta réponse commence EXACTEMENT par "# Ta ville : ".`;

type RequestBody = {
  prenom?: string;
  nom?: string;
  email?: string;
  quizAnswers?: QuizAnswersForReport;
  source?: string;
};

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Service indisponible (clé API manquante)" },
      { status: 503 },
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const prenom = (body.prenom ?? "").trim();
  const nom = (body.nom ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const quizAnswers = body.quizAnswers;
  const source = (body.source ?? "onboarding-quiz").trim();

  if (!prenom || prenom.length > 80) {
    return NextResponse.json({ error: "Prénom invalide" }, { status: 400 });
  }
  if (nom.length > 80) {
    return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }
  if (!quizAnswers || !quizAnswers.profil || !quizAnswers.frequenceParis) {
    return NextResponse.json({ error: "Réponses quiz manquantes" }, { status: 400 });
  }

  // Métadonnées RGPD
  const reqHeaders = await headers();
  const consentIp =
    reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() ??
    reqHeaders.get("x-real-ip") ??
    null;
  const consentUa = reqHeaders.get("user-agent") ?? null;

  const supabase = getSupabaseServer();

  // 1) Insert/Upsert dans newsletter_subscribers (pour cohérence avec l'existant)
  const villeEnvisagee = quizAnswers.villeEnvisagee ?? null;

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, confirmed_at, unsubscribed_at, confirm_token")
    .eq("email", email)
    .maybeSingle();

  let subscriberId: string | null = null;

  if (existing) {
    subscriberId = existing.id;
    if (existing.unsubscribed_at) {
      // Réinscription
      await supabase
        .from("newsletter_subscribers")
        .update({
          prenom,
          nom,
          source_article_slug: source,
          ville_envisagee: villeEnvisagee,
          unsubscribed_at: null,
          // On considère le rapport personnel comme une confirmation explicite
          confirmed_at: new Date().toISOString(),
          consent_ip: consentIp,
          consent_user_agent: consentUa,
        })
        .eq("id", existing.id);
    } else if (!existing.confirmed_at) {
      // Le rapport personnel = double opt-in implicite (user a fourni le quiz +
      // attendra le mail pour le lire). On marque confirmé directement.
      await supabase
        .from("newsletter_subscribers")
        .update({
          prenom,
          nom,
          source_article_slug: source,
          ville_envisagee: villeEnvisagee,
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    }
  } else {
    const { data: created, error: insertErr } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        prenom,
        nom,
        source_article_slug: source,
        ville_envisagee: villeEnvisagee,
        // Le rapport personnel vaut confirmation
        confirmed_at: new Date().toISOString(),
        consent_ip: consentIp,
        consent_user_agent: consentUa,
      })
      .select("id")
      .single();

    if (insertErr || !created) {
      console.error("Supabase insert error:", insertErr);
      return NextResponse.json(
        { error: "Erreur base de données" },
        { status: 500 },
      );
    }
    subscriberId = created.id;
  }

  // 2) Pré-sélection des communes candidates (top 10)
  const candidates = selectCandidateCommunes(SAMPLE_COMMUNES, quizAnswers, 10);
  const compressed = compressCommunesForReport(candidates);
  const budgetM2Max = getBudgetM2Max(quizAnswers);
  const cheapestCandidate = candidates.reduce((min, c) => {
    if (c.prix_m2_median == null) return min;
    if (min == null || c.prix_m2_median < min) return c.prix_m2_median;
    return min;
  }, null as number | null);
  const allOverBudget = cheapestCandidate != null && cheapestCandidate > budgetM2Max * 1.25;

  // 3) Construction du user prompt
  const profilLabel = PROFIL_LABELS[quizAnswers.profil];
  const frequenceLabel = FREQUENCE_LABELS[quizAnswers.frequenceParis];
  const budgetModeLabel = BUDGET_MODE_LABELS[quizAnswers.budgetMode];
  const criteresLabels = quizAnswers.criteresPrioritaires
    .map((c) => CRITERE_LABELS[c].label)
    .join(", ");

  const villeText = (() => {
    const v = quizAnswers.villeEnvisagee;
    if (!v || v === "pas-encore-decide") return "aucune préférence ferme";
    if (v.startsWith("autre:")) return v.replace(/^autre:/, "").trim();
    return v;
  })();

  const userPrompt = `Génère le rapport ultra-personnalisé pour cet utilisateur :

**Identité** : ${prenom}
**Profil** : ${profilLabel} (clé: ${quizAnswers.profil})
**Fréquence Paris** : ${frequenceLabel}
**Temps max trajet acceptable** : ${quizAnswers.tempsMaxParis} minutes
**Budget brut saisi** : ${quizAnswers.budgetValue} € (${budgetModeLabel})${quizAnswers.surfaceVisee ? ` pour ${quizAnswers.surfaceVisee} m²` : ""}
**Budget m² max recommandé** : ${budgetM2Max} €/m² (calculé à partir de la mensualité/loyer × surface visée, sur 20 ans à 4 %)
**Critères prioritaires** (pondérés ×2 dans ton score) : ${criteresLabels}
**Ville envisagée par le user** : ${villeText}
${allOverBudget ? `\n⚠️ **ALERTE BUDGET CONTRAINT** : la commune la moins chère du panier est à ${cheapestCandidate} €/m², au-dessus de ton budget m² max de ${budgetM2Max} €/m². Tu DOIS ouvrir le rapport par un avertissement honnête : "${prenom}, ton budget est très contraint pour ${quizAnswers.surfaceVisee ?? 60}m² en IDF/province." Puis propose la moins chère comme compromis + explique les arbitrages possibles (réduire surface, augmenter mensualité, éloigner trajet).` : ""}

# Communes candidates pré-filtrées (top ${candidates.length}, choisis 3 et classe-les)

Format : INSEE|Nom(CP)|Dept|prix|loyer|trajet|démographie|qualité|GPE

${compressed}

# Instructions

- Choisis 1 ville PRINCIPALE (verdict) + 2 alternatives backup parmi ces ${candidates.length} candidates.
- La ville principale est CELLE qui matche le mieux le profil. Ce n'est pas un top 3, c'est un verdict.
- Pour la ville principale, écris 4-5 puces argumentatives qui CITENT explicitement les chiffres du dataset (prix, trajet, etc.) ET qui font le lien avec les réponses du quiz de ${prenom}. Plus une fenêtre d'achat 2026.
- Pour les 2 backups, écris 60-80 mots chacun, plus court et moins développé que la ville principale (ce sont des plans B, pas des co-vainqueurs).
- Score X/100 cohérent (généralement 70-95).
- Mentionne ${prenom} 4 à 6 fois dans le rapport entier.
- Référence le budget, le temps de trajet ou les critères prioritaires au moins 5 fois.
- Si ${prenom} a indiqué une ville envisagée précise (${villeText}), traite-la en priorité OU explique pourquoi tu la déplaces.

Maintenant, génère le markdown du rapport.`;

  // 4) Appel Claude
  const startedAt = Date.now();
  let reportMarkdown: string;
  let modelUsed = "claude-opus-4-7";

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 4000,
      system: SYSTEM,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Réponse vide du modèle");
    }
    reportMarkdown = textBlock.text.trim();
    modelUsed = response.model;
  } catch (err) {
    console.error("Anthropic generation error:", err);
    // Fallback : on essaye sonnet pour pas perdre le lead
    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: SYSTEM,
        messages: [{ role: "user", content: userPrompt }],
      });
      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("Réponse vide du modèle (fallback)");
      }
      reportMarkdown = textBlock.text.trim();
      modelUsed = response.model;
    } catch (err2) {
      console.error("Anthropic fallback error:", err2);
      return NextResponse.json(
        { error: "Génération du rapport indisponible, réessaie dans 1 minute" },
        { status: 502 },
      );
    }
  }

  const generationMs = Date.now() - startedAt;
  const communesInsee = candidates.slice(0, 3).map((c) => c.code_insee);

  // 5) Save en BDD
  const { data: report, error: reportErr } = await supabase
    .from("personal_reports")
    .insert({
      subscriber_id: subscriberId,
      email,
      prenom,
      nom,
      quiz_answers: quizAnswers,
      report_markdown: reportMarkdown,
      model_used: modelUsed,
      generation_ms: generationMs,
      communes_insee: communesInsee,
    })
    .select("token")
    .single();

  if (reportErr || !report) {
    console.error("Supabase report insert error:", reportErr);
    return NextResponse.json(
      { error: "Erreur sauvegarde du rapport" },
      { status: 500 },
    );
  }

  const token = report.token as string;
  const reportUrl = `${SITE_URL}/mon-rapport/${token}`;

  // 6) Pose le cookie d'unlock
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "1", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  // 7) Brevo : upsert contact (en best-effort)
  let brevoContactId: number | null = null;
  try {
    const { contactId } = await brevoUpsertContact(
      email,
      prenom,
      nom,
      source,
      villeEnvisagee,
    );
    brevoContactId = contactId;
    if (contactId && !existing) {
      await supabase
        .from("newsletter_subscribers")
        .update({ brevo_contact_id: contactId })
        .eq("email", email);
    }
  } catch (err) {
    console.error("Brevo upsert error:", err);
  }

  // 8) Send email via Brevo (template si défini, sinon SMTP transactionnel inline)
  // Stratégie : on tente le template, et en cas d'échec on retombe sur l'inline.
  // Le user a TOUJOURS son rapport accessible via l'URL même si l'email rate.
  let emailSent = false;
  const templateId = Number(process.env.BREVO_TEMPLATE_ID_PERSONAL_REPORT);

  if (templateId && !Number.isNaN(templateId)) {
    try {
      await brevoSendTemplate(
        { email, name: `${prenom} ${nom}`.trim() },
        templateId,
        {
          prenom,
          reportUrl,
          communes: candidates.slice(0, 3).map((c) => c.nom).join(", "),
          ville_envisagee: villeText,
        },
        { tags: ["personal-report", "auto-confirmation"] },
      );
      emailSent = true;
    } catch (err) {
      console.error("Brevo template send error (will fallback inline):", err);
    }
  }

  if (!emailSent) {
    try {
      await sendInlineReportEmail({
        email,
        prenom,
        nom,
        reportUrl,
        reportMarkdown,
      });
      emailSent = true;
    } catch (err) {
      console.error("Brevo inline send error:", err);
    }
  }

  if (emailSent) {
    try {
      await supabase
        .from("personal_reports")
        .update({ email_sent_at: new Date().toISOString() })
        .eq("token", token);
    } catch (err) {
      console.error("Supabase email_sent_at update error:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    token,
    reportUrl,
    communes: candidates.slice(0, 3).map((c) => ({
      insee: c.code_insee,
      nom: c.nom,
    })),
    brevoContactId,
  });
}

/**
 * Envoi inline si pas de template Brevo configuré pour rapport perso.
 * Utilise l'API SMTP de Brevo directement avec un HTML construit côté serveur.
 */
async function sendInlineReportEmail(args: {
  email: string;
  prenom: string;
  nom: string;
  reportUrl: string;
  reportMarkdown: string;
}): Promise<void> {
  const { email, prenom, nom, reportUrl, reportMarkdown } = args;
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL ?? "newsletter@vivre-pres-de-paris.fr";
  const senderName = process.env.BREVO_SENDER_NAME ?? "Vivre près de Paris";

  // Extract verdict ville depuis le markdown (format : "# Ta ville : Vincennes")
  const villeMatch = reportMarkdown.match(/^#\s+Ta\s+ville\s*:\s*(.+?)\s*$/m);
  const villeVerdict = villeMatch ? villeMatch[1].trim() : null;

  const subject = villeVerdict
    ? `${prenom}, ta ville c'est ${villeVerdict} (voici pourquoi)`
    : `${prenom}, ton verdict est tombé`;
  const htmlBody = buildEmailHtml(prenom, reportUrl, villeVerdict);

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      to: [{ email, name: `${prenom} ${nom}`.trim() }],
      sender: { email: senderEmail, name: senderName },
      subject,
      htmlContent: htmlBody,
      tags: ["personal-report", "inline-fallback"],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo inline send failed (${res.status}): ${text}`);
  }
}

function buildEmailHtml(prenom: string, reportUrl: string, villeVerdict: string | null): string {
  const villeHero = villeVerdict ? escapeHtml(villeVerdict) : "Le verdict";
  const heroLine = villeVerdict
    ? `${escapeHtml(prenom)}, ta ville c'est <strong>${villeHero}</strong>.`
    : `${escapeHtml(prenom)}, ton verdict est tombé.`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Ton verdict est tombé</title>
</head>
<body style="margin:0;padding:0;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#52627a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f7fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 24px rgba(82,98,122,0.08);">
          <tr>
            <td style="padding:32px 36px 8px 36px;">
              <p style="margin:0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#9d8cf2;font-weight:600;">Le hack · Ton verdict</p>
              <h1 style="margin:12px 0 0 0;font-size:28px;line-height:1.2;color:#52627a;font-weight:600;">${heroLine}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 36px 0 36px;">
              <p style="margin:0;font-size:15px;line-height:1.6;color:#52627a;">
                Pas de top 10 mou. Une recommandation. <strong>La tienne.</strong> Calculée à partir de TES réponses au quiz (profil, fréquence Paris, budget, critères prioritaires) contre 173 communes.
              </p>
              <p style="margin:12px 0 0 0;font-size:15px;line-height:1.6;color:#52627a;">
                Dans ton verdict tu trouveras :
              </p>
              <ul style="margin:8px 0 0 0;padding-left:20px;font-size:14px;line-height:1.7;color:#52627a;">
                <li><strong>1 ville révélée</strong> (score de match sur 100) avec quartiers, pièges, fenêtre d'achat</li>
                <li><strong>2 alternatives backup</strong> au cas où</li>
                <li>Aucun autre Parisien n'aura le même verdict.</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 36px 32px 36px;text-align:center;">
              <a href="${reportUrl}" style="display:inline-block;background:linear-gradient(135deg,#9d8cf2 0%,#7b6ce3 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:16px;font-weight:600;font-size:15px;box-shadow:0 4px 14px rgba(157,140,242,0.4);">
                ${villeVerdict ? `Voir pourquoi ${villeHero}` : "Voir mon verdict"}
              </a>
              <p style="margin:14px 0 0 0;font-size:12px;color:#9aa3b2;">
                Le lien reste actif. Tu peux y revenir, le partager, ou l'imprimer.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 32px 36px;border-top:1px solid #f0f0f5;">
              <p style="margin:16px 0 0 0;font-size:12px;line-height:1.6;color:#9aa3b2;">
                Tu reçois cet email parce que tu as demandé ton verdict sur vivre-pres-de-paris.fr. 1 email par mois max après celui-ci, désinscription en 1 clic.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
