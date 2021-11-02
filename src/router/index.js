import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = resolve => require(['@/views/Home.vue'], resolve);
const configRoutes = resolve => require(['./config.js'], resolve);
const guestRoutes = resolve => require(['./guests.js'], resolve);
const mediaRoutes = resolve => require(['./media.js'], resolve);
const permissionRoutes = resolve => require(['./permission.js'], resolve);
const soundRoutes = resolve => require(['./sound.js'], resolve);

Vue.use(VueRouter)

const routes = [
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
