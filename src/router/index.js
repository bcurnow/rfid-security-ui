import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import MediaList from '@/views/media/MediaList.vue'
import MediaEdit from '@/views/media/MediaEdit.vue'
import ConfigList from '@/views/config/ConfigList.vue'
import ConfigEdit from '@/views/config/ConfigEdit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/media',
    name: 'MediaList',
    component: MediaList,
  },
  {
    path: '/config',
    name: 'ConfigList',
    component: ConfigList,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
