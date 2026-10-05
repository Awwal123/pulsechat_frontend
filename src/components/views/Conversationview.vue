<template>
  <div class="flex h-dvh flex-col bg-page">
    <header class="px-5 pt-5">
      <div class="relative flex h-11 items-center justify-center">
        <button
          type="button"
          aria-label="Go back"
          class="absolute left-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-chip text-text-primary transition-transform active:scale-95"
          @click="router.back()"
        >
          <ArrowLeftIcon class="h-6 w-6" />
        </button>
        <h1 class="text-xl font-bold text-text-primary">Message</h1>
        <button
          v-if="chat"
          type="button"
          aria-label="More options"
          class="absolute right-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-chip text-text-primary transition-transform active:scale-95"
        >
          <EllipsisHorizontalIcon class="h-6 w-6" />
        </button>
      </div>

      <div v-if="chat" class="flex items-center gap-3 border-b border-text-secondary/30 py-4">
        <img
          :src="chat.friend.profile_picture || FALLBACK_AVATAR"
          :alt="chat.friend.name"
          class="h-11 w-11 shrink-0 rounded-full object-cover"
        />
        <div class="min-w-0 flex-1">
          <p class="truncate text-[15px] font-bold text-text-primary">{{ chat.friend.name }}</p>
          <p
            class="truncate text-xs font-medium"
            :class="chatsStore.isTyping(conversationId) ? 'text-accent' : 'text-text-secondary'"
          >
            {{ chatsStore.isTyping(conversationId) ? 'typing...' : chat.friend.phone }}
          </p>
        </div>
        <button type="button" aria-label="Video call" class="cursor-pointer text-text-primary"><VideoCameraIcon class="h-7 w-7" /></button>
        <button type="button" aria-label="Voice call" class="ml-3 cursor-pointer text-text-primary"><PhoneIcon class="h-6 w-6" /></button>
      </div>
    </header>

    <!-- not found (only after the chat list has really loaded) -->
    <div v-if="!chat" class="flex flex-1 flex-col items-center justify-center gap-4 bg-chat-bg px-8 text-center">
      <p v-if="!chatsStore.fetchedOnce" class="text-sm text-text-secondary">Loading...</p>
      <template v-else>
        <p class="text-base font-semibold text-text-primary">Conversation not found</p>
        <RouterLink to="/chats" class="rounded-full bg-linear-to-b from-accent to-accent-dark px-6 py-3 text-sm font-semibold text-white">
          Back to chats
        </RouterLink>
      </template>
    </div>

    <template v-else>
      <div ref="scroller" class="flex-1 space-y-3 overflow-y-auto bg-chat-bg px-5 py-5">
        <p v-if="chatsStore.loadingMessages && !messages.length" class="text-center text-sm text-text-secondary">
          Loading messages...
        </p>
        <p v-else-if="!messages.length" class="text-center text-sm text-text-secondary">
          No messages yet. Say hi 👋
        </p>

        <ChatBubble
          v-for="m in messages"
          :key="m.id"
          :message="m"
          :mine="m.sender_id !== chat.friend.id"
          :read="chatsStore.isReadByFriend(m.id)"
          :friend-id="chat.friend.id"
          @menu="openMenu"
        />
      </div>

      <!-- editing banner -->
      <div
        v-if="editing"
        class="flex items-center gap-2 border-t border-text-secondary/30 bg-page px-5 py-2 text-xs"
      >
        <PencilIcon class="h-4 w-4 shrink-0 text-accent" />
        <div class="min-w-0 flex-1">
          <p class="font-bold text-accent">Editing message</p>
          <p class="truncate text-text-secondary">{{ editing.message }}</p>
        </div>
      </div>

      <footer class="flex items-center gap-3 border-t border-text-secondary/30 bg-page px-5 py-4">
        <button
          v-if="editing"
          type="button"
          aria-label="Cancel edit"
          class="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-chip text-text-primary transition-transform active:scale-95"
          @click="cancelEdit"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
        <button
          v-else
          type="button"
          aria-label="Attach"
          class="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-chip text-accent transition-transform active:scale-95"
        >
          <PlusIcon class="h-6 w-6" />
        </button>

        <input
          ref="input"
          v-model="draft"
          type="text"
          :placeholder="editing ? 'Edit message ...' : 'Type a message ...'"
          class="h-11 min-w-0 flex-1 rounded-lg bg-field px-4 text-[15px] text-text-primary outline-none placeholder:text-text-secondary/70"
          @input="onInput"
          @keyup.enter="submit"
          @keyup.esc="cancelEdit"
        />

        <button
          type="button"
          :aria-label="editing ? 'Save edit' : 'Send'"
          :disabled="!canSubmit"
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-accent to-accent-dark text-white shadow-md transition-all"
          :class="canSubmit ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-60'"
          @click="submit"
        >
          <CheckIcon v-if="editing" class="h-6 w-6" />
          <PaperAirplaneIcon v-else class="-mt-0.5 ml-0.5 h-5 w-5 -rotate-45" />
        </button>
      </footer>
    </template>

    <!-- action menu: Edit + Delete only -->
    <div v-if="menu" class="fixed inset-0 z-50" @click="menu = null" @contextmenu.prevent="menu = null">
      <div
        class="absolute w-44 overflow-hidden rounded-2xl bg-page py-1 shadow-xl ring-1 ring-text-secondary/20"
        :style="{ top: menu.top + 'px', right: '20px' }"
        @click.stop
      >
        <button
          type="button"
          class="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-[15px] font-medium text-text-primary hover:bg-chip/60"
          @click="startEdit"
        >
          <PencilIcon class="h-5 w-5" /> Edit
        </button>
        <button
          type="button"
          class="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-[15px] font-medium text-red-500 hover:bg-chip/60"
          @click="removeMessage"
        >
          <TrashIcon class="h-5 w-5" /> Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  CheckIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  TrashIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'
import ChatBubble from '../../assets/components/ChatBubble.vue'
import { useChatsStore } from '../../store/chats.ts'
import type { ChatMessage } from '../../types/api.ts'

const FALLBACK_AVATAR = 'https://i.pravatar.cc/150?img=12'
const POLL_MS = 30000 // real-time handles new messages now; polling is just a safety net

const props = defineProps<{ id: string }>()
const router = useRouter()
const chatsStore = useChatsStore()

const conversationId = computed(() => Number(props.id))
const chat = computed(() => chatsStore.getChat(conversationId.value))
const messages = computed(() => chatsStore.getMessages(conversationId.value))

const draft = ref('')
const scroller = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)

const editing = ref<ChatMessage | null>(null)
const menu = ref<{ message: ChatMessage; top: number } | null>(null)

const canSubmit = computed(
  () => !!draft.value.trim() && !chatsStore.sending && !chatsStore.mutating,
)

const scrollToBottom = async () => {
  await nextTick()
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
}

// ── typing indicator ────────────────────────────────────
const onInput = () => {
  if (editing.value) return // no typing signal while editing an old message
  if (draft.value.trim()) chatsStore.sendTyping(conversationId.value)
  else chatsStore.sendStoppedTyping(conversationId.value)
}

// ── send / edit ─────────────────────────────────────────
const submit = async () => {
  const text = draft.value.trim()
  if (!text || !chat.value || !canSubmit.value) return

  if (editing.value) {
    const target = editing.value
    if (text === target.message) return cancelEdit() // nothing changed
    const ok = await chatsStore.editMessage(conversationId.value, target.id, text)
    if (ok) cancelEdit()
    return
  }

  draft.value = ''
  chatsStore.sendStoppedTyping(conversationId.value)
  const ok = await chatsStore.sendMessage(conversationId.value, text)
  if (!ok) draft.value = text
}

// ── action menu ─────────────────────────────────────────
const openMenu = (message: ChatMessage, rect: DOMRect) => {
  const menuHeight = 110
  const below = rect.bottom + 8
  const top = below + menuHeight > window.innerHeight ? rect.top - menuHeight - 8 : below
  menu.value = { message, top: Math.max(8, top) }
}

const startEdit = async () => {
  if (!menu.value) return
  editing.value = menu.value.message
  draft.value = menu.value.message.message ?? ''
  menu.value = null
  await nextTick()
  input.value?.focus()
}

const cancelEdit = () => {
  editing.value = null
  draft.value = ''
}

const removeMessage = async () => {
  if (!menu.value) return
  const target = menu.value.message
  menu.value = null
  if (editing.value?.id === target.id) cancelEdit()
  await chatsStore.deleteMessage(conversationId.value, target.id)
}

// ── load + keep in sync ─────────────────────────────────
const syncReceipts = async () => {
  if (!chat.value) return
  const friendId = chat.value.friend.id
  await Promise.all([
    chatsStore.markIncomingAsRead(conversationId.value, friendId),
    chatsStore.refreshReadReceipts(conversationId.value, friendId),
  ])
}

const load = async () => {
  cancelEdit()
  chatsStore.activeConversationId = conversationId.value
  if (!chatsStore.fetchedOnce) await chatsStore.fetchChats()
  chatsStore.listenTo(conversationId.value) // no-op if already subscribed
  if (chat.value) {
    await chatsStore.fetchMessages(conversationId.value)
    await syncReceipts()
  }
  scrollToBottom()
}

let timer: number | undefined
let syncing = false
const poll = async () => {
  if (syncing || document.hidden || !chat.value || chatsStore.mutating) return
  syncing = true
  try {
    await chatsStore.fetchMessages(conversationId.value, true)
    await syncReceipts()
  } finally {
    syncing = false
  }
}

// a new message arrived (real-time, sent, or polled): scroll, and mark it read if it's from the friend
watch(
  () => messages.value.length,
  () => {
    scrollToBottom()
    const last = messages.value[messages.value.length - 1]
    if (last && chat.value && last.sender_id === chat.value.friend.id) syncReceipts()
  },
)

// switching conversations: stop typing in the old one, then load the new one
watch(conversationId, (_new, old) => {
  if (old) chatsStore.sendStoppedTyping(old)
  load()
})

onMounted(() => {
  load()
  timer = window.setInterval(poll, POLL_MS)
})

onBeforeUnmount(() => {
  clearInterval(timer)
  chatsStore.sendStoppedTyping(conversationId.value)
  if (chatsStore.activeConversationId === conversationId.value) {
    chatsStore.activeConversationId = null
  }
  // note: we do NOT leave the channel here, so the chat list keeps receiving updates
})
</script>