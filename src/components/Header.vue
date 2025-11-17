<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header class="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg dark:from-gray-900 dark:to-gray-800 dark:border-b dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <RouterLink to="/" class="flex items-center gap-2 hover:opacity-80 transition">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 10a3 3 0 106 0 3 3 0 00-6 0z"
            />
          </svg>
          <h1 class="text-2xl font-bold text-white">Vayumitr</h1>
        </RouterLink>
        <nav class="flex gap-6">
          <RouterLink
            to="/"
            class="text-white hover:text-blue-100 transition dark:hover:text-blue-400"
            :class="{ 'border-b-2 border-white': route.path === '/' }"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/forecast"
            class="text-white hover:text-blue-100 transition dark:hover:text-blue-400"
            :class="{ 'border-b-2 border-white': route.path === '/forecast' }"
          >
            Forecast
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-white hover:text-blue-100 transition dark:hover:text-blue-400"
            :class="{ 'border-b-2 border-white': route.path === '/about' }"
          >
            About
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
