import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase";
import { brevoUpsertContact, brevoSendEmail } from "@/lib/brevo";
import { emailConfirmation } from "@/lib/email-templates";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

const COOKIE_NAME = "vpdp_newsletter_unlocked";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: {
    prenom?: string;
    nom?: string;
    email?: string;
    source_article_slug?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const prenom = (body.prenom ?? "").trim();
  const nom = (body.nom ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const sourceSlug = body.source_article_slug?.trim() || null;

  if (!prenom || prenom.length > 80) {
    return NextResponse.json({ error: "Prénom invalide" }, { status: 400 });
  }
  if (!nom || nom.length > 80) {
    return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  // Métadonnées RGPD : IP + UA
  const reqHeaders = await headers();
  const consentIp =
    reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() ??
    reqHeaders.get("x-real-ip") ??
    null;
  const consentUa = reqHeaders.get("user-agent") ?? null;

  const supabase = getSupabaseServer();

  // Upsert dans Supabase : si déjà existant et confirmed, on renvoie OK direct.
  // Si existant mais pas confirmé, on relance l'email de confirmation.
  // Si nouveau, on insère.
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, confirmed_at, unsubscribed_at, confirm_token")
    .eq("email", email)
    .maybeSingle();

  let confirmToken: string;
  let isNewSubscriber = false;

  if (existing) {
    confirmToken = existing.confirm_token;

    if (existing.unsubscribed_at) {
      // Réinscription après désinscription : on remet à zéro
      const { error: updateErr } = await supabase
        .from("newsletter_subscribers")
        .update({
          prenom,
          nom,
          source_article_slug: sourceSlug,
          unsubscribed_at: null,
          confirmed_at: null,
          consent_ip: consentIp,
          consent_user_agent: consentUa,
        })
        .eq("id", existing.id);

      if (updateErr) {
        console.error("Supabase update (resub) error:", updateErr);
        return NextResponse.json(
          { error: "Erreur base de données" },
          { status: 500 },
        );
      }
    } else if (!existing.confirmed_at) {
      // Toujours pas confirmé, on met juste à jour les infos
      await supabase
        .from("newsletter_subscribers")
        .update({ prenom, nom, source_article_slug: sourceSlug })
        .eq("id", existing.id);
    }
    // Sinon (déjà confirmé) : on renvoie OK direct sans rien faire de plus
  } else {
    // Nouveau : insert
    const { data: created, error: insertErr } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        prenom,
        nom,
        source_article_slug: sourceSlug,
        consent_ip: consentIp,
        consent_user_agent: consentUa,
      })
      .select("confirm_token")
      .single();

    if (insertErr || !created) {
      console.error("Supabase insert error:", insertErr);
      return NextResponse.json(
        { error: "Erreur base de données" },
        { status: 500 },
      );
    }
    confirmToken = created.confirm_token;
    isNewSubscriber = true;
  }

  // Pose le cookie d'unlock (UX immédiate)
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "1", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  // Si déjà confirmé : pas besoin de renvoyer un email de confirmation
  if (existing?.confirmed_at && !existing.unsubscribed_at) {
    return NextResponse.json({ ok: true, alreadyConfirmed: true });
  }

  // Sinon : envoie l'email de double opt-in
  const confirmUrl = `${SITE_URL}/api/newsletter/confirm/${confirmToken}`;
  const html = emailConfirmation(prenom, confirmUrl);

  try {
    await brevoSendEmail(
      { email, name: `${prenom} ${nom}` },
      "Confirme ton inscription pour recevoir le Top 10",
      html,
      { tags: ["confirmation", "newsletter"] },
    );
  } catch (err) {
    console.error("Brevo send confirmation error:", err);
    // On ne fail PAS la requête côté user : l'inscription en DB est faite.
    // On log pour qu'on puisse renvoyer manuellement si nécessaire.
  }

  // Brevo upsert (contact créé mais pas encore dans la liste active tant que pas confirmé)
  // En réalité on l'ajoute à la liste tout de suite pour qu'il apparaisse dans Brevo,
  // mais avec attribute CONFIRMED=false, et on switch à true au moment de la confirmation.
  try {
    const { contactId } = await brevoUpsertContact(email, prenom, nom, sourceSlug);
    if (contactId && isNewSubscriber) {
      await supabase
        .from("newsletter_subscribers")
        .update({ brevo_contact_id: contactId })
        .eq("email", email);
    }
  } catch (err) {
    console.error("Brevo upsert contact error:", err);
  }

  return NextResponse.json({ ok: true });
}
