import type { AirQualityData } from './openWeatherApi'

export interface RunRecommendation {
  canRun: boolean
  recommendation: string
  description: string
  confidence: number // 0-100
  aqiRisk: 'safe' | 'moderate' | 'risky' | 'unsafe'
  suggestedTime: string
  warnings: string[]
  pollutantsConcern: string[]
}

export function analyzeForRunning(airQuality: AirQualityData | null): RunRecommendation {
  if (!airQuality || !airQuality.list || airQuality.list.length === 0) {
    return {
      canRun: false,
      recommendation: 'Unable to analyze',
      description: 'No air quality data available',
      confidence: 0,
      aqiRisk: 'unsafe',
      suggestedTime: 'N/A',
      warnings: ['No data available'],
      pollutantsConcern: [],
    }
  }

  const current = airQuality.list[0]
  const aqi = current.main.aqi
  const components = current.components

  const warnings: string[] = []
  const pollutantsConcern: string[] = []

  // Analyze AQI
  let aqiRisk: 'safe' | 'moderate' | 'risky' | 'unsafe'
  let canRun: boolean
  let recommendation: string
  let description: string
  let confidence: number
  let suggestedTime: string

  // Check individual pollutants that could affect running
  if (components.pm2_5 > 35) {
    pollutantsConcern.push('PM2.5 levels high')
    warnings.push('Fine particulates (PM2.5) are elevated - may irritate lungs')
  }

  if (components.pm10 > 100) {
    pollutantsConcern.push('PM10 levels high')
    warnings.push('Coarse particles (PM10) are high')
  }

  if (components.o3 > 120) {
    pollutantsConcern.push('Ozone levels high')
    warnings.push('Ozone concentration is elevated - may cause respiratory issues')
  }

  if (components.no2 > 150) {
    pollutantsConcern.push('NO₂ levels high')
    warnings.push('Nitrogen dioxide is elevated - avoid strenuous exercise')
  }

  if (components.co > 10000) {
    pollutantsConcern.push('CO levels high')
    warnings.push('Carbon monoxide is very high - stay indoors')
  }

  // Main recommendation based on AQI
  switch (aqi) {
    case 1: // Good
      canRun = true
      aqiRisk = 'safe'
      recommendation = '✅ Perfect for Running!'
      description = 'Air quality is excellent. This is ideal weather for outdoor running.'
      confidence = 95
      suggestedTime = 'Anytime - Morning is best'
      break

    case 2: // Fair
      canRun = true
      aqiRisk = 'moderate'
      recommendation = '✅ Good for Running'
      description = 'Air quality is acceptable. Most people can run comfortably.'
      confidence = 85
      suggestedTime = 'Early morning or evening'
      if (!warnings.some((w) => w.includes('PM2.5'))) {
        warnings.push('Consider shorter running distance')
      }
      break

    case 3: // Moderate
      canRun = components.pm2_5 < 30 && components.o3 < 100
      aqiRisk = 'risky'
      recommendation = canRun ? '⚠️ Caution While Running' : '❌ Not Recommended'
      description = canRun
        ? 'Air quality is moderate. Reduce running intensity and duration.'
        : 'Air quality is poor. Avoid strenuous outdoor exercise.'
      confidence = canRun ? 70 : 80
      suggestedTime = canRun ? 'Early morning' : 'Stay indoors'
      warnings.push('Sensitive individuals should avoid running')
      break

    case 4: // Poor
      canRun = false
      aqiRisk = 'unsafe'
      recommendation = '❌ Not Recommended'
      description = 'Air quality is poor. Avoid outdoor running. Prefer indoor exercise.'
      confidence = 90
      suggestedTime = 'Skip outdoor running today'
      warnings.push('Air quality is poor - avoid strenuous outdoor activity')
      warnings.push('Sensitive groups should especially avoid outdoor exercise')
      break

    case 5: // Very Poor
      canRun = false
      aqiRisk = 'unsafe'
      recommendation = '🚫 DO NOT RUN'
      description = 'Air quality is very poor. Stay indoors and use air purifiers.'
      confidence = 98
      suggestedTime = 'Absolutely avoid outdoor activities'
      warnings.push('HEALTH ALERT: Air quality is hazardous')
      warnings.push('Stay indoors with proper air filtration')
      break

    default:
      canRun = false
      aqiRisk = 'unsafe'
      recommendation = 'Unable to determine'
      description = 'Could not assess air quality'
      confidence = 0
      suggestedTime = 'N/A'
  }

  return {
    canRun,
    recommendation,
    description,
    confidence,
    aqiRisk,
    suggestedTime,
    warnings,
    pollutantsConcern,
  }
}

export function findBestTimeToRun(airQuality: AirQualityData | null): string {
  if (!airQuality || !airQuality.list || airQuality.list.length < 8) {
    return 'Early morning (6-8 AM)'
  }

  // Find the hour with the best (lowest) AQI in the next 24 hours
  let bestIndex = 0
  let bestAqi = airQuality.list[0].main.aqi

  for (let i = 0; i < Math.min(24, airQuality.list.length); i++) {
    if (airQuality.list[i].main.aqi < bestAqi) {
      bestAqi = airQuality.list[i].main.aqi
      bestIndex = i
    }
  }

  const bestHour = new Date(airQuality.list[bestIndex].dt * 1000)
  const timeStr = bestHour.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })
  return `${timeStr} (AQI: ${bestAqi})`
}

export function getRunningIntensityAdvice(airQuality: AirQualityData | null): string {
  if (!airQuality || !airQuality.list || airQuality.list.length === 0) {
    return 'Moderate intensity - monitor how you feel'
  }

  const aqi = airQuality.list[0].main.aqi
  const pm25 = airQuality.list[0].components.pm2_5

  if (aqi === 1 || pm25 < 12) {
    return 'High intensity is safe - Push your limits!'
  } else if (aqi === 2 || pm25 < 25) {
    return 'Moderate intensity - Maintain steady pace'
  } else if (aqi === 3) {
    return 'Low intensity only - Slow easy run'
  } else {
    return 'Do not run outdoors'
  }
}
