import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

const STATUS_COLORS = {
  in_transit:       "#E8440A",
  out_for_delivery: "#F59E0B",
  delivered:        "#22C55E",
  picked_up:        "#3B82F6",
  pending:          "#9CA3AF",
};

export default function LiveMap({ result }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const markerRef    = useRef(null);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [78.9629, 20.5937],
      zoom: 4,
      attributionControl: false,
    });

    mapRef.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    mapRef.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !result) return;

    const color  = STATUS_COLORS[result.status] || "#9CA3AF";
    const coords = [result.lng || 78.9629, result.lat || 20.5937];

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    const el = document.createElement("div");
    el.style.cssText = "position:relative;width:52px;height:52px;cursor:pointer";
    el.innerHTML = `
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:${color};opacity:0.2;
        animation:mapPulse 2s ease-in-out infinite">
      </div>
      <div style="
        position:absolute;inset:8px;border-radius:50%;
        background:${color};
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 12px ${color}88">
        <svg width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="white" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2"/>
          <path d="M16 8h4l3 3v5h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      </div>`;

    markerRef.current = new maplibregl.Marker({ element: el, anchor: "center" })
      .setLngLat(coords)
      .setPopup(
        new maplibregl.Popup({ offset: 30, closeButton: false, maxWidth: "220px" })
          .setHTML(`
            <div style="font-family:Inter,sans-serif;padding:12px 16px;
                        background:#1a1a1a;border-radius:12px">
              <div style="font-weight:700;color:${color};font-size:13px;margin-bottom:2px">
                ${result.current_location}
              </div>
              <div style="color:#888;font-size:11px">${result.courier}</div>
              <div style="margin-top:6px;font-size:11px;font-weight:600;
                color:#fff;text-transform:uppercase;letter-spacing:0.05em">
                ${result.status.replace(/_/g, " ")}
              </div>
            </div>`)
      )
      .addTo(mapRef.current);

    const routeCoords = (result.events || [])
      .filter(e => e.lat && e.lng)
      .map(e => [e.lng, e.lat])
      .reverse();

    const drawRoute = () => {
      if (mapRef.current.getLayer("route-line")) mapRef.current.removeLayer("route-line");
      if (mapRef.current.getSource("route"))     mapRef.current.removeSource("route");
      if (routeCoords.length < 2) return;

      mapRef.current.addSource("route", {
        type: "geojson",
        data: { type: "Feature", geometry: { type: "LineString", coordinates: routeCoords } },
      });
      mapRef.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: {
          "line-color": color,
          "line-width": 2.5,
          "line-dasharray": [2, 3],
          "line-opacity": 0.8,
        },
      });
    };

    if (mapRef.current.isStyleLoaded()) drawRoute();
    else mapRef.current.once("load", drawRoute);

    mapRef.current.flyTo({ center: coords, zoom: 8, duration: 1400, essential: true });
  }, [result]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-md">
      {/* Live badge */}
      <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-green-400 flex items-center gap-1.5 shadow-sm border border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
        Live
      </div>

      {/* Map container */}
      <div ref={containerRef} className="w-full h-72" />

      {/* Bottom status bar */}
      {result && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/70 backdrop-blur-sm px-4 py-2.5 flex items-center gap-2 border-t border-white/10">
          <span className="text-base">🚚</span>
          <span className="font-semibold text-white text-xs">
            {result.status.replace(/_/g, " ").toUpperCase()}
          </span>
          <span className="text-white/40 text-xs ml-auto truncate">
            {result.current_location}
          </span>
        </div>
      )}
    </div>
  );
}