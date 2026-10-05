import { defineStore } from "pinia";
import { ref } from "vue";
import { conversationService, messageService } from "../services/api.ts";
import type { ChatListItem, ChatMessage, LastMessage } from "../types/api.ts";
import echo from "../echo.js";

export const useChatsStore = defineStore("chats", () => {
  const chats = ref<ChatListItem[]>([]);
  const loadingChats = ref(false);
  const fetchedOnce = ref(false);
  const messages = ref<Record<number, ChatMessage[]>>({});
  const loadingMessages = ref(false);
  const sending = ref(false);
  const mutating = ref(false); // edit / delete in progress
  const readByFriend = ref<Record<number, boolean>>({}); // my messages the friend has read
  const activeConversationId = ref<number | null>(null); // the chat currently open on screen
  const typing = ref<Record<number, boolean>>({}); // is the friend typing, per conversation

  // not reactive on purpose
  const handledIncoming = new Map<number, Set<number>>();
  const subscribed = new Set<number>();
  const typingTimers = new Map<number, number>();
  const lastWhisperAt = new Map<number, number>();

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

  // ── messages ─────────────────────────────────────────
  async function fetchMessages(conversationId: number, silent = false) {
    loadingMessages.value = true;
    try {
      const res = await conversationService.getMessages(conversationId, silent);
      messages.value[conversationId] = res.data;
      return true;
    } catch {
      return false;
    } finally {
      loadingMessages.value = false;
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
  // friend side: show "typing..." and auto-clear if the signal stops
  function setTyping(conversationId: number, on: boolean) {
    clearTimeout(typingTimers.get(conversationId));
    typingTimers.delete(conversationId);
    typing.value[conversationId] = on;
    if (on) {
      typingTimers.set(
        conversationId,
        window.setTimeout(() => (typing.value[conversationId] = false), 3000),
      );
    }
  }

  const isTyping = (conversationId: number) => !!typing.value[conversationId];

  // my side: tell the friend I'm typing (throttled to one whisper every 2s)
  function sendTyping(conversationId: number) {
    const now = Date.now();
    if (now - (lastWhisperAt.get(conversationId) ?? 0) < 2000) return;
    lastWhisperAt.set(conversationId, now);
    echo
      .private(`conversation.${conversationId}`)
      .whisper("typing", { typing: true });
  }

  function sendStoppedTyping(conversationId: number) {
    lastWhisperAt.delete(conversationId);
    echo
      .private(`conversation.${conversationId}`)
      .whisper("typing", { typing: false });
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

    const incoming = msg.sender_id === chat.friend.id;
    if (incoming) setTyping(conversationId, false); // they sent it, so they stopped typing

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
      .listenForWhisper("typing", (e: { typing: boolean }) => {
        setTyping(conversationId, e.typing);
      });
  }

  function listenToAll() {
    chats.value.forEach((c) => listenTo(c.conversation_id));
  }

  function stopListening() {
    subscribed.forEach((id) => echo.leave(`conversation.${id}`));
    subscribed.clear();
  }

  // ── read receipts ────────────────────────────────────
  // Mark the friend's messages as read. First time we open a chat, only the last
  // `unread_count` incoming messages are unread; afterwards anything new gets marked.
  async function markIncomingAsRead(conversationId: number, friendId: number) {
    const chat = getChat(conversationId);
    if (!chat) return;

    const incoming = getMessages(conversationId).filter(
      (m) => m.sender_id === friendId && !m.is_deleted,
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

  // Check which of my messages the friend has read (drives the double tick).
  async function refreshReadReceipts(conversationId: number, friendId: number) {
    const mine = getMessages(conversationId).filter(
      (m) => m.sender_id !== friendId && !m.is_deleted,
    );
    const unknown = mine.filter((m) => !readByFriend.value[m.id]).slice(-20);

    await Promise.all(
      unknown.map(async (m) => {
        try {
          const res = await messageService.getReadStatus(m.id);
          if (res.data.some((r) => r.user_id === friendId))
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
    readByFriend.value = {};
    activeConversationId.value = null;
    handledIncoming.clear();
    fetchedOnce.value = false;
  }

  return {
    chats,
    loadingChats,
    fetchedOnce,
    messages,
    loadingMessages,
    sending,
    mutating,
    activeConversationId,
    fetchChats,
    getChat,
    getMessages,
    fetchMessages,
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