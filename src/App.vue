<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-950 dark:bg-gray-950 text-white">
    <Header />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>

    <footer class="bg-gray-900 dark:bg-gray-900 text-gray-300 text-center py-8 mt-12 border-t border-gray-800">
      <p>
        Weather & Air Quality Data by
        <a href="https://openweathermap.org" class="text-blue-400 hover:text-blue-300">OpenWeather</a>
      </p>
      <p class="text-sm mt-2">Air Pollution API provides current, forecast, and historical air quality data</p>
    </footer>
  </div>
</template>

<style scoped></style>
