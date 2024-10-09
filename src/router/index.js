import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePageView')
  },
  {
    path: '/community/immigrant_stories',
    name: 'story',
    component: () => import('../views/C_ImmiSView')
  },
  {
    path: '/community/guidance',
    name: 'guidance',
    component: () => import('../views/C_CommunityGView')
  },
  {
    path: '/community/events',
    name: 'events',
    component: () => import('../views/C_CommunityEView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/community/events/event_detail/:id',
    name: 'event_detail',
    component: () => import('../views/C_CommunityEDView'),
    meta: { requiresAuth: true }
  },
  {
    path: '/resources/language_assistance',
    name: 'lang',
    component: () => import('../views/R_LangAView')
  },
  {
    path: '/resources/social_well-being',
    name: 'wellbeing',
    component: () => import('../views/R_SWView')
  },
  {
    path: '/resources/legal_assistance',
    name: 'legal',
    component: () => import('../views/R_LegalAView')
  },
  {
    path: '/resources/city_info',
    name: 'cityInfo',
    component: () => import('../views/R_CityInfoView')
  },
  {
    path: '/resources/navigator',
    name: 'navigator',
    component: () => import('../views/NavigatorView')
  },
  {
    path: '/about_us/charity_info',
    name: 'charityInfo',
    component: () => import('../views/AU_CharityInfoView')
  },
  {
    path: '/about_us/join_us',
    name: 'joinUs',
    component: () => import('../views/AU_JoinUsView')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView')
  },
  {
    path: '/regis',
    name: 'regis',
    component: () => import('../views/RegisView')
  }

]

const router = createRouter({
  routes,
  history: createWebHistory()
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.isLogin) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
