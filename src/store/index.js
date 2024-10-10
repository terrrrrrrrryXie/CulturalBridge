import { createStore } from 'vuex'
import axios from 'axios'
import { generateSalt, hashPassword } from '../utils/crypto'
import db from '../firebase/init.js'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  arrayUnion,
  increment,
  arrayRemove
} from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const {GoogleGenerativeAI} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("REDACTED_GOOGLE_API_KEY");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are a cat. Your name is Snowball. You've been deployed on a charity's website and you're responsible for guarding the site and giving some warmth to the visitors who come to it."
});

export default createStore({
  state: {
    melCommunityList: [
      'Carlton',
      'Fitzroy',
      'South Yarra',
      'St Kilda',
      'Richmond',
      'Brunswick',
      'Docklands',
      'Footscray',
      'Prahran',
      'Hawthorn',
      'Toorak',
      'South Melbourne',
      'Melbourne CBD',
      'Essendon',
      'Caulfield',
      'Williamstown',
      'Glen Waverley',
      'Brighton'
    ],
    // whether user has login
    isLogin: false,
    // current user's email&passwd
    currentUserInfo: null,
    // user/admin
    currentRole: null,

    // event list
    eventList: null,
    // hided event list
    hidedEventList: null,

    immiStories: null
  },
  getters: {
  },
  mutations: {
    // set log state when login
    setLogState (state, { newIsLogin, newCurrentUserInfo, newCurrentRole }) {
      state.isLogin = newIsLogin
      state.currentUserInfo = newCurrentUserInfo
      state.currentRole = newCurrentRole
    },
    // initialize event list in store
    setEventList (state, eventList) {
      state.eventList = eventList
    },
    // initialize hided event list in store
    setHidedEventList (state, hidedEventList) {
      state.hidedEventList = hidedEventList
    },
    // assign a new value to specified attribute for specific event
    // modify specific value in local
    modifyEventList (state, { id, attribute, newValue }) {
      state.eventList.find(e => e.id === id)[attribute] = newValue
    },
    // set immigrant stories
    setImmiStories (state, storiesList) {
      state.immiStories = storiesList
    }
  },

  actions: {
    // search place by text
    async getCommunityInfo (_, input) {
      try {
        const response = await axios.get('https://getcommunityinfo-7ayuf7vtfq-uc.a.run.app', {
          params: {
            input: input
          }
        })
        
        return response.data
      } catch (error) {
        console.error('error:', error)
      }
    },

    // initialize event list fron api
    async getEventList ({ commit, state }) {
      try {
        const allEventFromDatabase = await getDocs(collection(db, 'events'))

        // load hided events list from database to local
        const hideEventList = []
        const hideEventListFromDatabase = await getDocs(collection(db, 'hideList'))
        hideEventListFromDatabase.forEach(event => {
          hideEventList.push(event.data().id)
        })

        const allEvents = []
        allEventFromDatabase.forEach(element => {
          if (state.currentRole === 'user' && !hideEventList.includes(element.data().id)) {
            allEvents.push(element.data())
          } else if (state.currentRole === 'admin') {
            allEvents.push(element.data())
          }
        })

        commit('setHidedEventList', hideEventList)
        commit('setEventList', allEvents)
      } catch (error) {
        console.error(error)
      }
    },

    async searchEmail (_, email) {
      const q = query(collection(db, 'users'), where('email', '==', email))
      const result = await getDocs(q)
      if (result.empty) {
        return null
      }
      return [result.docs[0].data(), result.docs[0].ref]
    },

    // registration new user
    async regist ({ commit, dispatch }, { email, passwd }) {
      const result = await dispatch('searchEmail', email)
      if (result !== null) {
        return 'This email already registered!'
      }

      const auth = getAuth()
      createUserWithEmailAndPassword(auth, email, passwd).catch((error) => {
        console.log('Regist fail: ', error)
      })

      // generate a salt value for encryption
      const salt = generateSalt()

      await addDoc(collection(db, 'users'), {
        email: email,
        password: hashPassword(passwd, salt),
        salt: salt,
        // avoid user rate one event twice
        ratedEvent: {},
        booked: [],
        role: 'user'
      })

      commit('setLogState', {
        newIsLogin: true,
        newCurrentUserInfo: {
          email: email,
          ratedEvent: {},
          booked: []
        },
        newCurrentRole: 'user'
      })
      return ''
    },

    // login
    async login ({ commit, dispatch }, { email, password }) {
      const result = await dispatch('searchEmail', email)
      if (result[0] === null) {
        return 'email'
      }
      const auth = getAuth()
      try {
        await signInWithEmailAndPassword(auth, email, password)
        commit('setLogState', {
          newIsLogin: true,
          newCurrentUserInfo: { email: result[0].email, ratedEvent: result[0].ratedEvent, booked: result[0].booked },
          newCurrentRole: result[0].role
        })
        return ''
      } catch (error) {
        console.log('Login error:', error)
        return 'passwd'
      }
    },

    // add reated event
    async addRatedEvent ({ state, dispatch }, { eventId, myScore, newRating, newRatedPeople }) {
      // update user info in database, and also update local
      const result = await dispatch('searchEmail', state.currentUserInfo.email)
      const ratedEvent = result[0].ratedEvent
      

      ratedEvent[eventId] = myScore
      await updateDoc(result[1], { ratedEvent })

      state.currentUserInfo.ratedEvent[eventId] = myScore

      // update event info in database, and also update local
      const q = query(collection(db, 'events'), where('id', '==', eventId))
      const eventRef = (await getDocs(q)).docs[0].ref
      await updateDoc(eventRef, {
        rating: newRating,
        ratedPeople: newRatedPeople
      })
      state.eventList.find(e => e.id === eventId).rating = newRating
      state.eventList.find(e => e.id === eventId).ratedPeople = newRatedPeople
    },

    // modify the local hided events list and database side
    async hideEvent ({ state }, { eventId }) {
      let action
      // add to list
      if (!state.hidedEventList.includes(eventId)) {
        state.hidedEventList.push(eventId)
        action = 'hide'

        // remove from list
      } else {
        state.hidedEventList = state.hidedEventList.filter((item) => item !== eventId)
        action = 'unhide'
      }
      try {
        await axios.get('https://hideevent-7ayuf7vtfq-uc.a.run.app', {
          params: { eventId: eventId, action: action }
        })
        return 'success'
      } catch (error) {
        console.error('Error to hide/unhide event:', error)
      }
    },

    async bookEvent ({ state }, { eventId }) {
      // not book yet
      const isBooked = state.currentUserInfo.booked.includes(eventId)

      // add booking record for user
      // perform query
      let q = query(collection(db, 'users'), where('email', '==', state.currentUserInfo.email))
      let result = await getDocs(q)
      // get ref for CRUD
      const userRef = doc(db, 'users', result.docs[0].id)
      await updateDoc(userRef, {
        booked: isBooked ? arrayRemove(eventId) : arrayUnion(eventId)
      })

      // reduce spot left for event
      q = query(collection(db, 'events'), where('id', '==', eventId))
      result = await getDocs(q)
      const eventRef = doc(db, 'events', result.docs[0].id)
      await updateDoc(eventRef, {
        remaining_spots: isBooked ? increment(1) : increment(-1)
      })

      // update local side
      isBooked
        ? state.currentUserInfo.booked = state.currentUserInfo.booked.filter(eid => eid !== eventId)
        : state.currentUserInfo.booked.push(eventId)
      const event = state.eventList.find(e => e.id === eventId)
      isBooked
        ? event.remaining_spots += 1
        : event.remaining_spots -= 1
    },

    async sendCode (_, {email, code}) {
      try {
        await axios.get('https://sendverification-7ayuf7vtfq-uc.a.run.app', {
          params: { toEmail: email, code: code }
        })
      } catch (error) {
        console.error('Send code error: ', error)
      }
    },

    async sendConfirmation (_, {email, fileContent}) {
      try {
        await axios.post('https://sendconfirmation-7ayuf7vtfq-uc.a.run.app', { toEmail: email, content: fileContent })
      } catch (error) {
        console.error('Send confirmation error: ', error)
      }
    },

    async getDirection (_, { origin, destination, mode }) {
      const originStr = `${origin.lat},${origin.lng}`;
      const destinationStr = `${destination.lat},${destination.lng}`;
      
      try {
        const response = await axios.get('https://getdirection-7ayuf7vtfq-uc.a.run.app', {
          params: {
            origin: originStr,
            destination: destinationStr,
            mode: mode
          }
        })
        return response.data
      } catch (error) {
        console.error('Get direction error: ', error)
      }
    },
    
    async sendBulkEmail (_, { nickname, toEmails, event }) {      
      try {
        const response = await axios.post('https://sendbulkemail-7ayuf7vtfq-uc.a.run.app', 
          {
            toEmails: JSON.stringify(toEmails),
            event: JSON.stringify(event),
            nickname: nickname
          }
        )
        
        return response.data
      } catch (error) {
        console.error('Send bulk email error: ', error)
      }
    },

    async sendMsgToAI (_, { msg }) {      
      const result = await model.generateContent(msg);
      const response = result.response;
      const text = response.text();
      return text
    },

    async getImmiStoriesList ({ commit }) {
      try {
        const allStoriesFromDatabase = await getDocs(collection(db, 'immigrant_stories'))
  
        const allStories = []
        allStoriesFromDatabase.forEach(element => {
            allStories.push(element.data())
          })
  
        commit('setImmiStories', allStories)
      } catch (error) {
        console.error(error)
      }
    },
  },

  

  modules: {
  }
})
