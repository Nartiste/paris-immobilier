/**
 * Carte INSEE → données ferroviaires pour Paris.
 *
 * Sources : SNCF Connect, Trainline, Wikipedia (LGV pages), TER SNCF, Transilien.
 * Chaque entrée donne le temps de trajet le plus court vers une gare parisienne
 * (Lyon, Montparnasse, Est, Nord, Saint-Lazare) en service direct.
 *
 * Utilisé comme fallback dans /api/commune-lookup quand une commune n'est pas
 * dans le seed `sample-data.ts` mais qu'on connait sa desserte ferroviaire.
 */

export type RailEntry = {
  station: string;
  minutes: number; // temps de trajet le plus court (porte-à-porte gare-à-gare)
  type: "TGV" | "Intercités" | "TER" | "Transilien" | "RER";
  ligne: string; // nom court affiché à l'utilisateur
  distance_km: number;
};

export const RAIL_BY_INSEE: Record<string, RailEntry> = {
  // ============ TGV Sud-Est (Gare de Lyon) ============
  "71270": { station: "Mâcon Loché TGV", minutes: 100, type: "TGV", ligne: "TGV Sud-Est", distance_km: 392 },
  "71153": { station: "Le Creusot Montceau TGV", minutes: 80, type: "TGV", ligne: "TGV Sud-Est", distance_km: 320 },
  "21231": { station: "Dijon Ville", minutes: 95, type: "TGV", ligne: "TGV Sud-Est", distance_km: 313 },
  "21054": { station: "Beaune", minutes: 130, type: "TGV", ligne: "Dijon-Beaune", distance_km: 312 },
  "71076": { station: "Chalon-sur-Saône", minutes: 85, type: "TGV", ligne: "TGV Sud-Est", distance_km: 339 },
  "69123": { station: "Lyon Part-Dieu", minutes: 113, type: "TGV", ligne: "TGV Sud-Est", distance_km: 460 },
  "42218": { station: "Saint-Étienne Châteaucreux", minutes: 168, type: "TGV", ligne: "TGV via Lyon", distance_km: 519 },
  "26362": { station: "Valence TGV", minutes: 130, type: "TGV", ligne: "TGV Méditerranée", distance_km: 561 },
  "84007": { station: "Avignon TGV", minutes: 158, type: "TGV", ligne: "TGV Méditerranée", distance_km: 688 },
  "13055": { station: "Marseille Saint-Charles", minutes: 184, type: "TGV", ligne: "TGV Méditerranée", distance_km: 750 },
  "13001": { station: "Aix-en-Provence TGV", minutes: 185, type: "TGV", ligne: "TGV Méditerranée", distance_km: 730 },
  "83137": { station: "Toulon", minutes: 235, type: "TGV", ligne: "TGV Méditerranée", distance_km: 836 },
  "06088": { station: "Nice Ville", minutes: 331, type: "TGV", ligne: "TGV Méditerranée", distance_km: 933 },
  "06029": { station: "Cannes", minutes: 305, type: "TGV", ligne: "TGV Méditerranée", distance_km: 901 },
  "30189": { station: "Nîmes Centre", minutes: 175, type: "TGV", ligne: "TGV Méditerranée", distance_km: 715 },
  "34172": { station: "Montpellier Sud de France", minutes: 195, type: "TGV", ligne: "TGV Méditerranée", distance_km: 760 },
  "34032": { station: "Béziers", minutes: 243, type: "TGV", ligne: "TGV Méditerranée", distance_km: 825 },
  "66136": { station: "Perpignan", minutes: 285, type: "TGV", ligne: "TGV Méditerranée", distance_km: 902 },
  "74010": { station: "Annecy", minutes: 220, type: "TGV", ligne: "TGV Sud-Est", distance_km: 545 },
  "73065": { station: "Chambéry-Challes-les-Eaux", minutes: 180, type: "TGV", ligne: "TGV Sud-Est", distance_km: 529 },
  "38185": { station: "Grenoble", minutes: 180, type: "TGV", ligne: "TGV Sud-Est", distance_km: 573 },
  "63113": { station: "Clermont-Ferrand", minutes: 188, type: "Intercités", ligne: "Intercités Bourbonnais", distance_km: 419 },
  "03310": { station: "Vichy", minutes: 165, type: "Intercités", ligne: "Intercités Bourbonnais", distance_km: 360 },
  "03190": { station: "Moulins-sur-Allier", minutes: 135, type: "Intercités", ligne: "Intercités Bourbonnais", distance_km: 295 },
  "58194": { station: "Nevers", minutes: 115, type: "Intercités", ligne: "Intercités Bourbonnais", distance_km: 240 },
  "18033": { station: "Bourges", minutes: 110, type: "Intercités", ligne: "Intercités Centre", distance_km: 226 },

  // ============ TGV Nord (Gare du Nord) ============
  "59350": { station: "Lille Flandres", minutes: 62, type: "TGV", ligne: "TGV Nord", distance_km: 220 },
  "62041": { station: "Arras", minutes: 50, type: "TGV", ligne: "TGV Nord", distance_km: 178 },
  "59178": { station: "Douai", minutes: 75, type: "TGV", ligne: "TGV Nord", distance_km: 193 },
  "59606": { station: "Valenciennes", minutes: 105, type: "TGV", ligne: "TGV Nord", distance_km: 210 },
  "80021": { station: "Amiens", minutes: 75, type: "Intercités", ligne: "Intercités Picardie", distance_km: 130 },
  "62193": { station: "Calais Fréthun", minutes: 95, type: "TGV", ligne: "TGV Nord", distance_km: 296 },
  "59183": { station: "Dunkerque", minutes: 115, type: "TGV", ligne: "TGV Nord", distance_km: 296 },
  "62160": { station: "Boulogne-sur-Mer Ville", minutes: 141, type: "TGV", ligne: "TGV Côte d'Opale", distance_km: 251 },
  "62498": { station: "Lens", minutes: 70, type: "TGV", ligne: "TGV Nord", distance_km: 200 },
  "62119": { station: "Béthune", minutes: 130, type: "TER", ligne: "TER Hauts-de-France", distance_km: 215 },
  "60159": { station: "Compiègne", minutes: 45, type: "TER", ligne: "TER Picardie", distance_km: 82 },
  "60175": { station: "Creil", minutes: 27, type: "TER", ligne: "TER/Transilien", distance_km: 51 },
  "60141": { station: "Chantilly-Gouvieux", minutes: 25, type: "TER", ligne: "TER/Transilien", distance_km: 42 },
  "02691": { station: "Saint-Quentin", minutes: 80, type: "Intercités", ligne: "Intercités Nord", distance_km: 153 },
  "59122": { station: "Cambrai-Ville", minutes: 110, type: "TER", ligne: "TER Hauts-de-France", distance_km: 175 },

  // ============ TGV Est (Gare de l'Est) ============
  "51454": { station: "Reims", minutes: 46, type: "TGV", ligne: "TGV Est", distance_km: 144 },
  "51108": { station: "Châlons-en-Champagne", minutes: 90, type: "Intercités", ligne: "Intercités Est", distance_km: 178 },
  "51230": { station: "Épernay", minutes: 75, type: "TER", ligne: "TER Grand Est", distance_km: 143 },
  "67482": { station: "Strasbourg", minutes: 106, type: "TGV", ligne: "TGV Est", distance_km: 491 },
  "57463": { station: "Metz Ville", minutes: 82, type: "TGV", ligne: "TGV Est", distance_km: 332 },
  "54395": { station: "Nancy Ville", minutes: 90, type: "TGV", ligne: "TGV Est", distance_km: 351 },
  "68066": { station: "Colmar", minutes: 145, type: "TGV", ligne: "TGV Est", distance_km: 528 },
  "68224": { station: "Mulhouse Ville", minutes: 162, type: "TGV", ligne: "TGV Est", distance_km: 488 },
  "10387": { station: "Troyes", minutes: 85, type: "Intercités", ligne: "Intercités Est", distance_km: 167 },
  "55029": { station: "Bar-le-Duc", minutes: 125, type: "TER", ligne: "TER Grand Est", distance_km: 235 },
  "55545": { station: "Meuse TGV", minutes: 70, type: "TGV", ligne: "TGV Est", distance_km: 261 },
  "08409": { station: "Sedan", minutes: 110, type: "TGV", ligne: "TGV Est", distance_km: 247 },
  "08105": { station: "Charleville-Mézières", minutes: 102, type: "TGV", ligne: "TGV Est", distance_km: 236 },
  "90010": { station: "Belfort-Montbéliard TGV", minutes: 137, type: "TGV", ligne: "TGV Rhin-Rhône", distance_km: 449 },
  "25056": { station: "Besançon Franche-Comté TGV", minutes: 125, type: "TGV", ligne: "TGV Rhin-Rhône", distance_km: 386 },

  // ============ TGV Atlantique (Gare Montparnasse) ============
  "72181": { station: "Le Mans", minutes: 54, type: "TGV", ligne: "TGV Atlantique", distance_km: 211 },
  "35238": { station: "Rennes", minutes: 85, type: "TGV", ligne: "TGV Atlantique", distance_km: 350 },
  "29019": { station: "Brest", minutes: 211, type: "TGV", ligne: "TGV Atlantique", distance_km: 593 },
  "29232": { station: "Quimper", minutes: 207, type: "TGV", ligne: "TGV Atlantique", distance_km: 559 },
  "56121": { station: "Lorient", minutes: 176, type: "TGV", ligne: "TGV Atlantique", distance_km: 503 },
  "56260": { station: "Vannes", minutes: 145, type: "TGV", ligne: "TGV Atlantique", distance_km: 458 },
  "35288": { station: "Saint-Malo", minutes: 134, type: "TGV", ligne: "TGV Atlantique", distance_km: 418 },
  "22278": { station: "Saint-Brieuc", minutes: 126, type: "TGV", ligne: "TGV Atlantique", distance_km: 446 },
  "37261": { station: "Saint-Pierre-des-Corps (Tours)", minutes: 64, type: "TGV", ligne: "TGV Atlantique", distance_km: 240 },
  "41269": { station: "Vendôme Villiers TGV", minutes: 42, type: "TGV", ligne: "TGV Atlantique", distance_km: 160 },
  "86194": { station: "Poitiers", minutes: 79, type: "TGV", ligne: "TGV Atlantique", distance_km: 340 },
  "16015": { station: "Angoulême", minutes: 105, type: "TGV", ligne: "TGV Atlantique", distance_km: 446 },
  "33063": { station: "Bordeaux Saint-Jean", minutes: 124, type: "TGV", ligne: "TGV Atlantique", distance_km: 580 },
  "64102": { station: "Bayonne", minutes: 235, type: "TGV", ligne: "TGV Atlantique", distance_km: 770 },
  "64122": { station: "Biarritz", minutes: 243, type: "TGV", ligne: "TGV Atlantique", distance_km: 778 },
  "17300": { station: "La Rochelle Ville", minutes: 146, type: "TGV", ligne: "TGV Atlantique", distance_km: 472 },
  "79191": { station: "Niort", minutes: 130, type: "TGV", ligne: "TGV Atlantique", distance_km: 408 },
  "87085": { station: "Limoges-Bénédictins", minutes: 199, type: "Intercités", ligne: "Intercités POLT", distance_km: 400 },
  "49007": { station: "Angers Saint-Laud", minutes: 92, type: "TGV", ligne: "TGV Atlantique", distance_km: 296 },
  "44109": { station: "Nantes", minutes: 125, type: "TGV", ligne: "TGV Atlantique", distance_km: 385 },
  "44055": { station: "La Baule-Escoublac", minutes: 175, type: "TGV", ligne: "TGV Atlantique", distance_km: 451 },
  "44184": { station: "Saint-Nazaire", minutes: 162, type: "TGV", ligne: "TGV Atlantique", distance_km: 437 },

  // ============ Saint-Lazare (Normandie) ============
  "76540": { station: "Rouen Rive-Droite", minutes: 75, type: "Intercités", ligne: "Intercités Normandie", distance_km: 137 },
  "76351": { station: "Le Havre", minutes: 125, type: "Intercités", ligne: "Intercités Normandie", distance_km: 228 },
  "14118": { station: "Caen", minutes: 116, type: "Intercités", ligne: "Intercités Normandie", distance_km: 240 },
  "50129": { station: "Cherbourg", minutes: 189, type: "Intercités", ligne: "Intercités Normandie", distance_km: 371 },
  "27229": { station: "Évreux Normandie", minutes: 62, type: "Intercités", ligne: "Intercités Normandie", distance_km: 108 },
  "27681": { station: "Vernon-Giverny", minutes: 45, type: "Intercités", ligne: "Intercités Normandie", distance_km: 80 },
  "78361": { station: "Mantes-la-Jolie", minutes: 32, type: "Transilien", ligne: "Transilien J", distance_km: 57 },
  "14366": { station: "Lisieux", minutes: 95, type: "Intercités", ligne: "Intercités Normandie", distance_km: 173 },
  "14047": { station: "Bayeux", minutes: 137, type: "Intercités", ligne: "Intercités Normandie", distance_km: 269 },
  "14220": { station: "Trouville-Deauville", minutes: 120, type: "Intercités", ligne: "Intercités Normandie", distance_km: 211 },

  // ============ Bourgogne / Centre intermédiaires ============
  "89387": { station: "Sens", minutes: 55, type: "Transilien", ligne: "Transilien R", distance_km: 117 },
  "89206": { station: "Joigny", minutes: 75, type: "TER", ligne: "TER Bourgogne", distance_km: 145 },
  "89024": { station: "Auxerre Saint-Gervais", minutes: 105, type: "TER", ligne: "TER Bourgogne", distance_km: 174 },
  "45234": { station: "Orléans", minutes: 65, type: "Intercités", ligne: "Intercités Centre", distance_km: 132 },
  "45208": { station: "Montargis", minutes: 65, type: "Transilien", ligne: "Transilien R", distance_km: 117 },
  "41018": { station: "Blois-Chambord", minutes: 90, type: "Intercités", ligne: "Intercités Centre", distance_km: 182 },
  "28085": { station: "Chartres", minutes: 60, type: "TER", ligne: "TER Centre", distance_km: 96 },
  "28134": { station: "Dreux", minutes: 75, type: "Transilien", ligne: "Transilien N", distance_km: 86 },
  "60057": { station: "Beauvais", minutes: 80, type: "TER", ligne: "TER Hauts-de-France", distance_km: 102 },
  "60612": { station: "Senlis", minutes: 50, type: "TER", ligne: "Bus → Chantilly", distance_km: 53 },
  "02722": { station: "Soissons", minutes: 75, type: "TER", ligne: "TER Hauts-de-France", distance_km: 103 },
};
