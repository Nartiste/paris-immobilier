import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { brevoUnsubscribe } from "@/lib/brevo";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivre-pres-de-paris.fr";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  if (!token || !UUID_RE.test(token)) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/unsubscribe/invalid`);
  }

  const supabase = getSupabaseServer();

  const { data: subscriber, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, unsubscribed_at")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (error || !subscriber) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/unsubscribe/invalid`);
  }

  // Marque comme désinscrit (idempotent)
  if (!subscriber.unsubscribed_at) {
    await supabase
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("id", subscriber.id);

    // Désinscription Brevo (retire de la liste + blacklist)
    try {
      await brevoUnsubscribe(subscriber.email);
    } catch (err) {
      console.error("Brevo unsubscribe error:", err);
    }
  }

  return NextResponse.redirect(`${SITE_URL}/newsletter/unsubscribe/ok`);
}
