import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Capture d'email "early access Premium". Stocke en mémoire process pour le
 * MVP. À remplacer par Resend/Loops/SendGrid + Supabase quand le volume monte.
 */

const memory: { email: string; ts: number; insee?: string }[] = [];

function isValidEmail(s: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s) && s.length < 200;
}

export async function POST(request: Request) {
  try {
    const { email, source } = (await request.json()) as { email: string; source?: string };
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    memory.push({ email, ts: Date.now(), insee: source });
    // En prod, forward to Loops / Resend / Mailchimp ici.
    // await fetch("https://app.loops.so/api/v1/contacts/create", { ... })
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function GET() {
  // Simple endpoint admin. Protéger avec un secret en prod.
  return NextResponse.json({ count: memory.length });
}
