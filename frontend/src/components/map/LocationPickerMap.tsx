"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { metresToDegrees } from "@/lib/geo";

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
  showBlurRadius?: boolean;
  blurRadiusMeters?: number;
}

const PIN_ICON = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z" fill="#B4530A"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`,
  iconSize: [24, 32],
  iconAnchor: [12, 32],
});

export default function LocationPickerMap({
  lat,
  lng,
  onLocationChange,
  showBlurRadius = false,
  blurRadiusMeters = 500,
}: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [localLat, setLocalLat] = useState(lat);
  const [localLng, setLocalLng] = useState(lng);
  const lastSetRef = useRef({ lat, lng });

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 13,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    const marker = L.marker([lat, lng], {
      icon: PIN_ICON,
      draggable: true,
      title: "Report location (draggable)",
      alt: "Drag this pin to set the pollution location",
    }).addTo(map);

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      lastSetRef.current = { lat: pos.lat, lng: pos.lng };
      setLocalLat(pos.lat);
      setLocalLng(pos.lng);
      onLocationChange(pos.lat, pos.lng);
      if (circleRef.current) {
        circleRef.current.setLatLng(pos);
      }
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      lastSetRef.current = { lat: e.latlng.lat, lng: e.latlng.lng };
      marker.setLatLng(e.latlng);
      setLocalLat(e.latlng.lat);
      setLocalLng(e.latlng.lng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
      if (circleRef.current) {
        circleRef.current.setLatLng(e.latlng);
      }
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to lat/lng prop changes (e.g. "Use my location" sets new coords in
  // the parent). Moves pin, blur circle and map view; no-op when identical
  // to the last value we rendered ourselves.
  useEffect(() => {
    if (lat === lastSetRef.current.lat && lng === lastSetRef.current.lng) return;
    lastSetRef.current = { lat, lng };
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;
    marker.setLatLng([lat, lng]);
    setLocalLat(lat);
    setLocalLng(lng);
    if (circleRef.current) {
      circleRef.current.setLatLng([lat, lng]);
    }
    map.setView([lat, lng], map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  // Toggle blur radius circle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (showBlurRadius) {
      if (!circleRef.current) {
        circleRef.current = L.circle([localLat, localLng], {
          radius: blurRadiusMeters,
          color: "#B4530A",
          fillColor: "#B4530A",
          fillOpacity: 0.1,
          weight: 1.5,
          dashArray: "4,4",
        }).addTo(map);
      } else {
        circleRef.current.setRadius(blurRadiusMeters);
      }
    } else {
      if (circleRef.current) {
        circleRef.current.remove();
        circleRef.current = null;
      }
    }
  }, [showBlurRadius, blurRadiusMeters, localLat, localLng]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full h-64 rounded-sm border border-border"
        aria-label="Location picker map. Click or drag the pin to set the pollution location."
      />
      <div className="mt-1 flex gap-4 text-14 text-muted font-mono">
        <span>Lat: {localLat.toFixed(5)}</span>
        <span>Lng: {localLng.toFixed(5)}</span>
        <span className="ml-auto">
          Approx. blur radius: {metresToDegrees(blurRadiusMeters).toFixed(4)} deg
        </span>
      </div>
    </div>
  );
}
