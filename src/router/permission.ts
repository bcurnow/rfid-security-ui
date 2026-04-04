import List from '@/views/permission/List.vue'
import { type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/permissions',
    name: 'PermissionList',
    component: List,
  },
]

export default routes
