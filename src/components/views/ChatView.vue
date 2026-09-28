<template>
  <MainLayout :activeTab="'chats'">
    <div class="px-6 py-4 space-y-4">
      <div v-for="chat in filteredChats" :key="chat.id" class="flex items-center gap-4 py-3 border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-secondary)] px-2 rounded cursor-pointer transition-colors">
        <!-- Avatar -->
        <img
          :src="chat.avatar"
          :alt="chat.name"
          class="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        
        <!-- Chat Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3 class="font-semibold text-[color:var(--color-text-primary)]">{{ chat.name }}</h3>
            <span class="text-xs text-[color:var(--color-text-secondary)]">{{ chat.time }}</span>
          </div>
          <p class="text-sm text-[color:var(--color-text-secondary)] truncate">{{ chat.message }}</p>
        </div>
        
        <!-- Badge -->
        <div v-if="chat.unread" class="w-6 h-6 bg-[#0891B2] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
          {{ chat.unread }}
        </div>
      </div>
    </div>
  </MainLayout>
</template>


<script setup lang="ts">
import { ref , computed, inject} from 'vue'
import MainLayout from '../layout/MainLayout.vue';

const searchQuery = inject<any>('searchQuery', ref(''))

// Filter chats based on search query
const filteredChats = computed(() => {
  if (!searchQuery.value || !searchQuery.value.trim()) {
    return chats.value
  }
  return chats.value.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})


const chats = ref([
  {
    id: 1,
    name: 'David Wayne',
    message: 'Thanks a bunch! Have a great day! 😊',
    time: '10:25',
    avatar: 'https://i.pravatar.cc/150?img=1',
    unread: null,
  },
  {
    id: 2,
    name: 'Edward Davidson',
    message: 'Great, thanks so much! 😊',
    time: '22:20 09/05',
    avatar: 'https://i.pravatar.cc/150?img=2',
    unread: 12,
  },
  {
    id: 3,
    name: 'Angela Kelly',
    message: 'Appreciate it! See you soon! 🎉',
    time: '10:45 08/05',
    avatar: 'https://i.pravatar.cc/150?img=3',
    unread: 1,
  },
  {
    id: 4,
    name: 'Jean Dare',
    message: 'Hooray! 🎉',
    time: '20:10 05/05',
    avatar: 'https://i.pravatar.cc/150?img=4',
    unread: null,
  },
  {
    id: 5,
    name: 'Dennis Borer',
    message: 'Your order has been successfully delivered',
    time: '17:02 05/05',
    avatar: 'https://i.pravatar.cc/150?img=5',
    unread: null,
  },
  {
    id: 6,
    name: 'Cayla Rath',
    message: 'See you soon!',
    time: '11:20 05/05',
    avatar: 'https://i.pravatar.cc/150?img=6',
    unread: null,
  },
  {
    id: 7,
    name: 'Erin Turcotte',
    message: 'I\'m ready to drop off your delivery. 👍',
    time: '19:35 02/05',
    avatar: 'https://i.pravatar.cc/150?img=7',
    unread: null,
  },
  {
    id: 8,
    name: 'Rodolfo Walter',
    message: 'Appreciate it! Hope you enjoy it!',
    time: '07:55 01/05',
    avatar: 'https://i.pravatar.cc/150?img=8',
    unread: null,
  },
])
</script>
