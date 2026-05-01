import { RouteRecordRaw } from 'vue-router'

export const soundRoutes: RouteRecordRaw[] = [
  {
    name: 'SoundList',
    path: '/sounds',
    component: () => import('@/views/sound/List.vue'),
  },
]