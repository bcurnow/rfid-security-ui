const List = resolve => require(['@/views/permission/List.vue'], resolve);

const routes = [
  {
    path: '/permissions',
    name: 'PermissionList',
    component: List,
  },
]

export default routes
