import { createRouter, createWebHistory } from "vue-router";

import Onboarding from "@/components/onboarding/Onboarding.vue";
import Onboarding2 from "@/components/onboarding/Onboarding2.vue";
import SplashScreen from "../components/onboarding/SplashScreen.vue";
import Step1Phone from "../components/auth/signup/Step1Phone.vue";
import Step3ProfileName from "../components/auth/signup/Step3ProfileName.vue";
import Step4OTP from "../components/auth/signup/Step4OTP.vue";
import PINSecurity from "../components/auth/pin/PINSecurity.vue";
import ChatView from "../components/dashboard/ChatView.vue";

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
  {
    path: "/signup/phone",
    name: "Step1Phone",
    component: Step1Phone,
  },

  {
    path: "/signup/name",
    name: "Step3ProfileName",
    component: Step3ProfileName,
  },
  {
    path: "/signup/otp",
    name: "Step4OTP",
    component: Step4OTP,
  },
  {
    path: "/pin/setpin",
    name: "PINSecurity",
    component: PINSecurity,
  },
  {
    path: "/dashboard/chats",
    name: "ChatView",
    component: ChatView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;