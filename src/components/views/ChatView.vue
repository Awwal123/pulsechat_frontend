<template>
  <MainLayout>
    <ul v-if="filteredChats.length" class="px-4 py-2">
      <li
        v-for="chat in filteredChats"
        :key="chat.id"
        class="flex cursor-pointer items-center gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-chip/60"
        @click="openChat(chat)"
      >
        <img :src="chat.avatar" :alt="chat.name" class="h-12 w-12 shrink-0 rounded-full object-cover" />

        <div class="min-w-0 flex-1">
          <h3 class="truncate text-base font-bold text-text-primary">{{ chat.name }}</h3>
          <p class="mt-1 truncate text-[13px] font-medium text-text-secondary">{{ chat.message }}</p>
        </div>

        <!-- time on top, unread badge underneath -->
        <div class="flex shrink-0 flex-col items-end gap-1.5 self-stretch py-0.5">
          <span class="text-xs font-semibold text-text-secondary">{{ chat.time }}</span>
          <span
            v-if="chat.unread"
            class="flex h-5 min-w-6 items-center justify-center rounded-md bg-accent px-1.5 text-xs font-bold text-white"
          >
            {{ chat.unread }}
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layout/MainLayout.vue'
import { useSearch } from '../../assets/composables/Usesearch.ts'


interface Chat {
  id: number
  name: string
  message: string
  time: string
  avatar: string
  unread: number | null
}

const router = useRouter()

// the header search box (MainLayout) writes to this
const { query: searchQuery } = useSearch()

const chats = ref<Chat[]>([
  { id: 1, name: 'David Wayne', message: 'Thanks a bunch! Have a great day! 😊', time: '10:25', avatar: 'https://i.pravatar.cc/150?img=1', unread: 5 },
  { id: 2, name: 'Edward Davidson', message: 'Great, thanks so much! 💫', time: '22:20 09/05', avatar: 'https://i.pravatar.cc/150?img=2', unread: 12 },
  { id: 3, name: 'Angela Kelly', message: 'Appreciate it! See you soon! 🚀', time: '10:45 08/05', avatar: 'https://i.pravatar.cc/150?img=3', unread: 1 },
  { id: 4, name: 'Jean Dare', message: 'Hooray! 🎉', time: '20:10 05/05', avatar: 'https://i.pravatar.cc/150?img=4', unread: null },
  { id: 5, name: 'Dennis Borer', message: 'Your order has been successfully delivered', time: '17:02 05/05', avatar: 'https://i.pravatar.cc/150?img=5', unread: null },
  { id: 6, name: 'Cayla Rath', message: 'See you soon!', time: '11:20 05/05', avatar: 'https://i.pravatar.cc/150?img=6', unread: null },
  { id: 7, name: 'Erin Turcotte', message: "I'm ready to drop off your delivery. 👍", time: '19:35 02/05', avatar: 'https://i.pravatar.cc/150?img=7', unread: null },
  { id: 8, name: 'Rodolfo Walter', message: 'Appreciate it! Hope you enjoy it!', time: '07:55 01/05', avatar: 'https://i.pravatar.cc/150?img=8', unread: null },
])

const isSearching = computed(() => searchQuery.value.trim().length > 0)

const filteredChats = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return q ? chats.value.filter((c) => c.name.toLowerCase().includes(q)) : chats.value
})

const openChat = (chat: Chat) => {
  router.push(`/chats/${chat.id}`)
}
</script>