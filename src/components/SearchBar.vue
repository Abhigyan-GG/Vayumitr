<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  search: [city: string]
}>()

const city = ref('')
const isLoading = ref(false)

const handleSearch = () => {
  if (city.value.trim()) {
    isLoading.value = true
    emit('search', city.value.trim())
    city.value = ''
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
</script>

<template>
  <div class="w-full max-w-2xl mx-auto mb-8">
    <div class="flex gap-2">
      <input
        v-model="city"
        type="text"
        placeholder="Search for a city..."
        class="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition"
        @keydown="handleKeydown"
        :disabled="isLoading"
      />
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
