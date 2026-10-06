<template>
  <SubPageLayout :title="title">
    <div class="px-4 pt-4">
      <p class="mb-3 text-sm text-text-secondary">{{ members.length }} members</p>

      <button
        v-if="isAdmin"
        type="button"
        class="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-tint text-[15px] font-medium text-tint-text transition-all active:scale-[0.99]"
        @click="openSheet"
      >
        <PlusIcon class="h-5 w-5" />
        Add members
      </button>

      <p
        v-if="chatsStore.loadingMembers && !members.length"
        class="pt-10 text-center text-sm text-text-secondary"
      >
        Loading members...
      </p>

      <ul class="mt-3">
        <li v-for="m in sortedMembers" :key="m.id">
          <PersonRow
            :name="chatsStore.isMine(m.id) ? 'You' : m.name"
            :subtitle="m.phone"
            :avatar="m.profile_picture || FALLBACK_AVATAR"
          >
            <template #action>
              <span
                v-if="m.role === 'admin'"
                class="shrink-0 rounded-md bg-chip px-2 py-1 text-xs font-semibold text-text-secondary"
              >
                Admin
              </span>
            </template>
          </PersonRow>
        </li>
      </ul>
    </div>
  </SubPageLayout>

  <!-- pick friends to add -->
  <BottomSheet v-model="sheetOpen" title="Add members">
    <div class="px-4 pt-4">
      <ul>
        <li v-for="c in candidates" :key="c.id">
          <div class="cursor-pointer" @click="toggle(c.id)">
            <PersonRow :name="c.name" :subtitle="c.phone" :avatar="c.avatar">
              <template #action>
                <span
                  role="checkbox"
                  :aria-checked="draft.includes(c.id)"
                  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors"
                  :class="draft.includes(c.id) ? 'border-accent bg-accent text-white' : 'border-text-secondary/60'"
                >
                  <CheckIcon v-if="draft.includes(c.id)" class="h-4 w-4 stroke-3" />
                </span>
              </template>
            </PersonRow>
          </div>
        </li>
        <li v-if="!candidates.length" class="pt-10 text-center text-sm text-text-secondary">
          All your friends are already in this group
        </li>
      </ul>
    </div>

    <template #footer>
      <div class="flex gap-4">
        <button
          type="button"
          class="h-[52px] flex-1 cursor-pointer rounded-full bg-tint text-[15px] font-semibold text-tint-text transition-all active:scale-95"
          @click="sheetOpen = false"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="!draft.length || chatsStore.addingMembers"
          class="h-[52px] flex-1 rounded-full bg-linear-to-b from-accent to-accent-dark text-[15px] font-semibold text-white shadow-md transition-all"
          :class="draft.length && !chatsStore.addingMembers ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-40'"
          @click="commit"
        >
          {{ chatsStore.addingMembers ? 'Adding...' : 'Add' }}
        </button>
      </div>
    </template>
  </BottomSheet>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { CheckIcon, PlusIcon } from '@heroicons/vue/24/outline'
import SubPageLayout from '../layout/SubPageLayout.vue'
import BottomSheet from '../../assets/components/BottomSheet.vue'
import PersonRow from '../../assets/components/PersonRow.vue'
import { useChatsStore } from '../../store/chats.ts'
import { FALLBACK_AVATAR, chatName } from '../../utils/chatDisplay.ts'

const props = defineProps<{ id: string }>()
const chatsStore = useChatsStore()

const conversationId = computed(() => Number(props.id))
const chat = computed(() => chatsStore.getChat(conversationId.value))
const members = computed(() => chatsStore.getMembers(conversationId.value))
const title = computed(() => (chat.value ? chatName(chat.value) : 'Members'))

onMounted(async () => {
  if (!chatsStore.fetchedOnce) await chatsStore.fetchChats()
  chatsStore.fetchMembers(conversationId.value)
})

// you first, then admins, then everyone else A to Z
const sortedMembers = computed(() =>
  [...members.value].sort((a, b) => {
    const rank = (m: (typeof members.value)[number]) =>
      chatsStore.isMine(m.id) ? 0 : m.role === 'admin' ? 1 : 2
    return rank(a) - rank(b) || a.name.localeCompare(b.name)
  }),
)

const isAdmin = computed(() =>
  members.value.some((m) => chatsStore.isMine(m.id) && m.role === 'admin'),
)

// friends = people you have a private chat with, minus anyone already in the group
const candidates = computed(() => {
  const inGroup = new Set(members.value.map((m) => m.id))
  return chatsStore.chats
    .filter((c) => c.type === 'private' && c.friend && !inGroup.has(c.friend.id))
    .map((c) => ({
      id: c.friend!.id,
      name: c.friend!.name,
      phone: c.friend!.phone,
      avatar: c.friend!.profile_picture || FALLBACK_AVATAR,
    }))
})

const sheetOpen = ref(false)
const draft = ref<number[]>([])

const openSheet = () => {
  draft.value = []
  sheetOpen.value = true
}
const toggle = (id: number) => {
  draft.value = draft.value.includes(id) ? draft.value.filter((x) => x !== id) : [...draft.value, id]
}
const commit = async () => {
  if (!draft.value.length) return
  const ok = await chatsStore.addMembers(conversationId.value, draft.value)
  if (ok) sheetOpen.value = false
}
</script>