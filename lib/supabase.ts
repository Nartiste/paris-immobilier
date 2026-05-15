import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Client Supabase server-only avec service_role (bypass RLS).
 * À utiliser UNIQUEMENT dans les API routes / Server Actions.
 * NE JAMAIS importer ce client depuis un composant client.
 */
let serverClient: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
  if (serverClient) return serverClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL manquante");
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY manquante");

  serverClient = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return serverClient;
}

/** Type miroir de la table newsletter_subscribers. */
export type NewsletterSubscriber = {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  source_article_slug: string | null;
  brevo_contact_id: number | null;
  created_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  confirm_token: string;
  unsubscribe_token: string;
  consent_ip: string | null;
  consent_user_agent: string | null;
};
