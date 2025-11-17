<script setup lang="ts">
import { ref } from 'vue'
import { getCitySuggestions, type GeocodeResult } from '@/services/openWeatherApi'

const emit = defineEmits<{
  search: [city: string]
  searchCoords: [{ lat: number; lon: number }]
}>()

const city = ref('')
const isLoading = ref(false)
const suggestions = ref<GeocodeResult[]>([])
let debounceTimer: number | undefined

const fetchSuggestions = (q: string) => {
  if (!q) {
    suggestions.value = []
    return
  }

  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(async () => {
    try {
      const results = await getCitySuggestions(q, 6)
      suggestions.value = results
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching suggestions', err)
      suggestions.value = []
    }
  }, 300)
}

const handleSearch = (value?: string) => {
  const q = (value ?? city.value).trim()
  if (q) {
    isLoading.value = true
    emit('search', q)
    city.value = ''
    suggestions.value = []
    setTimeout(() => {
      isLoading.value = false
    }, 1000)
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSearch()
  }
}

const selectSuggestion = (s: GeocodeResult) => {
  // Emit coordinates directly so parent can perform a deterministic lookup
  emit('searchCoords', { lat: s.lat, lon: s.lon })
  city.value = ''
  suggestions.value = []
}

const handleBlur = () => {
  // small delay to allow click to register on suggestion
  setTimeout(() => (suggestions.value = []), 150)
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto mb-8">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <input
          v-model="city"
          @input="(e) => fetchSuggestions(city.value)"
          @blur="handleBlur"
          type="text"
          placeholder="Search for a city..."
          class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white placeholder-gray-500 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition"
          @keydown="handleKeydown"
          :disabled="isLoading"
        />

        <ul v-if="suggestions.length" class="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-auto">
          <li v-for="(s, idx) in suggestions" :key="idx" class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" @click="selectSuggestion(s)">
            <div class="text-sm text-gray-900 dark:text-gray-100">{{ s.name }}<span v-if="s.state">, {{ s.state }}</span>, {{ s.country }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Lat: {{ s.lat.toFixed(2) }}, Lon: {{ s.lon.toFixed(2) }}</div>
          </li>
        </ul>
      </div>
      <button
        @click="handleSearch"
        :disabled="!city.trim() || isLoading"
        class="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {{ isLoading ? 'Searching...' : 'Search' }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
