<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import ForecastCard from '@/components/ForecastCard.vue'
import {
  getWeatherByCityName,
  getAirQualityForecast,
  type WeatherData,
  type AirQualityData,
} from '@/services/openWeatherApi'

const weather = ref<WeatherData | null>(null)
const forecast = ref<AirQualityData | null>(null)
const isLoading = ref(false)
const error = ref('')
const cityName = ref('London')

const searchCity = async (city: string) => {
  isLoading.value = true
  error.value = ''
  cityName.value = city

  try {
    const weatherData = await getWeatherByCityName(city)
    weather.value = weatherData

    const forecastData = await getAirQualityForecast(weatherData.coord.lat, weatherData.coord.lon)
    forecast.value = forecastData
  } catch (err) {
    error.value = 'Failed to fetch forecast data. Please try again.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Initialize with London
const initializeApp = async () => {
  await searchCity('London')
}

initializeApp()
</script>

<template>
  <div class="space-y-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-white mb-4">4-Day Air Quality Forecast</h1>
      <p class="text-gray-400">View hourly air pollution forecasts and plan your activities accordingly</p>
    </div>

    <SearchBar @search="searchCity" />

    <div v-if="error" class="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <div v-if="weather && forecast" class="space-y-6">
      <div class="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-700">
        <h2 class="text-2xl font-bold text-white mb-2">{{ weather.name }}, {{ weather.sys.country }}</h2>
        <p class="text-blue-200">Forecast for the next 4 days with hourly granularity</p>
      </div>

      <ForecastCard :forecast="forecast" :isLoading="isLoading" />

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 class="text-lg font-semibold text-blue-300 mb-3">Forecast Information</h3>
        <p class="text-gray-300 text-sm mb-3">
          The 4-day forecast shows hourly air quality predictions for the selected location. Each day is broken down
          into multiple time periods, allowing you to see how pollution levels are expected to change throughout the
          day.
        </p>
        <ul class="text-gray-300 text-sm space-y-2 ml-4">
          <li>• <strong>AQI:</strong> Air Quality Index (1-5 scale) for each hour</li>
          <li>• <strong>Pollutant Concentrations:</strong> Real-time measurements in μg/m³</li>
          <li>• <strong>Trends:</strong> Identify patterns to plan outdoor activities</li>
          <li>• <strong>Peak Hours:</strong> Avoid times when pollution is highest</li>
        </ul>
      </div>
    </div>

    <div v-else-if="!isLoading" class="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
      <p class="text-gray-400">Loading forecast data...</p>
    </div>
  </div>
</template>

<style scoped></style>
