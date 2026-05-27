-- ============================================================================
-- Migration 002 : Ajoute la colonne ville_envisagee à newsletter_subscribers
-- À exécuter dans le SQL Editor de Supabase une seule fois.
--
-- Cette colonne stocke la réponse à la question "Quelle ville envisages-tu ?"
-- du quiz d'onboarding (étape 6). Utilisée pour la pré-qualification des leads.
-- ============================================================================

ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS ville_envisagee TEXT;

-- Index si on souhaite faire des stats de regroupement
CREATE INDEX IF NOT EXISTS idx_subscribers_ville_envisagee
  ON newsletter_subscribers(ville_envisagee)
  WHERE ville_envisagee IS NOT NULL;

-- Mettre à jour la vue d'export pour inclure la nouvelle colonne.
-- DROP puis CREATE car CREATE OR REPLACE refuse de réordonner les colonnes existantes.
DROP VIEW IF EXISTS newsletter_subscribers_export;

-- security_invoker = true : la vue respecte la RLS de la table sous-jacente
-- au lieu de tourner avec les privilèges du créateur. Cf. migration 004.
CREATE VIEW newsletter_subscribers_export
WITH (security_invoker = true) AS
SELECT
  email,
  prenom,
  nom,
  source_article_slug,
  ville_envisagee,
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
