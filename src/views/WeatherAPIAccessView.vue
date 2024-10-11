<template>
  <pre>
    {{ jsondata }}
  </pre>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore()
const jsondata = ref(null)

onMounted(async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
        jsondata.value = await store.dispatch('getWeather', { location: location })
    });
  }
})
</script>

<style>

</style>