import { RouteRecordRaw } from "vue-router";

export const mediaRoutes: RouteRecordRaw[] = [
  {
    path: "/media",
    name: "MediaList",
    component: () => import("@/views/media/List.vue"),
    children: [
      {
        path: ":mediaId",
        name: "MediaPermissions",
        component: () => import("@/views/media/Permissions.vue"),
        props: (route) => ({
          mediaId: Array.isArray(route.params.mediaId)
            ? route.params.mediaId[0]
            : route.params.mediaId,
        }),
      },
    ],
  },
];
