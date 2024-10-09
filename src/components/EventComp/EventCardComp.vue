<template>
  <div
    class="card"
    :style="[
      'width: 18rem',
      hiddenTag ? 'border: 2px red solid' : '',
      hiddenForUser ? 'display: none;' : '',
    ]"
  >
    <router-link
      class="img-container"
      :to="{ name: 'event_detail', params: { id: eventKey } }"
    >
      <img :src="image" class="card-img-top" alt="event cover" />
    </router-link>
    <div class="card-body">
      <h5 class="card-title">{{ eventName }}</h5>
      <p class="card-text">
        {{ showText }}
      </p>
      <div class="bottom">
        <router-link
          :to="{ name: 'event_detail', params: { id: eventKey } }"
          class="btn btn-primary"
          id="view"
        >
          View Detail
          <span v-if="hiddenTag" class="badge bg-secondary">Hidden</span>
        </router-link>
        <label>{{ date }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, defineProps } from 'vue'

const store = useStore()
const props = defineProps({
  eventName: String,
  description: String,
  date: String,
  image: String,
  eventKey: Number,
  isHidden: Boolean
})

const hiddenTag = computed(() => {
  if (store.state.currentRole === 'admin' && props.isHidden) {
    return true
  }
  return false
})

const hiddenForUser = computed(() => {
  if (store.state.currentRole === 'user' && props.isHidden) {
    return true
  }
  return false
})

const showText = computed(() => {
  if (props.description.length <= 90) {
    return props.description
  }
  let result = props.description.slice(0, 80)

  if (result[result.length - 1] !== ' ') {
    const lastSpaceIndex = result.lastIndexOf(' ')

    if (lastSpaceIndex !== -1) {
      result = result.slice(0, lastSpaceIndex)
    }
  }

  return result + '...'
})
</script>

<style scoped>
.img-container {
  height: 60%;
  overflow: hidden;
}
img {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease-in-out;
  object-fit: cover;
}
.img-container:hover img {
  transform: scale(1.2);
}
.card {
  flex: 1 1 calc(33.333% - 2vw);
  margin-bottom: 20px;
  height: 60vh;
}

@media (max-width: 768px) {
  .card {
    flex: 1 1 calc(50% - 20px);
  }
}

@media (max-width: 576px) {
  .card {
    flex: 1 1 100%;
    margin-bottom: 10px;
  }
}
.bottom {
  position: absolute;
  bottom: 4%;
  width: 100%;
}

.bottom label {
  position: absolute;
  right: 4vw;
  bottom: 0;
}
</style>
