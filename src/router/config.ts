import List from '@/views/config/List.vue'
import { type RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
  {
    path: '/configs',
    name: 'ConfigList',
    component: List,
  },
]

export default routes
