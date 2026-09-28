<template>
  <SubPageLayout title="Add Friend">
    <!-- segmented tabs -->
    <div class="px-4 pt-4">
      <div class="relative grid grid-cols-2 rounded-full bg-chip p-1" role="tablist">
        <!-- sliding highlight -->
        <span
          class="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-linear-to-b from-accent to-accent-dark shadow-md transition-transform duration-300 ease-out"
          :class="tab === 'requests' ? 'translate-x-full' : 'translate-x-0'"
        />
        <button
          v-for="t in tabs"
          :key="t.id"
          type="button"
          role="tab"
          :aria-selected="tab === t.id"
          class="relative z-10 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors duration-300"
          :class="tab === t.id ? 'text-white' : 'text-text-secondary'"
          @click="tab = t.id"
        >
          <component :is="t.icon" class="h-5 w-5" />
          {{ t.label }}
          <span
            v-if="t.id === 'requests' && pendingCount"
            class="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold transition-colors duration-300"
            :class="tab === 'requests' ? 'bg-white text-accent' : 'bg-accent text-white'"
          >
            {{ pendingCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- ── find by phone ─────────────────────────────── -->
    <section v-if="tab === 'find'" class="px-4 pt-5">
      <label
        class="flex h-14 items-center gap-3 rounded-2xl border-2 bg-field px-4 transition-colors"
        :class="focused ? 'border-accent' : 'border-transparent'"
      >
        <PhoneIcon class="h-5 w-5 shrink-0" :class="focused ? 'text-accent' : 'text-text-secondary'" />
        <span class="text-sm font-semibold text-text-secondary">(+44)</span>
        <input
          :value="formatted"
          type="tel"
          inputmode="numeric"
          placeholder="Enter phone number"
          class="w-full min-w-0 bg-transparent text-[15px] font-medium text-text-primary outline-none placeholder:text-text-secondary/60"
          @input="onInput"
          @focus="focused = true"
          @blur="focused = false"
        />
      </label>

      <!-- empty state -->
      <div v-if="results.length === 0" class="flex flex-col items-center pt-20 text-center">
        <div class="flex h-36 w-36 items-center justify-center rounded-full bg-accent/10 text-accent/40">
          <svg class="h-20 w-20" viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="8" y="14" width="80" height="56" rx="16" />
            <path d="M8 34h80" />
            <path d="M22 50h22" />
            <circle cx="66" cy="62" r="11" />
            <path d="M74 70l9 9" />
          </svg>
        </div>
        <p class="mt-5 text-base font-semibold text-text-primary">
          {{ digits ? 'No user found' : 'Find your friends' }}
        </p>
        <p class="mt-1 max-w-[16rem] text-sm text-text-secondary">
          {{ digits ? 'No user found with that number.' : 'Enter a phone number to search for people you know.' }}
        </p>
      </div>

      <!-- results -->
      <ul v-else class="mt-4 space-y-3">
        <li
          v-for="p in results"
          :key="p.id"
          class="flex items-center gap-3 rounded-2xl bg-chip/60 p-3"
        >
          <img :src="p.avatar" :alt="p.name" class="h-12 w-12 shrink-0 rounded-full object-cover" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-[15px] font-bold text-text-primary">{{ p.name }}</p>
            <p class="truncate text-xs font-medium text-text-secondary">{{ p.phone }}</p>
          </div>
          <button
            type="button"
            :aria-label="isRequested(p.id) ? 'Request sent' : 'Send friend request'"
            :disabled="isRequested(p.id)"
            class="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-all active:scale-95 disabled:cursor-default"
            :class="isRequested(p.id)
              ? 'bg-chip text-text-secondary'
              : 'bg-linear-to-b from-accent to-accent-dark text-white shadow-md'"
            @click="sendRequest(p.id)"
          >
            <CheckIcon v-if="isRequested(p.id)" class="h-4 w-4" />
            <UserPlusIcon v-else class="h-4 w-4" />
            {{ isRequested(p.id) ? 'Sent' : 'Add' }}
          </button>
        </li>
      </ul>
    </section>

    <!-- ── incoming requests ─────────────────────────── -->
    <section v-else class="px-4 pt-5">
      <!-- empty state -->
      <div v-if="requests.length === 0" class="flex flex-col items-center pt-20 text-center">
        <div class="flex h-36 w-36 items-center justify-center rounded-full bg-accent/10 text-accent/40">
          <InboxIcon class="h-16 w-16" />
        </div>
        <p class="mt-5 text-base font-semibold text-text-primary">No pending requests</p>
        <p class="mt-1 max-w-[16rem] text-sm text-text-secondary">
          When someone sends you a friend request, it will show up here.
        </p>
      </div>

      <TransitionGroup
        v-else
        tag="ul"
        class="space-y-3"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        leave-active-class="transition duration-200 ease-in"
        leave-to-class="-translate-x-4 opacity-0"
      >
        <li v-for="r in requests" :key="r.id" class="rounded-2xl bg-chip/60 p-4">
          <div class="flex items-center gap-3">
            <img :src="r.avatar" :alt="r.name" class="h-14 w-14 shrink-0 rounded-full object-cover" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-base font-bold text-text-primary">{{ r.name }}</p>
              <p class="truncate text-xs font-medium text-text-secondary">{{ r.phone }}</p>
              <p class="mt-0.5 text-xs text-text-secondary/80">Wants to be your friend</p>
            </div>
          </div>

          <!-- accept / reject, right under the request -->
          <div class="mt-4 flex gap-3">
            <button
              type="button"
              class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-b from-accent to-accent-dark text-sm font-semibold text-white shadow-md transition-all active:scale-95"
              @click="acceptRequest(r.id)"
            >
              <CheckIcon class="h-5 w-5" />
              Accept
            </button>
            <button
              type="button"
              class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-danger/40 text-sm font-semibold text-danger transition-all hover:bg-danger/10 active:scale-95"
              @click="rejectRequest(r.id)"
            >
              <XMarkIcon class="h-5 w-5" />
              Reject
            </button>
          </div>
        </li>
      </TransitionGroup>
    </section>
  </SubPageLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  CheckIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  UserPlusIcon,
  XMarkIcon,
  BellAlertIcon,
} from '@heroicons/vue/24/outline'
import SubPageLayout from '../layout/SubPageLayout.vue'
import { useContacts } from '../../assets/composables/Usecontacts.ts'

const route = useRoute()
const { requests, pendingCount, searchDirectory, isRequested, sendRequest, acceptRequest, rejectRequest } = useContacts()

const tabs = [
  { id: 'find', label: 'Find', icon: MagnifyingGlassIcon },
  { id: 'requests', label: 'Requests', icon: BellAlertIcon },
] as const
const tab = ref<'find' | 'requests'>(route.query.tab === 'requests' ? 'requests' : 'find')

const digits = ref('')
const focused = ref(false)
const formatted = computed(() =>
  [digits.value.slice(0, 2), digits.value.slice(2, 6), digits.value.slice(6, 10)].filter(Boolean).join(' '),
)
const results = computed(() => searchDirectory(digits.value))

const onInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  digits.value = el.value.replace(/\D/g, '').slice(0, 10)
  el.value = formatted.value
}
</script>