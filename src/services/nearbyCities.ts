export interface NearbyCity {
  name: string
  country: string
  lat: number
  lon: number
  distance: number // in km
}

// Database of major cities worldwide with their coordinates
// This is a simplified database; in production, you'd use a proper geolocation API
const citiesDatabase: Record<string, NearbyCity[]> = {
  // India
  'Delhi,IN': [
    { name: 'Noida', country: 'India', lat: 28.5355, lon: 77.391, distance: 25 },
    { name: 'Ghaziabad', country: 'India', lat: 28.6692, lon: 77.4538, distance: 35 },
    { name: 'Greater Noida', country: 'India', lat: 28.4744, lon: 77.545, distance: 35 },
  ],
  'Noida,IN': [
    { name: 'Delhi', country: 'India', lat: 28.6139, lon: 77.209, distance: 25 },
    { name: 'Greater Noida', country: 'India', lat: 28.4744, lon: 77.545, distance: 15 },
    { name: 'Ghaziabad', country: 'India', lat: 28.6692, lon: 77.4538, distance: 30 },
  ],
  'Mumbai,IN': [
    { name: 'Thane', country: 'India', lat: 19.218, lon: 72.9781, distance: 30 },
    { name: 'Navi Mumbai', country: 'India', lat: 19.0176, lon: 73.0822, distance: 25 },
    { name: 'Pune', country: 'India', lat: 18.5204, lon: 73.8567, distance: 150 },
  ],
  'Bangalore,IN': [
    { name: 'Whitefield', country: 'India', lat: 12.9698, lon: 77.7499, distance: 20 },
    { name: 'Indiranagar', country: 'India', lat: 13.0346, lon: 77.6245, distance: 10 },
    { name: 'Koramangala', country: 'India', lat: 12.9352, lon: 77.6245, distance: 8 },
  ],

  // UK
  'London,GB': [
    { name: 'Westminster', country: 'UK', lat: 51.4975, lon: -0.1357, distance: 2 },
    { name: 'Greenwich', country: 'UK', lat: 51.4769, lon: 0, distance: 10 },
    { name: 'Richmond', country: 'UK', lat: 51.4545, lon: -0.3033, distance: 15 },
    { name: 'Croydon', country: 'UK', lat: 51.3766, lon: -0.0955, distance: 20 },
  ],

  // USA
  'New York,US': [
    { name: 'Jersey City', country: 'USA', lat: 40.7178, lon: -74.0431, distance: 3 },
    { name: 'Newark', country: 'USA', lat: 40.7357, lon: -74.1724, distance: 15 },
    { name: 'Hoboken', country: 'USA', lat: 40.7355, lon: -74.0314, distance: 5 },
  ],
  'Los Angeles,US': [
    { name: 'Long Beach', country: 'USA', lat: 33.7701, lon: -118.1937, distance: 35 },
    { name: 'Pasadena', country: 'USA', lat: 34.1478, lon: -118.1445, distance: 20 },
    { name: 'Anaheim', country: 'USA', lat: 33.8354, lon: -117.9985, distance: 40 },
  ],

  // France
  'Paris,FR': [
    { name: 'Versailles', country: 'France', lat: 48.8047, lon: 2.1203, distance: 17 },
    { name: 'Neuilly-sur-Seine', country: 'France', lat: 48.8829, lon: 2.2676, distance: 8 },
    { name: 'Boulogne-Billancourt', country: 'France', lat: 48.8329, lon: 2.2397, distance: 5 },
  ],
}

export function getNearbyCity(cityName: string, lat: number, lon: number): NearbyCity[] {
  // Try to find nearby cities from database
  const key = cityName.split(',')[0]
  const nearby = Object.keys(citiesDatabase).find(
    (k) => k.toLowerCase().includes(key.toLowerCase()),
  )

  if (nearby) {
    return citiesDatabase[nearby]
  }

  // If not in database, return empty array
  // In production, use a proper geocoding API to find actual nearby cities
  return []
}

export function getRandomNearbyCities(cityName: string, lat: number, lon: number, count: number = 3): NearbyCity[] {
  const nearby = getNearbyCity(cityName, lat, lon)
  // Shuffle and return requested count
  return nearby.sort(() => Math.random() - 0.5).slice(0, count)
}
