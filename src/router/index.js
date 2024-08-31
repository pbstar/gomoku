import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/play",
      name: "play",
      component: () => import("../views/play.vue"),
    },
    {
      path: "/playAi",
      name: "playAi",
      component: () => import("../views/playAi.vue"),
    },
  ],
});

export default router;
