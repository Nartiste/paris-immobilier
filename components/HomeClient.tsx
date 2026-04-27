"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import CommuneCard from "./CommuneCard";
import CompareView from "./CompareView";
import Concierge from "./Concierge";
import ConciergeButton from "./ConciergeButton";
import { useAppStore } from "@/lib/store";
import type { Commune, GpeStation } from "@/lib/types";

const MapView = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-sm text-neutral-500">
      Chargement de la carte…
    </div>
  ),
});

type Props = {
  /** Contenu SEO server-rendered injecté dans le panneau gauche scrollable */
  leftContent: React.ReactNode;
  /** Contenu CityFooter à la fin du panneau gauche (server-rendered) */
  footerContent: React.ReactNode;
};

/**
 * Layout principal de la home :
 *
 * Desktop (lg+) :
 *   +-----------------------------+
 *   | LEFT scroll | RIGHT map     |
 *   | (480px)     | (sticky)      |
 *   +-----------------------------+
 *
 * Mobile (< lg) :
 *   +----------------+
 *   | Map (50vh)     |
 *   | LEFT content   |
 *   |  (full scroll) |
 *   +----------------+
 *
 * Le contenu SEO (HomeShell, CityFooter) est injecté en server-render via
 * les props leftContent + footerContent → HTML disponible aux crawlers.
 */
export default function HomeClient({ leftContent, footerContent }: Props) {
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [extraCommunes, setExtraCommunes] = useState<Commune[]>([]);
  const [gpeStations, setGpeStations] = useState<GpeStation[]>([]);
  const [flyTo, setFlyTo] = useState<{ lat: number; lon: number; zoom?: number } | null>(null);

  const {
    weights,
    mode,
    profile,
    budgetMax,
    tempsMaxParis,
    showGpe,
    selectedCommuneInsee,
    setSelectedCommune,
    compareCommuneInsee,
    setCompareCommune,
    pendingAddress,
    setPendingAddress,
  } = useAppStore();

  useEffect(() => {
    void (async () => {
      try {
        const [cRes, gRes] = await Promise.all([
          fetch("/api/communes"),
          fetch("/api/gpe"),
        ]);
        const cData = await cRes.json();
        const gData = await gRes.json();
        setCommunes(cData.communes ?? []);
        setGpeStations(gData.stations ?? []);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    })();
  }, []);

  const allCommunes = useMemo(
    () => [...communes, ...extraCommunes],
    [communes, extraCommunes],
  );

  const selectedCommune = useMemo(
    () => allCommunes.find((c) => c.code_insee === selectedCommuneInsee) ?? null,
    [allCommunes, selectedCommuneInsee],
  );

  const compareCommune = useMemo(
    () => allCommunes.find((c) => c.code_insee === compareCommuneInsee) ?? null,
    [allCommunes, compareCommuneInsee],
  );

  const showCompareView =
    !!compareCommune &&
    !!selectedCommune &&
    compareCommune.code_insee !== selectedCommune.code_insee;

  // Réagit aux sélections d'adresse (TopNav search → store → ici)
  useEffect(() => {
    if (!pendingAddress) return;
    const { insee, lat, lon } = pendingAddress;
    setFlyTo({ lat, lon, zoom: 13 });

    if (allCommunes.some((c) => c.code_insee === insee)) {
      setSelectedCommune(insee);
      setPendingAddress(null);
      return;
    }

    void (async () => {
      try {
        const res = await fetch(`/api/commune-lookup?insee=${encodeURIComponent(insee)}`);
        const data = await res.json();
        if (data?.commune) {
          setExtraCommunes((prev) =>
            prev.some((c) => c.code_insee === insee) ? prev : [...prev, data.commune],
          );
          setSelectedCommune(insee);
        }
      } catch (err) {
        console.error("Failed to lookup commune", err);
      } finally {
        setPendingAddress(null);
      }
    })();
  }, [pendingAddress, allCommunes, setSelectedCommune, setPendingAddress]);

  return (
    <div className="lg:relative lg:flex lg:min-h-[calc(100vh-3.5rem)]">
      {/* PANNEAU GAUCHE — content scrollable (server SEO + filters) */}
      <aside className="border-b border-neutral-200 bg-white lg:h-[calc(100vh-3.5rem)] lg:w-[480px] lg:flex-shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        {/* Map mobile : montre la carte juste après le hero */}
        <div className="block h-[50vh] w-full lg:hidden" id="map-mobile">
          <MapView
            communes={allCommunes}
            gpeStations={gpeStations}
            weights={weights}
            mode={mode}
            profile={profile}
            budgetMax={budgetMax}
            tempsMaxParis={tempsMaxParis}
            showGpe={showGpe}
            onSelectCommune={setSelectedCommune}
            flyTo={flyTo}
          />
        </div>

        {/* Contenu SEO server-rendered */}
        {leftContent}

        {/* Filtres interactifs (sliders + GPE toggle) */}
        <section className="border-b border-neutral-100 px-1 py-3" id="filtres">
          <Sidebar />
        </section>

        {/* Footer global avec toutes les villes */}
        {footerContent}
      </aside>

      {/* PANNEAU DROIT — map fixe sticky desktop only */}
      <section
        aria-label="Carte interactive"
        className="sticky top-14 hidden h-[calc(100vh-3.5rem)] flex-1 lg:block"
      >
        <MapView
          communes={allCommunes}
          gpeStations={gpeStations}
          weights={weights}
          mode={mode}
          profile={profile}
          budgetMax={budgetMax}
          tempsMaxParis={tempsMaxParis}
          showGpe={showGpe}
          onSelectCommune={setSelectedCommune}
          flyTo={flyTo}
        />
      </section>

      {/* OVERLAYS — communs aux 2 layouts */}
      {selectedCommune && (
        <CommuneCard
          commune={selectedCommune}
          onClose={() => setSelectedCommune(null)}
        />
      )}

      {showCompareView && selectedCommune && compareCommune && (
        <CompareView
          a={compareCommune}
          b={selectedCommune}
          onClose={() => setCompareCommune(null)}
          onSwap={() => {
            setSelectedCommune(compareCommune.code_insee);
            setCompareCommune(selectedCommune.code_insee);
          }}
        />
      )}

      <ConciergeButton />
      <Concierge
        communes={allCommunes}
        onPickCommune={(insee) => {
          setSelectedCommune(insee);
          const c = allCommunes.find((x) => x.code_insee === insee);
          if (c) setFlyTo({ lat: c.lat, lon: c.lon, zoom: 11 });
        }}
      />
    </div>
  );
}
