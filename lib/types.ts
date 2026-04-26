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
  // Accessibilité Paris (cœur du produit)
  temps_trajet_paris_min: number; // min entre TC et voiture, vers Châtelet
  temps_trajet_tc_min: number | null;
  temps_trajet_voiture_min: number | null;
  mode_principal: "rer" | "transilien" | "metro" | "tgv" | "voiture" | "mixte";
  ligne_principale: string | null; // ex: "RER A", "L", "TGV"
  distance_paris_km: number;
  // Reste
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
  tempsParis: number;
  prix: number;
  qualiteVie: number;
  economie: number;
  education: number;
  futurTransport: number;
};

export const DEFAULT_WEIGHTS: Weights = {
  tempsParis: 35,
  prix: 25,
  qualiteVie: 15,
  economie: 8,
  education: 7,
  futurTransport: 10,
};

export type ScoreMode = "rapport_qualite_prix" | "absolu";

export type CommuneScore = {
  total: number;
  tempsParis: number;
  prix: number;
  qualiteVie: number;
  economie: number;
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
