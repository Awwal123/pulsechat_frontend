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
  // getter
  const isAuthenticated = computed(() => !!token.value);

  // session helpers
  function setSession(newToken: string, newUser: User) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  function logout() {
    useChatsStore().reset();
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // OTP
  async function sendOtp(phone: string, purpose: OtpPurpose) {
    sendingOtp.value = true;
    try {
      const res = await authService.sendOtp({ phone, purpose });
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
      if (res.data.token && res.data.user)
        setSession(res.data.token, res.data.user);
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
    try {
      const res = await authService.uploadImage(file);
      return res.data.url;
    } catch {
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
      toast.success(res.message);
      return true;
    } catch {
      return false;
    } finally {
      verifyingPin.value = false;
    }
  }

  async function register(payload: RegisterRequest) {
    registering.value = true;
    try {
      const res = await authService.register(payload);
      setSession(res.data.token, res.data.user);
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
