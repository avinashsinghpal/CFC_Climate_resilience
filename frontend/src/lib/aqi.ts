import type { AqiCategory } from "@/types";

export interface AqiBand {
  category: AqiCategory;
  min: number;
  max: number;
  color: string;
  bgColor: string;
  textColor: string;
  cssClass: string;
}

export const AQI_BANDS: AqiBand[] = [
  {
    category: "Good",
    min: 0,
    max: 50,
    color: "#4A7C59",
    bgColor: "#EDF5F0",
    textColor: "#2E5239",
    cssClass: "aqi-good",
  },
  {
    category: "Satisfactory",
    min: 51,
    max: 100,
    color: "#6B9E3A",
    bgColor: "#F0F5E8",
    textColor: "#3D5A20",
    cssClass: "aqi-satisfactory",
  },
  {
    category: "Moderate",
    min: 101,
    max: 200,
    color: "#C68A1A",
    bgColor: "#FDF5E2",
    textColor: "#7A520E",
    cssClass: "aqi-moderate",
  },
  {
    category: "Poor",
    min: 201,
    max: 300,
    color: "#C05A1F",
    bgColor: "#FBF0E8",
    textColor: "#7A3812",
    cssClass: "aqi-poor",
  },
  {
    category: "Very Poor",
    min: 301,
    max: 400,
    color: "#992B1A",
    bgColor: "#F8EAE8",
    textColor: "#6B1E12",
    cssClass: "aqi-very-poor",
  },
  {
    category: "Severe",
    min: 401,
    max: 500,
    color: "#5C1018",
    bgColor: "#F2E8EA",
    textColor: "#3D0A10",
    cssClass: "aqi-severe",
  },
];

export function getAqiBand(aqiValue: number): AqiBand {
  for (const band of AQI_BANDS) {
    if (aqiValue <= band.max) return band;
  }
  return AQI_BANDS[AQI_BANDS.length - 1];
}

export function getCategoryFromValue(aqiValue: number): AqiCategory {
  return getAqiBand(aqiValue).category;
}

export function pm25ToAqi(pm25: number): number {
  // Simplified conversion using Indian AQI breakpoints
  if (pm25 <= 30) return Math.round((50 / 30) * pm25);
  if (pm25 <= 60) return Math.round(50 + ((100 - 50) / (60 - 30)) * (pm25 - 30));
  if (pm25 <= 90) return Math.round(100 + ((200 - 100) / (90 - 60)) * (pm25 - 60));
  if (pm25 <= 120) return Math.round(200 + ((300 - 200) / (120 - 90)) * (pm25 - 90));
  if (pm25 <= 250) return Math.round(300 + ((400 - 300) / (250 - 120)) * (pm25 - 120));
  return Math.min(500, Math.round(400 + ((500 - 400) / (380 - 250)) * (pm25 - 250)));
}
