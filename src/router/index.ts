import { createRouter, createWebHistory } from "vue-router";

import Onboarding from "@/components/onboarding/Onboarding.vue";
import Onboarding2 from "@/components/onboarding/Onboarding2.vue";
import SplashScreen from "../components/onboarding/SplashScreen.vue";
import Step1Phone from "../components/auth/signup/Step1Phone.vue";
import Step3ProfileName from "../components/auth/signup/Step3ProfileName.vue";
import Step4OTP from "../components/auth/signup/Step4OTP.vue";
import PINSecurity from "../components/auth/pin/PINSecurity.vue";
import ChatView from "../components/views/ChatView.vue";
import GroupsView from "../components/views/GroupsView.vue";
import ProfileView from "../components/views/ProfileView.vue";
import MoreView from "../components/views/MoreView.vue";
import { usePhone } from "../assets/composables/Usephone.ts";
import LoginPhone from "../components/auth/signin/LoginPhone.vue";
import OtpVerify from "../components/auth/signin/OtpVerify.vue";
import AddFriendView from "../components/views/AddFriendView.vue";
import CreateGroupView from "../components/views/CreateGroupView.vue";
import Conversationview from "../components/views/Conversationview.vue";

// OTP screens need a valid phone number, the name screen needs a verified OTP
const requirePhone = () => (usePhone().isValid.value ? true : undefined);

const routes = [
  { path: "/", name: "Onboarding", component: Onboarding },
  { path: "/onboarding2", name: "Onboarding2", component: Onboarding2 },
  { path: "/splash", name: "SplashScreen", component: SplashScreen },

  // ── login ──────────────────────────────────────────────
  { path: "/login", name: "LoginPhone", component: LoginPhone },
  {
    path: "/login/otp",
    name: "LoginOtp",
    component: OtpVerify,
    beforeEnter: () => requirePhone() ?? "/login",
  },

  // ── signup: phone → otp → name → pin ───────────────────
  { path: "/signup/phone", name: "Step1Phone", component: Step1Phone },
  {
    path: "/signup/otp",
    name: "Step4OTP",
    component: Step4OTP,
    beforeEnter: () => requirePhone() ?? "/signup/phone",
  },
  {
    path: "/signup/name",
    name: "Step3ProfileName",
    component: Step3ProfileName,
    beforeEnter: () => (usePhone().otpVerified.value ? true : "/signup/phone"),
  },
  { path: "/pin/setpin", name: "PINSecurity", component: PINSecurity },

  // ── app ────────────────────────────────────────────────
  { path: "/chats", name: "Chats", component: ChatView },
 { path: "/chats/:id", name: "Chat", component: Conversationview, props: true },
  { path: "/groups", name: "Groups", component: GroupsView },
  { path: "/profile", name: "Profile", component: ProfileView },
  { path: "/more", name: "More", component: MoreView },
  { path: "/friends/add", name: "AddFriend", component: AddFriendView },
  { path: "/groups/create", name: "CreateGroup", component: CreateGroupView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
