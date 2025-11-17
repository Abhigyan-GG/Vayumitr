<script setup lang="ts">
import { computed } from 'vue'
import type { AirQualityData } from '@/services/openWeatherApi'
import { getAQIInfo, getPollutantLevel, formatDate } from '@/services/openWeatherApi'

interface Props {
  forecast: AirQualityData | null
  isLoading: boolean
}

const props = defineProps<Props>()

// Group forecast data by day
const forecastByDay = computed(() => {
  if (!props.forecast) return []

  const groups: Record<string, (typeof props.forecast.list)[0][]> = {}

  props.forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const dayKey = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    if (!groups[dayKey]) {
      groups[dayKey] = []
    }
    groups[dayKey].push(item)
  })

  return Object.entries(groups).slice(0, 4).map(([date, items]) => ({
    date,
    items: items.slice(0, 8), // Show up to 8 hourly entries per day
    avgAqi: Math.round(items.reduce((sum, item) => sum + item.main.aqi, 0) / items.length),
  }))
})

const getAQIColor = (aqi: number) => {
  const info = getAQIInfo(aqi)
  return info.color
}

const getAQILabel = (aqi: number) => {
  const info = getAQIInfo(aqi)
  return info.name
}

const formatTime = (unixTime: number): string => {
  const date = new Date(unixTime * 1000)
  return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const getPollutantStatus = (key: string, value: number) => {
  return getPollutantLevel(key, value).status
}
</script>

<template>
  <div v-if="!isLoading && forecastByDay.length > 0" class="space-y-6">
    <div v-for="(day, index) in forecastByDay" :key="index" class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
        <h3 class="text-xl font-bold text-white">{{ day.date }}</h3>
        <div
          class="flex items-center gap-2 px-3 py-1 rounded-lg text-white text-sm font-semibold"
          :style="`background-color: ${getAQIColor(day.avgAqi)}`"
        >
          <span>Avg AQI: {{ day.avgAqi }}</span>
          <span>{{ getAQILabel(day.avgAqi) }}</span>
        </div>
      </div>

      <!-- Hourly breakdown -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          v-for="(hour, hourIndex) in day.items"
          :key="hourIndex"
          class="bg-gray-750 rounded p-4 border border-gray-600 hover:border-blue-500 transition"
        >
          <div class="text-sm text-gray-400 mb-2 font-medium">{{ formatTime(hour.dt) }}</div>
          <div
            class="inline-block px-2 py-1 rounded text-white text-xs font-semibold mb-3"
            :style="`background-color: ${getAQIColor(hour.main.aqi)}`"
          >
            AQI: {{ hour.main.aqi }}
          </div>

          <!-- Top pollutants -->
          <div class="space-y-2 text-xs">
            <div class="flex justify-between text-gray-300">
              <span>PM2.5:</span>
              <span class="font-semibold">{{ hour.components.pm2_5.toFixed(1) }}</span>
            </div>
            <div class="flex justify-between text-gray-300">
              <span>NO₂:</span>
              <span class="font-semibold">{{ hour.components.no2.toFixed(1) }}</span>
            </div>
            <div class="flex justify-between text-gray-300">
              <span>O₃:</span>
              <span class="font-semibold">{{ hour.components.o3.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed pollutants -->
      <div class="border-t border-gray-700 pt-4">
        <h4 class="text-sm font-semibold text-gray-300 mb-3">First Hour Pollutant Details (μg/m³)</h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div class="bg-gray-900 rounded p-2">
            <div class="text-gray-400">PM2.5</div>
            <div class="text-white font-bold">{{ day.items[0].components.pm2_5.toFixed(1) }}</div>
            <div class="text-gray-500">{{ getPollutantStatus('pm2_5', day.items[0].components.pm2_5) }}</div>
          </div>
          <div class="bg-gray-900 rounded p-2">
            <div class="text-gray-400">PM10</div>
            <div class="text-white font-bold">{{ day.items[0].components.pm10.toFixed(1) }}</div>
            <div class="text-gray-500">{{ getPollutantStatus('pm10', day.items[0].components.pm10) }}</div>
          </div>
          <div class="bg-gray-900 rounded p-2">
            <div class="text-gray-400">NO₂</div>
            <div class="text-white font-bold">{{ day.items[0].components.no2.toFixed(1) }}</div>
            <div class="text-gray-500">{{ getPollutantStatus('no2', day.items[0].components.no2) }}</div>
          </div>
          <div class="bg-gray-900 rounded p-2">
            <div class="text-gray-400">CO</div>
            <div class="text-white font-bold">{{ day.items[0].components.co.toFixed(1) }}</div>
            <div class="text-gray-500">{{ getPollutantStatus('co', day.items[0].components.co) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="isLoading" class="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-blue-400"></div>
      <span class="ml-4 text-gray-300">Loading forecast data...</span>
    </div>
  </div>

  <div v-else class="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
    <p class="text-gray-400">Search for a city first to see the air quality forecast</p>
  </div>
</template>

<style scoped>
/* Custom color for gray-750 (between gray-700 and gray-800) */
:deep(.bg-gray-750) {
  background-color: #2d3748;
}
</style>
