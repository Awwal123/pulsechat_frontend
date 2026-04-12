import { createRouter, createWebHistory } from "vue-router";

import Onboarding from "@/components/onboarding/Onboarding.vue";
import Onboarding2 from "@/components/onboarding/Onboarding2.vue";
import SplashScreen from "../components/onboarding/SplashScreen.vue";

const routes = [
  {
    path: "/",
    name: "Onboarding",
    component: Onboarding,
  },
  {
    path: "/onboarding2",
    name: "Onboarding2",
    component: Onboarding2,
  },
  {
    path: "/splash",
    name: "SplashScreen",
    component: SplashScreen,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;