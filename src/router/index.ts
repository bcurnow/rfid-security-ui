import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import configRoutes from './config'
import guestRoutes from './guests'
import mediaRoutes from './media'
import permissionRoutes from './permission'
import soundRoutes from './sound'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
]

routes.push(...configRoutes)
routes.push(...guestRoutes)
routes.push(...mediaRoutes)
routes.push(...permissionRoutes)
routes.push(...soundRoutes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router