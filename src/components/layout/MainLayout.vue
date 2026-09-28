<template>
  <div class="min-h-screen bg-[color:var(--color-page)] flex flex-col">
    <!-- Header -->
    <div class="bg-gradient-to-r from-[#0891B2] to-[#0284C7] text-white px-6 py-4 flex items-center justify-between gap-4">
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
        class="flex-1 bg-white text-[color:var(--color-text-primary)] placeholder-[color:var(--color-text-secondary)] rounded-full px-4 py-2 focus:outline-none"
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

    <!-- Page Content -->
    <div class="flex-1 overflow-y-auto">
      <slot />
    </div>

    <!-- Bottom Navigation -->
    <div class="bg-[color:var(--color-surface)] border-t border-[color:var(--color-border)] px-6 py-4 flex items-center justify-around">
      <router-link
        to="/chats"
        class="flex flex-col items-center gap-2 transition-colors"
        :class="activeTab === 'chats' ? 'text-[#0891B2]' : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]'"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
        <span class="text-xs font-medium">Chats</span>
      </router-link>
      
      <router-link
        to="/groups"
        class="flex flex-col items-center gap-2 transition-colors"
        :class="activeTab === 'groups' ? 'text-[#0891B2]' : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]'"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-5-9h10v2H7z"/>
        </svg>
        <span class="text-xs font-medium">Groups</span>
      </router-link>
      
      <router-link
        to="/profile"
        class="flex flex-col items-center gap-2 transition-colors"
        :class="activeTab === 'profile' ? 'text-[#0891B2]' : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]'"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        <span class="text-xs font-medium">Profile</span>
      </router-link>
      
      <router-link
        to="/more"
        class="flex flex-col items-center gap-2 transition-colors"
        :class="activeTab === 'more' ? 'text-[#0891B2]' : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]'"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
        <span class="text-xs font-medium">More</span>
      </router-link>
    </div>

    <!-- Add Friend / Create Group Modal -->
    <AddFriendCreateGroupModal v-model="showActionModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AddFriendCreateGroupModal from '../../assets/components/AddFriendCreateGroupModal.vue'

const route = useRoute()
const showSearchBar = ref(false)
const showActionModal = ref(false)
const searchQuery = ref('')

const activeTab = ref<string>('')

// Determine active tab from current route
const getActiveTab = () => {
  const path = route.path
  if (path.includes('chats')) return 'chats'
  if (path.includes('groups')) return 'groups'
  if (path.includes('profile')) return 'profile'
  if (path.includes('more')) return 'more'
  return 'chats'
}

const toggleSearch = () => {
  showSearchBar.value = true
}

const clearSearch = () => {
  showSearchBar.value = false
  searchQuery.value = ''
}

// Watch route changes to update active tab
import { watch } from 'vue'
watch(() => route.path, () => {
  activeTab.value = getActiveTab()
}, { immediate: true })

// Expose searchQuery for child components to use
defineExpose({
  searchQuery,
})
</script>
