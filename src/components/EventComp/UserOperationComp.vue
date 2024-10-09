<template>
  <div class="lower-right">
        <button
        type="button"
        :class="['btn', isBooked?'btn-warning':'btn-primary']"
        v-if="store.state.currentRole ==='user'"
        @click="bookEvent"
        >
          <i class="bi bi-person-add" />{{  isBooked?'Cancel Booking':'Book Now!' }}
        </button>
        <button
        type="button"
        class='btn btn-primary'
        v-if="store.state.currentRole ==='user' && isBooked"
        @click="exportPDF"
        >Export Confirmation PDF
        </button>

        <RateEventComp
        :currentScore="currentScore"
        :ratedPeople="ratedPeople"
        v-if="store.state.currentRole ==='user'"
        />

        <HideEventComp
        v-else-if="store.state.currentRole ==='admin'"
        />
      </div>
</template>

<script setup >
import { computed, defineProps, defineEmits } from 'vue'
import RateEventComp from './RateEventComp.vue'
import HideEventComp from './HideEventComp.vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useStore()
const props = defineProps({
  currentScore: Number,
  ratedPeople: Number
})
console.log(props);
const emit = defineEmits(['exportPDF', 'sendConfirmation'])


const isBooked = computed(() => {
  return store.state.currentUserInfo.booked.includes(route.params.id)
})

const bookEvent = () => {
  emit('sendConfirmation')
  store.dispatch('bookEvent', { eventId: route.params.id })
}

const exportPDF = () => {  
  emit('exportPDF')
}

</script>

<style>
.lower-right {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: relative;
  /* border: 2px red solid; */
}
.lower-right .btn {
  text-align: center;
  line-height: 200%;
  width: 100%;
}
.lower-right .btn i {
  font-size: 1.4rem;
  margin-right: 0.6vw;
}

</style>
