<template>
  <button
        type="button"
        :class="['btn', 'btn-'+(rateRecord!==-1?'success':'secondary')]"
        @click="rateEvent"
        :disabled="rateRecord!==-1"
        >
          <i :class="['bi', 'bi-emoji-smile'+(rateRecord!==-1?'-fill':'')]" />
          {{ rateRecord!==-1?'Rated':'Rate This'}}
        </button>

        <div class="star">
          <div class="textRate">Current Score: {{ roundedScore }}</div>
          <i
            v-for="index in 5"
            :key="index"
            :class="['bi', 'bi-' + getStarClass(index, roundedScore)]"
          />
        </div>
        <div class="star" @mousemove="chooseRate" ref="ratingBox">
          <div class="textRate">My Score: {{ rateRecord===-1?myScore:rateRecord }}</div>
          <i
            v-for="index in 5"
            :key="index"
            :class="['bi', 'bi-' + getStarClass(index, rateRecord===-1?myScore:rateRecord)]"
            :style="rateRecord===-1?'':'color: green;'"
          />
        </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps({
  currentScore: Number,
  ratedPeople: Number
})
const route = useRoute()
const store = useStore()

// the current score gave by all users
const roundedScore = computed(() => {
  // rounded to multiplier of 0.5
  return Math.round(props.currentScore / 0.5) * 0.5
})

// show score
const getStarClass = (index, score) => {
  if (score >= index) {
    return 'star-fill'
  } else if (score >= index - 0.5) {
    return 'star-half'
  } else {
    return 'star'
  }
}

// if user rated before, then return the history value, otherwise return undefined
// the score gave before
const rateRecord = computed({
  get () {
    const scoreRecord = store.state.currentUserInfo.ratedEvent[route.params.id]

    return scoreRecord === undefined ? -1 : scoreRecord
  }
})

// the rating box
const ratingBox = ref(null)
// the user given's score for now
const myScore = ref(0)

const chooseRate = (e) => {
  const border = e.currentTarget.getBoundingClientRect()
  // distance between cursor and left border
  const distance = e.clientX - border.left

  // total width of box
  const boxWidth = ratingBox.value.offsetWidth

  // How much width each star spans
  const widthPerStar = boxWidth / 5

  // (cursor distance)/(star's width) is the score, then rounded
  const result = Math.round((distance / widthPerStar) / 0.5) * 0.5
  myScore.value = result < 0 ? 0 : result
}

// when click rate button
const rateEvent = () => {
  const totalScore = props.currentScore * props.ratedPeople
  const newScore = (totalScore + myScore.value) / (props.ratedPeople + 1)

  // call addRateEvent in store action, update user info in database
  store.dispatch('addRatedEvent', {
    eventId: route.params.id,
    myScore: myScore.value,
    newRating: newScore,
    newRatedPeople: props.ratedPeople + 1
  })
}
</script>

<style scoped>
.textRate {
  font-size: 1.2vw;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: -12vw;
}
.star {
  height: 16%;
  width: 40%;
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 2.4vw;
}
.star i {
  cursor: pointer;
}

@media (max-width: 768px) {
  .star {
    width: 80%;
    font-size: 5.4vw;
  }
  .textRate {
    top: -2vh;
    left: auto;
    font-size: 2.8vw;
    white-space: nowrap;
  }
}
</style>
