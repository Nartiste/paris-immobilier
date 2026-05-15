import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase";
import { brevoSendTemplate, getWelcomeTemplateId } from "@/lib/brevo";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

const TOP_10_SLUG = "top-10-villes-pour-quitter-paris-2026";
const TOP_10_PDF = `${SITE_URL}/downloads/top-10-quitter-paris-2026.pdf`;
const COOKIE_NAME = "vpdp_newsletter_unlocked";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  if (!token || !UUID_RE.test(token)) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/confirm/invalid`);
  }

  const supabase = getSupabaseServer();

  const { data: subscriber, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, prenom, nom, confirmed_at, unsubscribed_at, unsubscribe_token")
    .eq("confirm_token", token)
    .maybeSingle();

  if (error || !subscriber) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/confirm/invalid`);
  }

  if (subscriber.unsubscribed_at) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/confirm/invalid`);
  }

  // Marque comme confirmé (idempotent)
  if (!subscriber.confirmed_at) {
    const { error: updateErr } = await supabase
      .from("newsletter_subscribers")
      .update({ confirmed_at: new Date().toISOString() })
      .eq("id", subscriber.id);

    if (updateErr) {
      console.error("Supabase confirm error:", updateErr);
    }

    // Envoie le mail de bienvenue via template Brevo + PDF en pièce jointe
    const articleUrl = `${SITE_URL}/blog/${TOP_10_SLUG}`;
    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe/${subscriber.unsubscribe_token}`;

    try {
      await brevoSendTemplate(
        { email: subscriber.email, name: `${subscriber.prenom} ${subscriber.nom}` },
        getWelcomeTemplateId(),
        {
          prenom: subscriber.prenom,
          articleUrl,
          unsubscribeUrl,
          pdfUrl: TOP_10_PDF,
        },
        {
          attachment: [
            { url: TOP_10_PDF, name: "Top-10-quitter-paris-2026.pdf" },
          ],
          tags: ["welcome", "top-10"],
        },
      );
    } catch (err) {
      console.error("Brevo send welcome error:", err);
      // On ne fail pas : la confirmation est validée même si le mail rate
    }
  }

  // Pose le cookie d'unlock (au cas où il aurait expiré ou changé de device)
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "1", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return NextResponse.redirect(`${SITE_URL}/newsletter/confirm/ok`);
}
