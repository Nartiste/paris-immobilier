import { NextResponse } from "next/server";
import type { Commune } from "@/lib/types";
import { RAIL_BY_INSEE } from "@/lib/rail-data";

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
  let voiture: number;
  if (distanceKm <= 5) voiture = Math.round(distanceKm * 4);
  else if (distanceKm <= 20) voiture = Math.round(15 + (distanceKm - 5) * 2.0);
  else if (distanceKm <= 60) voiture = Math.round(45 + (distanceKm - 20) * 1.0);
  else voiture = Math.round(85 + (distanceKm - 60) * 0.85);

  let tc: number;
  if (distanceKm <= 3) tc = Math.round(distanceKm * 6);
  else if (distanceKm <= 15) tc = Math.round(15 + distanceKm * 1.5);
  else if (distanceKm <= 50) tc = Math.round(25 + distanceKm * 0.8);
  else tc = Math.round(45 + distanceKm * 0.4);

  return { voiture, tc };
}

/**
 * Estimation grossière du prix m² selon le département et la distance Paris.
 * Permet de remplir les données pour les communes hors-seed sans appeler DVF.
 * Source : MeilleursAgents avril 2026, médianes par département.
 */
function estimatePrices(dept: string, distanceKm: number) {
  const deptDefaults: Record<string, { prix: number; loyer: number; revenu: number; chomage: number }> = {
    "75": { prix: 10500, loyer: 32, revenu: 30000, chomage: 7.5 },
    "92": { prix: 7400, loyer: 24, revenu: 32000, chomage: 7.0 },
    "93": { prix: 4200, loyer: 19, revenu: 19500, chomage: 13.0 },
    "94": { prix: 5900, loyer: 21, revenu: 24500, chomage: 9.5 },
    "78": { prix: 4500, loyer: 17, revenu: 28000, chomage: 7.5 },
    "91": { prix: 3700, loyer: 16, revenu: 26500, chomage: 8.0 },
    "95": { prix: 3500, loyer: 16, revenu: 24500, chomage: 9.5 },
    "77": { prix: 3300, loyer: 15, revenu: 26000, chomage: 8.5 },
    "60": { prix: 2400, loyer: 12, revenu: 22500, chomage: 9.0 },
    "27": { prix: 2100, loyer: 11, revenu: 22000, chomage: 9.5 },
    "28": { prix: 2200, loyer: 11, revenu: 23000, chomage: 8.0 },
    "45": { prix: 2300, loyer: 12, revenu: 23000, chomage: 8.5 },
    "89": { prix: 1800, loyer: 10, revenu: 21000, chomage: 9.0 },
  };
  const def = deptDefaults[dept] ?? { prix: 2200, loyer: 11, revenu: 22000, chomage: 9.0 };

  let prixFactor = 1;
  if (dept === "75" || dept === "92" || dept === "93" || dept === "94") {
    if (distanceKm < 5) prixFactor = 1.15;
    else if (distanceKm < 10) prixFactor = 1.0;
    else prixFactor = 0.85;
  }

  return {
    prix_m2_median: Math.round(def.prix * prixFactor),
    loyer_m2_median: Math.round(def.loyer * prixFactor * 10) / 10,
    revenu_median: def.revenu,
    taux_chomage: def.chomage,
    rendement_locatif: Math.round(((def.loyer * 12) / (def.prix * prixFactor)) * 1000) / 10,
  };
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

    const { voiture, tc: tcEstimated } = estimateTravelTimes(distanceKm);

    const rail = RAIL_BY_INSEE[insee];
    const tc = rail ? rail.minutes : tcEstimated;
    const tempsMin = Math.min(voiture, tc);

    let mode_principal: Commune["mode_principal"];
    let ligne_principale: string | null = null;

    if (rail) {
      const t = rail.type.toLowerCase();
      mode_principal = (t === "tgv" || t === "intercités" ? "tgv" :
        t === "transilien" ? "transilien" :
        t === "rer" ? "rer" : "transilien") as Commune["mode_principal"];
      ligne_principale = rail.ligne;
    } else {
      mode_principal = distanceKm > 70 ? "tgv" : distanceKm > 30 ? "transilien" : distanceKm > 10 ? "rer" : "metro";
    }

    const dept = data.codeDepartement ?? "";
    const prices = estimatePrices(dept, distanceKm);

    const commune: Commune = {
      code_insee: data.code,
      nom: data.nom,
      code_postal: data.codesPostaux?.[0] ?? "",
      departement: dept,
      region: data.codeRegion ?? "",
      population: data.population ?? 0,
      lat,
      lon,
      prix_m2_median: prices.prix_m2_median,
      prix_m2_evolution_5y: 0,
      loyer_m2_median: prices.loyer_m2_median,
      rendement_locatif: prices.rendement_locatif,
      revenu_median: prices.revenu_median,
      taux_chomage: prices.taux_chomage,
      nb_transactions: 0,
      temps_trajet_paris_min: tempsMin,
      temps_trajet_tc_min: tc,
      temps_trajet_voiture_min: voiture,
      mode_principal,
      ligne_principale,
      distance_paris_km: distanceKm,
      distance_gare_km: rail ? 0.5 : null,
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
