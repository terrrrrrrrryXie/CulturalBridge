<template>
<PageTopicComp :page="2" />
  <div class="main">
    <div class="left">
        <form class="d-flex" @submit.prevent="navigate">
            <div class="input">
                <label>
                    <input 
                    class="form-control me-2" 
                    type="search" 
                    placeholder="Enter your start point" 
                    aria-label="Search"
                    v-model="origin"
                    @input="associatePlace(origin, 'origin')"
                    >
                </label>
                <label>
                    <input 
                    class="form-control me-2" 
                    type="search" 
                    placeholder="Enter your destination" 
                    aria-label="Search"
                    v-model="destination"
                    @input="associatePlace(destination, 'destination')"
                >
                </label>
                <label>
                    <select class="form-select" v-model="routeMode" aria-label="Default select example">
                        <option value="walking">Walking</option>
                        <option value="driving">Driving</option>
                        <option value="bicycling">Bicycling</option>
                        <option value="transit">Transit</option>
                    </select>
                </label>
            </div>
        
            <button 
            class="btn btn-outline-primary" 
            type="submit"
            >
            {{ originLocation?destinationLocation?'Go':'Choose Destination':'Choose Start Point' }}
            </button>
        </form>
        <ul class="list-group list" v-if="!showRoutes && !showSteps">
            <li class="list-group-item listTopic" style="cursor: default">Relevant Locations</li>
            <li 
            class="list-group-item" 
            v-for="(location, index) in associatedPlace"
            :key="index"
            @click="setInputBar(location)"
            >
            {{ location.formatted_address }}
            </li>
            <div class="empty" v-if="associatedPlace.length === 0">
                No result
            </div>
        </ul>
        <ul class="list-group list" v-if="showRoutes">
            <li class="list-group-item listTopic" style="cursor: default">All Routes</li>
            <li 
            class="list-group-item"
            v-for="(route, index) in allRoutes"
            :key="index"
            @click="chooseRoute(route)"
            >
                {{index + 1 + '. '}}
                <strong>Total Distance: </strong>{{ Number((calculateRouote(route, 'distance') / 1000).toFixed(2)) + ' km' }},
                <strong>Estimate Dusration: </strong>{{ Math.round(calculateRouote(route, 'duration') / 60) + ' mins' }}
            </li>
            <div class="empty" v-if="allRoutes.length === 0">
                No result
            </div>
        </ul>
        <ul class="list-group list" v-if="showSteps">
            <li class="list-group-item listTopic" style="cursor: default">Steps</li>
            <li 
            class="list-group-item"
            v-for="(step, index) in steps"
            :key="index"
            v-html="(index + 1 + '. ') + step.html_instructions"
            @click="location = step.end_location"
            />
            <div class="empty" v-if="steps.length === 0">
                No result
            </div>
        </ul>
    </div>
    <div class="right">
        <div class="col-md-8 main-content map">
            <MapComp :location="location" :zoom="16" />
        </div>
        <button class="btn btn-primary mb-3 reset" @click="getCurrentLocation">
            <i class="bi bi-arrow-counterclockwise" />
        </button>
    </div>
  </div>
  
</template>

<script setup>
import PageTopicComp from '@/components/PageTopicComp.vue'
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import MapComp from '../components/MapComp.vue'

const store = useStore()
// the position shown on map
const location = ref(null)
const routeMode = ref('walking')

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

const showRoutes = ref(false)
const showSteps = ref(false)
const allRoutes = ref([])

const origin = ref('')
const originLocation = ref('')
const destination = ref('')
const destinationLocation = ref('')
const navigate = async () => {
    showRoutes.value = true
    showSteps.value = false
    
    const response = await store.dispatch('getDirection', { 
        origin: originLocation.value.location,
        destination: destinationLocation.value.location,
        mode: routeMode.value
        })
    allRoutes.value = response.routes
    
}

// calculate total duration/distance of route
const calculateRouote = (route, attribute) => {
    let result = 0
    route.legs.forEach((leg) => {
        result += leg[attribute].value
    });
    return result
}

const steps = ref([])
const chooseRoute = (route) => {
    showRoutes.value = false
    showSteps.value = true
    
    let result = []
    route.legs.forEach((leg) => {
        leg.steps.forEach((step) => {
            result.push(step)
        })
    })

    steps.value = result
}

const associatedPlace = ref([])
const entering = ref('')
const associatePlace = async (userInput, value) => { 
    showRoutes.value = false   
    showSteps.value = false
    entering.value = value
    const relatedResult = await store.dispatch('getCommunityInfo', userInput)    
    associatedPlace.value = relatedResult.results
}

const setInputBar = (content) => {
    entering.value == 'origin' ? origin.value = content.formatted_address : destination.value = content.formatted_address
    entering.value == 'origin' ? originLocation.value = content.geometry : destinationLocation.value = content.geometry
    location.value = content.geometry.location    
}

</script>

<style scoped>
    label {
        width: 100%;
    }
    .reset {
        position: absolute;
        right: 0.6vw;
        top: 1.6vh;
    }

    .main {
        /* border: 2px red solid; */
        height: 80vh;
        display: flex;
        width: 80vw;
        flex-direction: row;
        margin: auto;
    }
    @media (max-width: 768px) {
        .main {
            flex-direction: column;
        }
        .left {
            width: 100% !important
        }
        .right {
            width: 100%!important;
            height: 40vh;
        }
        form {
            height: 12vh !important;
        }
        #map {
            height: 40vh;
            width: 100%;
        }
        .list {
            height: 26vh !important;
        }
        .empty {
            font-size: 4vw !important;
        }
    }
    .left {
        width: 50%;
    }
    form {
        width: 100%;
        /* border: 2px green solid; */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 18vh;
    }
    form .input {
        width: 68%;
    }
    form button {
        width: 34%;
        height: 60%;
    }
    .list {
        width: 100%;
        height: 61.4vh;
        /* border: 1px hotpink solid; */
        overflow: auto;
    }
    .right {
        width: 50%;
        height: 100%;
        /* border: 2px rgb(0, 255, 30) solid; */
        position: relative;
    }

    .map {
        /* border: 2px blue solid; */
        height: 100%;
        width: 100%;
    }
    .listTopic {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgb(33, 33, 33);
        color: whitesmoke;
        position: sticky;
        top: 0;
        z-index: 1000;
        font-size: 1.2rem;
        font-weight: bold;
    }
    li {
        cursor: pointer;
    }
    .empty {
        width: 100%;
        height: 100%;
        border: 4px saddlebrown solid;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bolder;
        font-size: 1.4vw;
    }
</style>