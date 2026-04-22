<template>
  <div class="min-h-screen bg-page flex flex-col">
    <!-- Header -->
    <div class="bg-linear-to-r from-[#0891B2] to-[#0284C7] text-white px-6 py-4 flex items-center justify-between gap-4">
      <div v-if="!showSearchBar" class="flex items-center gap-2">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/>
        </svg>
        <span class="text-xl font-bold">E-Chat</span>
      </div>
      
      <!-- Search Input in Header -->
      <input
        v-if="showSearchBar"
        v-model="searchQuery"
        type="text"
        placeholder="Search"
        autofocus
        class="flex-1 bg-white text-primary placeholder-text-secondary rounded-full px-4 py-2 focus:outline-none"
      />
      
      <div class="flex items-center gap-2 ml-auto">
        <!-- Search Icon - Hidden when search is active -->
        <button
          v-if="!showSearchBar"
          @click="toggleSearch"
          class="hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <!-- Close Button - Shown when search is active -->
        <button
          v-if="showSearchBar"
          @click="clearSearch"
          class="hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Plus Button -->
        <button
          @click="showActionModal = true"
          class="hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Chats List -->
    <div class="flex-1 overflow-y-auto">
      <div v-for="chat in filteredChats" :key="chat.id" class="px-6 py-4 border-b border-border hover:bg-(--color-surface-secondary) transition-colors cursor-pointer">
        <div class="flex items-center gap-4">
          <!-- Avatar -->
          <img
            :src="chat.avatar"
            :alt="chat.name"
            class="w-12 h-12 rounded-full object-cover shrink-0"
          />
          
          <!-- Chat Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-semibold text-text-primary">{{ chat.name }}</h3>
              <span class="text-xs text-text-secondary">{{ chat.time }}</span>
            </div>
            <p class="text-sm text-text-secondary truncate">{{ chat.message }}</p>
          </div>
          
          <!-- Badge -->
          <div v-if="chat.unread" class="w-6 h-6 bg-[#0891B2] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
            {{ chat.unread }}
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="bg-(--color-surface) border-t border-border px-6 py-4 flex items-center justify-around">
      <button class="flex flex-col items-center gap-2 text-[#0891B2]">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
        <span class="text-xs font-medium">Chats</span>
      </button>
      
      <button class="flex flex-col items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-9h10v2H7z"/>
        </svg>
        <span class="text-xs font-medium">Groups</span>
      </button>
      
      <button class="flex flex-col items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        <span class="text-xs font-medium">Profile</span>
      </button>
      
      <button class="flex flex-col items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
        <span class="text-xs font-medium">More</span>
      </button>
    </div>

    <!-- Add Friend / Create Group Modal -->
    <AddFriendCreateGroupModal v-model="showActionModal"  />
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import AddFriendCreateGroupModal from '../../assets/components/AddFriendCreateGroupModal.vue'


const showSearchBar = ref(false)
const showActionModal = ref(false)
const searchQuery = ref('')

const toggleSearch = () => {
  showSearchBar.value = true
}

const clearSearch = () => {
  showSearchBar.value = false
  searchQuery.value = ''
}

// Filter chats based on search query
const filteredChats = computed(() => {
  if (!searchQuery.value.trim()) {
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
