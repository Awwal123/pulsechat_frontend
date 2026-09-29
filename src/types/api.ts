export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  profile_picture: string;
  created_at: string;
  updated_at: string;
  email?: string;
  gender?: string;
  birthday?: string;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface SignupRequest {
  name: string;
  phone: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  profile_picture?: string;
  email?: string;
  gender?: string;
  birthday?: string;
}
export type OtpPurpose = "login" | "register";

export interface SendOtpRequest {
  phone: string;
  purpose: OtpPurpose;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface VerifyOtpPayload {
  purpose: OtpPurpose;
}
export interface VerifyOtpPayload {
  purpose: OtpPurpose;
  requires_pin?: boolean;
  // only if login without a PIN returns a session (see the note at the end)
  user?: User;
  token?: string;
}

export interface VerifyPinRequest {
  phone: string;
  security_pin: string;
}

export interface RegisterRequest {
  phone: string;
  name: string;
  profile_picture?: string;
  security_pin?: string;
}

export interface UploadImagePayload {
  url: string;
  public_id: string;
}

