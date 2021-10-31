import List from '@/views/guests/List.vue'
import Media from '@/views/guests/Media.vue'

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
      },
    ],
  },
]

export default routes
