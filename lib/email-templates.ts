/**
 * Templates HTML pour les emails newsletter.
 *
 * Style : email-safe (tableaux inline, couleurs hexa, fonts système avec fallback).
 * Tous les liens doivent être absolus.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

const COLORS = {
  bleu: "#52627A",
  iris: "#9D8CF2",
  irisStrong: "#7A6BD1",
  irisSoft: "#EFEBFF",
  vertSoft: "#E8F0EC",
  textDark: "#1A1A1A",
  textMuted: "#6B7280",
  bgLight: "#FAFAFA",
};

function shell(title: string, body: string, ctaLabel?: string, ctaUrl?: string): string {
  const cta = ctaLabel && ctaUrl
    ? `
      <tr>
        <td align="center" style="padding: 24px 0 12px 0;">
          <a href="${ctaUrl}" style="display: inline-block; padding: 14px 28px; background-color: ${COLORS.bleu}; color: #ffffff; text-decoration: none; border-radius: 16px; font-weight: 600; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            ${ctaLabel}
          </a>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.bgLight}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${COLORS.bgLight};">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(82, 98, 122, 0.08);">

          <!-- Header avec dégradé -->
          <tr>
            <td style="background: linear-gradient(135deg, ${COLORS.irisSoft} 0%, #ffffff 50%, ${COLORS.vertSoft} 100%); padding: 32px 32px 24px 32px;">
              <p style="margin: 0; color: ${COLORS.bleu}; font-size: 24px; font-weight: 500; font-family: Georgia, serif; letter-spacing: -0.02em;">
                Vivre <span style="color: ${COLORS.iris}; font-style: italic;">près</span> de Paris
              </p>
              <p style="margin: 4px 0 0 0; color: ${COLORS.bleu}; opacity: 0.6; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em;">
                Trouver où s'installer
              </p>
            </td>
          </tr>

          <!-- Corps -->
          <tr>
            <td style="padding: 32px;">
              ${body}
              ${cta}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${COLORS.bgLight}; padding: 24px 32px; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 12px; line-height: 1.6;">
                Tu reçois cet email parce que tu as téléchargé un guide depuis <a href="${SITE_URL}" style="color: ${COLORS.irisStrong}; text-decoration: none;">vivre-pres-de-paris.fr</a>. Conformément au RGPD, tu peux te désinscrire en un clic à tout moment depuis le lien en bas de chaque email.
              </p>
              <p style="margin: 12px 0 0 0; color: ${COLORS.textMuted}; font-size: 12px;">
                © ${new Date().getFullYear()} Vivre près de Paris · Prception · contact@prception.co
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

/** Email de confirmation (double opt-in). */
export function emailConfirmation(prenom: string, confirmUrl: string): string {
  const body = `
    <p style="margin: 0 0 16px 0; color: ${COLORS.textDark}; font-size: 22px; font-weight: 600; line-height: 1.3;">
      Confirme ton inscription, ${prenom}
    </p>
    <p style="margin: 0 0 16px 0; color: ${COLORS.textDark}; font-size: 15px; line-height: 1.7;">
      Tu viens de demander à recevoir le <strong>Top 10 des villes pour quitter Paris en 2026</strong>. Avant de t'envoyer le guide complet, j'ai juste besoin que tu confirmes ton adresse email pour respecter le RGPD.
    </p>
    <p style="margin: 0 0 16px 0; color: ${COLORS.textDark}; font-size: 15px; line-height: 1.7;">
      Un clic sur le bouton ci-dessous et tu reçois immédiatement le guide complet par email, avec le PDF à imprimer.
    </p>
  `;
  return shell(
    "Confirme ton inscription — Vivre près de Paris",
    body,
    "Je confirme et je reçois le Top 10",
    confirmUrl,
  );
}

/** Email de bienvenue avec lead magnet (Top 10). */
export function emailWelcome(
  prenom: string,
  articleUrl: string,
  unsubscribeUrl: string,
  pdfUrl: string,
): string {
  const body = `
    <p style="margin: 0 0 16px 0; color: ${COLORS.textDark}; font-size: 22px; font-weight: 600; line-height: 1.3;">
      Le voilà, ${prenom}
    </p>
    <p style="margin: 0 0 16px 0; color: ${COLORS.textDark}; font-size: 15px; line-height: 1.7;">
      Comme promis, voici le <strong>Top 10 des villes pour quitter Paris en 2026</strong>, à lire en ligne ou en PDF. C'est le résultat de plusieurs mois d'analyse sur 80 communes, croisant prix DVF, temps de trajet, qualité de vie, écoles et perspectives Grand Paris Express.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0;">
      <tr>
        <td style="background: linear-gradient(135deg, ${COLORS.irisSoft} 0%, ${COLORS.vertSoft} 100%); padding: 24px; border-radius: 20px;">
          <p style="margin: 0 0 8px 0; color: ${COLORS.bleu}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 600;">
            Ton guide
          </p>
          <p style="margin: 0 0 16px 0; color: ${COLORS.bleu}; font-size: 18px; font-weight: 600; line-height: 1.4;">
            Top 10 des villes pour quitter Paris en 2026
          </p>
          <p style="margin: 0; color: ${COLORS.bleu}; opacity: 0.8; font-size: 14px; line-height: 1.6;">
            Mâcon, Reims, Saint-Germain-en-Laye, Mantes-la-Jolie, Versailles, Vincennes, Tours, Champigny-sur-Marne, Cergy, Massy. Avec pour chacune : prix m², trajet, profil cible, et les arbitrages à connaître.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 8px 0; color: ${COLORS.textDark}; font-size: 14px; line-height: 1.7;">
      Deux formats à ta disposition :
    </p>
    <ul style="margin: 0 0 24px 0; padding-left: 20px; color: ${COLORS.textDark}; font-size: 14px; line-height: 1.8;">
      <li><a href="${articleUrl}" style="color: ${COLORS.irisStrong}; text-decoration: none;"><strong>Lire en ligne</strong></a> — version interactive avec liens vers les fiches communes et carte</li>
      <li><a href="${pdfUrl}" style="color: ${COLORS.irisStrong}; text-decoration: none;"><strong>Télécharger le PDF</strong></a> — pour lire offline ou imprimer (en pièce jointe aussi)</li>
    </ul>

    <p style="margin: 24px 0 16px 0; color: ${COLORS.textDark}; font-size: 15px; line-height: 1.7;">
      Et ensuite, ce que tu recevras :
    </p>
    <p style="margin: 0 0 8px 0; color: ${COLORS.textDark}; font-size: 14px; line-height: 1.7;">
      1 email par mois maximum, avec les meilleures analyses du moment : nouvelles communes étudiées, évolutions de prix, alertes Grand Paris Express, profils émergents. Rien d'autre. Tu peux te désinscrire en un clic à tout moment.
    </p>

    <p style="margin: 32px 0 0 0; color: ${COLORS.textDark}; font-size: 15px; line-height: 1.7;">
      À très vite,<br>
      <strong style="color: ${COLORS.bleu};">L'équipe Vivre près de Paris</strong>
    </p>

    <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #E5E7EB;">

    <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 11px; line-height: 1.6;">
      Tu ne souhaites plus recevoir nos emails ? <a href="${unsubscribeUrl}" style="color: ${COLORS.textMuted}; text-decoration: underline;">Désinscris-toi en un clic</a>.
    </p>
  `;

  return shell(
    "Ton Top 10 des villes pour quitter Paris — Vivre près de Paris",
    body,
    "Lire le Top 10 en ligne",
    articleUrl,
  );
}
