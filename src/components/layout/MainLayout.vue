<template>
  <div class="flex h-dvh flex-col bg-page">
    <!-- Header (relative + z-30 so the + dropdown can overlap the page) -->
    <header
      class="relative z-30 flex items-center justify-between gap-3 bg-linear-to-br from-header-from to-header-to px-5 py-4 text-white"
    >
      <div v-if="!showSearchBar" class="flex items-center gap-2">
        <img
          src="../../assets/images/pulsechat-icon-light.svg"
          alt="Pulse Chat"
          class="h-8 dark:hidden"
        />
        <img
          src="../../assets/images/pulsechat-icon-dark.svg"
          alt="Pulse Chat"
          class="hidden h-8 dark:block"
        />
      </div>

      <!-- search pill -->
      <input
        v-else
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        placeholder="Search"
        class="h-10 min-w-0 flex-1 rounded-full bg-white px-5 text-[15px] text-slate-800 placeholder-slate-400 outline-none"
      />

      <div class="ml-auto flex items-center gap-1">
        <button
          v-if="!showSearchBar"
          type="button"
          aria-label="Search"
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
          @click="openSearch"
        >
          <MagnifyingGlassIcon class="h-6 w-6" />
        </button>

        <button
          v-else
          type="button"
          aria-label="Close search"
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
          @click="closeSearch"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>

        <!-- + button → dropdown: Add Friend / Create Group -->
        <PlusMenu v-if="!showSearchBar" />
      </div>
    </header>

    <!-- Page content -->
    <div class="flex-1 overflow-y-auto">
      <slot />
    </div>

    <!-- Bottom navigation -->
    <nav class="flex items-center gap-1 rounded-t-3xl bg-chip p-1.5">
      <RouterLink
        v-for="t in tabs"
        :key="t.id"
        :to="t.to"
        class="flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-2.5 text-xs font-medium transition-colors"
        :class="current === t.id
          ? 'bg-linear-to-b from-accent to-accent-dark text-white shadow-md'
          : 'text-text-secondary hover:text-text-primary'"
      >
        <component :is="t.icon" class="h-6 w-6" />
        {{ t.label }}
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Bars3Icon,
  ChatBubbleOvalLeftEllipsisIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import PlusMenu from './PlusMenu.vue';
import { useSearch } from '../../assets/composables/Usesearch.ts';


// optional: views may still pass :activeTab, otherwise it comes from the route
const props = defineProps<{ activeTab?: string }>()
const route = useRoute()

const tabs = [
  { id: 'chats', to: '/chats', label: 'Chats', icon: ChatBubbleOvalLeftEllipsisIcon },
  { id: 'groups', to: '/groups', label: 'Groups', icon: UserGroupIcon },
  { id: 'profile', to: '/profile', label: 'Profile', icon: UserCircleIcon },
  { id: 'more', to: '/more', label: 'More', icon: Bars3Icon },
]
const current = computed(
  () => props.activeTab ?? tabs.find((t) => route.path.startsWith(t.to))?.id ?? 'chats',
)

/* search: shared with the pages through useSearch() */
const { query: searchQuery } = useSearch()

const showSearchBar = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

const openSearch = async () => {
  showSearchBar.value = true
  await nextTick()
  searchInput.value?.focus()
}
const closeSearch = () => {
  showSearchBar.value = false
  searchQuery.value = ''
}
</script>
