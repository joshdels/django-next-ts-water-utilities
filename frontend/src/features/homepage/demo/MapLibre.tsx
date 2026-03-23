"use client";

import { useRef, useEffect, useState } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "./Map.module.css";
import { useMapIcons } from "@/hooks/useMapIcons";

export default function DemoMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const [lng] = useState(0);
  const [lat] = useState(0);
  const [zoom] = useState(0);

  const [nodeData, setNodeData] = useState<any>(null);
  const [lineData, setLineData] = useState<any>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",
      center: [lng, lat],
      zoom,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    map.current.on("load", async () => {
      try {
        const [lines, nodes] = await Promise.all([
          fetch("/data/lines.geojson").then((r) => r.json()),
          fetch("/data/nodes.geojson").then((r) => r.json()),
        ]);
        setLineData(lines);
        setNodeData(nodes);

        map.current?.addSource("lines-data", { type: "geojson", data: lines });
        map.current?.addSource("nodes-data", { type: "geojson", data: nodes });

        map.current?.addLayer({
          id: "lines-layer",
          type: "line",
          source: "lines-data",
          paint: {
            "line-color": [
              "match",
              ["get", "type"],
              "primary",
              "#FF00FC",
              "secondary",
              "#F2FF00",
              "tertiary",
              "#00FF27",
              "#999999",
            ],
            "line-width": [
              "match",
              ["get", "type"],
              "primary",
              5,
              "secondary",
              2,
              "tertiary",
              1,
              1,
            ],
          },
        });

        map.current?.addLayer({
          id: "nodes-layer",
          type: "symbol",
          source: "nodes-data",
          layout: {
            "icon-image": ["get", "type"],
            "icon-size": 1,
            "icon-allow-overlap": true,
          },
        });

        const bounds = new maplibregl.LngLatBounds();
        lines.features.forEach((feature: any) => {
          const geom = feature.geometry;
          if (!geom) return;
          const addCoords = (coords: any) => {
            if (Array.isArray(coords) && typeof coords[0] === "number")
              bounds.extend(coords);
            else if (Array.isArray(coords)) coords.forEach(addCoords);
          };
          addCoords(geom.coordinates);
        });

        if (!bounds.isEmpty()) {
          map.current?.fitBounds(bounds, { padding: 50, duration: 1000 });
        }
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [lng, lat, zoom]);

  useMapIcons(map.current, nodeData, {
    radius: 20,
    iconScale: 0.6,
    borderWidth: 2,
    typeColors: {
      hydrant: "#FF0000",
      valve: "#0000FF",
      pump: "#CC5500",
    },
  });

  return <div ref={mapContainer} className={styles["map-container"]} />;
}
