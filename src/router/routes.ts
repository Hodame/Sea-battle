import { RouteRecordRaw } from "vue-router";
import { RouteNames } from "./routeNames";

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteNames.MENU,
    component: () => import('../pages/MainPage.vue')
  },
  {
    path: "/:catchAll(.*)*",
    name: "Not Found",
    component: () => import("../pages/ErrorPage.vue"),
  },
]