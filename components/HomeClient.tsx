"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Map as MapIcon, X } from "lucide-react";
import Sidebar from "./Sidebar";
import CommuneCard from "./CommuneCard";
import { useAppStore } from "@/lib/store";
import type { Commune, GpeStation } from "@/lib/types";
import { communeToSlug } from "@/lib/slug";

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
 * Layout principal :
 *
 * Desktop (lg+) :
 *   ┌──────────────┬──────────────┐
 *   │ LEFT scroll  │ RIGHT sticky │
 *   │ (~480 px)    │ map          │
 *   └──────────────┴──────────────┘
 *
 * Mobile (< lg) :
 *   ┌──────────────┐
 *   │ Tout en      │
 *   │ scroll       │  (PAS de map embarquée)
 *   │ vertical     │
 *   │ : H1, top10, │
 *   │ filtres,     │
 *   │ footer…      │
 *   └──────────────┘
 *      ┌─────┐  ← bouton flottant
 *      │Carte│   qui ouvre la map en
 *      └─────┘   plein écran
 */
export default function HomeClient({ leftContent, footerContent }: Props) {
  const router = useRouter();
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [extraCommunes, setExtraCommunes] = useState<Commune[]>([]);
  const [gpeStations, setGpeStations] = useState<GpeStation[]>([]);
  const [flyTo, setFlyTo] = useState<{ lat: number; lon: number; zoom?: number } | null>(null);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);

  const {
    weights,
    mode,
    profile,
    budgetMax,
    tempsMaxParis,
    showGpe,
    selectedCommuneInsee,
    setSelectedCommune,
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

  // Réagit aux pendingAddress dispatchés par AddressSearchClient.
  //
  // Note : si la commune est dans notre dataset, AddressSearchClient
  // navigue directement vers /vivre-a/[slug] (jamais de pendingAddress
  // dans ce cas). Donc ici on ne traite QUE les communes hors dataset
  // qui doivent être affichées en card temporaire au-dessus de la map.
  //
  // On NE force PAS l'ouverture du map modal mobile : laisse l'utilisateur
  // garder le contexte du panneau gauche.
  useEffect(() => {
    if (!pendingAddress) return;
    const { insee, lat, lon } = pendingAddress;
    setFlyTo({ lat, lon, zoom: 12 });

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
  }, [pendingAddress, setSelectedCommune, setPendingAddress]);

  // Bloque le scroll body quand le map modal est ouvert
  useEffect(() => {
    if (!mobileMapOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMapOpen]);

  return (
    <div className="lg:relative lg:flex lg:min-h-[calc(100vh-5rem)]">
      {/* PANNEAU GAUCHE — content scrollable (server SEO + filters) */}
      <aside className="scroll-smooth bg-neutral-50 lg:h-[calc(100vh-5rem)] lg:w-[480px] lg:flex-shrink-0 lg:overflow-y-auto lg:border-r lg:border-neutral-200 lg:bg-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-bleu/25 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand-bleu/40 [scrollbar-width:thin] [scrollbar-color:rgba(82,98,122,0.25)_transparent]">
        {leftContent}

        {/* Filtres interactifs */}
        <section
          id="filtres"
          className="border-t border-neutral-100 bg-white px-4 py-6 sm:px-6"
        >
          <h2 className="px-2 text-lg font-semibold text-neutral-900">
            Affine ta recherche
          </h2>
          <p className="mt-1 px-2 text-xs text-neutral-500">
            Pondère les critères selon ce qui compte pour toi.
          </p>
          <div className="mt-4">
            <Sidebar />
          </div>
        </section>

        {footerContent}
      </aside>

      {/* PANNEAU DROIT — desktop : sticky map. Mobile : modal full-screen */}
      <section
        aria-label="Carte interactive"
        className={
          mobileMapOpen
            ? "fixed inset-0 z-50 bg-white"
            : "sticky top-20 hidden h-[calc(100vh-5rem)] flex-1 lg:block"
        }
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
          onSelectCommune={(insee) => {
            // Sur mobile (map en modal full-screen), naviguer direct vers la
            // fiche : la CommuneCard serait masquée derrière le modal sinon.
            if (mobileMapOpen) {
              const c = allCommunes.find((x) => x.code_insee === insee);
              if (c) {
                setMobileMapOpen(false);
                router.push(`/vivre-a/${communeToSlug(c)}`);
                return;
              }
            }
            setSelectedCommune(insee);
          }}
          flyTo={flyTo}
        />
        {mobileMapOpen && (
          <button
            type="button"
            onClick={() => setMobileMapOpen(false)}
            className="absolute right-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-neutral-50 lg:hidden"
            aria-label="Fermer la carte"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </section>

      {/* OVERLAYS */}
      {selectedCommune && (
        <CommuneCard
          commune={selectedCommune}
          onClose={() => setSelectedCommune(null)}
        />
      )}

      {/* Bouton flottant CARTE (mobile only) */}
      {!mobileMapOpen && (
        <button
          type="button"
          onClick={() => setMobileMapOpen(true)}
          className="fixed bottom-5 left-5 z-30 flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-3 text-sm font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform hover:scale-105 lg:hidden"
        >
          <MapIcon className="h-4 w-4" />
          Voir la carte
        </button>
      )}

    </div>
  );
}
