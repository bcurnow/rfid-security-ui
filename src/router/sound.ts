import List from '@/views/sound/List.vue'
import { type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    component: List,
    name: 'SoundList',
    path: '/sounds',
  },
]

export default routes
