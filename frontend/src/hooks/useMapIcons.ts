"use client";

import { useEffect } from "react";
import type { Map } from "maplibre-gl";

interface IconOptions {
  iconFolder?: string;
  radius?: number;
  iconScale?: number;
  borderWidth?: number;
  typeColors?: Record<string, string>;
  borderColor?: string;
}

export function useMapIcons(
  map: Map | null,
  nodeData: any,
  options?: IconOptions,
) {
  useEffect(() => {
    if (!map || !nodeData) return;

    const {
      iconFolder = "/icons",
      radius = 16,
      iconScale = 0.6,
      borderWidth = 2,
      typeColors = {},
      borderColor = "#ffffff",
    } = options || {};

    const nodeTypes = new Set<string>();
    nodeData.features.forEach((f: any) => {
      const t = f.properties?.type;
      if (t) nodeTypes.add(t);
    });

    nodeTypes.forEach(async (iconName) => {
      if (map.hasImage(iconName)) return;

      try {
        const res = await fetch(`${iconFolder}/${iconName}.svg`);
        let svgText = await res.text();

        svgText = svgText.replace(/(fill|stroke)=".*?"/g, `$1="#ffffff"`);
        svgText = svgText.replace(
          /<svg/,
          `<svg fill="#ffffff" stroke="#ffffff"`,
        );

        const img = new Image();
        img.src = "data:image/svg+xml;base64," + btoa(svgText);

        img.onload = () => {
          const size = radius * 2;
          const iconSize = size * iconScale;
          const iconOffset = (size - iconSize) / 2;

          const ctx = document.createElement("canvas").getContext("2d")!;
          ctx.canvas.width = size;
          ctx.canvas.height = size;

          const bgColor = typeColors[iconName] || "#FF0000";

          // Draw background circle (colored)
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.arc(radius, radius, radius - borderWidth, 0, Math.PI * 2);
          ctx.fill();

          // Draw border ring
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = borderWidth;
          ctx.beginPath();
          ctx.arc(radius, radius, radius - borderWidth / 2, 0, Math.PI * 2);
          ctx.stroke();

          // Draw white icon centered
          ctx.drawImage(img, iconOffset, iconOffset, iconSize, iconSize);

          // Add to MapLibre
          map.addImage(iconName, {
            width: size,
            height: size,
            data: ctx.getImageData(0, 0, size, size).data,
          });
        };

        img.onerror = () => console.warn(`Failed to load icon: ${iconName}`);
      } catch (err) {
        console.error("Error loading icon", iconName, err);
      }
    });
  }, [map, nodeData, options]);
}
