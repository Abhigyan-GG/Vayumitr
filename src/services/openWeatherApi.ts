// Read API configuration from Vite environment variables. These should be defined
// in your local `.env` (for development) or in your deployment environment.
const API_KEY = (import.meta.env.VITE_OPENWEATHER_API_KEY as string) || ''
const BASE_URL = (import.meta.env.VITE_OPENWEATHER_BASE_URL as string) || 'https://api.openweathermap.org'

if (!API_KEY) {
  // Warn during development if the key is missing — calls will fail without it.
  // Do not throw here so the app can still load for non-API parts.
  // Replace with runtime error handling if you prefer stricter behavior.
  // eslint-disable-next-line no-console
  console.warn('VITE_OPENWEATHER_API_KEY is not set. API requests will fail.')
}

export interface WeatherData {
  name: string
  sys: {
    country: string
  }
  coord: {
    lat: number
    lon: number
  }
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg: number
  }
  visibility: number
}

export interface AirQualityData {
  coord: [number, number]
  list: Array<{
    dt: number
    main: {
      aqi: number
    }
    components: {
      co: number
      no: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
      nh3: number
    }
  }>
}

export interface AirQualityLevel {
  level: number
  name: string
  color: string
  description: string
}

const AQI_LEVELS: Record<number, AirQualityLevel> = {
  1: { level: 1, name: 'Good', color: '#10b981', description: 'Air quality is satisfactory' },
  2: { level: 2, name: 'Fair', color: '#f59e0b', description: 'Air quality is acceptable' },
  3: { level: 3, name: 'Moderate', color: '#f97316', description: 'Sensitive groups may experience issues' },
  4: { level: 4, name: 'Poor', color: '#ef4444', description: 'Everyone may begin to experience issues' },
  5: { level: 5, name: 'Very Poor', color: '#7c2d12', description: 'Health warnings of emergency conditions' },
}

export async function getWeatherByCityName(city: string): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  )
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }
  return response.json()
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }
  return response.json()
}

export async function getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  const response = await fetch(
    `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  )
  if (!response.ok) {
    throw new Error(`Air Quality API error: ${response.status}`)
  }
  return response.json()
}

export async function getAirQualityForecast(lat: number, lon: number): Promise<AirQualityData> {
  const response = await fetch(
    `${BASE_URL}/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  )
  if (!response.ok) {
    throw new Error(`Air Quality Forecast API error: ${response.status}`)
  }
  return response.json()
}

export function formatTime(unixTime: number): string {
  const date = new Date(unixTime * 1000)
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function formatDate(unixTime: number): string {
  const date = new Date(unixTime * 1000)
  return date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function getAQIInfo(aqi: number): AirQualityLevel {
  return AQI_LEVELS[aqi] || AQI_LEVELS[1]
}

export function getPollutantLevel(
  pollutant: string,
  value: number
): { level: number; color: string; status: string } {
  const levels: Record<string, Array<{ max: number; level: number; color: string; status: string }>> = {
    so2: [
      { max: 20, level: 1, color: '#10b981', status: 'Good' },
      { max: 80, level: 2, color: '#f59e0b', status: 'Fair' },
      { max: 250, level: 3, color: '#f97316', status: 'Moderate' },
      { max: 350, level: 4, color: '#ef4444', status: 'Poor' },
      { max: Infinity, level: 5, color: '#7c2d12', status: 'Very Poor' },
    ],
    no2: [
      { max: 40, level: 1, color: '#10b981', status: 'Good' },
      { max: 70, level: 2, color: '#f59e0b', status: 'Fair' },
      { max: 150, level: 3, color: '#f97316', status: 'Moderate' },
      { max: 200, level: 4, color: '#ef4444', status: 'Poor' },
      { max: Infinity, level: 5, color: '#7c2d12', status: 'Very Poor' },
    ],
    pm10: [
      { max: 20, level: 1, color: '#10b981', status: 'Good' },
      { max: 50, level: 2, color: '#f59e0b', status: 'Fair' },
      { max: 100, level: 3, color: '#f97316', status: 'Moderate' },
      { max: 200, level: 4, color: '#ef4444', status: 'Poor' },
      { max: Infinity, level: 5, color: '#7c2d12', status: 'Very Poor' },
    ],
    pm2_5: [
      { max: 10, level: 1, color: '#10b981', status: 'Good' },
      { max: 25, level: 2, color: '#f59e0b', status: 'Fair' },
      { max: 50, level: 3, color: '#f97316', status: 'Moderate' },
      { max: 75, level: 4, color: '#ef4444', status: 'Poor' },
      { max: Infinity, level: 5, color: '#7c2d12', status: 'Very Poor' },
    ],
    o3: [
      { max: 60, level: 1, color: '#10b981', status: 'Good' },
      { max: 100, level: 2, color: '#f59e0b', status: 'Fair' },
      { max: 140, level: 3, color: '#f97316', status: 'Moderate' },
      { max: 180, level: 4, color: '#ef4444', status: 'Poor' },
      { max: Infinity, level: 5, color: '#7c2d12', status: 'Very Poor' },
    ],
    co: [
      { max: 4400, level: 1, color: '#10b981', status: 'Good' },
      { max: 9400, level: 2, color: '#f59e0b', status: 'Fair' },
      { max: 12400, level: 3, color: '#f97316', status: 'Moderate' },
      { max: 15400, level: 4, color: '#ef4444', status: 'Poor' },
      { max: Infinity, level: 5, color: '#7c2d12', status: 'Very Poor' },
    ],
  }

  const pollutantLevels = levels[pollutant.toLowerCase()] || levels.pm2_5
  const found = pollutantLevels.find((l) => value < l.max)

  return found || pollutantLevels[pollutantLevels.length - 1]
}
