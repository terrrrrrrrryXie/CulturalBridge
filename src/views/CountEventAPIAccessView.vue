<template>
  <pre>{{ jsondata }}</pre>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore()
const jsondata = ref(null)

onMounted(async () => {
  jsondata.value = await store.dispatch('countEventListAPI')
})
</script>

<style>

</style>