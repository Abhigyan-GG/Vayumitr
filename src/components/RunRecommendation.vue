<script setup lang="ts">
import { computed } from 'vue'
import type { AirQualityData } from '@/services/openWeatherApi'
import { getAirQuality } from '@/services/openWeatherApi'
import { analyzeForRunning, findBestTimeToRun, getRunningIntensityAdvice } from '@/services/runRecommendation'
import { getRandomNearbyCities } from '@/services/nearbyCities'

interface Props {
  airQuality: AirQualityData | null
  cityName: string
  lat: number
  lon: number
  isLoading: boolean
}

const emit = defineEmits<{
  selectCity: [cityName: string, lat: number, lon: number]
}>()

const props = defineProps<Props>()

const recommendation = computed(() => {
  return analyzeForRunning(props.airQuality)
})

const bestTime = computed(() => {
  return findBestTimeToRun(props.airQuality)
})

const intensityAdvice = computed(() => {
  return getRunningIntensityAdvice(props.airQuality)
})

const nearbyCities = computed(() => {
  if (!props.airQuality) return []
  return getRandomNearbyCities(props.cityName, props.lat, props.lon, 3)
})

const selectNearbyCity = async (cityName: string, lat: number, lon: number) => {
  emit('selectCity', cityName, lat, lon)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Main Recommendation Card -->
    <div
      class="rounded-lg shadow-lg p-8 border border-gray-700"
      :class="{
        'bg-gradient-to-r from-green-900 to-green-800': recommendation.aqiRisk === 'safe',
        'bg-gradient-to-r from-yellow-900 to-yellow-800': recommendation.aqiRisk === 'moderate',
        'bg-gradient-to-r from-orange-900 to-orange-800': recommendation.aqiRisk === 'risky',
        'bg-gradient-to-r from-red-900 to-red-800': recommendation.aqiRisk === 'unsafe',
      }"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left: Main Recommendation -->
        <div>
          <h2 class="text-4xl font-bold text-white mb-2">{{ recommendation.recommendation }}</h2>
          <p class="text-lg text-gray-100 mb-4">{{ recommendation.description }}</p>

          <div class="bg-black bg-opacity-20 rounded p-4 mb-4">
            <div class="text-sm text-gray-200 mb-3">
              <strong>Confidence:</strong> {{ recommendation.confidence }}%
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                class="h-full transition-all duration-300"
                :style="{ width: recommendation.confidence + '%' }"
                :class="{
                  'bg-green-500': recommendation.aqiRisk === 'safe',
                  'bg-yellow-500': recommendation.aqiRisk === 'moderate',
                  'bg-orange-500': recommendation.aqiRisk === 'risky',
                  'bg-red-500': recommendation.aqiRisk === 'unsafe',
                }"
              ></div>
            </div>
          </div>

          <div class="bg-black bg-opacity-20 rounded p-4">
            <div class="text-sm text-gray-200">
              <strong>Best Time:</strong> {{ bestTime }}
            </div>
            <div class="text-sm text-gray-200 mt-2">
              <strong>Intensity:</strong> {{ intensityAdvice }}
            </div>
          </div>
        </div>

        <!-- Right: Warnings & Tips -->
        <div class="space-y-4">
          <div v-if="recommendation.warnings.length > 0">
            <h3 class="text-lg font-semibold text-white mb-3">⚠️ Health Warnings</h3>
            <div class="space-y-2">
              <div v-for="(warning, idx) in recommendation.warnings" :key="idx" class="bg-black bg-opacity-30 rounded p-3">
                <p class="text-sm text-gray-100">{{ warning }}</p>
              </div>
            </div>
          </div>

          <div v-if="recommendation.pollutantsConcern.length > 0">
            <h3 class="text-lg font-semibold text-white mb-3">🔴 Pollutants of Concern</h3>
            <div class="space-y-2">
              <div v-for="(pollutant, idx) in recommendation.pollutantsConcern" :key="idx" class="bg-black bg-opacity-30 rounded p-3">
                <p class="text-sm text-gray-100">{{ pollutant }}</p>
              </div>
            </div>
          </div>

          <div v-if="recommendation.warnings.length === 0 && recommendation.pollutantsConcern.length === 0">
            <p class="text-green-100 text-sm">✅ No health warnings - Safe to run!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Nearby Cities with Better AQI -->
    <div v-if="nearbyCities.length > 0" class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 class="text-xl font-bold text-white mb-4">🏃 Better Air Quality Nearby (Within 10-50 km)</h3>
      <p class="text-gray-300 text-sm mb-4">
        Consider running in these nearby areas which may have better air quality:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="city in nearbyCities"
          :key="city.name"
          @click="selectNearbyCity(city.name, city.lat, city.lon)"
          class="bg-gradient-to-br from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 rounded-lg p-4 border border-blue-700 hover:border-blue-600 transition text-left"
        >
          <div class="text-white font-semibold">{{ city.name }}</div>
          <div class="text-sm text-gray-300">{{ city.country }}</div>
          <div class="text-xs text-blue-300 mt-2">~{{ city.distance }} km away</div>
          <div class="text-xs text-gray-400 mt-1">Click to check weather</div>
        </button>
      </div>
    </div>

    <!-- Running Tips -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 class="text-lg font-semibold text-white mb-4">💡 Running Tips</h3>
      <ul class="space-y-3 text-sm text-gray-300">
        <li>
          <strong>Early Morning:</strong> Air quality is typically better between 6-8 AM when traffic is low
        </li>
        <li>
          <strong>Avoid Peak Hours:</strong> Skip running during 10 AM - 2 PM when pollution peaks
        </li>
        <li>
          <strong>Route Selection:</strong> Choose parks and green areas over busy roads
        </li>
        <li>
          <strong>Listen to Your Body:</strong> If you feel shortness of breath, reduce intensity immediately
        </li>
        <li>
          <strong>Mask Option:</strong> For poor AQI, consider air quality masks if running is essential
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
