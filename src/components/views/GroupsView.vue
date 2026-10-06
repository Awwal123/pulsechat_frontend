<template>
  <MainLayout activeTab="groups">
    <div
      v-if="chatsStore.loadingChats && !chatsStore.chats.length"
      class="px-8 pt-24 text-center text-sm text-text-secondary"
    >
      Loading groups...
    </div>

    <ul v-else-if="groups.length" class="px-4 py-2">
      <ChatRow v-for="chat in groups" :key="chat.conversation_id" :chat="chat" />
    </ul>

    <div v-else class="flex flex-col items-center px-8 pt-24 text-center">
      <p class="text-base font-semibold text-text-primary">
        {{ isSearching ? 'No groups found' : 'No groups yet' }}
      </p>
      <p class="mt-1 text-sm text-text-secondary">
        {{ isSearching ? 'Try a different name.' : 'Create a group to chat with several friends at once.' }}
      </p>
      <RouterLink
        v-if="!isSearching"
        to="/groups/create"
        class="mt-6 flex h-12 w-full max-w-xs items-center justify-center rounded-full bg-linear-to-b from-accent to-accent-dark text-sm font-semibold text-white shadow-md transition-all active:scale-95"
      >
        Create Group
      </RouterLink>
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

onMounted(() => chatsStore.fetchChats(chatsStore.fetchedOnce))

const isSearching = computed(() => searchQuery.value.trim().length > 0)

const groups = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const all = chatsStore.chats.filter((c) => c.type === 'group')
  return q ? all.filter((c) => chatName(c).toLowerCase().includes(q)) : all
})
</script>