const List = resolve => require(['@/views/sound/List.vue'], resolve);

const routes = [
  {
    component: List,
    name: 'SoundList',
    path: '/sounds',
  },
]

export default routes
