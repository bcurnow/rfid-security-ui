import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { configRoutes } from './config'
import { guestsRoutes } from './guests'
import { mediaRoutes } from './media'
import { permissionRoutes } from './permission'
import { soundRoutes } from './sound'

const routes: RouteRecordRaw[] = [
  ...configRoutes,
  ...guestsRoutes,
  ...mediaRoutes,
  ...permissionRoutes,
  ...soundRoutes,
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router