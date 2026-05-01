import { RouteRecordRaw } from 'vue-router'


export const configRoutes: RouteRecordRaw[] = [
  {
    path: '/configs',
    name: 'ConfigList',
    component: () => import('@/views/config/List.vue'),
  },
]