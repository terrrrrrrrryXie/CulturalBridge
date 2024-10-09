<template>
  <downloadCSV class="btn btn-primary btn-sm export" :data="csvData" name="export.csv">
      Download CSV
  </downloadCSV>
  <div class="container">
    <PageTopicComp :page="1" />
    <EventFilterComp @filter="filtList" @order="orderList" />
    <div class="card-container">
      <!-- isHidden only used for admin function -->
      <EventCardComp
        v-for="(event, index) in paginatedEvents"
        :key="index"
        :isHidden="isEventHidden(event.id)"
        :eventName="event.event_name"
        :description="event.description"
        :date="event.date"
        :image="event.image_url"
        :eventKey="Number(event.id)"
      />
    </div>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage <= 1 }">
          <a class="page-link" @click="currentPage--">Previous</a>
        </li>
        <li v-for="index in totalNumPage" :key="index" class="page-item">
          <a class="page-link" @click="currentPage = index">{{ index }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage >= totalNumPage }">
          <a class="page-link" @click="currentPage++">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import PageTopicComp from '@/components/PageTopicComp.vue'
import EventCardComp from '../components/EventComp/EventCardComp.vue'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import EventFilterComp from '@/components/EventComp/EventFilterComp.vue'

const store = useStore()

const isEventHidden = (index) => {
  return store.state.hidedEventList.includes(index.toString())
}

// some events might be hide for user but not hide for admin
const visibleEventList = ref([])
// for unset filter
const backup = ref([])

const csvData = computed(() => {
  return visibleEventList.value.map(event => {
    return {
      ID: event.id,
      Title: event.event_name,
      Description: event.description,
      Date: event.date.toString(),
      Time: event.time,
      Rating: event.rating,
      Attendees: event.attendees,
      'Remaining Spot': event.remaining_spots,
      'Ticket Price': event.ticket_price,
      'Rated People': event.ratedPeople,
      Organizer: event.organizer,
      image_url: event.image_url,
      Address: event.location.address,
      Community: event.location.community,
      Longitude: event.location.longitude,
      Latitude: event.location.latitude,
    };
});
})

onMounted(async () => {
  await store.dispatch('getEventList')
  visibleEventList.value = await store.state.eventList
  backup.value = visibleEventList.value
})

const filtList = ({ selectedCommu, keyWord }) => {
  const isCommuChosen = selectedCommu !== 'Choose Community'
  const isKeyWdChosen = keyWord !== ''
  if (!isCommuChosen && !isKeyWdChosen) {
    visibleEventList.value = backup.value
    return
  }

  const result = []

  for (const event of backup.value) {
    // boolean: no community selected/matched
    // if a community been chosen for factor, then check whether current event mathed
    const checkCommu =
      !isCommuChosen || event.location.community === selectedCommu
    // boolean: no specified key word/description matches key word/topic matches key word
    const checkKeyWord =
      !isKeyWdChosen ||
      event.description.includes(keyWord) ||
      event.event_name.includes(keyWord)

    // selected community, no key word
    // decide whether keep this event by match key word
    if (isCommuChosen && !isKeyWdChosen) {
      if (checkCommu) {
        result.push(event)
      }
      // specified key word, no selected community
    } else if (isKeyWdChosen && !isCommuChosen) {
      if (checkKeyWord) {
        result.push(event)
      }
      // both key word and community specified
    } else if (isCommuChosen && isKeyWdChosen) {
      if (checkCommu && checkKeyWord) {
        result.push(event)
      }
    }
  }
  visibleEventList.value = result
}

const orderList = ({ orderWay, whatOrder }) => {
  visibleEventList.value.sort((a, b) => {
    if (whatOrder === 'date') {
      const aDate = new Date(a.date)
      const bDate = new Date(b.date)

      return orderWay === 'asc' ? aDate - bDate : bDate - aDate
    } else if (whatOrder === 'rate') {
      return orderWay === 'asc' ? a.rating - b.rating : b.rating - a.rating
    }
    return 0
  })
}

// PAGINATION
const currentPage = ref(1)
const numPerPage = ref(10)

const totalNumPage = computed(() => {
  return Math.ceil(visibleEventList.value.length / numPerPage.value)
})

// event shown on each page
const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * numPerPage.value
  const end = start + numPerPage.value
  return visibleEventList.value.slice(start, end)
})
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4vh;
  margin-top: 0vh;
}

.export {
  position: sticky;
  top: 12vh;
  left: 2vw;
  z-index: 1;
  opacity: .8;
  transition: all, .3s;
}

.export:hover {
  opacity: 1;
}
</style>
