import { defineStore } from "pinia";
import { ref } from "vue";
import { conversationService } from "../services/api.ts";
import type { ChatListItem, ChatMessage } from "../types/api.ts";

export const useChatsStore = defineStore("chats", () => {
  const chats = ref<ChatListItem[]>([]);
  const loadingChats = ref(false);
  const fetchedOnce = ref(false);
  const messages = ref<Record<number, ChatMessage[]>>({});
  const loadingMessages = ref(false);
  const sending = ref(false);

  async function fetchChats(silent = false) {
    loadingChats.value = true;
    try {
      const res = await conversationService.getChatList(silent);
      chats.value = res.data;
      return true;
    } catch {
      return false;
    } finally {
      loadingChats.value = false;
      fetchedOnce.value = true;
    }
  }

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

  const getChat = (conversationId: number) =>
    chats.value.find((c) => c.conversation_id === conversationId) ?? null;

  const getMessages = (conversationId: number) => messages.value[conversationId] ?? [];

  async function sendMessage(conversationId: number, text: string, replyToId?: number) {
    if (sending.value) return false;
    sending.value = true;
    try {
      const res = await conversationService.sendMessage(conversationId, {
        message: text,
        ...(replyToId ? { reply_to_id: replyToId } : {}),
      });
      const msg = res.data;
      (messages.value[conversationId] ??= []).push(msg);

      const chat = getChat(conversationId);
      if (chat) {
        chat.last_message = {
          id: msg.id,
          message: msg.message,
          sender_id: msg.sender_id,
          created_at: msg.created_at,
          is_deleted: msg.is_deleted ?? false,
        };
        chat.last_message_at = msg.created_at;
        chats.value = [chat, ...chats.value.filter((c) => c !== chat)];
      }
      return true;
    } catch {
      return false;
    } finally {
      sending.value = false;
    }
  }

  function reset() {
    chats.value = [];
    messages.value = {};
    fetchedOnce.value = false;
  }

  return {
    chats, loadingChats, fetchedOnce, messages, loadingMessages, sending,
    fetchChats, fetchMessages, getChat, getMessages, sendMessage, reset,
  };
});