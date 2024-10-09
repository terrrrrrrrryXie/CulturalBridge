<template>
  <router-link to="/community/events" class="btn btn-primary btn-sm back"
    >Back to list</router-link
  >
  <div class="container">
    <!-- top part -->
    <div
      class="p-4 p-md-5 row-mb-4 rounded text-bg-dark d-flex flex-column flex-md-row topPart"
    >
      <div
        class="col-md-6 bottom-card row g-0 border overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative"
      >
        <div class="col p-4 d-flex flex-column position-static">
          <h1 class="display-4 fst-italic">
            {{ eventInfo.event_name }}
          </h1>
          <p class="lead my-3">
            {{ eventInfo.description }}
          </p>
        </div>
      </div>
      <div
        class="map col-md-6 bottom-card row g-0 border overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative"
      >
        <MapComp
          :location="{
            lat: eventInfo.location.latitude,
            lng: eventInfo.location.longitude,
          }"
          :zoom="14"
        />
      </div>
    </div>

    <!-- lower part -->
    <div class="lower-part row mb-2">
      <!-- left -->
      <div class="lower-left">
        <ul class="list-group">
          <li class="list-group-item">
            <i class="bi bi-pin-map-fill" /> Address:
            {{ eventInfo.location.address }}
          </li>
          <li class="list-group-item">
            <i class="bi bi-calendar"></i> Date: {{ eventInfo.date }}
          </li>
          <li class="list-group-item">
            <i class="bi bi-clock" /> Time: {{ eventInfo.time }}
          </li>
          <li class="list-group-item">
            <i class="bi bi-trophy" /> Organizer: {{ eventInfo.organizer }}
          </li>
          <li class="list-group-item">
            <i class="bi bi-people-fill" /> Attendees: {{ eventInfo.attendees }}
          </li>
          <li class="list-group-item">
            <i class="bi bi-people" /> Spot Left:
            {{ eventInfo.remaining_spots }}
          </li>
        </ul>
      </div>
      <!-- right -->
      <UserOperationComp
        :currentScore="eventInfo.rating"
        :ratedPeople="eventInfo.ratedPeople"
        @exportPDF="exportPDF"
        @sendConfirmation="sendConfirmation"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import MapComp from '../components/MapComp.vue'
import UserOperationComp from '../components/EventComp/UserOperationComp.vue'
import html2pdf from 'html2pdf.js';

const store = useStore()
const route = useRoute()

const eventInfo = ref(store.state.eventList.find(e => e.id === route.params.id))

onMounted(async () => {
  const response = await fetch('../../../EventInfo.html')
  const element = document.createElement('div')
  element.innerHTML = await response.text()
  element.querySelector('#name').textContent = eventInfo.value.event_name
  element.querySelector('#attendees').textContent = eventInfo.value.attendees
  element.querySelector('#location').textContent = eventInfo.value.location.address + ', ' + eventInfo.value.location.community
  element.querySelector('#organizer').textContent = eventInfo.value.organizer
  element.querySelector('#date').textContent = eventInfo.value.date
  element.querySelector('#description').textContent = eventInfo.value.description
  element.querySelector('#time').textContent = eventInfo.value.time
  element.querySelector('#user_email').textContent = store.state.currentUserInfo.email
  confirmationContent.value = element
})

const confirmationContent = ref('')
const confirmationOptions = {
    margin: 10,
    filename: 'BookingConfirmation.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

const exportPDF = async () => {  
  await html2pdf()
    .from(confirmationContent.value)
    .set(confirmationOptions).save()
};

const sendConfirmation = async () => {
  const reader = new FileReader();
  const blob = await html2pdf()
    .from(confirmationContent.value)
    .set(confirmationOptions).output('blob')
  
  // convert to base64 code
  reader.readAsDataURL(blob);
  reader.onloadend = async () => {
    const base64Data = reader.result.split(',')[1];
    
    store.dispatch('sendConfirmation', {
      email: store.state.currentUserInfo.email, 
      fileContent: base64Data
    })
  };
}
</script>

<style scoped>
.p-4.p-md-5.mb-4.rounded.text-bg-dark {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}

@media (min-width: 768px) {
  .p-4.p-md-5.mb-4.rounded.text-bg-dark {
    flex-direction: row;
  }
}
.topPart {
  padding: 2rem !important;
}

.lower-part {
  margin-top: 4vh;
}

.lower-left {
  width: 50%;
}
.container {
  margin-top: 4vh;
}

.map {
  min-height: 20vh;
}
#map {
  min-height: 20vh;
}

.back {
  position: sticky;
  top: 12vh;
  left: 2vw;
}
</style>
