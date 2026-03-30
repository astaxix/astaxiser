
/**
 * Location Service
 * Handles address suggestions and geocoding using OpenStreetMap/Nominatim
 */

export interface LocationSuggestion {
  label: string;
  lat: number;
  lon: number;
}

export async function fetchPlaceSuggestions(query: string): Promise<LocationSuggestion[]> {
  if (!query || query.length < 3) return [];

  try {
    // Wir suchen primär in Bingen und Umgebung
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=de&viewbox=7.8,50.0,8.0,49.8&bounded=0`;
    
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'de'
      }
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      label: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon)
    }));
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.display_name || 'Unbekannter Standort';
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return 'Unbekannter Standort';
  }
}
