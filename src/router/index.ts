import { createRouter, createWebHistory } from "vue-router"
import { routes } from "./routes"
import { RouteNames } from "./routeNames"
import { useBoard } from "@/helpers/storePlayerBoard"

const playerBoard = useBoard

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(function (to, from, next) {
  if (from.name !== RouteNames.PREPARATION && to.name === RouteNames.AI) {
    return next("/menu")
  }

  // else if (from.name !== RouteNames.PREPARATION && to.name === RouteNames.PVP) {
  //   return next("/menu")
  // } else if (from.name !== RouteNames.FIND && to.name === RouteNames.PVP) {
  //   return next("/menu")
  // }

  return next()
})

export default router
