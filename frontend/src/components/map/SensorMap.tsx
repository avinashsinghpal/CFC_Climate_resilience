"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAqiBand } from "@/lib/aqi";
import type { Sensor } from "@/types";

interface SensorMapProps {
  sensors: Sensor[];
  selectedId?: string;
  onSelectSensor: (sensor: Sensor) => void;
}

function makeIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 16 : 12;
  const border = isSelected ? 3 : 2;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;
      border-radius:${size / 2}px;
      background:${color};
      border:${border}px solid white;
      box-shadow:0 1px 3px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function SensorMap({
  sensors,
  selectedId,
  onSelectSensor,
}: SensorMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    sensors.forEach((sensor) => {
      const aqi = sensor.latestReading?.aqiValue ?? 0;
      const band = getAqiBand(aqi);
      const color = sensor.status === "offline" ? "#9CA3AF" : band.color;
      const isSelected = sensor.id === selectedId;

      const marker = L.marker([sensor.lat, sensor.lng], {
        icon: makeIcon(color, isSelected),
        title: `${sensor.id} (${sensor.area})`,
        alt: `Sensor ${sensor.id} at ${sensor.area}, AQI category ${band.category}`,
      });

      marker.bindTooltip(
        `<strong>${sensor.id}</strong><br>${sensor.area}, ${sensor.city}<br>PM2.5: ${sensor.latestReading?.pm25 ?? "N/A"} ug/m3<br>Status: ${sensor.status}`,
        { sticky: true, className: "leaflet-tooltip-custom" }
      );

      marker.on("click", () => onSelectSensor(sensor));
      marker.addTo(map);
      markersRef.current.set(sensor.id, marker);
    });
  }, [sensors, selectedId, onSelectSensor]);

  // Pan to selected sensor
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const sensor = sensors.find((s) => s.id === selectedId);
    if (sensor) {
      map.setView([sensor.lat, sensor.lng], 12, { animate: false });
    }
  }, [selectedId, sensors]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      aria-label="Map of sensor locations"
    />
  );
}
