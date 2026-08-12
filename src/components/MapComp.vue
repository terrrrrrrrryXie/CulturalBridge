<template>
  <div id="map">Map</div>
</template>

<script setup>
import { defineProps, watch } from 'vue'
const props = defineProps({
  location: Object,
  zoom: Number
})

// load google variable
const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(window.google)
    } else {
      const script = document.createElement('script')
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`
      script.async = true
      script.defer = true
      script.onerror = reject

      window.initMap = () => {
        resolve(window.google)
      }

      document.head.appendChild(script)
    }
  })
}
const initMap = async (location) => {
  const google = await loadGoogleMaps()

  const { Map } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')

  const map = new Map(document.getElementById('map'), {
    zoom: props.zoom,
    center: location,
    mapId: 'DEMO_MAP_ID'
  })

  /* eslint-disable no-new */
  new AdvancedMarkerElement({
    map: map,
    position: location,
    title: 'Uluru'
  })
}

watch(
  () => props.location,
  (newValue) => {
    initMap(newValue)
  },
  { immediate: true }
)
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
</style>
