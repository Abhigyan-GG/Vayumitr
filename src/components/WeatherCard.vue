<script setup lang="ts">
import type { WeatherData } from '@/services/openWeatherApi'

defineProps<{
  weather: WeatherData | null
  isLoading: boolean
}>()
</script>

<template>
  <div v-if="weather" class="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-700">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div class="md:col-span-1 flex flex-col items-center justify-center">
        <img
          :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`"
          :alt="weather.weather[0].description"
          class="w-32 h-32"
        />
        <p class="text-gray-300 text-lg capitalize">{{ weather.weather[0].description }}</p>
      </div>

      <div class="md:col-span-2">
        <div class="mb-6">
          <h2 class="text-4xl font-bold text-white">{{ weather.name }}, {{ weather.sys.country }}</h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-700">
            <div class="text-4xl font-bold text-blue-400">{{ Math.round(weather.main.temp) }}°C</div>
            <div class="text-sm text-gray-300">Temperature</div>
          </div>

          <div class="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-4 border border-orange-700">
            <div class="text-4xl font-bold text-orange-400">{{ Math.round(weather.main.feels_like) }}°C</div>
            <div class="text-sm text-gray-300">Feels Like</div>
          </div>

          <div class="bg-gradient-to-br from-cyan-900 to-cyan-800 rounded-lg p-4 border border-cyan-700">
            <div class="text-4xl font-bold text-cyan-400">{{ weather.main.humidity }}%</div>
            <div class="text-sm text-gray-300">Humidity</div>
          </div>

          <div class="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-700">
            <div class="text-4xl font-bold text-green-400">{{ weather.wind.speed }}</div>
            <div class="text-sm text-gray-300">Wind (m/s)</div>
          </div>

          <div class="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-700">
            <div class="text-4xl font-bold text-purple-400">{{ weather.main.pressure }}</div>
            <div class="text-sm text-gray-300">Pressure (hPa)</div>
          </div>

          <div class="bg-gradient-to-br from-pink-900 to-pink-800 rounded-lg p-4 border border-pink-700">
            <div class="text-4xl font-bold text-pink-400">{{ (weather.visibility / 1000).toFixed(1) }}</div>
            <div class="text-sm text-gray-300">Visibility (km)</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="isLoading" class="bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-700">
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-blue-400"></div>
      <span class="ml-4 text-gray-300">Loading weather data...</span>
    </div>
  </div>
</template>

<style scoped></style>
