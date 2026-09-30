import axios, { type AxiosError } from "axios";
import { toast } from "vue-sonner";

import type {
  SendOtpRequest,
  ApiResponse,
  VerifyOtpRequest,
  VerifyOtpPayload,
  AuthPayload,
  RegisterRequest,
  UploadImagePayload,
  VerifyPinRequest,
  UpdateProfileRequest,
  User,
  FriendRequestRecord,
  FriendUser,
  IncomingFriendRequest,
  RespondAction,
  FriendRecord,
  ChatListItem,
  ChatMessage,
  SendMessagePayload,
  DeletedMessage,
  MessageReadStatus,
  ReadReceipt,
} from "../types/api";
import { useAuthStore } from "../store/auth";
import router from "../router";

// lets a single request opt out of the global error toast
declare module "axios" {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  // called at request time, so Pinia is already installed by now
  const { token } = useAuthStore();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.log(
      "API Request:",
      config.method,
      `${config.baseURL}${config.url}`,
      config.data,
    );
  }
  return config;
});

function getErrorMessage(error: AxiosError<any>): string {
  if (!error.response) return "Network error. Check your connection.";

  const data = error.response.data;

  // Laravel validation errors: { errors: { phone: ["The phone has already been taken."] } }
  if (data?.errors && typeof data.errors === "object") {
    const first = Object.values(data.errors).flat()[0];
    if (typeof first === "string") return first;
  }

  return (
    data?.message ||
    data?.error ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (import.meta.env.DEV) console.log("API Error:", error.response?.data);

    const isAuthRequest = error.config?.url?.startsWith("/api/auth/");
    const auth = useAuthStore();

    // expired token on a normal request: clear the session and go to login.
    // Skip this for /api/auth/* calls, since a wrong PIN or OTP is not an expired session.
    if (error.response?.status === 401 && auth.token && !isAuthRequest) {
      auth.logout();
      router.push("/login");
    }

    if (!error.config?.skipErrorToast) {
      toast.error(getErrorMessage(error));
    }

    return Promise.reject(error);
  },
);

export const toApiPhone = (digits: string) =>
  digits.startsWith("0") ? digits : `0${digits}`;

export const authService = {
  // ...your existing functions

  sendOtp: (payload: SendOtpRequest) =>
    api.post<ApiResponse<null>>("/auth/send-otp", payload).then((r) => r.data),

  verifyOtp: (payload: VerifyOtpRequest) =>
    api
      .post<ApiResponse<VerifyOtpPayload>>("/auth/verify-otp", payload)
      .then((r) => r.data),
  register: (payload: RegisterRequest) =>
    api
      .post<ApiResponse<AuthPayload>>("/auth/register", payload)
      .then((r) => r.data),

  verifyPin: (payload: VerifyPinRequest) =>
    api
      .post<ApiResponse<AuthPayload>>("/auth/verify-pin", payload)
      .then((r) => r.data),

  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    // don't set Content-Type yourself; the browser adds the multipart boundary
    return api
      .post<ApiResponse<UploadImagePayload>>("/upload/image", form)
      .then((r) => r.data);
  },

  updateProfile: (payload: UpdateProfileRequest) =>
    api
      .put<ApiResponse<User>>("/user/update-profile", payload)
      .then((r) => r.data),

  logout: () =>
    // skipErrorToast: we log out locally no matter what, so no error toast needed
    api
      .post<ApiResponse<null>>("/auth/logout", null, { skipErrorToast: true })
      .then((r) => r.data),
};

export const friendService = {
  search: (phone: string) =>
    api
      .post<ApiResponse<FriendUser>>("/friends/search", { phone })
      .then((r) => r.data),

  sendRequest: (receiver_id: number) =>
    api
      .post<
        ApiResponse<FriendRequestRecord>
      >("/friends/request", { receiver_id })
      .then((r) => r.data),

  // silent = true is for background fetches (like the menu badge), so no error toast
  getRequests: (silent = false) =>
    api
      .get<
        ApiResponse<IncomingFriendRequest[]>
      >("/friends/get-friend-request", { skipErrorToast: silent })
      .then((r) => r.data),

  respond: (requestId: number, action: RespondAction) =>
    api
      .post<
        ApiResponse<FriendRequestRecord>
      >(`/friends/respond-request/${requestId}`, { action })
      .then((r) => r.data),

       getFriends: (silent = false) =>
    api
      .get<ApiResponse<FriendRecord[]>>("/friends/get-friends", {
        skipErrorToast: silent,
      })
      .then((r) => r.data),
};

export const conversationService = {
  getChatList: (silent = false) =>
    api
      .get<ApiResponse<ChatListItem[]>>("/conversations/get-chat-list", {
        skipErrorToast: silent,
      })
      .then((r) => r.data),

  sendMessage: (conversationId: number, payload: SendMessagePayload) =>
    api
      .post<ApiResponse<ChatMessage>>(
        `/conversations/${conversationId}/messages`,
        payload,
      )
      .then((r) => r.data),


  getMessages: (conversationId: number, silent = false) =>
    api
      .get<ApiResponse<ChatMessage[]>>(
        `/conversations/${conversationId}/messages`,
        { skipErrorToast: silent },
      )
      .then((r) => r.data),

  
};

export const messageService = {
  markAsRead: (message_id: number) =>
    api
      .post<ApiResponse<ReadReceipt>>(
        "/messages/mark-as-read",
        { message_id },
        { skipErrorToast: true },
      )
      .then((r) => r.data),

  getReadStatus: (messageId: number) =>
    api
      .get<ApiResponse<MessageReadStatus[]>>(
        `/messages/${messageId}/read-status`,
        { skipErrorToast: true },
      )
      .then((r) => r.data),

  edit: (messageId: number, message: string) =>
    api
      .put<ApiResponse<ChatMessage>>(`/messages/${messageId}/edit-message`, { message })
      .then((r) => r.data),

  remove: (messageId: number) =>
    api
      .delete<ApiResponse<DeletedMessage>>(`/messages/${messageId}/delete-message`)
      .then((r) => r.data),
};
export default api;
