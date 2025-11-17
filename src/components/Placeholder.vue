<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="min-h-96 flex flex-col items-center justify-center bg-gray-800 rounded-lg border-2 border-dashed border-gray-700 p-8">
    <svg class="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <h2 class="text-2xl font-bold text-gray-200 mb-2">{{ title }}</h2>
    <p class="text-gray-400 text-center">{{ description }}</p>
    <p class="text-gray-500 text-sm mt-4">Continue prompting to fill in this page content</p>
  </div>
</template>

<style scoped></style>
