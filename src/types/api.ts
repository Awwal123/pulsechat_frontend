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
  email?: string;
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
  email: string;
  profile_picture?: string;
  security_pin?: string;
}

export interface UploadImagePayload {
  url: string;
  public_id: string;
}


export interface FriendUser {
  id: number;
  name: string;
  phone: string;
  profile_picture: string;
}

export type RespondAction = "accept" | "reject";

// returned by /friends/request and /friends/respond-request
export interface FriendRequestRecord {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: "pending" | "accepted" | "rejected";
  responded_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IncomingFriendRequest {
  friend_request_id: number;
  sender_id: number;
  receiver_id: number;
  status: "pending" | "accepted" | "rejected";
  responded_at: string | null;
  created_at: string;
  sender: FriendUser;
}

export interface FriendProfile {
  id: number;
  name: string;
  phone: string;
  profile_picture: string | null;
}

export interface FriendRecord {
  friendship_id: number;
  friend: FriendProfile;
}

export interface GroupMember {
  id: number; // user id
  name: string;
  phone: string;
  profile_picture: string | null;
  role: "admin" | "member";
}

// what the API actually returns for each member
export interface GroupMemberRecord {
  id: number; // membership row id (not the user id)
  conversation_id: number;
  user_id: number;
  role: "admin" | "member";
  user: {
    id: number;
    name: string;
    phone: string;
    profile_picture: string | null;
  };
}
export interface ChatListItem {
  conversation_id: number;
  type: "private" | "group";
  friend: FriendProfile | null; // null for groups
  group: GroupProfile | null; // null for private chats
  last_message: LastMessage | null;
  last_message_at: string | null;
  unread_count: number;
}

export interface MessageSender extends FriendProfile {
  email?: string;
  gender?: string;
  birthday?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReplyToMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string;
  reply_to_id: number | null;
  edited_at: string | null;
  deleted_at: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  sender: MessageSender;
}

export interface SendMessagePayload {
  message: string;
  reply_to_id?: number;
}

export interface LastMessage {
  id: number;
  message: string | null; // null when the message was deleted
  sender_id: number;
  created_at: string;
  is_deleted: boolean;
}
export interface GroupProfile {
  name: string;
  profile_picture: string | null;
  member_count: number;
}


export interface CreateGroupRequest {
  name: string;
  member_ids: number[];
  profile_picture?: string;
}
// ── messages ────────────────────────────────────────────
export interface MessageSender extends FriendProfile {
  email?: string;
  gender?: string;
  birthday?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string | null; // null when deleted
  reply_to_id: number | null;
  edited_at: string | null;
  deleted_at: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  sender: MessageSender;
  reply_to?: ChatMessage | null; // the quoted message (same shape)
  pending?: boolean;
}


export interface ReadReceipt {
  id: number;
  message_id: number;
  user_id: number;
  read_at: string;
  created_at: string;
  updated_at: string;
}

export interface MessageReadStatus extends ReadReceipt {
  user: FriendProfile;
}

export interface DeletedMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: null;
  reply_to_id: number | null;
  edited_at: string | null;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}