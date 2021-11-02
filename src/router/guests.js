const List = resolve => require(['@/views/guests/List.vue'], resolve);
const Media = resolve => require(['@/views/guests/Media.vue'], resolve);
const Permissions = resolve => require(['@/views/media/Permissions.vue'], resolve);

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
