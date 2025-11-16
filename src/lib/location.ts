// Default location: Universitas Gadjah Mada (UGM), Yogyakarta
export const DEFAULT_LOCATION = {
  lat: -7.770688,
  lng: 110.377716,
  name: "Universitas Gadjah Mada",
  address: "Bulaksumur, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta"
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Format distance to human readable string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
}

/**
 * Estimate travel time based on distance
 * Assumes average speed of 30 km/h in city
 */
export function estimateTravelTime(meters: number): string {
  const averageSpeedKmh = 30; // Average city speed
  const hours = meters / 1000 / averageSpeedKmh;
  const minutes = Math.ceil(hours * 60);

  if (minutes < 60) {
    return `${minutes} menit`;
  } else {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs} jam ${mins} menit` : `${hrs} jam`;
  }
}

/**
 * Extract coordinates from Google Maps URL
 * Handles various Google Maps URL formats including shortened URLs
 */
export function extractCoordsFromGmapsUrl(url: string | null | undefined): { lat: number; lng: number } | null {
  if (!url) return null;

  try {
    // Clean the URL
    const cleanUrl = url.trim();

    // Format 1: https://maps.google.com/?q=-7.770688,110.377716
    const qMatch = cleanUrl.match(/[?&]q=(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // Format 2: https://www.google.com/maps/place/@-7.770688,110.377716,17z
    // or https://www.google.com/maps/@-7.770688,110.377716,17z
    const atMatch = cleanUrl.match(/@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Format 3: Coordinates in URL path or query
    // Matches patterns like: -7.770688,110.377716
    const coordMatch = cleanUrl.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);

      // Validate coordinates range
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }

    // Format 4: https://maps.app.goo.gl/xxx (shortened URL)
    // These need to be expanded, but for now we'll try to extract from any embedded coords
    if (cleanUrl.includes('goo.gl') || cleanUrl.includes('maps.app')) {
      // Try to find any coordinate pattern in the URL
      const anyCoordMatch = cleanUrl.match(/(-?\d+\.\d{4,}),\s*(-?\d+\.\d{4,})/);
      if (anyCoordMatch) {
        const lat = parseFloat(anyCoordMatch[1]);
        const lng = parseFloat(anyCoordMatch[2]);

        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng };
        }
      }

      // For shortened URLs, we can't extract directly without following redirects
      // Return null and user should use full URL
      console.warn('Shortened Google Maps URL detected. Please use full URL format for better accuracy.');
      return null;
    }

    return null;
  } catch (error) {
    console.error('Error extracting coords from gmaps URL:', error);
    return null;
  }
}

/**
 * Parse location string to coordinates
 * Handles formats like: "-7.770688, 110.377716" or "lat,lng"
 */
export function parseLocationString(location: string | null | undefined): { lat: number; lng: number } | null {
  if (!location) return null;

  try {
    // Remove any whitespace
    const cleaned = location.trim();

    // Try to parse as "lat,lng"
    const parts = cleaned.split(',').map(p => p.trim());
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    return null;
  } catch (error) {
    console.error('Error parsing location:', error);
    return null;
  }
}

/**
 * Get distance and travel time from default location to UMKM
 * Tries to extract from gmaps URL first, then falls back to location string
 */
export function getDistanceInfo(
  gmapsUrl: string | null | undefined,
  locationString?: string | null | undefined
): {
  distance: string;
  travelTime: string;
  distanceMeters: number;
} | null {
  // First try to extract from gmaps URL
  let coords = extractCoordsFromGmapsUrl(gmapsUrl);

  // If that fails, try parsing location string
  if (!coords && locationString) {
    coords = parseLocationString(locationString);
  }

  if (!coords) {
    return null;
  }

  const distanceMeters = calculateDistance(
    DEFAULT_LOCATION.lat,
    DEFAULT_LOCATION.lng,
    coords.lat,
    coords.lng
  );

  return {
    distance: formatDistance(distanceMeters),
    travelTime: estimateTravelTime(distanceMeters),
    distanceMeters
  };
}
