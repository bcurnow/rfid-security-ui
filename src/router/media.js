const List = resolve => require(['@/views/media/List.vue'], resolve);
const Permissions = resolve => require(['@/views/media/Permissions.vue'], resolve);

const routes = [
  {
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
