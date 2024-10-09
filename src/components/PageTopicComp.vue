<template>
  <div class="container topic">
    <div class="pageName">
      <i :class="['bi', iconClass]" />
      {{ name[page] }}
    </div>
  </div>
  <hr> 
</template>

<script setup>
import { ref, defineProps, computed } from 'vue'

/* eslint-disable */
const props = defineProps({
  page: Number,
});
/* eslint-disable */


// use specified number to choose icon
const icon = ref([
  "buildings",
  "calendar-event",
  'sign-turn-right'
]);
const name = ref([
    "City Info",
    "Community Event",
    'Navigator'
])

const iconClass = computed(() => {
    
    return 'bi-'+icon.value[props.page]
})

</script>

<style scoped>
.bi {
  font-size: 3.4rem;
}
.topic {
  height: 14vh;
  padding-top: 2vh;
  margin-bottom: 2vh;
}
.topic .pageName {
  height: 100%;
  width: 100%;
  font-size: 1.8rem;
  font-weight: bold;
}
</style>
