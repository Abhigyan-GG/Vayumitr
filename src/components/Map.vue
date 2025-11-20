<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import * as L from 'leaflet'

interface Props {
  lat: number
  lon: number
  cityName: string
  isLoading?: boolean
}

const emit = defineEmits<{
  selectLocation: [lat: number, lon: number]
}>()

const props = defineProps<Props>()

const mapContainer = ref<HTMLDivElement | null>(null)
const selectedCoords = ref<string>('')
let map: L.Map | null = null
let currentMarker: L.Marker | null = null

onMounted(() => {
  if (!mapContainer.value) return

  // Initialize map
  map = L.map(mapContainer.value).setView([props.lat, props.lon], 10)

  // Add dark theme tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map)

  // Add initial marker
  updateMarker(props.lat, props.lon, props.cityName)

  // Handle map clicks
  map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng
    selectedCoords.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    updateMarker(lat, lng, 'Selected Location')
    emit('selectLocation', lat, lng)
  })

  // Add help text (avoid calling Leaflet control factory to keep TypeScript happy on CI)
  try {
    const container = map.getContainer()
    const helpDiv = document.createElement('div')
    helpDiv.className = 'bg-gray-800 text-white p-3 rounded text-sm border border-gray-700'
    helpDiv.style.position = 'absolute'
    helpDiv.style.top = '10px'
    helpDiv.style.left = '10px'
    helpDiv.style.zIndex = '1000'
    helpDiv.innerHTML = '<strong>💡 Click on map</strong> to select a location'
    container.appendChild(helpDiv)
  } catch (err) {
    // silently ignore if DOM not available
  }
})

const updateMarker = (lat: number, lon: number, name: string) => {
  if (!map) return

  if (currentMarker) {
    map.removeLayer(currentMarker)
  }

  currentMarker = L.marker([lat, lon], {
    icon: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
  })
    .addTo(map)
    .bindPopup(`<div class="bg-gray-800 text-white p-2"><b>${name}</b></div>`)
    .openPopup()
}

watch(
  () => ({ lat: props.lat, lon: props.lon }),
  () => {
    if (map) {
      map.setView([props.lat, props.lon], 10)
      updateMarker(props.lat, props.lon, props.cityName)
    }
  },
)
</script>

<template>
  <div class="space-y-4">
    <div ref="mapContainer" class="w-full h-96 rounded-lg shadow-lg overflow-hidden border border-gray-700"></div>
    <div v-if="selectedCoords" class="bg-gray-800 rounded p-4 border border-gray-700">
      <p class="text-gray-300">
        <span class="font-semibold">Selected Coordinates:</span> {{ selectedCoords }}
      </p>
      <p v-if="props.isLoading" class="text-sm text-gray-400 mt-2">Fetching weather for this location...</p>
    </div>
  </div>
</template>

<style scoped>
:deep(.leaflet-container) {
  background: #1f2937;
}

:deep(.leaflet-popup-content-wrapper) {
  background-color: #111827;
  color: #fff;
  border-radius: 6px;
}

:deep(.leaflet-popup-tip) {
  background-color: #111827;
}

:deep(.leaflet-control-zoom-in),
:deep(.leaflet-control-zoom-out) {
  background-color: #374151 !important;
  color: #fff !important;
}

:deep(.leaflet-control-zoom-in:hover),
:deep(.leaflet-control-zoom-out:hover) {
  background-color: #4b5563 !important;
}

:deep(.leaflet-control) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}
</style>
