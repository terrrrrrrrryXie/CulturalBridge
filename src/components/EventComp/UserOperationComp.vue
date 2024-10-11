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
        ><i class="bi bi-file-pdf" />Export Confirmation PDF
        </button>
        <button
        type="button"
        class='btn btn-info'
        v-if="store.state.currentRole ==='user' && isBooked"
        data-bs-toggle="modal" 
        data-bs-target="#bulkEmailInput"
        ><i class="bi bi-share" />Share with friends
        </button>
        <div class="modal fade" id="bulkEmailInput" tabindex="-1" aria-labelledby="bulkEmail" aria-hidden="true">
          <div class="modal-dialog">
            <form class="modal-content" @submit.prevent="inviteFriends">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="bulkEmailTitle">Share with your firends!</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <label for="nickname">How to address you?</label>
                <input id="nickname" type="text" class="form-control" placeholder="display for your friend" v-model="nickname">
              </div>
              <div class="modal-body" v-for="(email, index) in friendEmail" :key="index">
                <label :for="index">{{ 'Friend ' + (index + 1) }}</label>
                <input :id="index" type="email" class="form-control" placeholder="name@friend.com" v-model="friendEmail[index]" required>
                <a 
                  class="deleteFE" 
                  aria-label="delete" 
                  @click="friendEmail.splice(index, 1)"
                  v-if="friendEmail.length > 2"
                >
                  <i class="bi bi-x-circle" />
                </a>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" @click="friendEmail.push('')">Add More</button>
                <button type="submit" class="btn btn-success">Notify Them</button>
              </div>
            </form>
          </div>
        </div>
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
import { computed, defineProps, defineEmits, ref } from 'vue'
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
const emit = defineEmits(['exportPDF', 'sendConfirmation', 'sendBulkEmail'])

const nickname = ref('')
const friendEmail = ref(['', ''])

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

const inviteFriends = () => { 
  emit('sendBulkEmail', { nickname: nickname.value, toEmails: friendEmail.value })
  friendEmail.value = ['', '']
}
</script>

<style>
.deleteFE {
  position: absolute;
  right: 1.2vw;
  top: 2vh;
  font-size: 1.2vw;
  cursor: pointer;
}
@media (max-width: 768px) {
  .deleteFE {
    font-size: 2vw;
    right: 1.6vw;
  }
}
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
.modal-footer {
  flex-wrap: nowrap;
}
</style>
