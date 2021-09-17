import List from '@/views/media/List.vue'
import Permissions from '@/views/media/Permissions.vue'

const routes = [
  {
    path: '/media',
    name: 'MediaList',
    component: List,
  },
  {
    path: '/media/:mediaId/permissions',
    name: 'MediaPermissions',
    component: Permissions,
  },
]

export default routes
