import { defineStore } from "pinia";
import { ref } from "vue";
import { toast } from "vue-sonner";
import {
  conversationService,
  groupService,
  messageService,
} from "../services/api.ts";
import type {
  ChatListItem,
  ChatMessage,
  CreateGroupRequest,
  GroupMember,
  LastMessage,
} from "../types/api.ts";
import echo from "../echo.js";
import { useAuthStore } from "./auth.ts";

export const useChatsStore = defineStore("chats", () => {
  const chats = ref<ChatListItem[]>([]);
  const loadingChats = ref(false);
  const fetchedOnce = ref(false);
  const messages = ref<Record<number, ChatMessage[]>>({});
  const loadingMessages = ref(false);
  const sending = ref(false);
  const mutating = ref(false); // edit / delete in progress
  const creatingGroup = ref(false);
  const readByFriend = ref<Record<number, boolean>>({}); // my messages someone else has read
  const activeConversationId = ref<number | null>(null); // the chat currently open on screen
  const typing = ref<Record<number, Record<number, string>>>({}); // conversationId -> { userId: name } // is someone typing, per conversation
  const messagePages = ref<Record<number, number>>({});
  const hasMoreMessages = ref<Record<number, boolean>>({});
  const loadingOlderMessages = ref<Record<number, boolean>>({});

  // not reactive on purpose
  const handledIncoming = new Map<number, Set<number>>();
  const subscribed = new Set<number>();
  const typingTimers = new Map<string, number>(); // key: "conversationId:userId"
  const lastWhisperAt = new Map<number, number>();
 const groupMembers = ref<Record<number, GroupMember[]>>({});
const loadingMembers = ref(false);
const addingMembers = ref(false);
  // who am I? (auth store is read lazily to avoid a circular-import problem)
  const myId = () => useAuthStore().user?.id ?? 0;
  const isMine = (senderId: number) => senderId === myId();

  // ── chats ────────────────────────────────────────────
  async function fetchChats(silent = false) {
    loadingChats.value = true;
    try {
      const res = await conversationService.getChatList(silent);
      chats.value = res.data;
      listenToAll();
      return true;
    } catch {
      return false;
    } finally {
      loadingChats.value = false;
      fetchedOnce.value = true;
    }
  }

  const getChat = (conversationId: number) =>
    chats.value.find((c) => c.conversation_id === conversationId) ?? null;

  const getMessages = (conversationId: number) =>
    messages.value[conversationId] ?? [];

  // ── groups ───────────────────────────────────────────
  // returns the new conversation id, or null if it failed
  async function createGroup(payload: CreateGroupRequest) {
    if (creatingGroup.value) return null;
    creatingGroup.value = true;
    try {
      const res = await groupService.create(payload);
      await fetchChats(true); // loads the group in list shape and subscribes its channel
      toast.success(res.message);
      return res.data.id;
    } catch {
      return null; // the interceptor already toasted the error
    } finally {
      creatingGroup.value = false;
    }
  }

  const getMembers = (conversationId: number) =>
    groupMembers.value[conversationId] ?? [];

  async function fetchMembers(conversationId: number) {
    loadingMembers.value = true;
    try {
      const res = await groupService.members(conversationId);
      groupMembers.value[conversationId] = res.data;
      return true;
    } catch {
      return false;
    } finally {
      loadingMembers.value = false;
    }
  }

  async function addMembers(conversationId: number, memberIds: number[]) {
    if (addingMembers.value || !memberIds.length) return false;
    addingMembers.value = true;
    try {
      const res = await groupService.addMembers(conversationId, {
        member_ids: memberIds,
      });
      // refresh the member list and the chat list (member_count changed)
      await Promise.all([fetchMembers(conversationId), fetchChats(true)]);
      toast.success(res.message);
      return true;
    } catch {
      return false; // the interceptor already toasted the error
    } finally {
      addingMembers.value = false;
    }
  }
  // ── messages ─────────────────────────────────────────
  // Page 1 = newest messages. A normal fetch resets the thread to page 1.
  // A silent fetch (polling) merges: it refreshes the newest page but keeps
  // any older pages the user already loaded.
  async function fetchMessages(conversationId: number, silent = false) {
    loadingMessages.value = true;

    try {
      const res = await conversationService.getMessages(conversationId, silent);
      const fresh = res.data.data;
      const existing = messages.value[conversationId];
      const loadedOlder = (messagePages.value[conversationId] ?? 1) > 1;

      if (silent && existing?.length && loadedOlder) {
        const firstFreshId = fresh[0]?.id ?? Infinity;
        const older = existing.filter((m) => m.id < firstFreshId);
        messages.value[conversationId] = [...older, ...fresh];
        // leave messagePages / hasMoreMessages untouched
      } else {
        messages.value[conversationId] = fresh;
        messagePages.value[conversationId] = res.data.current_page;
        hasMoreMessages.value[conversationId] =
          res.data.current_page < res.data.last_page;
      }

      return true;
    } catch {
      return false;
    } finally {
      loadingMessages.value = false;
    }
  }

  const canLoadOlder = (conversationId: number) =>
    !!hasMoreMessages.value[conversationId] &&
    !loadingOlderMessages.value[conversationId];

  async function loadOlderMessages(conversationId: number) {
    if (!canLoadOlder(conversationId)) return false;

    loadingOlderMessages.value[conversationId] = true;

    try {
      const nextPage = (messagePages.value[conversationId] ?? 1) + 1;

      const res = await conversationService.getMessages(
        conversationId,
        true, // silent: we show our own "loading older" indicator
        nextPage,
      );

      const existingMessages = messages.value[conversationId] ?? [];
      const existingIds = new Set(existingMessages.map((m) => m.id));
      // de-dupe in case new messages shifted the page boundaries
      const olderMessages = res.data.data.filter((m) => !existingIds.has(m.id));

      messages.value[conversationId] = [...olderMessages, ...existingMessages];

      messagePages.value[conversationId] = res.data.current_page;

      hasMoreMessages.value[conversationId] =
        res.data.current_page < res.data.last_page;

      return true;
    } catch {
      return false;
    } finally {
      loadingOlderMessages.value[conversationId] = false;
    }
  }

  function patchLastMessage(
    conversationId: number,
    messageId: number,
    patch: Partial<LastMessage>,
  ) {
    const chat = getChat(conversationId);
    if (chat?.last_message?.id === messageId)
      Object.assign(chat.last_message, patch);
  }

  // updates the message and any reply-quote that points at it
  function patchMessage(
    conversationId: number,
    messageId: number,
    patch: Partial<ChatMessage>,
  ) {
    for (const m of messages.value[conversationId] ?? []) {
      if (m.id === messageId) Object.assign(m, patch);
      if (m.reply_to?.id === messageId) Object.assign(m.reply_to, patch);
    }
  }

  // moves the chat to the top and refreshes its preview line
  function bumpChat(chat: ChatListItem, msg: ChatMessage) {
    chat.last_message = {
      id: msg.id,
      message: msg.message,
      sender_id: msg.sender_id,
      created_at: msg.created_at,
      is_deleted: false,
    };
    chat.last_message_at = msg.created_at;
    chats.value = [chat, ...chats.value.filter((c) => c !== chat)];
  }

  async function sendMessage(
    conversationId: number,
    text: string,
    replyToId?: number,
  ) {
    if (sending.value) return false;
    sending.value = true;
    try {
      const res = await conversationService.sendMessage(conversationId, {
        message: text,
        ...(replyToId ? { reply_to_id: replyToId } : {}),
      });
      const msg: ChatMessage = {
        ...res.data,
        edited_at: res.data.edited_at ?? null,
        deleted_at: res.data.deleted_at ?? null,
        is_deleted: res.data.is_deleted ?? false,
        reply_to: res.data.reply_to ?? null,
      };

      // the websocket event can beat the HTTP response, so don't add it twice
      const list = (messages.value[conversationId] ??= []);
      if (!list.some((m) => m.id === msg.id)) list.push(msg);

      const chat = getChat(conversationId);
      if (chat) bumpChat(chat, msg);
      return true;
    } catch {
      return false;
    } finally {
      sending.value = false;
    }
  }

  async function editMessage(
    conversationId: number,
    messageId: number,
    text: string,
  ) {
    if (mutating.value) return false;
    mutating.value = true;
    try {
      const res = await messageService.edit(messageId, text);
      const { message, edited_at, updated_at } = res.data;
      patchMessage(conversationId, messageId, {
        message,
        edited_at,
        updated_at,
      });
      patchLastMessage(conversationId, messageId, { message });
      return true;
    } catch {
      return false;
    } finally {
      mutating.value = false;
    }
  }

  async function deleteMessage(conversationId: number, messageId: number) {
    if (mutating.value) return false;
    mutating.value = true;
    try {
      const res = await messageService.remove(messageId);
      patchMessage(conversationId, messageId, {
        message: null,
        is_deleted: true,
        deleted_at: res.data.deleted_at,
        updated_at: res.data.updated_at,
      });
      patchLastMessage(conversationId, messageId, {
        message: null,
        is_deleted: true,
      });
      return true;
    } catch {
      return false;
    } finally {
      mutating.value = false;
    }
  }

  // ── typing indicator ─────────────────────────────────
  // someone else is typing: show "typing..." and auto-clear if the signal stops
  // ── typing indicator ─────────────────────────────────
  // someone else started/stopped typing; auto-clears if their signal stops
  function setTyping(
    conversationId: number,
    userId: number,
    name: string,
    on: boolean,
  ) {
    const key = `${conversationId}:${userId}`;
    clearTimeout(typingTimers.get(key));
    typingTimers.delete(key);

    const current = { ...(typing.value[conversationId] ?? {}) };
    if (on) {
      current[userId] = name;
      typingTimers.set(
        key,
        window.setTimeout(
          () => setTyping(conversationId, userId, name, false),
          3000,
        ),
      );
    } else {
      delete current[userId];
    }
    typing.value[conversationId] = current;
  }

  const isTyping = (conversationId: number) =>
    Object.keys(typing.value[conversationId] ?? {}).length > 0;

  // "Ameer is typing..." / "Ameer and Tobi are typing..." / "" when nobody is
  const typingLabel = (conversationId: number) => {
    const names = Object.values(typing.value[conversationId] ?? {}).map(
      (n) => n.trim().split(" ")[0] || "Someone",
    );
    if (names.length === 0) return "";
    if (names.length === 1) return `${names[0]} is typing...`;
    if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
    return `${names[0]} and ${names.length - 1} others are typing...`;
  };

  // my side: tell the others I'm typing (name + id travel with the whisper)
  function whisperTyping(conversationId: number, on: boolean) {
    const me = useAuthStore().user;
    echo.private(`conversation.${conversationId}`).whisper("typing", {
      typing: on,
      user_id: me?.id ?? 0,
      name: me?.name ?? "",
    });
  }

  // throttled to one whisper every 2s
  function sendTyping(conversationId: number) {
    const now = Date.now();
    if (now - (lastWhisperAt.get(conversationId) ?? 0) < 2000) return;
    lastWhisperAt.set(conversationId, now);
    whisperTyping(conversationId, true);
  }

  function sendStoppedTyping(conversationId: number) {
    lastWhisperAt.delete(conversationId);
    whisperTyping(conversationId, false);
  }
  // ── real-time ────────────────────────────────────────
  // Called for every `message.sent` event, for any conversation.
  function receiveMessage(raw: ChatMessage) {
    const conversationId = raw.conversation_id;
    const msg: ChatMessage = {
      ...raw,
      edited_at: raw.edited_at ?? null,
      deleted_at: raw.deleted_at ?? null,
      is_deleted: raw.is_deleted ?? false,
      reply_to: raw.reply_to ?? null,
    };

    // 1) add to the open thread (only if that thread is already loaded)
    const list = messages.value[conversationId];
    if (list && !list.some((m) => m.id === msg.id)) list.push(msg);

    // 2) update the chat list
    const chat = getChat(conversationId);
    if (!chat) {
      fetchChats(true); // brand-new conversation we don't know about yet
      return;
    }

    const incoming = !isMine(msg.sender_id);
    if (incoming) setTyping(conversationId, msg.sender_id, "", false); // they sent it, so they stopped typing /

    if (chat.last_message && chat.last_message.id >= msg.id) return; // already handled

    if (incoming && activeConversationId.value !== conversationId) {
      chat.unread_count = (chat.unread_count ?? 0) + 1;
    }
    bumpChat(chat, msg);
  }

  function listenTo(conversationId: number) {
    if (subscribed.has(conversationId)) return;
    subscribed.add(conversationId);
    echo
      .private(`conversation.${conversationId}`)
      .listen(".message.sent", (event: { message: ChatMessage }) => {
        receiveMessage(event.message);
      })
      .listenForWhisper(
        "typing",
        (e: { typing: boolean; user_id: number; name: string }) => {
          if (e.user_id === myId()) return; // ignore my own other devices
          setTyping(conversationId, e.user_id, e.name, e.typing);
        },
      );
  }

  function listenToAll() {
    chats.value.forEach((c) => listenTo(c.conversation_id));
  }

  function stopListening() {
    subscribed.forEach((id) => echo.leave(`conversation.${id}`));
    subscribed.clear();
  }

  // ── read receipts ────────────────────────────────────
  // Mark other people's messages as read. First time we open a chat, only the last
  // `unread_count` incoming messages are unread; afterwards anything new gets marked.
  async function markIncomingAsRead(conversationId: number) {
    const chat = getChat(conversationId);
    if (!chat) return;

    const incoming = getMessages(conversationId).filter(
      (m) => !isMine(m.sender_id) && !m.is_deleted,
    );

    let seen = handledIncoming.get(conversationId);
    if (!seen) {
      const unread = chat.unread_count ?? 0;
      seen = new Set(
        incoming
          .slice(0, Math.max(0, incoming.length - unread))
          .map((m) => m.id),
      );
      handledIncoming.set(conversationId, seen);
    }

    const pending = incoming.filter((m) => !seen.has(m.id));
    if (!pending.length) {
      chat.unread_count = 0;
      return;
    }

    const results = await Promise.allSettled(
      pending.map((m) => messageService.markAsRead(m.id)),
    );
    results.forEach((r, i) => {
      if (r.status === "fulfilled") seen.add(pending[i]!.id);
    });
    if (results.every((r) => r.status === "fulfilled")) chat.unread_count = 0;
  }

  // Check which of my messages someone else has read (drives the double tick).
  // In a group, one reader is enough.
  async function refreshReadReceipts(conversationId: number) {
    const mine = getMessages(conversationId).filter(
      (m) => isMine(m.sender_id) && !m.is_deleted,
    );
    const unknown = mine.filter((m) => !readByFriend.value[m.id]).slice(-20);

    await Promise.all(
      unknown.map(async (m) => {
        try {
          const res = await messageService.getReadStatus(m.id);
          if (res.data.some((r) => r.user_id !== myId()))
            readByFriend.value[m.id] = true;
        } catch {
          /* ignore, try again on the next refresh */
        }
      }),
    );

    // if a newer message was read, every older one of mine was read too
    const newestRead = Math.max(
      0,
      ...mine.filter((m) => readByFriend.value[m.id]).map((m) => m.id),
    );
    mine.forEach((m) => {
      if (m.id <= newestRead) readByFriend.value[m.id] = true;
    });
  }

  const isReadByFriend = (messageId: number) => !!readByFriend.value[messageId];

  function reset() {
    stopListening();
    typingTimers.forEach((t) => clearTimeout(t));
    typingTimers.clear();
    lastWhisperAt.clear();
    typing.value = {};
    chats.value = [];
    messages.value = {};
    messagePages.value = {};
    hasMoreMessages.value = {};
    loadingOlderMessages.value = {};
    readByFriend.value = {};
    activeConversationId.value = null;
    handledIncoming.clear();
    fetchedOnce.value = false;
    groupMembers.value = {};
  }

  return {
    chats,
    loadingChats,
    fetchedOnce,
    messages,
    loadingMessages,
    loadingOlderMessages,
    hasMoreMessages,
    creatingGroup,
    sending,
    mutating,
    activeConversationId,
    isMine,
    typingLabel,
    fetchChats,
    getChat,

    getMessages,
    createGroup,
    loadingMembers,
    addingMembers,
    getMembers,
    fetchMembers,
    addMembers,
    fetchMessages,
    loadOlderMessages,
    canLoadOlder,
    sendMessage,
    editMessage,
    deleteMessage,
    receiveMessage,
    isTyping,
    sendTyping,
    sendStoppedTyping,
    listenTo,
    listenToAll,
    stopListening,
    markIncomingAsRead,
    refreshReadReceipts,
    isReadByFriend,
    reset,
  };
});
