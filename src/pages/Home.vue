<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import AirQualityPanel from '@/components/AirQualityPanel.vue'
import Map from '@/components/Map.vue'
import RunRecommendation from '@/components/RunRecommendation.vue'
import { getWeatherByCityName, getWeatherByCoords, getAirQuality, getAirQualityForecast, type WeatherData, type AirQualityData } from '@/services/openWeatherApi'

const weather = ref<WeatherData | null>(null)
const airQuality = ref<AirQualityData | null>(null)
const isLoading = ref(false)
const error = ref('')

const searchCity = async (city: string) => {
  isLoading.value = true
  error.value = ''

  try {
    const weatherData = await getWeatherByCityName(city)
    weather.value = weatherData

    const airQualityData = await getAirQuality(weatherData.coord.lat, weatherData.coord.lon)
    airQuality.value = airQualityData
  } catch (err) {
    error.value = 'Failed to fetch weather and air quality data. Please try again.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const selectLocationFromMap = async (lat: number, lon: number) => {
  isLoading.value = true
  error.value = ''

  try {
    // Query weather by coordinates (more reliable than reverse geocoding -> city name)
    const weatherData = await getWeatherByCoords(lat, lon)
    weather.value = weatherData

    const airQualityData = await getAirQuality(weatherData.coord.lat, weatherData.coord.lon)
    airQuality.value = airQualityData
  } catch (err) {
    error.value = 'Failed to fetch weather for selected location. Please try searching instead.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const initializeApp = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          isLoading.value = true
          const { latitude, longitude } = position.coords
          const weatherData = await getWeatherByCoords(latitude, longitude)
          weather.value = weatherData
          const airQualityData = await getAirQuality(weatherData.coord.lat, weatherData.coord.lon)
          airQuality.value = airQualityData
        } catch (err) {
          console.error('Error initializing app:', err)
          // fallback to London
          await searchCity('London')
        } finally {
          isLoading.value = false
        }
      },
      () => {
        searchCity('London')
      },
    )
  } else {
    searchCity('London')
  }
}

initializeApp()
</script>

<template>
  <div class="space-y-8">
    <SearchBar @search="searchCity" />

    <div v-if="error" class="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <WeatherCard :weather="weather" :isLoading="isLoading" />

    <div v-if="weather" class="space-y-8">
      <!-- Interactive Map -->
      <div>
        <h3 class="text-2xl font-bold text-white mb-4">📍 Location Map</h3>
        <Map
          :lat="weather.coord.lat"
          :lon="weather.coord.lon"
          :cityName="weather.name"
          @selectLocation="selectLocationFromMap"
        />
      </div>

      <!-- Run Recommendation -->
      <div>
        <h3 class="text-2xl font-bold text-white mb-4">🏃 Running Recommendation</h3>
        <RunRecommendation
          :airQuality="airQuality"
          :cityName="weather.name"
          :lat="weather.coord.lat"
          :lon="weather.coord.lon"
          :isLoading="isLoading"
          @selectCity="searchCity"
        />
      </div>
    </div>

    <!-- Air Quality Details -->
    <AirQualityPanel :airQuality="airQuality" :isLoading="isLoading" />
  </div>
</template>

<style scoped></style>
