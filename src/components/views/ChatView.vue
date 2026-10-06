<template>
  <MainLayout>
    <div
      v-if="chatsStore.loadingChats && !chatsStore.chats.length"
      class="px-8 pt-24 text-center text-sm text-text-secondary"
    >
      Loading chats...
    </div>

    <ul v-else-if="filteredChats.length" class="px-4 py-2">
      <ChatRow v-for="chat in filteredChats" :key="chat.conversation_id" :chat="chat" />
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
import { computed, onMounted } from 'vue'
import MainLayout from '../layout/MainLayout.vue'
import ChatRow from '../../assets/components/ChatRow.vue'
import { useSearch } from '../../assets/composables/Usesearch.ts'
import { useChatsStore } from '../../store/chats.ts'
import { chatName } from '../../utils/chatDisplay.ts'

const chatsStore = useChatsStore()
const { query: searchQuery } = useSearch()

// always refresh when the screen opens; silent once we already have data
onMounted(() => chatsStore.fetchChats(chatsStore.fetchedOnce))

const isSearching = computed(() => searchQuery.value.trim().length > 0)

const filteredChats = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return q
    ? chatsStore.chats.filter((c) => chatName(c).toLowerCase().includes(q))
    : chatsStore.chats
})
</script>