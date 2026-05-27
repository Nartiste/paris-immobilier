-- =============================================================================
-- 004_security_fixes.sql
-- Corrections des 4 alertes Security Advisor Supabase (mai 2026)
-- =============================================================================
--
-- Ce fichier résout :
--   1. 3 vues marquées SECURITY DEFINER → conversion en SECURITY INVOKER
--   2. spatial_ref_sys (table PostGIS) sans RLS → RLS + policy SELECT publique
--
-- À exécuter manuellement dans le SQL Editor Supabase
-- (Dashboard → SQL Editor → New Query → coller le contenu → Run).
--
-- Après exécution : Advisors → Security Advisor → Refresh.
-- Les 4 erreurs devraient disparaître.
--
-- =============================================================================
-- 1) Vues : SECURITY DEFINER → SECURITY INVOKER
-- =============================================================================
-- Une vue SECURITY DEFINER s'exécute avec les privilèges du créateur (postgres,
-- superuser), ce qui contourne la RLS des tables sous-jacentes. C'est dangereux :
-- si la vue est accessible via anon key, n'importe qui peut potentiellement lire
-- des données qu'il ne devrait pas voir.
--
-- SECURITY INVOKER s'exécute avec les privilèges de l'appelant, respecte la RLS.
-- C'est le comportement attendu pour des vues "admin export" comme les nôtres.
--
-- Note : si une de ces vues est appelée via le service_role (côté serveur API),
-- la RLS reste bypassée comme avant. Aucun impact côté code applicatif.

ALTER VIEW IF EXISTS public.newsletter_subscribers_export
  SET (security_invoker = true);

ALTER VIEW IF EXISTS public.personal_reports_stats
  SET (security_invoker = true);

-- communes_public n'existe pas dans nos migrations versionnées (créée via
-- dashboard ?). On l'altère uniquement si elle existe.
ALTER VIEW IF EXISTS public.communes_public
  SET (security_invoker = true);

-- =============================================================================
-- 2) spatial_ref_sys : NE PAS exécuter en SQL (limitation Supabase)
-- =============================================================================
-- spatial_ref_sys est une table de référence PostGIS qui contient les
-- définitions de projections SRID. Elle est OWNED BY postgres (superuser créé
-- par l'extension PostGIS), donc le rôle utilisé par le SQL Editor du
-- dashboard ne peut pas l'ALTER → ERROR 42501 "must be owner of table".
--
-- C'est un faux positif du linter Supabase, documenté comme tel :
--   - La table ne contient AUCUNE donnée sensible (c'est la liste mondiale
--     des projections géographiques, identique sur tous les projets PostGIS).
--   - Aucun rôle non-superuser n'a INSERT/UPDATE/DELETE dessus.
--   - Le risque flaggé par "RLS Disabled in Public" n'existe pas concrètement.
--
-- À faire à la place : Dashboard Supabase → Advisors → Security Advisor →
-- clique sur la ligne 'spatial_ref_sys' → bouton 'Mute' / 'Ignore this lint'.
-- L'alerte disparaît proprement sans toucher à l'extension PostGIS.
--
-- Ne PAS exécuter le bloc ci-dessous (laissé en commentaire pour traçabilité) :
--
-- ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Public read access to spatial_ref_sys"
--   ON public.spatial_ref_sys;
-- CREATE POLICY "Public read access to spatial_ref_sys"
--   ON public.spatial_ref_sys
--   FOR SELECT
--   USING (true);

-- =============================================================================
-- Vérification (optionnel, à lancer après le bloc ci-dessus)
-- =============================================================================
-- SELECT schemaname, viewname,
--        viewoptions
-- FROM pg_views
-- WHERE schemaname = 'public'
--   AND viewname IN ('newsletter_subscribers_export', 'personal_reports_stats', 'communes_public');
--
-- SELECT relname, relrowsecurity
-- FROM pg_class
-- WHERE relname = 'spatial_ref_sys';
-- =============================================================================
