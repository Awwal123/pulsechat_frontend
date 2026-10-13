import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

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
import { useAuthStore } from "../store/auth.ts";
import AboutUs from "../assets/components/AboutUs.vue";


declare module "vue-router" {
  interface RouteMeta {
    public?: boolean;
    guestOnly?: boolean;
  }
}

const requirePhone = () => (usePhone().isValid.value ? true : undefined);

const PUBLIC = { public: true };
const GUEST_ONLY = { public: true, guestOnly: true };

const routes: RouteRecordRaw[] = [
  { path: "/", name: "Onboarding", component: Onboarding, meta: GUEST_ONLY },
  { path: "/onboarding2", name: "Onboarding2", component: Onboarding2, meta: GUEST_ONLY },
  { path: "/splash", name: "SplashScreen", component: SplashScreen, meta: PUBLIC },
  { path: "/login", name: "LoginPhone", component: LoginPhone, meta: GUEST_ONLY },
  {
    path: "/login/otp",
    name: "LoginOtp",
    component: OtpVerify,
    meta: PUBLIC,
    beforeEnter: () => requirePhone() ?? "/login",
  },
  { path: "/signup/phone", name: "Step1Phone", component: Step1Phone, meta: GUEST_ONLY },
  {
    path: "/signup/otp",
    name: "Step4OTP",
    component: Step4OTP,
    meta: PUBLIC,
    beforeEnter: () => requirePhone() ?? "/signup/phone",
  },
  {
    path: "/signup/name",
    name: "Step3ProfileName",
    component: Step3ProfileName,
    meta: PUBLIC,
    beforeEnter: () => (usePhone().otpVerified.value ? true : "/signup/phone"),
  },
  { path: "/pin/setpin", component: PINSecurity, props: { mode: "set" }, meta: PUBLIC },
  { path: "/pin/verify", component: PINSecurity, props: { mode: "verify" }, meta: PUBLIC },
  { path: "/chats", name: "Chats", component: ChatView },
  { path: "/chats/:id", name: "Chat", component: Conversationview, props: true },
  {
    path: "/chats/:id/members",
    component: () => import("../components/views/GroupMembersView.vue"),
    props: true,
  },
   { path: "/about", name: "About", component:AboutUs },
  { path: "/groups", name: "Groups", component: GroupsView },
  { path: "/groups/create", name: "CreateGroup", component: CreateGroupView },
  { path: "/profile", name: "Profile", component: ProfileView },
 
  { path: "/more", name: "More", component: MoreView },
  { path: "/friends/add", name: "AddFriend", component: AddFriendView },
  { path: "/:pathMatch(.*)*", redirect: "/chats" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!to.meta.public && !auth.isAuthenticated) {
    return { path: "/login", replace: true };
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { path: "/chats", replace: true };
  }

  return true;
});

export default router;