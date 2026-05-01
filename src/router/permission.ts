import { RouteRecordRaw } from 'vue-router'

export const permissionRoutes: RouteRecordRaw[] = [
  {
    path: '/permissions',
    name: 'PermissionList',
    component:  () => import('@/views/permission/List.vue'),
  },
]