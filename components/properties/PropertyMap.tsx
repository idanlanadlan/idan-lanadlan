"use client";

// Leaflet is loaded dynamically inside useEffect — safe for SSR/Next.js 16
import { useEffect, useRef } from "react";
import type { Property } from "@/lib/types";

interface Props {
  properties: Property[];
  height?: string;
  /** Legend labels — defaults to Hebrew (admin screens don't localize) */
  labels?: { sale: string; rent: string; on_map: string };
}

// Gold and blue marker SVG as data URLs
const MARKER_SVG = (color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
  <path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22S28 23.33 28 14C28 6.27 21.73 0 14 0z" fill="${color}" />
  <circle cx="14" cy="14" r="6" fill="white" fill-opacity="0.9"/>
</svg>`)}`;

const SALE_ICON_URL = MARKER_SVG("#C9A96E");
const RENT_ICON_URL = MARKER_SVG("#60a5fa");

export default function PropertyMap({
  properties,
  height = "480px",
  labels = { sale: "מכירה", rent: "השכרה", on_map: "נכסים על המפה" },
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  const mapped = properties.filter((p) => p.lat && p.lng);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let cancelled = false;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Effect was cleaned up (or the container was already initialized by a
      // stale, overlapping run) before this async import resolved — bail out
      // instead of calling L.map() on a container Leaflet already owns.
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;
      if ((mapRef.current as unknown as { _leaflet_id?: number })._leaflet_id) return;

      // Fix default icon paths broken by webpack
      // @ts-expect-error — leaflet internal
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center: [number, number] =
        mapped.length > 0 ? [mapped[0].lat!, mapped[0].lng!] : [32.07, 34.78];
      const zoom = mapped.length > 1 ? 11 : mapped.length === 1 ? 14 : 12;

      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: false });
      mapInstanceRef.current = map;

      // CartoDB Dark Matter tile — matches the site's dark aesthetic
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      map.setView(center, zoom);

      // Add markers
      mapped.forEach((p) => {
        const iconUrl = p.type === "rent" ? RENT_ICON_URL : SALE_ICON_URL;
        const icon = L.icon({ iconUrl, iconSize: [28, 36], iconAnchor: [14, 36], popupAnchor: [0, -36] });

        const priceStr =
          p.type === "rent"
            ? `₪${p.price.toLocaleString("he-IL")} / חודש`
            : `₪${p.price.toLocaleString("he-IL")}`;

        const popup = `
          <div dir="rtl" style="min-width:180px;font-family:Arial,sans-serif;">
            <p style="font-size:13px;font-weight:600;color:#F5F5F0;margin:0 0 4px">${p.title}</p>
            <p style="font-size:12px;color:#C9A96E;margin:0 0 4px">${priceStr}</p>
            <p style="font-size:11px;color:#aaa;margin:0 0 8px">${p.bedrooms} חד׳ · ${p.size_sqm} מ״ר · ${p.city}</p>
            <a href="/nadlan/${p.id}" style="font-size:11px;color:#C9A96E;text-decoration:underline;">לנכס ←</a>
          </div>`;

        L.marker([p.lat!, p.lng!], { icon }).addTo(map).bindPopup(popup, { className: "crm-popup" });
      });

      // Fit bounds if multiple markers
      if (mapped.length > 1) {
        const bounds = L.latLngBounds(mapped.map((p) => [p.lat!, p.lng!]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        // @ts-expect-error — leaflet Map type
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mapped.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-charcoal border border-gray-dark rounded-xl text-center"
        style={{ height }}
      >
        <div>
          <p className="text-gray-light text-sm">אין נכסים עם קואורדינטות להצגה</p>
          <p className="text-xs text-gray-light/60 mt-1">ייבא נכסים מ-CRM — הקואורדינטות מזוהות אוטומטית</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        .leaflet-popup-content-wrapper { background:#111; border:1px solid #333; border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,.5); }
        .leaflet-popup-tip { background:#111; }
        .leaflet-popup-close-button { color:#aaa !important; }
        .leaflet-container { border-radius: inherit; }
      `}</style>
      <div ref={mapRef} style={{ height }} className="rounded-xl overflow-hidden border border-gray-dark" />
      <p className="mt-2 text-xs text-gray-light">
        <span className="inline-block w-2 h-2 rounded-full bg-gold mr-1" />{labels.sale}
        <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1 ml-3" />{labels.rent}
        · {mapped.length} {labels.on_map}
      </p>
    </>
  );
}
