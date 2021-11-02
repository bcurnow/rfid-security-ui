const List = resolve => require(['@/views/config/List.vue'], resolve);

const routes = [
  {
    component: List,
    name: 'ConfigList',
    path: '/configs',
  },
]

export default routes
