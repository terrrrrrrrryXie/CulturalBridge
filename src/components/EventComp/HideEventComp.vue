<template>
  <button
        type="button"
        class="btn btn-danger"
        @click="hideThis"
        >
          <i :class="['bi', 'bi-eye-slash'+(hideState?'-fill':'')]" />
          {{ hideState?'Hided':'Hide This' }}
        </button>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const route = useRoute()

// check whether hided with localstorage
const hideState = computed({
  get () {
    const scoreRecord = store.state.hidedEventList.includes(route.params.id)

    return scoreRecord
  },
  set () {

  }
})

const hideThis = () => {
  store.dispatch('hideEvent', { eventId: route.params.id })
}
</script>

<style scoped>
.btn {
    position: absolute;
    top: 0;
}
</style>
