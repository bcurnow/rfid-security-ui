import List from '@/views/media/List.vue'
import Permissions from '@/views/media/Permissions.vue'
import { type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [  {
    path: '/media',
    name: 'MediaList',
    component: List,
    children: [
      {
        path: ':mediaId/permissions',
        name: 'MediaPermissions',
        component: Permissions,
      },
    ],
  },
]

export default routes
