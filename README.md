# Paris Immobilier

Trouvez la **meilleure commune où s'installer en France** selon vos critères : prix immobilier, transports actuels et futurs (Grand Paris Express), qualité de vie, économie locale, éducation.

Web app interactive avec carte, scoring multi-critères pondérable, recherche d'adresse précise, top des communes en temps réel.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**, TypeScript, Tailwind CSS 4
- **MapLibre GL JS** — carte interactive (tuiles OpenStreetMap)
- **Supabase** (Postgres + PostGIS) — base de données géospatiale
- **Zustand** — state management
- Hébergement : **Vercel**

## Sources de données (toutes publiques)

| Donnée | Source | URL |
|--------|--------|-----|
| Transactions immobilières (DVF) | data.gouv.fr | https://files.data.gouv.fr/geo-dvf/latest/csv/ |
| Géocodage adresses (BAN) | data.gouv.fr | https://api-adresse.data.gouv.fr |
| Découpage communes | INSEE / IGN | https://www.data.gouv.fr/fr/datasets/contours-des-communes-de-france/ |
| Revenus, démographie | INSEE FILOSOFI | https://www.insee.fr/fr/statistiques/ |
| Équipements (commerces, écoles, médecins) | INSEE BPE | https://www.insee.fr/fr/statistiques/ |
| Criminalité | data.gouv.fr (Ministère Intérieur) | https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/ |
| Futures gares Grand Paris Express | Société des Grands Projets | https://www.data.gouv.fr/fr/organizations/societe-des-grands-projets/ |
| Tuiles cartographiques | OpenStreetMap | © OSM contributors |

## Lancement local

```bash
cp .env.local.example .env.local
# remplir les variables Supabase

npm install
npm run dev
```

L'app fonctionne **sans Supabase configuré** : un échantillon de 20 communes (IDF + grandes métropoles) est utilisé en fallback.

## Déploiement de la base de données

1. Créer un projet sur https://supabase.com (région `eu-west-3`)
2. Activer l'extension **PostGIS** (Database → Extensions)
3. Exécuter `supabase/schema.sql` dans le SQL Editor
4. Importer les données (voir section Import ci-dessous)
5. Renseigner `.env.local` avec l'URL et les clés API

## Import des données réelles (TODO — phase 2)

Le scaffold actuel utilise un échantillon. Pour la France entière :

```bash
# DVF (à venir)
npm run import:dvf

# Communes + INSEE
npm run import:communes

# Futures gares GPE
npm run import:gpe
```

Scripts d'import à développer dans `scripts/import/*.ts`.

## Architecture

```
app/
  page.tsx                # Page d'accueil
  api/
    communes/route.ts     # Liste des communes (Supabase ou fallback)
    geocode/route.ts      # Proxy BAN
    gpe/route.ts          # Futures gares
components/
  HomeClient.tsx          # Wrapper client (state + map)
  Map.tsx                 # MapLibre GL
  Sidebar.tsx             # Pondération des critères
  AddressSearch.tsx       # Autocomplétion BAN
  CommuneCard.tsx         # Détail commune
  TopRanking.tsx          # Top 10 communes
lib/
  types.ts                # Types métier
  scoring.ts              # Logique de score multi-critères
  store.ts                # Zustand store
  supabase.ts             # Client Supabase
  sample-data.ts          # Données fallback
supabase/
  schema.sql              # Schéma BDD (PostGIS)
```

## Score multi-critères

Le score (0-100) combine 6 dimensions pondérables :

- **Prix immobilier** : prix m² achat (DVF) ou loyer (observatoires) selon profil
- **Transports actuels** : distance gare / autoroute
- **Économie** : revenu médian, taux de chômage
- **Qualité de vie** : commerces, médecins, espaces verts, sécurité
- **Éducation** : densité d'écoles
- **Futurs transports** : bonus pondéré par horizon (gare 2026 > gare 2031)

Deux modes :
- **Rapport qualité-prix** : favorise les communes sous-cotées
- **Score absolu** : somme pondérée pure
