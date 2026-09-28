<template>
  <SubPageLayout title="Create Group">
    <div class="px-4 pt-6">
      <label class="mb-2 block text-sm text-text-secondary">Name Group</label>
      <input
        v-model="name"
        type="text"
        maxlength="40"
        placeholder="Enter Name Group"
        class="h-12 w-full rounded-xl border border-border bg-transparent px-4 text-[15px] text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-accent"
      />

      <p class="mt-5 mb-2 text-sm text-text-secondary">Members</p>
      <button
        type="button"
        class="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-tint text-[15px] font-medium text-tint-text transition-all active:scale-[0.99]"
        @click="openSheet"
      >
        <PlusIcon class="h-5 w-5" />
        Add members to group
      </button>

      <ul class="mt-3">
        <li v-for="m in members" :key="m.id">
          <PersonRow :name="m.name" :subtitle="m.phone" :avatar="m.avatar">
            <template #action>
              <button
                type="button"
                :aria-label="`Remove ${m.name}`"
                class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-chip text-danger transition-all active:scale-95"
                @click="remove(m.id)"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </template>
          </PersonRow>
        </li>
      </ul>
    </div>

    <template #footer>
      <button
        type="button"
        :disabled="!canCreate"
        class="h-[52px] w-full rounded-full bg-linear-to-b from-accent to-accent-dark text-[15px] font-semibold text-white shadow-md transition-all"
        :class="canCreate ? 'cursor-pointer active:scale-[0.98]' : 'cursor-not-allowed opacity-40 shadow-none'"
        @click="create"
      >
        Create Group
      </button>
    </template>
  </SubPageLayout>

  <!-- pick members -->
  <BottomSheet v-model="sheetOpen" title="Add members to group">
    <div class="px-4 pt-4">
      <label
        class="flex h-12 items-center gap-3 rounded-xl border px-4 transition-colors"
        :class="searchFocused ? 'border-accent' : 'border-border'"
      >
        <MagnifyingGlassIcon class="h-5 w-5 shrink-0 text-text-secondary" />
        <input
          v-model="query"
          type="text"
          placeholder="Search"
          class="w-full min-w-0 bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
        />
      </label>

      <ul class="mt-3">
        <li v-for="c in filteredContacts" :key="c.id">
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
        <li v-if="filteredContacts.length === 0" class="pt-10 text-center text-sm text-text-secondary">No contacts found</li>
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
          class="h-[52px] flex-1 cursor-pointer rounded-full bg-linear-to-b from-accent to-accent-dark text-[15px] font-semibold text-white shadow-md transition-all active:scale-95"
          @click="commit"
        >
          Add
        </button>
      </div>
    </template>
  </BottomSheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckIcon, MagnifyingGlassIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import SubPageLayout from '../layout/SubPageLayout.vue'
import BottomSheet from '../../assets/components/BottomSheet.vue'
import PersonRow from '../../assets/components/PersonRow.vue'
import { useContacts, type Person } from '../../assets/composables/Usecontacts.ts'

const router = useRouter()
const { contacts } = useContacts()

const name = ref('')
const members = ref<Person[]>([])
const canCreate = computed(() => name.value.trim().length > 0 && members.value.length > 0)

/* bottom sheet: edit a draft, only apply it on "Add" */
const sheetOpen = ref(false)
const draft = ref<number[]>([])
const query = ref('')
const searchFocused = ref(false)

const filteredContacts = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return contacts.value
  return contacts.value.filter((c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '') || '§'))
})

const openSheet = () => {
  draft.value = members.value.map((m) => m.id)
  query.value = ''
  sheetOpen.value = true
}
const toggle = (id: number) => {
  draft.value = draft.value.includes(id) ? draft.value.filter((x) => x !== id) : [...draft.value, id]
}
const commit = () => {
  members.value = contacts.value.filter((c) => draft.value.includes(c.id))
  sheetOpen.value = false
}
const remove = (id: number) => {
  members.value = members.value.filter((m) => m.id !== id)
}

const create = () => {
  if (!canCreate.value) return
  // TODO: POST { name: name.value.trim(), memberIds: members.value.map(m => m.id) }
  router.push('/groups')
}
</script>