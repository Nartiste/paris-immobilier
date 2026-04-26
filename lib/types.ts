export type Commune = {
  code_insee: string;
  nom: string;
  code_postal: string;
  departement: string;
  region: string;
  population: number;
  lat: number;
  lon: number;
  prix_m2_median: number | null;
  prix_m2_evolution_5y: number | null;
  loyer_m2_median: number | null;
  rendement_locatif: number | null;
  revenu_median: number | null;
  taux_chomage: number | null;
  nb_transactions: number;
  distance_gare_km: number | null;
  distance_autoroute_km: number | null;
  nb_commerces: number | null;
  nb_ecoles: number | null;
  nb_medecins: number | null;
  espaces_verts_pct: number | null;
  taux_criminalite: number | null;
  bonus_gpe: number | null;
};

export type Weights = {
  prix: number;
  transports: number;
  economie: number;
  qualiteVie: number;
  education: number;
  futurTransport: number;
};

export const DEFAULT_WEIGHTS: Weights = {
  prix: 30,
  transports: 25,
  economie: 10,
  qualiteVie: 15,
  education: 10,
  futurTransport: 10,
};

export type ScoreMode = "rapport_qualite_prix" | "absolu";

export type CommuneScore = {
  total: number;
  prix: number;
  transports: number;
  economie: number;
  qualiteVie: number;
  education: number;
  futurTransport: number;
};

export type Profile = "acheteur" | "locataire";

export type GpeStation = {
  id: string;
  nom: string;
  ligne: string;
  lat: number;
  lon: number;
  annee_ouverture: number;
};

export type AddressFeature = {
  label: string;
  city: string;
  postcode: string;
  citycode: string;
  lat: number;
  lon: number;
  score: number;
};
