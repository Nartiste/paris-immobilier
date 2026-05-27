-- ============================================================================
-- Migration 003 : Personal Reports (AI-Powered Personal Report)
-- À exécuter dans le SQL Editor de Supabase une seule fois.
--
-- Stocke les rapports personnalisés générés par Claude à partir des
-- réponses du quiz d'onboarding. Chaque rapport a une URL persistante
-- /mon-rapport/[token] que le user peut revisiter / partager (effet viral).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS personal_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL DEFAULT '',
  -- Snapshot complet des réponses du quiz (JSONB pour requêtage facile)
  quiz_answers JSONB NOT NULL,
  -- Rapport généré par Claude au format markdown
  report_markdown TEXT NOT NULL,
  -- HTML rendu (optionnel, pour cache)
  report_html TEXT,
  -- Token unique pour URL persistante /mon-rapport/[token]
  token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email_sent_at TIMESTAMPTZ,
  -- Compteur de vues (incrémenté à chaque visite de /mon-rapport/[token])
  views_count INTEGER NOT NULL DEFAULT 0,
  -- Métadonnées génération
  model_used TEXT,
  generation_ms INTEGER,
  -- 3 communes principales sélectionnées (pour stats rapides)
  communes_insee TEXT[] DEFAULT '{}'::TEXT[]
);

CREATE INDEX IF NOT EXISTS idx_personal_reports_token ON personal_reports(token);
CREATE INDEX IF NOT EXISTS idx_personal_reports_email ON personal_reports(email);
CREATE INDEX IF NOT EXISTS idx_personal_reports_created ON personal_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_personal_reports_subscriber ON personal_reports(subscriber_id);

-- RLS strict : seul service_role peut lire/écrire.
-- Les API routes Next.js utilisent le service key et bypass RLS.
ALTER TABLE personal_reports ENABLE ROW LEVEL SECURITY;

-- Vue d'export pour stats (sans le markdown qui est lourd)
-- security_invoker = true : la vue respecte la RLS de la table sous-jacente
-- au lieu de tourner avec les privilèges du créateur. Cf. migration 004.
CREATE OR REPLACE VIEW personal_reports_stats
WITH (security_invoker = true) AS
SELECT
  id,
  email,
  prenom,
  quiz_answers->>'profil' AS profil,
  quiz_answers->>'frequenceParis' AS frequence,
  (quiz_answers->>'budgetValue')::INTEGER AS budget,
  quiz_answers->>'villeEnvisagee' AS ville_envisagee,
  communes_insee,
  views_count,
  created_at,
  email_sent_at,
  CASE WHEN email_sent_at IS NULL THEN 'pending' ELSE 'sent' END AS email_status
FROM personal_reports
ORDER BY created_at DESC;
