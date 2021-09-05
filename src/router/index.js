import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import configRoutes from './config.js'
import mediaRoutes from './media.js'
import permissionRoutes from './permission.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
]

routes.push(...configRoutes)
routes.push(...mediaRoutes)
routes.push(...permissionRoutes)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
