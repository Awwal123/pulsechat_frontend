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
          <p class="truncate text-xs font-medium text-text-secondary">{{ chat.friend.phone }}</p>
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
      <div ref="scroller" class="flex-1 space-y-4 overflow-y-auto bg-chat-bg px-5 py-5">
        <p v-if="chatsStore.loadingMessages && !messages.length" class="text-center text-sm text-text-secondary">
          Loading messages...
        </p>
        <p v-else-if="!messages.length" class="text-center text-sm text-text-secondary">
          No messages yet. Say hi 👋
        </p>

        <MessageBubble
          v-for="m in messages"
          :key="m.id"
          :text="m.is_deleted ? 'This message was deleted' : (m.message ?? '')"
          :time="formatChatTime(m.created_at) + (m.edited_at && !m.is_deleted ? ' · edited' : '')"
          :mine="m.sender_id !== chat.friend.id"
          :sender="null"
        />
      </div>

      <footer class="flex items-center gap-3 border-t border-text-secondary/30 bg-page px-5 py-4">
        <button
          type="button"
          aria-label="Attach"
          class="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-chip text-accent transition-transform active:scale-95"
        >
          <PlusIcon class="h-6 w-6" />
        </button>

        <input
          v-model="draft"
          type="text"
          placeholder="Type a message ..."
          class="h-11 min-w-0 flex-1 rounded-lg bg-field px-4 text-[15px] text-text-primary outline-none placeholder:text-text-secondary/70"
          @keyup.enter="send"
        />

        <button
          type="button"
          aria-label="Send"
          :disabled="!draft.trim() || chatsStore.sending"
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-accent to-accent-dark text-white shadow-md transition-all"
          :class="draft.trim() && !chatsStore.sending ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-60'"
          @click="send"
        >
          <PaperAirplaneIcon class="-mt-0.5 ml-0.5 h-5 w-5 -rotate-45" />
        </button>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  EllipsisHorizontalIcon,
  PhoneIcon,
  PlusIcon,
  VideoCameraIcon,
} from '@heroicons/vue/24/outline'
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'
import MessageBubble from '../../assets/components/Messagebubble.vue'
import { useChatsStore } from '../../store/chats.ts'
import { formatChatTime } from '../../utils/formatTime.ts'

const FALLBACK_AVATAR = 'https://i.pravatar.cc/150?img=12'

const props = defineProps<{ id: string }>()
const router = useRouter()
const chatsStore = useChatsStore()

const conversationId = computed(() => Number(props.id))
const chat = computed(() => chatsStore.getChat(conversationId.value))
const messages = computed(() => chatsStore.getMessages(conversationId.value))

const draft = ref('')
const scroller = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
}

const send = async () => {
  const text = draft.value.trim()
  if (!text || !chat.value || chatsStore.sending) return
  draft.value = ''
  const ok = await chatsStore.sendMessage(conversationId.value, text)
  if (!ok) draft.value = text
}

const load = async () => {
  if (!chatsStore.fetchedOnce) await chatsStore.fetchChats()
  if (chat.value) await chatsStore.fetchMessages(conversationId.value)
  scrollToBottom()
}

watch(() => messages.value.length, scrollToBottom)
watch(conversationId, load)
onMounted(load)
</script>