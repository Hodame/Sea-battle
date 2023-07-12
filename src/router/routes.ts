import { RouteRecordRaw } from "vue-router"
import { RouteNames } from "./routeNames"

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../pages/MainPage.vue"),
    redirect: "/menu",
    children: [
      {
        path: "/menu",
        name: RouteNames.MENU,
        component: () => import("../pages/MenuPage.vue"),
      },
      {
        path: "/settings",
        name: RouteNames.SETTINGS,
        component: () => import("../pages/SettingsPage.vue"),
      },
      {
        path: "/ai",
        name: RouteNames.AI,
        component: () => import("../pages/AiBattlePage.vue"),
        props: (route) => ({ board: route.params.board }),
      },
      {
        path: "/pvp",
        name: RouteNames.PVP,
        component: () => import("../pages/PVPBattlePage.vue"),
        props: (route) => ({ board: route.params.board }),
      },
      {
        path: "/preparation",
        name: RouteNames.PREPARATION,
        component: () => import("../pages/PreparePage.vue"),
      },
      {
        path: "/find",
        name: RouteNames.FIND,
        component: () => import("../pages/FindGamePage.vue"),
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    name: "Not Found",
    component: () => import("../pages/ErrorPage.vue"),
  },
]
