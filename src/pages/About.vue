<script setup lang="ts">
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-4xl font-bold text-white">About This App</h1>

    <div class="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
      <h2 class="text-2xl font-bold text-white mb-4">Weather & Air Quality Application</h2>
      <p class="text-gray-300 mb-4">
        This application integrates real-time weather data with the OpenWeather Air Pollution API to provide
        comprehensive environmental information for any location worldwide.
      </p>

      <h3 class="text-xl font-bold text-white mb-3 mt-6">Features</h3>
      <ul class="list-disc list-inside space-y-2 text-gray-300 mb-4">
        <li>Current weather conditions including temperature, humidity, wind speed, and more</li>
        <li>Real-time air quality index (AQI) with color-coded severity levels</li>
        <li>Detailed pollutant concentrations for 8 different air pollutants</li>
        <li>AQI scale reference with health impact information</li>
        <li>Search functionality for any city worldwide</li>
      </ul>

      <h3 class="text-xl font-bold text-white mb-3 mt-6">Data Sources</h3>
      <p class="text-gray-300 mb-4">
        All data is sourced from <a href="https://openweathermap.org" class="text-blue-400 hover:text-blue-300">OpenWeather</a>, a leading provider of weather and air quality data.
      </p>

      <h3 class="text-xl font-bold text-white mb-3 mt-6">Air Quality Index (AQI) Scale</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="bg-green-900 bg-opacity-30 rounded p-4 border-l-4 border-green-500">
          <div class="font-semibold text-green-400">1 - Good</div>
          <p class="text-sm text-green-300">Air quality is satisfactory</p>
        </div>
        <div class="bg-yellow-900 bg-opacity-30 rounded p-4 border-l-4 border-yellow-500">
          <div class="font-semibold text-yellow-400">2 - Fair</div>
          <p class="text-sm text-yellow-300">Air quality is acceptable</p>
        </div>
        <div class="bg-orange-900 bg-opacity-30 rounded p-4 border-l-4 border-orange-500">
          <div class="font-semibold text-orange-400">3 - Moderate</div>
          <p class="text-sm text-orange-300">Sensitive groups may experience issues</p>
        </div>
        <div class="bg-red-900 bg-opacity-30 rounded p-4 border-l-4 border-red-500">
          <div class="font-semibold text-red-400">4 - Poor</div>
          <p class="text-sm text-red-300">Everyone may experience issues</p>
        </div>
        <div class="bg-purple-900 bg-opacity-30 rounded p-4 border-l-4 border-purple-500">
          <div class="font-semibold text-purple-400">5 - Very Poor</div>
          <p class="text-sm text-purple-300">Health warnings of emergency conditions</p>
        </div>
      </div>

      <h3 class="text-xl font-bold text-white mb-3 mt-6">Pollutants Monitored</h3>
      <div class="space-y-3">
        <div class="bg-blue-900 bg-opacity-30 rounded p-4 border border-blue-700">
          <div class="font-semibold text-blue-300">PM2.5 & PM10 (Particulate Matter)</div>
          <p class="text-sm text-blue-200">Fine and coarse particles that can penetrate deep into the lungs</p>
        </div>
        <div class="bg-blue-900 bg-opacity-30 rounded p-4 border border-blue-700">
          <div class="font-semibold text-blue-300">NO₂ (Nitrogen Dioxide)</div>
          <p class="text-sm text-blue-200">Primary emissions from traffic and industry</p>
        </div>
        <div class="bg-blue-900 bg-opacity-30 rounded p-4 border border-blue-700">
          <div class="font-semibold text-blue-300">O₃ (Ozone)</div>
          <p class="text-sm text-blue-200">Secondary pollutant formed from NOx and VOCs in sunlight</p>
        </div>
        <div class="bg-blue-900 bg-opacity-30 rounded p-4 border border-blue-700">
          <div class="font-semibold text-blue-300">CO (Carbon Monoxide)</div>
          <p class="text-sm text-blue-200">Toxic gas produced by incomplete combustion</p>
        </div>
        <div class="bg-blue-900 bg-opacity-30 rounded p-4 border border-blue-700">
          <div class="font-semibold text-blue-300">SO₂ (Sulphur Dioxide)</div>
          <p class="text-sm text-blue-200">Industrial emissions that can cause respiratory issues</p>
        </div>
        <div class="bg-blue-900 bg-opacity-30 rounded p-4 border border-blue-700">
          <div class="font-semibold text-blue-300">NH₃ (Ammonia)</div>
          <p class="text-sm text-blue-200">Agricultural emissions affecting air quality</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
