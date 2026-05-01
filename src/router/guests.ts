import { RouteRecordRaw } from 'vue-router'

export const guestsRoutes: RouteRecordRaw[] = [
  {
    path: '/guests',
    name: 'GuestsList',
    component: () => import('@/views/guests/List.vue'),
    children: [
      {
        path: ':guestId/media',
        name: 'GuestMedia',
        component: () => import('@/views/guests/Media.vue'),
        props: (route) => ({ guestId: Number(route.params.guestId) }),
        children: [
          {
            path: ':mediaId/permissions',
            name: 'GuestMediaPermissions',
            component: () => import('@/views/media/Permissions.vue'),
            props: (route) => ({ guestId: Number(route.params.guestId) })
          },
        ],
      },
    ],
  },
]