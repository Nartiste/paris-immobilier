"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Hook analytics côté client pour la page rapport personnel.
 * Track la vue + pose le cookie d'unlock (defense in depth, déjà posé par script inline).
 */
export default function RapportAnalytics({ token }: { token: string }) {
  useEffect(() => {
    track("personal_report_view", { token });

    // Pose le cookie d'unlock côté client (en plus du script inline serveur)
    if (typeof document !== "undefined") {
      document.cookie = `vpdp_newsletter_unlocked=1; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  }, [token]);

  return null;
}
