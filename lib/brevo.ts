/**
 * Wrapper léger autour de l'API Brevo (v3).
 *
 * Docs : https://developers.brevo.com/reference
 *
 * On n'utilise pas leur SDK officiel car il alourdit le bundle Vercel
 * pour 2 endpoints. Un simple fetch suffit.
 */

const BREVO_API = "https://api.brevo.com/v3";

function getApiKey(): string {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error("BREVO_API_KEY manquante dans .env.local");
  return key;
}

function getListId(): number {
  const id = Number(process.env.BREVO_LIST_ID);
  if (!id || Number.isNaN(id)) {
    throw new Error("BREVO_LIST_ID manquant ou invalide dans .env.local");
  }
  return id;
}

function getSenderEmail(): string {
  return process.env.BREVO_SENDER_EMAIL ?? "newsletter@vivre-pres-de-paris.fr";
}

function getSenderName(): string {
  return process.env.BREVO_SENDER_NAME ?? "Vivre près de Paris";
}

type BrevoContactCreatePayload = {
  email: string;
  attributes?: Record<string, string | number | boolean | null>;
  listIds?: number[];
  updateEnabled?: boolean;
};

/**
 * Crée ou met à jour un contact dans Brevo.
 * Retourne l'ID Brevo (si nouveau) ou null si déjà existant + updateEnabled=true.
 */
export async function brevoUpsertContact(
  email: string,
  prenom: string,
  nom: string,
  sourceArticleSlug: string | null,
): Promise<{ contactId: number | null; alreadyExisted: boolean }> {
  const payload: BrevoContactCreatePayload = {
    email,
    attributes: {
      PRENOM: prenom,
      NOM: nom,
      SOURCE_ARTICLE: sourceArticleSlug ?? "",
    },
    listIds: [getListId()],
    updateEnabled: true,
  };

  const res = await fetch(`${BREVO_API}/contacts`, {
    method: "POST",
    headers: {
      "api-key": getApiKey(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 201) {
    const data = (await res.json()) as { id: number };
    return { contactId: data.id, alreadyExisted: false };
  }
  if (res.status === 204) {
    // Mis à jour (déjà existant)
    return { contactId: null, alreadyExisted: true };
  }
  const text = await res.text();
  throw new Error(`Brevo upsert failed (${res.status}): ${text}`);
}

type BrevoSendTemplatePayload = {
  to: { email: string; name?: string }[];
  templateId: number;
  params?: Record<string, string | number | boolean | null>;
  attachment?: { url: string; name: string }[];
  tags?: string[];
};

/**
 * Envoie un email transactionnel via un template Brevo.
 *
 * Le template est défini côté Brevo (UI > Templates) et référencé par son ID.
 * Cela permet à l'utilisateur de modifier les emails depuis Brevo sans toucher au code.
 *
 * Les variables {{params.X}} dans le template sont remplacées par les valeurs de `params`.
 */
export async function brevoSendTemplate(
  to: { email: string; name?: string },
  templateId: number,
  params: Record<string, string | number | boolean | null>,
  options?: {
    attachment?: { url: string; name: string }[];
    tags?: string[];
  },
): Promise<{ messageId: string }> {
  const payload: BrevoSendTemplatePayload = {
    to: [to],
    templateId,
    params,
    tags: options?.tags,
    attachment: options?.attachment,
  };

  const res = await fetch(`${BREVO_API}/smtp/email`, {
    method: "POST",
    headers: {
      "api-key": getApiKey(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo send template failed (${res.status}): ${text}`);
  }
  const data = (await res.json()) as { messageId: string };
  return data;
}

function getTemplateId(envKey: string): number {
  const id = Number(process.env[envKey]);
  if (!id || Number.isNaN(id)) {
    throw new Error(`${envKey} manquant ou invalide dans .env.local`);
  }
  return id;
}

export function getConfirmationTemplateId(): number {
  return getTemplateId("BREVO_TEMPLATE_ID_CONFIRMATION");
}

export function getWelcomeTemplateId(): number {
  return getTemplateId("BREVO_TEMPLATE_ID_WELCOME");
}

/** Désinscription côté Brevo : retire le contact de la liste et le marque opt-out. */
export async function brevoUnsubscribe(email: string): Promise<void> {
  // Étape 1 : retirer le contact de la liste
  const removeRes = await fetch(
    `${BREVO_API}/contacts/lists/${getListId()}/contacts/remove`,
    {
      method: "POST",
      headers: {
        "api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emails: [email] }),
    },
  );

  if (!removeRes.ok && removeRes.status !== 400) {
    // 400 = pas dans la liste, on s'en fiche
    const text = await removeRes.text();
    console.error(`Brevo remove from list ${removeRes.status}: ${text}`);
  }

  // Étape 2 : marquer le contact comme "emailBlacklisted" pour éviter tout envoi futur
  const blacklistRes = await fetch(
    `${BREVO_API}/contacts/${encodeURIComponent(email)}`,
    {
      method: "PUT",
      headers: {
        "api-key": getApiKey(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailBlacklisted: true }),
    },
  );

  if (!blacklistRes.ok && blacklistRes.status !== 404) {
    const text = await blacklistRes.text();
    console.error(
      `Brevo blacklist ${blacklistRes.status}: ${text}`,
    );
  }
}

export function brevoIsConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_LIST_ID);
}
