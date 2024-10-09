<template>
  <div class="container">
    <h1>Cultural Bridge</h1>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
          <input
            type="email"
            :class="['form-control', emailErrMsg == '' ? '' : 'is-invalid']"
            id="email"
            aria-describedby="email"
            @blur="validateEmail"
            v-model="userInfo.email"
          />
        
        <div class="invalid-feedback" v-if="emailErrMsg !== ''">
          {{ emailErrMsg }}
        </div>
      </div>
      <div class="mb-3 password">
        <label for="password" class="form-label">Password</label>
          <input
            :type="show ? 'text' : 'password'"
            :class="['form-control', passwdErrMsg == '' ? '' : 'is-invalid']"
            id="password"
            @blur="validatePasswd"
            v-model="userInfo.password"
            aria-describedby="email"
          />
        
        <a
          href="#"
          :class="[
            'showPassword',
            'bi',
            show ? 'bi-eye-fill' : 'bi-eye-slash-fill',
          ]"
          @mousedown="showPassword(true)"
          @mouseup="showPassword(false)"
          aria-label="show password"
        />
        <div class="invalid-feedback" v-if="passwdErrMsg !== ''">
          {{ passwdErrMsg }}
        </div>
      </div>
      <a href="" style="display: block; margin-bottom: 1.2vh"
        >Forgot Password?</a
      >
      <button
      type="submit"
      class="btn btn-primary"
      style="margin-bottom: 2vh"
      >
        Log In
      </button>
      <router-link class="btn btn-outline-primary" to="/regis">
        Not a member yet?
      </router-link>
    </form>
    <hr class="my-4" />
    <div class="otherOptions">
      <button type="button" class="btn btn-outline-dark">
        <div>
          <i class="bi bi-google" />
          Log in with Google
        </div>
      </button>
      <button type="button" class="btn btn-outline-dark">
        <div>
          <i class="bi bi-facebook" />
          Log in with Facebook
        </div>
      </button>
      <button type="button" class="btn btn-outline-dark" @click="adminLogin">
        <div>
          <i class="bi bi-command" />
          Log in with Admin
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
// import { collection, getDocs, query, where } from 'firebase/firestore'
// import db from '@/firebase/init'

// const q = query(collection(db, 'users'), where('email', '==', '11@qq.com'))
// const result = await getDocs(q)
// const a = result.docs[0]
// console.log('aaaaa', a.data())

const store = useStore()
const router = useRouter()
const route = useRoute()

const show = ref(false)
const showPassword = (state) => {
  show.value = state
}

const userInfo = ref({
  email: '',
  password: ''
})

// email validation
const emailErrMsg = ref('')
const validateEmail = () => {
  const email = userInfo.value.email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) {
    emailErrMsg.value = 'Please enter your email'
  } else if (!emailRegex.test(email)) {
    emailErrMsg.value = 'Please provide a valid email address.'
  } else if (email.length > 100) {
    emailErrMsg.value = 'Email length exceeds limit'
  } else {
    emailErrMsg.value = ''
  }
}

// password validation
const passwdErrMsg = ref('')
const validatePasswd = () => {
  const passwd = userInfo.value.password
  if (!passwd) {
    passwdErrMsg.value = 'Please enter your password'
  } else if (passwd.length > 100) {
    passwdErrMsg.value = 'Password length exceeds limit'
  } else {
    passwdErrMsg.value = ''
  }
}

// normal login
const login = async () => {
  if (emailErrMsg.value === '' && passwdErrMsg.value === '') {
    const loginMsg = await store.dispatch('login', userInfo.value)

    if (loginMsg === 'email') {
      emailErrMsg.value = "This email haven't registered!"
      return
    } else if (loginMsg === 'passwd') {
      passwdErrMsg.value = 'Wrong password!'
      userInfo.value.password = ''
      return
    }
    const redirectTo = route.query.redirect || '/'
    router.push(redirectTo)
  } else {
    console.log('fail')
  }
}

// admin login
const adminLogin = () => {
  store.commit('setLogState', { newIsLogin: true, newCurrentUserInfo: { email: 'Admin', password: '', ratedEvent: {} }, newCurrentRole: 'Admin' })
  const redirectTo = route.query.redirect || '/'
  router.push(redirectTo)
}
</script>

<style scoped>
h1 {
  font-family: "Courier New", Courier, monospace;
  font-weight: bolder;
  text-align: center;
}
.container {
  width: 40vw;
  margin: auto;
  margin-top: 4vh;
}
@media (max-width: 1200px) {
  .container {
    width: 60vw;
  }
}
@media (max-width: 768px) {
  .container {
    width: 80vw;
  }
}
form {
  width: 100%;
  margin-top: 4vh;
}
.btn {
  width: 100%;
}
.password {
  position: relative;
}
.showPassword {
  color: black;
  font-size: 1.6rem;
  position: absolute;
  top: 4.6vh;
  right: 1.8vw;
}
.otherOptions {
  margin: auto;
  margin-top: 6vh;
  width: 80%;
}
.otherOptions i {
  margin-right: 1.2vw;
}
.otherOptions button {
  margin-bottom: 2vh;
}
@media (max-width: 768px) {
  .bi {
    display: none;
  }
}

/* .invalid-feedback {
  position: absolute;
  margin-bottom: 6vh;
} */
</style>
