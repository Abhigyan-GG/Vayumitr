import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Forecast from '@/pages/Forecast.vue'
import About from '@/pages/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/forecast',
    name: 'Forecast',
    component: Forecast,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
