/**
 * Geo utilities for the prototype.
 * Actual geo-indistinguishability (Laplace mechanism) is stubbed.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Stub: in production this would add calibrated Laplace noise to the
 * coordinates to achieve geo-indistinguishability (Andres et al., 2013).
 * Here it just returns the original position so the map works.
 */
export function blurLocation(position: LatLng, radiusMeters: number = 500): LatLng {
  // Stub: return position unchanged in the prototype
  void radiusMeters;
  return position;
}

/**
 * Convert metres to approximate degrees of latitude/longitude.
 * Used to draw the blur radius circle on the map.
 */
export function metresToDegrees(metres: number): number {
  // 1 degree of latitude ~ 111,000 m
  return metres / 111000;
}

/**
 * Calculate the distance in kilometres between two lat/lng points
 * using the Haversine formula.
 */
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.asin(Math.sqrt(h));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
