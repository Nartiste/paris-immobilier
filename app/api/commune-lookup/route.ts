import { NextResponse } from "next/server";
import type { Commune } from "@/lib/types";

export const revalidate = 86400;

const PARIS_LAT = 48.8566;
const PARIS_LON = 2.3522;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function estimateTravelTimes(distanceKm: number) {
  // Estimation grossière. La voiture suit ~80 km/h hors-IDF, ~40 km/h en proche couronne (trafic).
  // Les TC (RER/Transilien/TGV) sont ~70-150 km/h selon la ligne.
  let voiture: number;
  if (distanceKm <= 5) voiture = Math.round(distanceKm * 4); // intra-Paris
  else if (distanceKm <= 20) voiture = Math.round(15 + (distanceKm - 5) * 2.0); // petite couronne
  else if (distanceKm <= 60) voiture = Math.round(45 + (distanceKm - 20) * 1.0); // grande couronne / IDF élargie
  else voiture = Math.round(85 + (distanceKm - 60) * 0.85); // hors IDF

  let tc: number;
  if (distanceKm <= 3) tc = Math.round(distanceKm * 6); // métro
  else if (distanceKm <= 15) tc = Math.round(15 + distanceKm * 1.5); // RER/Transilien proche
  else if (distanceKm <= 50) tc = Math.round(25 + distanceKm * 0.8); // Transilien/RER long
  else tc = Math.round(45 + distanceKm * 0.4); // TGV/Intercités

  return { voiture, tc };
}

type GeoApiCommune = {
  code: string;
  nom: string;
  codesPostaux?: string[];
  centre?: { coordinates: [number, number] };
  population?: number;
  codeDepartement?: string;
  codeRegion?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const insee = searchParams.get("insee");

  if (!insee) {
    return NextResponse.json({ error: "Missing insee" }, { status: 400 });
  }

  try {
    const url = `https://geo.api.gouv.fr/communes/${insee}?fields=nom,code,codesPostaux,centre,population,codeDepartement,codeRegion&format=json`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: `geo.api.gouv.fr ${res.status}` },
        { status: 502 },
      );
    }
    const data = (await res.json()) as GeoApiCommune;

    const lon = data.centre?.coordinates?.[0] ?? 0;
    const lat = data.centre?.coordinates?.[1] ?? 0;
    const distanceKm = Math.round(
      haversineKm(lat, lon, PARIS_LAT, PARIS_LON) * 10,
    ) / 10;
    const { voiture, tc } = estimateTravelTimes(distanceKm);
    const tempsMin = Math.min(voiture, tc);

    const mode_principal: Commune["mode_principal"] =
      distanceKm > 70 ? "tgv" : distanceKm > 30 ? "transilien" : distanceKm > 10 ? "rer" : "metro";

    const commune: Commune = {
      code_insee: data.code,
      nom: data.nom,
      code_postal: data.codesPostaux?.[0] ?? "",
      departement: data.codeDepartement ?? "",
      region: data.codeRegion ?? "",
      population: data.population ?? 0,
      lat,
      lon,
      prix_m2_median: null,
      prix_m2_evolution_5y: null,
      loyer_m2_median: null,
      rendement_locatif: null,
      revenu_median: null,
      taux_chomage: null,
      nb_transactions: 0,
      temps_trajet_paris_min: tempsMin,
      temps_trajet_tc_min: tc,
      temps_trajet_voiture_min: voiture,
      mode_principal,
      ligne_principale: null,
      distance_paris_km: distanceKm,
      distance_gare_km: null,
      distance_autoroute_km: null,
      nb_commerces: null,
      nb_ecoles: null,
      nb_medecins: null,
      espaces_verts_pct: null,
      taux_criminalite: null,
      bonus_gpe: null,
    };

    return NextResponse.json({ source: "geo.api.gouv.fr", commune });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 502 },
    );
  }
}
