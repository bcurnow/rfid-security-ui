import List from '@/views/guests/List.vue'
import Media from '@/views/guests/Media.vue'
import Permissions from '@/views/media/Permissions.vue'

const routes = [
  {
    path: '/guests',
    name: 'GuestsList',
    component: List,
    children: [
      {
        path: ':guestId/media',
        name: 'GuestMedia',
        component: Media,
        children: [
          {
            path: ':mediaId/permissions',
            name: 'GuestMediaPermissions',
            component: Permissions,
          },
        ],
      },
    ],
  },
]

export default routes
