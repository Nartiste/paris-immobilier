"use client";

import { useRouter } from "next/navigation";
import AddressSearch from "./AddressSearch";
import { useAppStore } from "@/lib/store";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";
import { communeToSlug } from "@/lib/slug";

/**
 * Wrapper de AddressSearch.
 *
 * Comportement attendu :
 *  • Si la commune sélectionnée fait partie du dataset → navigue
 *    directement vers /vivre-a/[slug] (UX meilleursagents).
 *  • Sinon (commune non couverte) → dispatche au store pour que la home
 *    fly-to la carte et lookup une fiche temporaire via /api/commune-lookup.
 */
export default function AddressSearchClient() {
  const router = useRouter();
  const { setPendingAddress } = useAppStore();

  return (
    <AddressSearch
      onSelect={(f) => {
        if (!f.citycode) return;

        // Cas 1 : commune dans notre dataset → fiche complète /vivre-a/[slug]
        const c = SAMPLE_COMMUNES.find((x) => x.code_insee === f.citycode);
        if (c) {
          router.push(`/vivre-a/${communeToSlug(c)}`);
          return;
        }

        // Cas 2 : commune hors dataset → fly map + commune-lookup temporaire
        setPendingAddress({
          insee: f.citycode,
          lat: f.lat,
          lon: f.lon,
          label: f.label,
        });
      }}
    />
  );
}
