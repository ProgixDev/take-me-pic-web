"use client";

/**
 * Real interactive map (Leaflet + free CartoDB raster tiles) styled to match
 * the carnet-de-voyage aesthetic via a warm sepia tint (see .map-sepia in
 * globals.css). Leaflet is loaded lazily inside an effect so it never runs on
 * the server — safe for the Next.js app router.
 *
 * Two marker variants:
 *  - "polaroid": a little polaroid photo + handwritten caption (spots).
 *  - "pin":      a stamp-red dot with an icon + label chip (people / places).
 */

import { useEffect, useRef } from "react";
import type * as LeafletNS from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  variant?: "polaroid" | "pin";
  /** photo url for the polaroid variant */
  image?: string;
  /** emoji/char shown inside the pin dot */
  icon?: string;
  /** small green "live" dot under the pin */
  online?: boolean;
  /** navigate here on click */
  href?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function markerHtml(m: MapMarker): string {
  const label = escapeHtml(m.label);
  if (m.variant === "polaroid") {
    const bg = m.image ? `background-image:url('${m.image}')` : "";
    return `
      <div class="tmp-marker">
        <div class="tmp-polaroid">
          <div class="tmp-polaroid-photo" style="${bg}"></div>
          <div class="tmp-polaroid-cap">${label}</div>
        </div>
        <div class="tmp-marker-tip"></div>
      </div>`;
  }
  const dotIcon = m.icon ? escapeHtml(m.icon) : "📍";
  const live = m.online ? `<span class="tmp-marker-live"></span>` : "";
  return `
    <div class="tmp-marker">
      <div class="tmp-pin-dot">${dotIcon}</div>
      <div class="tmp-pin-label">${label}</div>
      ${live}
    </div>`;
}

export function LiveMap({
  markers,
  className,
  height = 320,
  zoom = 4,
  center,
  scrollZoom = false,
  worldWrap = true,
}: {
  markers: MapMarker[];
  className?: string;
  height?: number | string;
  zoom?: number;
  center?: [number, number];
  scrollZoom?: boolean;
  worldWrap?: boolean;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletNS.Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    let map: LeafletNS.Map | null = null;

    (async () => {
      const mod = await import("leaflet");
      const L = (mod as unknown as { default?: typeof LeafletNS }).default ?? (mod as unknown as typeof LeafletNS);
      if (cancelled || !elRef.current || mapRef.current) return;

      map = L.map(elRef.current, {
        zoomControl: true,
        scrollWheelZoom: scrollZoom,
        attributionControl: true,
        worldCopyJump: worldWrap,
      });
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          subdomains: "abcd",
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      ).addTo(map);

      const latlngs: LeafletNS.LatLngExpression[] = [];
      for (const m of markers) {
        const icon = L.divIcon({
          html: markerHtml(m),
          className: "tmp-divicon",
          iconSize: [1, 1],
          iconAnchor: [0, 0],
        });
        const marker = L.marker([m.lat, m.lng], { icon, riseOnHover: true }).addTo(map);
        if (m.href) {
          marker.on("click", () => {
            window.location.href = m.href as string;
          });
        }
        latlngs.push([m.lat, m.lng]);
      }

      if (center) {
        map.setView(center, zoom);
      } else if (latlngs.length > 1) {
        map.fitBounds(L.latLngBounds(latlngs), { padding: [60, 60], maxZoom: 13 });
      } else if (latlngs.length === 1) {
        map.setView(latlngs[0], zoom);
      } else {
        map.setView([46, 6], zoom);
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={elRef}
      className={`tmp-map map-sepia ${className ?? ""}`}
      style={{ height, width: "100%" }}
      role="application"
      aria-label="Map"
    />
  );
}
