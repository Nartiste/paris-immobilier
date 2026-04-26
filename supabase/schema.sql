-- Paris Immobilier — Schéma de base de données
-- À exécuter dans Supabase SQL Editor (Database → SQL Editor)
-- Active PostGIS si ce n'est pas déjà fait dans Database → Extensions

create extension if not exists postgis;

-- Table des communes (35 000 communes France)
create table if not exists communes (
  code_insee     text primary key,
  nom            text not null,
  code_postal    text,
  departement    text,
  region         text,
  population     integer,
  lat            double precision,
  lon            double precision,
  geom           geometry(MultiPolygon, 4326),
  centroid       geometry(Point, 4326),

  -- Immobilier (DVF + observatoires)
  prix_m2_median       numeric,
  prix_m2_evolution_5y numeric,
  loyer_m2_median      numeric,
  rendement_locatif    numeric,
  nb_transactions      integer default 0,

  -- Économie (INSEE FILOSOFI)
  revenu_median   numeric,
  taux_chomage    numeric,

  -- Accessibilité
  distance_gare_km      numeric,
  distance_autoroute_km numeric,

  -- Qualité de vie (INSEE BPE + IGN + data.gouv)
  nb_commerces       integer,
  nb_ecoles          integer,
  nb_medecins        integer,
  espaces_verts_pct  numeric,
  taux_criminalite   numeric,

  -- Bonus GPE / nouveaux transports (calculé)
  bonus_gpe numeric default 0,

  updated_at timestamptz default now()
);

create index if not exists communes_centroid_idx on communes using gist (centroid);
create index if not exists communes_geom_idx on communes using gist (geom);
create index if not exists communes_nom_idx on communes using gin (to_tsvector('french', nom));
create index if not exists communes_postal_idx on communes (code_postal);

-- Table des transactions DVF (granularité adresse)
create table if not exists transactions_dvf (
  id              bigserial primary key,
  date_mutation   date not null,
  valeur_fonciere numeric,
  type_local      text,
  surface_reelle  numeric,
  nb_pieces       integer,
  prix_m2         numeric,
  adresse         text,
  code_postal     text,
  code_insee      text references communes(code_insee),
  lat             double precision,
  lon             double precision,
  geom            geometry(Point, 4326)
);

create index if not exists tx_geom_idx on transactions_dvf using gist (geom);
create index if not exists tx_insee_idx on transactions_dvf (code_insee);
create index if not exists tx_date_idx on transactions_dvf (date_mutation);

-- Table des futures gares Grand Paris Express + autres projets
create table if not exists gares_futures (
  id               text primary key,
  nom              text not null,
  ligne            text,
  reseau           text default 'GPE',
  lat              double precision,
  lon              double precision,
  geom             geometry(Point, 4326),
  annee_ouverture  integer,
  statut           text default 'en_construction'
);

create index if not exists gares_futures_geom_idx on gares_futures using gist (geom);

-- Vue matérialisée pour le score précalculé (rafraîchie périodiquement)
create or replace view communes_public as
  select
    code_insee, nom, code_postal, departement, region,
    population, lat, lon,
    prix_m2_median, prix_m2_evolution_5y, loyer_m2_median, rendement_locatif,
    revenu_median, taux_chomage, nb_transactions,
    distance_gare_km, distance_autoroute_km,
    nb_commerces, nb_ecoles, nb_medecins,
    espaces_verts_pct, taux_criminalite, bonus_gpe
  from communes;

-- RLS : lecture publique, écriture via service_role uniquement
alter table communes enable row level security;
alter table transactions_dvf enable row level security;
alter table gares_futures enable row level security;

drop policy if exists communes_read on communes;
create policy communes_read on communes for select using (true);

drop policy if exists tx_read on transactions_dvf;
create policy tx_read on transactions_dvf for select using (true);

drop policy if exists gares_read on gares_futures;
create policy gares_read on gares_futures for select using (true);
