import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import type {
  User,
  OtpPurpose,
  RegisterRequest,
  VerifyOtpPayload,
  UpdateProfileRequest,
} from "../types/api";
import { authService } from "../services/api";
import { useChatsStore } from "./chats";
import { setupNotifications } from "../services/notification";
import { compressImage } from "../utils/image";

function readUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", () => {
  // state
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(readUser());
  const loading = ref(false);
  const sendingOtp = ref(false);
  const verifyingOtp = ref(false);
  const verifyingPin = ref(false);
  const registering = ref(false);
  const updatingProfile = ref(false);
  const loggingOut = ref(false);
  const isAuthenticated = computed(() => !!token.value);
  const pendingEmail = ref<string | null>(
    sessionStorage.getItem("pending_email"),
  );

  function setPendingEmail(email: string | null) {
    pendingEmail.value = email;
    if (email) sessionStorage.setItem("pending_email", email);
    else sessionStorage.removeItem("pending_email");
  }

  // session helpers
  function setSession(newToken: string, newUser: User) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  // Push setup is slow (permission prompt, token, registering it on the backend).
  // Run it in the background so login/navigation never waits for it,
  // and never let a failure here break the login.
  function setupUserNotifications() {
    setupNotifications().catch((e) =>
      console.warn("Notification setup failed:", e),
    );
  }

  function logout() {
    useChatsStore().reset();
    setPendingEmail(null);
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // OTP
  async function sendOtp(phone: string, purpose: OtpPurpose, email?: string) {
    sendingOtp.value = true;
    try {
      // "Resend code" on the OTP screen doesn't know the email, so fall back to the saved one
      const registerEmail =
        purpose === "register" ? (email ?? pendingEmail.value) : undefined;

      const res = await authService.sendOtp({
        phone,
        purpose,
        ...(registerEmail ? { email: registerEmail } : {}),
      });

      if (registerEmail) setPendingEmail(registerEmail);
      toast.success(res.message);
      return true;
    } catch {
      return false; // the interceptor already toasted the error
    } finally {
      sendingOtp.value = false;
    }
  }

  async function verifyOtp(
    phone: string,
    otp: string,
    purpose: OtpPurpose,
  ): Promise<VerifyOtpPayload | null> {
    verifyingOtp.value = true;
    try {
      const res = await authService.verifyOtp({ phone, otp, purpose });
      toast.success(res.message);
      if (res.data.token && res.data.user) {
        setSession(res.data.token, res.data.user);
        setupUserNotifications(); // background, no await
      }
      return res.data;
    } catch {
      return null;
    } finally {
      verifyingOtp.value = false;
    }
  }

  // sends the full profile plus your changes, so a partial update never wipes fields
  async function updateProfile(changes: UpdateProfileRequest) {
    updatingProfile.value = true;
    try {
      const current = user.value;
      const res = await authService.updateProfile({
        name: current?.name,
        profile_picture: current?.profile_picture,
        email: current?.email || undefined,
        gender: current?.gender || undefined,
        birthday: current?.birthday?.slice(0, 10) || undefined,
        ...changes,
      });
      user.value = { ...user.value, ...res.data } as User;
      localStorage.setItem("user", JSON.stringify(user.value));
      toast.success(res.message);
      return true;
    } catch {
      return false;
    } finally {
      updatingProfile.value = false;
    }
  }

  async function uploadPhoto(file: File): Promise<string | null> {
    let ready: File;
    try {
      ready = await compressImage(file);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not read that image.",
      );
      return null;
    }

    try {
      const res = await authService.uploadImage(ready);
      return res.data.url;
    } catch (e: any) {
      // the interceptor already toasts; this shows the real reason in the console
      console.error(
        "Image upload failed:",
        e?.response?.status,
        e?.response?.data ?? e,
      );
      return null;
    }
  }

  // calls the API, then always clears the session on this device.
  // (logout() stays as the local-only clear used by the interceptor)
  async function signOut() {
    loggingOut.value = true;
    try {
      const res = await authService.logout();
      toast.success(res.message);
    } catch {
      // network error or expired token: still end the session locally
    } finally {
      logout();
      loggingOut.value = false;
    }
  }

  async function verifyPin(phone: string, security_pin: string) {
    verifyingPin.value = true;
    try {
      const res = await authService.verifyPin({ phone, security_pin });
      setSession(res.data.token, res.data.user);
      setupUserNotifications(); // background, no await

      toast.success(res.message);
      return true;
    } catch {
      return false;
    } finally {
      verifyingPin.value = false;
    }
  }

  async function register(payload: Omit<RegisterRequest, "email">) {
    const email = pendingEmail.value;
    if (!email) {
      toast.error("Email is missing. Please go back and enter your email.");
      return false;
    }

    registering.value = true;
    try {
      const res = await authService.register({ ...payload, email });
      setSession(res.data.token, res.data.user);
      setPendingEmail(null);
      setupUserNotifications(); // background, no await

      toast.success(res.message);
      return true;
    } catch {
      return false;
    } finally {
      registering.value = false;
    }
  }

  return {
    token,
    user,
    loading,
    sendingOtp,
    verifyingOtp,
    verifyingPin,
    registering,
    updatingProfile,
    loggingOut,
    isAuthenticated,
    pendingEmail,
    setPendingEmail,
    updateProfile,
    uploadPhoto,
    setSession,
    logout,
    signOut,
    sendOtp,
    verifyOtp,
    verifyPin,
    register,
  };
});