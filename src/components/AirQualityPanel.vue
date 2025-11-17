<script setup lang="ts">
import { computed } from 'vue'
import type { AirQualityData } from '@/services/openWeatherApi'
import { getAQIInfo, getPollutantLevel } from '@/services/openWeatherApi'

interface Props {
  airQuality: AirQualityData | null
  isLoading: boolean
}

const props = defineProps<Props>()

const currentAirQuality = computed(() => {
  return props.airQuality?.list[0] || null
})

const aqiInfo = computed(() => {
  if (!currentAirQuality.value) return null
  return getAQIInfo(currentAirQuality.value.main.aqi)
})

const pollutants = computed(() => {
  if (!currentAirQuality.value) return []

  const components = currentAirQuality.value.components
  return [
    {
      name: 'PM2.5',
      fullName: 'Fine Particulates',
      value: components.pm2_5,
      unit: 'μg/m³',
      key: 'pm2_5',
    },
    {
      name: 'PM10',
      fullName: 'Coarse Particulates',
      value: components.pm10,
      unit: 'μg/m³',
      key: 'pm10',
    },
    {
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide',
      value: components.no2,
      unit: 'μg/m³',
      key: 'no2',
    },
    {
      name: 'O₃',
      fullName: 'Ozone',
      value: components.o3,
      unit: 'μg/m³',
      key: 'o3',
    },
    {
      name: 'CO',
      fullName: 'Carbon Monoxide',
      value: components.co,
      unit: 'μg/m³',
      key: 'co',
    },
    {
      name: 'SO₂',
      fullName: 'Sulphur Dioxide',
      value: components.so2,
      unit: 'μg/m³',
      key: 'so2',
    },
    {
      name: 'NO',
      fullName: 'Nitrogen Monoxide',
      value: components.no,
      unit: 'μg/m³',
      key: 'no',
    },
    {
      name: 'NH₃',
      fullName: 'Ammonia',
      value: components.nh3,
      unit: 'μg/m³',
      key: 'nh3',
    },
  ]
})

const getPollutantColor = (key: string, value: number) => {
  return getPollutantLevel(key, value).color
}

const getPollutantStatus = (key: string, value: number) => {
  return getPollutantLevel(key, value).status
}
</script>

<template>
  <div v-if="currentAirQuality && aqiInfo" class="space-y-8">
    <!-- AQI Scale Reference (Top) -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 class="text-lg font-semibold text-white mb-4">📊 AQI Scale Reference (1-5)</h3>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div
          class="rounded p-3 text-center cursor-default hover:scale-105 transition"
          style="background-color: #10b981; background-image: linear-gradient(135deg, #10b981, #059669);"
        >
          <div class="text-2xl font-bold text-white">1</div>
          <div class="text-xs text-green-100 font-semibold">Good</div>
        </div>
        <div
          class="rounded p-3 text-center cursor-default hover:scale-105 transition"
          style="background-color: #f59e0b; background-image: linear-gradient(135deg, #f59e0b, #d97706);"
        >
          <div class="text-2xl font-bold text-white">2</div>
          <div class="text-xs text-yellow-100 font-semibold">Fair</div>
        </div>
        <div
          class="rounded p-3 text-center cursor-default hover:scale-105 transition"
          style="background-color: #f97316; background-image: linear-gradient(135deg, #f97316, #ea580c);"
        >
          <div class="text-2xl font-bold text-white">3</div>
          <div class="text-xs text-orange-100 font-semibold">Moderate</div>
        </div>
        <div
          class="rounded p-3 text-center cursor-default hover:scale-105 transition"
          style="background-color: #ef4444; background-image: linear-gradient(135deg, #ef4444, #dc2626);"
        >
          <div class="text-2xl font-bold text-white">4</div>
          <div class="text-xs text-red-100 font-semibold">Poor</div>
        </div>
        <div
          class="rounded p-3 text-center cursor-default hover:scale-105 transition"
          style="background-color: #7c2d12; background-image: linear-gradient(135deg, #7c2d12, #5b21b6);"
        >
          <div class="text-2xl font-bold text-white">5</div>
          <div class="text-xs text-gray-100 font-semibold">Very Poor</div>
        </div>
      </div>
    </div>

    <!-- Main AQI Display -->
    <div
      class="rounded-lg shadow-lg p-8 text-white border border-gray-700"
      :style="`background: linear-gradient(135deg, ${aqiInfo.color}, ${aqiInfo.color}dd); opacity: 0.95;`"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <div class="text-8xl font-bold mb-2 text-white drop-shadow-lg">{{ currentAirQuality.main.aqi }}</div>
          <div class="text-4xl font-bold mb-4 text-white drop-shadow-lg">{{ aqiInfo.name }}</div>
          <p class="text-xl opacity-90">{{ aqiInfo.description }}</p>
          <div class="mt-6 text-sm opacity-85">
            <p class="font-semibold">🌍 OpenWeather AQI Scale (1-5)</p>
            <p class="text-xs mt-2">1 = Good | 2 = Fair | 3 = Moderate | 4 = Poor | 5 = Very Poor</p>
          </div>
        </div>

        <div class="bg-black bg-opacity-30 rounded-lg p-6 backdrop-blur-sm">
          <h3 class="text-xl font-semibold mb-4">Health Impact</h3>
          <div class="space-y-3 text-sm">
            <div v-if="currentAirQuality.main.aqi === 1" class="text-green-100">
              ✅ Air quality is satisfactory and air pollution poses little or no risk
            </div>
            <div v-else-if="currentAirQuality.main.aqi === 2" class="text-yellow-100">
              ⚠️ Air quality is acceptable for most, but sensitive groups may experience issues
            </div>
            <div v-else-if="currentAirQuality.main.aqi === 3" class="text-orange-100">
              ⚠️ Sensitive groups may experience respiratory symptoms; general public mostly unaffected
            </div>
            <div v-else-if="currentAirQuality.main.aqi === 4" class="text-red-100">
              🚨 Everyone may begin to experience respiratory symptoms; avoid outdoor activity
            </div>
            <div v-else-if="currentAirQuality.main.aqi === 5" class="text-red-100">
              🔴 Health warnings of emergency conditions; entire population affected
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pollutant Grid with Numeric Values -->
    <div>
      <h3 class="text-2xl font-bold text-white mb-6">Pollutant Concentrations (μg/m³)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="pollutant in pollutants"
          :key="pollutant.key"
          class="rounded-lg shadow p-4 border-l-4 bg-gray-800 border-gray-700 hover:bg-gray-750 transition"
          :style="`border-left-color: ${getPollutantColor(pollutant.key, pollutant.value)}`"
        >
          <div class="text-sm font-medium text-gray-400 mb-2">{{ pollutant.fullName }}</div>
          <div class="text-3xl font-bold text-white mb-2">{{ pollutant.value.toFixed(2) }}</div>
          <div class="text-xs text-gray-500 mb-2">{{ pollutant.unit }}</div>
          <div
            class="inline-block px-2 py-1 rounded text-white text-xs font-semibold"
            :style="`background-color: ${getPollutantColor(pollutant.key, pollutant.value)}`"
          >
            {{ getPollutantStatus(pollutant.key, pollutant.value) }}
          </div>
        </div>
      </div>
    </div>

    <!-- API Information -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 class="text-lg font-semibold text-blue-300 mb-3">About Air Quality Data</h3>
      <p class="text-gray-300 text-sm mb-3">
        This air quality information is provided by the OpenWeather Air Pollution API. The API returns current,
        forecast (up to 4 days), and historical (from Nov 27, 2020) air pollution data including:
      </p>
      <ul class="text-gray-300 text-sm space-y-1 ml-4">
        <li>• <strong>PM2.5 & PM10:</strong> Particulate matter concentrations</li>
        <li>• <strong>NO₂:</strong> Nitrogen dioxide from traffic and industry</li>
        <li>• <strong>O₃:</strong> Ozone levels</li>
        <li>• <strong>CO:</strong> Carbon monoxide from combustion</li>
        <li>• <strong>SO₂:</strong> Sulphur dioxide from industrial emissions</li>
        <li>• <strong>NH₃:</strong> Ammonia levels</li>
      </ul>
    </div>
  </div>

  <div v-else-if="isLoading" class="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-blue-400"></div>
      <span class="ml-4 text-gray-300">Loading air quality data...</span>
    </div>
  </div>
</template>

<style scoped></style>
