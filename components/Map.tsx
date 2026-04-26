"use client";

import { useEffect, useMemo, useRef } from "react";
import maplibregl, { Map as MapLibreMap, Popup } from "maplibre-gl";
import type { Commune, GpeStation, Weights, ScoreMode, Profile } from "@/lib/types";
import { computeCommuneScore, scoreToColor, scoreToLabel } from "@/lib/scoring";
import { formatEuros } from "@/lib/utils";

type Props = {
  communes: Commune[];
  gpeStations: GpeStation[];
  weights: Weights;
  mode: ScoreMode;
  profile: Profile;
  budgetMax: number | null;
  showGpe: boolean;
  onSelectCommune: (insee: string | null) => void;
  flyTo: { lat: number; lon: number; zoom?: number } | null;
};

export default function Map({
  communes,
  gpeStations,
  weights,
  mode,
  profile,
  budgetMax,
  showGpe,
  onSelectCommune,
  flyTo,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);

  const communeGeoJson = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: communes
        .filter((c) =>
          budgetMax == null
            ? true
            : profile === "acheteur"
              ? (c.prix_m2_median ?? 0) <= budgetMax
              : (c.loyer_m2_median ?? 0) <= budgetMax,
        )
        .map((c) => {
          const score = computeCommuneScore(c, weights, mode, profile);
          return {
            type: "Feature" as const,
            geometry: {
              type: "Point" as const,
              coordinates: [c.lon, c.lat],
            },
            properties: {
              code_insee: c.code_insee,
              nom: c.nom,
              prix_m2: c.prix_m2_median,
              loyer_m2: c.loyer_m2_median,
              score: score.total,
              color: scoreToColor(score.total),
              label: scoreToLabel(score.total),
            },
          };
        }),
    };
  }, [communes, weights, mode, profile, budgetMax]);

  const gpeGeoJson = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: gpeStations.map((s) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [s.lon, s.lat] },
        properties: { ...s },
      })),
    };
  }, [gpeStations]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [2.4, 46.8],
      zoom: 5.4,
      maxBounds: [
        [-7, 40],
        [12, 52],
      ],
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.ScaleControl(), "bottom-left");

    map.on("load", () => {
      map.addSource("communes", {
        type: "geojson",
        data: communeGeoJson,
      });

      map.addLayer({
        id: "communes-circles",
        type: "circle",
        source: "communes",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5,
            ["max", 4, ["/", ["get", "score"], 12]],
            12,
            ["max", 8, ["/", ["get", "score"], 5]],
          ],
          "circle-color": ["get", "color"],
          "circle-opacity": 0.78,
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addSource("gpe", {
        type: "geojson",
        data: gpeGeoJson,
      });

      map.addLayer({
        id: "gpe-stations",
        type: "circle",
        source: "gpe",
        layout: { visibility: showGpe ? "visible" : "none" },
        paint: {
          "circle-radius": 6,
          "circle-color": "#7c3aed",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      map.addLayer({
        id: "gpe-labels",
        type: "symbol",
        source: "gpe",
        layout: {
          "text-field": ["get", "nom"],
          "text-size": 11,
          "text-offset": [0, 1.2],
          "text-anchor": "top",
          visibility: showGpe ? "visible" : "none",
        },
        paint: {
          "text-color": "#7c3aed",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5,
        },
      });

      map.on("click", "communes-circles", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const insee = feature.properties?.code_insee as string | undefined;
        if (insee) onSelectCommune(insee);
      });

      map.on("mouseenter", "communes-circles", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const feature = e.features?.[0];
        if (!feature) return;
        const props = feature.properties as Record<string, unknown>;
        const coords = (feature.geometry as unknown as {
          coordinates: [number, number];
        }).coordinates;
        const prix = props.prix_m2 ? formatEuros(props.prix_m2 as number) : "—";
        const score = props.score as number;
        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 12,
        })
          .setLngLat(coords)
          .setHTML(
            `<div style="font-family:inherit">
              <div style="font-weight:600;font-size:14px;margin-bottom:2px">${props.nom}</div>
              <div style="font-size:12px;color:#525252">Prix médian : <b>${prix}</b>/m²</div>
              <div style="font-size:12px;color:#525252">Score : <b style="color:${props.color}">${score}/100 — ${props.label}</b></div>
            </div>`,
          )
          .addTo(map);
      });

      map.on("mouseleave", "communes-circles", () => {
        map.getCanvas().style.cursor = "";
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const src = map.getSource("communes") as maplibregl.GeoJSONSource | undefined;
      if (src) src.setData(communeGeoJson);
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [communeGeoJson]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const src = map.getSource("gpe") as maplibregl.GeoJSONSource | undefined;
      if (src) src.setData(gpeGeoJson);
      if (map.getLayer("gpe-stations")) {
        map.setLayoutProperty(
          "gpe-stations",
          "visibility",
          showGpe ? "visible" : "none",
        );
      }
      if (map.getLayer("gpe-labels")) {
        map.setLayoutProperty(
          "gpe-labels",
          "visibility",
          showGpe ? "visible" : "none",
        );
      }
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [gpeGeoJson, showGpe]);

  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [flyTo.lon, flyTo.lat],
      zoom: flyTo.zoom ?? 12,
      duration: 1200,
    });
  }, [flyTo]);

  return <div ref={mapContainerRef} className="absolute inset-0" />;
}
