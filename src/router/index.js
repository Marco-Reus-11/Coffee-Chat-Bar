import { createRouter, createWebHistory } from 'vue-router'
import contact from '../view/contact.vue'

const routes = [
  { path: '/', component: contact }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router