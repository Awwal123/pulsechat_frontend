<template>
  <MainLayout>
    <div
      v-if="chatsStore.loadingChats && !chatsStore.chats.length"
      class="px-8 pt-24 text-center text-sm text-text-secondary"
    >
      Loading chats...
    </div>

    <ul v-else-if="filteredChats.length" class="px-4 py-2">
      <li
        v-for="chat in filteredChats"
        :key="chat.conversation_id"
        class="flex cursor-pointer items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-chip/60"
        @click="openChat(chat)"
      >
        <img
          :src="chat.friend.profile_picture || FALLBACK_AVATAR"
          :alt="chat.friend.name"
          class="h-12 w-12 shrink-0 rounded-full object-cover"
        />

        <div class="min-w-0 flex-1">
          <h3 class="truncate text-base font-bold text-text-primary">
            {{ chat.friend.name }}
          </h3>
          <p class="mt-1 truncate text-[13px] font-medium text-text-secondary">
            {{ preview(chat) }}
          </p>
        </div>

        <!-- time on top, unread badge underneath -->
        <div
          class="flex shrink-0 flex-col items-end gap-1.5 self-stretch py-0.5"
        >
          <span
            v-if="chat.last_message"
            class="text-xs font-semibold text-text-secondary"
          >
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
    </ul>

    <!-- empty state: searching with no match, or no chats yet -->
    <div v-else class="flex flex-col items-center px-8 pt-24 text-center">
      <p class="text-base font-semibold text-text-primary">
        {{ isSearching ? 'No chats found' : 'No conversations yet' }}
      </p>
      <p class="mt-1 text-sm text-text-secondary">
        {{ isSearching ? 'Try a different name.' : 'Add a friend or start a group to begin chatting.' }}
      </p>

      <div v-if="!isSearching" class="mt-6 flex w-full max-w-xs gap-3">
        <RouterLink
          to="/friends/add"
          class="flex h-12 flex-1 items-center justify-center rounded-full bg-tint text-sm font-semibold text-tint-text transition-all active:scale-95"
        >
          Add Friend
        </RouterLink>
        <RouterLink
          to="/groups/create"
          class="flex h-12 flex-1 items-center justify-center rounded-full bg-linear-to-b from-accent to-accent-dark text-sm font-semibold text-white shadow-md transition-all active:scale-95"
        >
          Create Group
        </RouterLink>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layout/MainLayout.vue'
import { useSearch } from '../../assets/composables/Usesearch.ts'
import { useChatsStore } from '../../store/chats.ts'
import type { ChatListItem } from '../../types/api.ts'
import { formatChatTime } from '../../utils/formatTime.ts'




const FALLBACK_AVATAR = 'https://i.pravatar.cc/150?img=12'


const router = useRouter()
const chatsStore = useChatsStore()
const { query: searchQuery } = useSearch()

onMounted(() => chatsStore.fetchChats())

const isSearching = computed(() => searchQuery.value.trim().length > 0)

const filteredChats = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return q
    ? chatsStore.chats.filter((c) => c.friend.name.toLowerCase().includes(q))
    : chatsStore.chats
})

const preview = (chat: ChatListItem) => {
  const m = chat.last_message
  if (!m) return 'No messages yet'
  const text = m.is_deleted ? 'This message was deleted' : (m.message ?? '')
  return m.sender_id === chat.friend.id ? text : `You: ${text}`
}
const openChat = (chat: ChatListItem) => router.push(`/chats/${chat.conversation_id}`)
</script>
