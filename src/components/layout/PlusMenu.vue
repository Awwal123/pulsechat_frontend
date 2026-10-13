<template>
  <div ref="root" class="relative">
    <button
      type="button"
      data-tour="plus-button"
      :aria-label="open ? 'Close menu' : 'Open menu'"
      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white transition-colors"
      :class="open ? 'bg-white/20' : 'hover:bg-white/10'"
      @click="open = !open"
    >
      <XMarkIcon v-if="open" class="h-6 w-6" />
      <PlusIcon v-else class="h-6 w-6" />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="scale-95 opacity-0"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="scale-95 opacity-0"
    >
      <div v-if="open" class="absolute top-12 right-0 z-40 w-60 origin-top-right rounded-2xl bg-sheet p-2 shadow-xl">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :data-tour="item.tour"
          class="flex items-center gap-4 rounded-xl px-4 py-4 text-[15px] font-medium text-text-primary transition-colors hover:bg-chip"
          @click="open = false"
        >
          <component :is="item.icon" class="h-6 w-6 text-text-secondary" />
          <span class="flex-1">{{ item.label }}</span>
          <span
            v-if="item.badge"
            data-tour="friend-requests"
            class="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white"
          >
            {{ item.badge }}
          </span>
        </RouterLink>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PlusIcon, XMarkIcon, UserIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import { useContacts } from '../../assets/composables/Usecontacts'
import { useTourStore } from '../../store/tour.ts'

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const { pendingCount } = useContacts()
const tour = useTourStore()

const items = computed(() => [
  { label: 'Add Friend', to: '/friends/add', icon: UserIcon, badge: pendingCount.value || null, tour: 'add-friend' },
  { label: 'Create Group', to: '/groups/create', icon: UserGroupIcon, badge: null, tour: 'create-group' },
])


watch(
  () => tour.menuOpen,
  (v) => {
    open.value = v
  },
)

const onDocClick = (e: MouseEvent) => {
  if (tour.active) return 
  if (!open.value || !root.value) return
  if (!e.composedPath().includes(root.value)) open.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>