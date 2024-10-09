<template>
  <div>
    <nav class="navbar navbar-expand-xl navbar-dark bg-dark" aria-label="Menu">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Cultural Bridge</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExampleXl"
          aria-controls="navbarsExampleXl"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsExampleXl">
          <ul class="navbar-nav me-auto mb-2 mb-xl-0">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                >Community</a
              >
              <ul class="dropdown-menu">
                <li>
                  <router-link
                    class="dropdown-item"
                    to="/community/immigrant_stories"
                  >
                    Immigrant Stories
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/community/guidance">
                    Community Guidance
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/community/events">
                    {{ store.state.currentRole === 'Admin'?'Events Manage':'Events'}}
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                >Resources</a
              >
              <ul class="dropdown-menu">
                <li>
                  <router-link
                    class="dropdown-item"
                    to="/resources/language_assistance"
                  >
                    Language Assistance
                  </router-link>
                </li>
                <li>
                  <router-link
                    class="dropdown-item"
                    to="/resources/social_well-being"
                  >
                    Social Well-being
                  </router-link>
                </li>
                <li>
                  <router-link
                    class="dropdown-item"
                    to="/resources/legal_assistance"
                  >
                    Legal Assistance
                  </router-link>
                </li>
                <li>
                  <router-link 
                    class="dropdown-item" 
                    to="/resources/city_info"
                  >
                    City Info
                  </router-link>
                </li>
                <li>
                  <router-link 
                    class="dropdown-item" 
                    to="/resources/navigator"
                  >
                    Navigator
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                >About Us</a
              >
              <ul class="dropdown-menu">
                <li>
                  <router-link
                    class="dropdown-item"
                    to="/about_us/charity_info"
                  >
                    Charity Info
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/about_us/join_us">
                    Join Us
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <router-link
        class="bi bi-person-circle"
        :to="isLog ? null : '/login'"
        v-if="currentPath !== '/login'"
        :data-bs-toggle="isLog ? 'modal' : null"
        :data-bs-target="isLog ? '#exampleModal' : null"
      />
    </nav>
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              You have successfully logged in
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Your current logged in user email is:
            {{ currentUser }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()
const currentPath = ref('')

watch(route, (newValue) => {
  currentPath.value = newValue.path
})

const isLog = computed(() => store.state.isLogin)
const currentUser = computed(() => {
  if (isLog.value) {
    return store.state.currentUserInfo.email
  } else {
    return null
  }
})
</script>
<style>
.bi-person-circle {
  color: white;
  font-size: 2.4rem;
  margin-right: 2vw;
}
@media (max-width: 1199.9px) {
  .bi-person-circle {
    position: absolute;
    right: 5.2vw;
    top: 0;
  }
}
@media (max-width: 992px) {
  .bi-person-circle {
    right: 6.4vw;
  }
}
@media (max-width: 768px) {
  .bi-person-circle {
    right: 12.4vw;
  }
}
@media (max-width: 768px) {
  .bi-person-circle {
    right: 16.4vw;
  }
}
</style>
