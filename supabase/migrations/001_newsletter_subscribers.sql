-- ============================================================================
-- Migration 001 : Newsletter subscribers
-- À exécuter dans le SQL Editor de Supabase une seule fois.
-- ============================================================================

-- Extension pgcrypto pour gen_random_uuid() (souvent déjà activée)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table principale des abonnés newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  -- Provenance : quel article a déclenché l'opt-in
  source_article_slug TEXT,
  -- Brevo contact ID (rempli après création dans Brevo)
  brevo_contact_id BIGINT UNIQUE,
  -- Timestamps cycle de vie
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  -- Tokens uniques pour confirmation et désinscription (envoyés dans les mails)
  confirm_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  -- Métadonnées RGPD
  consent_ip INET,
  consent_user_agent TEXT
);

-- Index utiles
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_confirmed ON newsletter_subscribers(confirmed_at) WHERE confirmed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscribers_confirm_token ON newsletter_subscribers(confirm_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_unsubscribe_token ON newsletter_subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON newsletter_subscribers(created_at DESC);

-- RLS : on ferme tout par défaut. Seul le service_role (côté serveur) peut lire/écrire.
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Pas de policy pour anon → impossible d'accéder côté client. Seul le service_role
-- (utilisé dans les API routes Next.js) bypass RLS et peut tout faire.

-- Vue d'export pour l'admin (CSV ready)
CREATE OR REPLACE VIEW newsletter_subscribers_export AS
SELECT
  email,
  prenom,
  nom,
  source_article_slug,
  created_at,
  confirmed_at,
  unsubscribed_at,
  CASE
    WHEN unsubscribed_at IS NOT NULL THEN 'unsubscribed'
    WHEN confirmed_at IS NOT NULL THEN 'confirmed'
    ELSE 'pending'
  END AS status
FROM newsletter_subscribers
ORDER BY created_at DESC;
