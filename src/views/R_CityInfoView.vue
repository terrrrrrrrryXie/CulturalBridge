<template>
  <PageTopicComp :page="0" />
  <div class="container main">
    <form class="d-flex" @submit.prevent="redirect(inputPlace)">
      <label>
        <input 
          class="form-control me-2" 
          type="search" 
          placeholder="Search place here" 
          aria-label="Search"
          v-model="inputPlace"
        >
      </label>
      <button class="btn btn-outline-primary" type="submit">Search</button>
    </form>
    
    <div class="row">
      <div class="col-md-4 sidebar">
        <div class="list-topic">Community List</div>
        <div class="list-group">
          <a
            href="#"
            v-for="(name, index) in communityList"
            :key="index"
            ref="communityName"
            class="list-group-item list-group-item-action"
            @click="redirect(name + ' AU')"
          >
            {{ name }}
          </a>
        </div>
      </div>
      <div class="col-md-8 main-content map">
        <MapComp :location="location" :zoom="12" />
      </div>
    </div>
  </div>
</template>

<script setup>
import PageTopicComp from '@/components/PageTopicComp.vue'
import MapComp from '../components/MapComp.vue'
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

// the position shown on map
const location = ref(null)

// get current location coordinate and set to location
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      location.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    })
  } else {
    alert('Geolocation is not supported by this browser.')
  }
}

onMounted(() => {
  getCurrentLocation()
})

// get all community name
const store = useStore()
const communityList = store.state.melCommunityList
// the place input by user
const inputPlace = ref('')

// change current position
const redirect = async (name) => {
  try {
    const newLocation = await store.dispatch('getCommunityInfo', name)

    if (newLocation && newLocation.results.length > 0) {
      location.value = newLocation.results[0].geometry.location
    } else {
      console.error('No result returned')
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
form {
  /* border: 2px green solid; */
  display: flex;
  flex-direction: row;
  width: 27.2vw;
  margin: 0;
  /* margin-left: auto; */
  margin-bottom: 0.8vh;
  position: relative;
  height: 6vh;
} 

form button {
  width: 30%;
  height: 100%;
  /* margin-left: auto; */
  position: absolute;
  right: 0;
}

form input {
  width: 68%;
  height: 100%;
  padding: 1.2vh;
  /* margin-left: auto; */  
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  form {
    width: 50vw;
  }
}

.map {
  /* border: 2px blue solid; */
  height: 90%;
}

.row {
  height: 100%;
}

.main {
  /* border: 2px yellow solid; */
  height: 70vh;
}

@media (max-width: 767.9px) {
    .row {
        height: 26vh;
    }
  .main {
    height: auto;
  }
  .map {
    height: 50vh;
    width: 100%;
  }
  .list-topic {
    height: 6vh !important;
  }
}
.sidebar {
  /* border: 2px green solid; */
  height: 90%;
  position: relative;
}
.list-topic {
  width: 100%;
  height: 8vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(33, 33, 33);
  color: whitesmoke;
  /* position: sticky; */
  top: 0;
  z-index: 1000;
  font-size: 1.2rem;
  font-weight: bold;
}
.list-group {
  font-size: 1.2rem;
  height: calc(100% - 8vh);
  overflow: scroll;
  overflow-x: hidden;
}
.list-group-item {
  height: 8vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
