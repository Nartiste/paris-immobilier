"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import AddressSearch from "./AddressSearch";
import CommuneCard from "./CommuneCard";
import CompareView from "./CompareView";
import TopRanking from "./TopRanking";
import { useAppStore } from "@/lib/store";
import type { Commune, GpeStation, AddressFeature } from "@/lib/types";

const MapView = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-sm text-neutral-500">
      Chargement de la carte…
    </div>
  ),
});

export default function HomeClient() {
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [extraCommunes, setExtraCommunes] = useState<Commune[]>([]);
  const [gpeStations, setGpeStations] = useState<GpeStation[]>([]);
  const [flyTo, setFlyTo] = useState<{ lat: number; lon: number; zoom?: number } | null>(null);
  const [dataSource, setDataSource] = useState<string>("loading");
  const [lookupLoading, setLookupLoading] = useState(false);

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
    isPickingCompare,
    setPickingCompare,
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
        setDataSource(cData.source ?? "unknown");
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
    compareCommune.code_insee !== selectedCommune.code_insee &&
    !isPickingCompare;

  const handleAddressSelect = async (f: AddressFeature) => {
    setFlyTo({ lat: f.lat, lon: f.lon, zoom: 13 });
    const insee = f.citycode;
    if (!insee) return;

    if (allCommunes.some((c) => c.code_insee === insee)) {
      setSelectedCommune(insee);
      return;
    }

    setLookupLoading(true);
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
      setLookupLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="hidden w-[320px] flex-shrink-0 lg:block">
        <Sidebar />
      </div>

      <main className="relative flex-1 overflow-hidden">
        <header className="absolute left-0 right-0 top-0 z-40 flex items-center gap-3 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white text-xs font-bold">
              PI
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-neutral-900">
                Paris Immobilier
              </h1>
              <p className="text-[10px] text-neutral-500">
                Trouvez la meilleure commune en France
              </p>
            </div>
          </div>
          <div className="flex-1 max-w-xl">
            <AddressSearch onSelect={handleAddressSelect} loading={lookupLoading} />
          </div>
          <div className="hidden items-center gap-1 text-[10px] text-neutral-400 xl:flex">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                dataSource === "supabase"
                  ? "bg-emerald-500"
                  : dataSource === "sample"
                    ? "bg-amber-500"
                    : "bg-neutral-300"
              }`}
            />
            <span>
              {dataSource === "supabase"
                ? "Supabase"
                : dataSource === "sample"
                  ? "Échantillon"
                  : "…"}
            </span>
          </div>
        </header>

        <div className="absolute inset-0 pt-[60px]">
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

          {selectedCommune && (
            <div className="pointer-events-auto">
              <CommuneCard
                commune={selectedCommune}
                onClose={() => setSelectedCommune(null)}
              />
            </div>
          )}

          {showCompareView && selectedCommune && compareCommune && (
            <CompareView
              a={compareCommune}
              b={selectedCommune}
              onClose={() => {
                setCompareCommune(null);
                setPickingCompare(false);
              }}
              onSwap={() => {
                setSelectedCommune(compareCommune.code_insee);
                setCompareCommune(selectedCommune.code_insee);
              }}
            />
          )}

          {allCommunes.length > 0 && (
            <div className="pointer-events-auto">
              <TopRanking
                communes={allCommunes}
                weights={weights}
                mode={mode}
                profile={profile}
                budgetMax={budgetMax}
                tempsMaxParis={tempsMaxParis}
                onSelect={(insee) => {
                  setSelectedCommune(insee);
                  const c = allCommunes.find((x) => x.code_insee === insee);
                  if (c) setFlyTo({ lat: c.lat, lon: c.lon, zoom: 11 });
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
