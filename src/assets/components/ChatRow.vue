<template>
  <li
    class="flex cursor-pointer items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-chip/60"
    @click="router.push(`/chats/${chat.conversation_id}`)"
  >
    <img
      v-if="avatar"
      :src="avatar"
      :alt="name"
      class="h-12 w-12 shrink-0 rounded-full object-cover"
    />
    <div
      v-else
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-chip text-text-secondary"
    >
      <UserGroupIcon class="h-6 w-6" />
    </div>

    <div class="min-w-0 flex-1">
      <h3 class="truncate text-base font-bold text-text-primary">{{ name }}</h3>
      <p
  class="mt-1 truncate text-[13px] font-medium"
  :class="typingLabel ? 'text-accent' : 'text-text-secondary'"
>
  {{ typingLabel || preview }}
</p>
    </div>

    <!-- time on top, unread badge underneath -->
    <div class="flex shrink-0 flex-col items-end gap-1.5 self-stretch py-0.5">
      <span v-if="chat.last_message" class="text-xs font-semibold text-text-secondary">
        {{ formatChatTime(chat.last_message.created_at) }}
      </span>
      <span
        v-if="chat.unread_count > 0"
        class="flex h-5 min-w-6 items-center justify-center rounded-md bg-accent px-1.5 text-xs font-bold text-white"
      >
        {{ chat.unread_count }}
      </span>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { UserGroupIcon } from '@heroicons/vue/24/outline'
import { useChatsStore } from '../../store/chats.ts'
import type { ChatListItem } from '../../types/api.ts'
import { formatChatTime } from '../../utils/formatTime.ts'
import { chatAvatar, chatName, chatPreview } from '../../utils/chatDisplay.ts'

const props = defineProps<{ chat: ChatListItem }>()

const router = useRouter()
const chatsStore = useChatsStore()

const name = computed(() => chatName(props.chat))
const avatar = computed(() => chatAvatar(props.chat))
const typingLabel = computed(() => chatsStore.typingLabel(props.chat.conversation_id))
const preview = computed(() => chatPreview(props.chat, chatsStore.isMine))
</script>