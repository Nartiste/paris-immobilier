"use client";

import AddressSearch from "./AddressSearch";
import { useAppStore } from "@/lib/store";

/**
 * Wrapper de AddressSearch qui dispatche la sélection au store global,
 * sans avoir besoin d'un prop `onSelect`. Utilisable depuis n'importe où
 * (TopNav, sidebar, etc.) — HomeClient écoute le store pour réagir.
 */
export default function AddressSearchClient() {
  const { setPendingAddress } = useAppStore();
  return (
    <AddressSearch
      onSelect={(f) => {
        if (!f.citycode) return;
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
