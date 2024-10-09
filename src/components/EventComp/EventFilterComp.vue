<template>
  <div class="container box">
    <form @submit.prevent="filt">
      <select
        class="form-select selectCommu"
        aria-label="select community"
        v-model="selectedCommu"
      >
        <option selected>Choose Community</option>

        <option
          v-for="(commu, index) in store.state.melCommunityList"
          :key="index"
          :value="commu"
        >
          {{ commu }}
        </option>
      </select>
      <input
        type="text"
        class="form-control"
        id="inputPassword2"
        placeholder="Key word"
        v-model="keyWord"
      />

      <button class="btn btn-primary mb-3 reset" @click="reset">
        <i class="bi bi-arrow-counterclockwise" />
      </button>
      <button type="submit" class="btn btn-primary mb-3" @click="filt">
        Filter
      </button>
    </form>
    <div class="order">
      <div class="btn-group date" role="group" aria-label="Basic example">
        Sort by date in&nbsp;&nbsp;
        <button
          type="button"
          :class="['btn', 'btn-primary', (orderWay === 'asc'&&whatOrder === 'date') ? 'active' : '']"
          @click="order('asc', 'date')"
        >
          ascending
        </button>
        <button
          type="button"
          :class="['btn', 'btn-primary', (orderWay === 'desc'&&whatOrder === 'date') ? 'active' : '']"
          @click="order('desc', 'date')"
        >
          descending
        </button>
      </div>
      <div class="btn-group score" role="group" aria-label="Basic example">
        Sort by score in&nbsp;&nbsp;
        <button
          type="button"
          :class="['btn', 'btn-primary', (orderWay === 'asc'&&whatOrder === 'rate') ? 'active' : '']"
          @click="order('asc', 'rate')"
        >
          ascending
        </button>
        <button
          type="button"
          :class="['btn', 'btn-primary', (orderWay === 'desc'&&whatOrder === 'rate') ? 'active' : '']"
          @click="order('desc', 'rate')"
        >
          descending
        </button>
      </div>
    </div>
  </div>
  <hr />
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, defineEmits } from 'vue'

const store = useStore()
const emit = defineEmits(['filter', 'order'])

const selectedCommu = ref('Choose Community')
const keyWord = ref('')
const orderWay = ref('')
const whatOrder = ref('')

const filt = () => {
  emit('filter', {
    selectedCommu: selectedCommu.value,
    keyWord: keyWord.value
  })
}

const reset = () => {
  selectedCommu.value = 'Choose Community'
  keyWord.value = ''
  orderWay.value = ''
  whatOrder.value = ''
  emit('filter', {
    selectedCommu: selectedCommu.value,
    keyWord: keyWord.value
  })
}

const order = (order, factor) => {
  whatOrder.value = factor
  orderWay.value = order
  emit('order', {
    orderWay: orderWay.value,
    whatOrder: whatOrder.value
  })
}
</script>

<style scoped>
.box {
  height: 28vh;
  padding-top: 2vh;
  /* border: 2px red solid; */
}
form {
  width: 100%;
  height: 30%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.order {
  width: 100%;
  height: 40%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
.btn-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.4vw;
  background-color: rgb(28, 28, 28);
  color: white;
}
.selectCommu {
  width: 30%;
}
input {
  width: 40%;
}
button {
  width: 16%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.reset {
  width: 4%;
  font-size: 2vw;
}
@media (max-width: 768px) {
  .order {
    flex-direction: column;
  }
}
</style>
