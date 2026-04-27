/**
 * Analytique légère, compatible Plausible (RGPD-friendly).
 *
 * Si Plausible est chargé via une balise script (cf. layout.tsx), on
 * pousse les events custom. Sinon, on log dans la console pour le dev.
 *
 * Pour activer en prod : ajouter NEXT_PUBLIC_PLAUSIBLE_DOMAIN=paris-immo.fr
 * et le script <script defer data-domain="..." src="https://plausible.io/js/script.js" />
 */

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
  }
}

export type AnalyticsEvent =
  | "compare_open"
  | "compare_swap"
  | "compare_limit_reached"
  | "monetize_cta_click"
  | "concierge_open"
  | "concierge_message"
  | "concierge_recommendation"
  | "premium_view_pricing"
  | "premium_signup_intent"
  | "seo_page_view";

export function track(event: AnalyticsEvent, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  if (typeof window.plausible === "function") {
    window.plausible(event, props ? { props } : undefined);
  } else if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, props);
  }
}
