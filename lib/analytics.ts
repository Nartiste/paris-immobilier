/**
 * Analytique double-feed : Plausible (RGPD-friendly) + Google Tag Manager.
 *
 * Plausible : si NEXT_PUBLIC_PLAUSIBLE_DOMAIN est défini.
 * GTM       : si NEXT_PUBLIC_GTM_ID est défini (cf. layout.tsx). Les events
 *             sont pushés sur window.dataLayer ; un trigger "Custom Event"
 *             dans GTM peut les router vers GA4, Meta Pixel, etc.
 */

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
    dataLayer?: Array<Record<string, unknown>>;
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
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...(props ?? {}) });
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, props);
  }
}
