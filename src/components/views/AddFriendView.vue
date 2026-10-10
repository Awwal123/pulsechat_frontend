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
        <span class="text-sm font-semibold text-text-secondary">(+234)</span>
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

      <!-- searching -->
      <div v-if="searching" class="flex flex-col items-center pt-20 text-center">
        <p class="animate-pulse text-sm font-semibold text-text-secondary">Searching…</p>
      </div>

      <!-- result -->
      <ul v-else-if="searchResult" class="mt-4 space-y-3">
        <li class="flex items-center gap-3 rounded-2xl bg-chip/60 p-3">
          <img
            v-if="searchResult.profile_picture"
            :src="searchResult.profile_picture"
            :alt="searchResult.name"
            class="h-12 w-12 shrink-0 rounded-full object-cover"
          />
          <div
            v-else
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-base font-bold text-accent"
          >
            {{ initial(searchResult.name) }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-[15px] font-bold text-text-primary">{{ searchResult.name }}</p>
            <p class="truncate text-xs font-medium text-text-secondary">{{ displayPhone(searchResult.phone) }}</p>
          </div>
          <button
            type="button"
            :aria-label="isRequested(searchResult.id) ? 'Request sent' : 'Send friend request'"
            :disabled="isRequested(searchResult.id) || sendingTo !== null"
            class="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-all active:scale-95 disabled:cursor-default"
            :class="isRequested(searchResult.id)
              ? 'bg-chip text-text-secondary'
              : 'bg-linear-to-b from-accent to-accent-dark text-white shadow-md disabled:opacity-60'"
            @click="friends.sendRequest(searchResult.id)"
          >
            <CheckIcon v-if="isRequested(searchResult.id)" class="h-4 w-4" />
            <UserPlusIcon v-else class="h-4 w-4" />
            {{ isRequested(searchResult.id) ? 'Sent' : sendingTo === searchResult.id ? 'Sending…' : 'Add' }}
          </button>
        </li>
      </ul>

      <!-- empty state: searched with no match, or there is nobody to suggest -->
      <div
        v-else-if="hasSearched || (!loadingSuggestions && suggestions.length === 0)"
        class="flex flex-col items-center pt-20 text-center"
      >
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
          {{ hasSearched ? 'No user found' : 'Find your friends' }}
        </p>
        <p class="mt-1 max-w-[16rem] text-sm text-text-secondary">
          {{ hasSearched ? 'No user found with that number.' : 'Enter a phone number to search for people you know.' }}
        </p>
      </div>

      <!-- suggestions (shown while the search box is idle) -->
      <div v-else class="mt-5">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-sm font-bold text-text-primary">People you may know</h2>
          <button
            type="button"
            class="cursor-pointer text-sm font-semibold text-accent"
            @click="toggleAll"
          >
            {{ showAll ? 'Show less' : 'See all' }}
          </button>
        </div>

        <p
          v-if="loadingList && visibleSuggestions.length === 0"
          class="animate-pulse pt-10 text-center text-sm font-semibold text-text-secondary"
        >
          Loading suggestions…
        </p>

        <ul v-else class="space-y-3">
          <li
            v-for="s in visibleSuggestions"
            :key="s.id"
            class="flex items-center gap-3 rounded-2xl bg-chip/60 p-3"
          >
            <img
              v-if="s.profile_picture"
              :src="s.profile_picture"
              :alt="s.name"
              class="h-12 w-12 shrink-0 rounded-full object-cover"
            />
            <div
              v-else
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-base font-bold text-accent"
            >
              {{ initial(s.name) }}
            </div>

            <div class="min-w-0 flex-1">
              <p class="flex items-center gap-2">
                <span class="truncate text-[15px] font-bold text-text-primary">{{ s.name }}</span>
                <span
                  v-if="s.is_featured"
                  class="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent"
                >
                  Featured
                </span>
              </p>
            </div>

            <button
              type="button"
              :aria-label="isRequested(s.id) ? 'Request sent' : 'Send friend request'"
              :disabled="isRequested(s.id) || sendingTo !== null"
              class="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-all active:scale-95 disabled:cursor-default"
              :class="isRequested(s.id)
                ? 'bg-chip text-text-secondary'
                : 'bg-linear-to-b from-accent to-accent-dark text-white shadow-md disabled:opacity-60'"
              @click="friends.sendRequest(s.id)"
            >
              <CheckIcon v-if="isRequested(s.id)" class="h-4 w-4" />
              <UserPlusIcon v-else class="h-4 w-4" />
              {{ isRequested(s.id) ? 'Sent' : sendingTo === s.id ? 'Sending…' : 'Add' }}
            </button>
          </li>
        </ul>

        <!-- paging for the full list -->
        <button
          v-if="showAll && hasMoreAll"
          type="button"
          :disabled="loadingAll"
          class="mt-4 flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-chip text-sm font-semibold text-text-primary transition-all active:scale-95 disabled:cursor-default disabled:opacity-60"
          @click="friends.loadMoreSuggestions()"
        >
          {{ loadingAll ? 'Loading…' : 'Load more' }}
        </button>
      </div>
    </section>

    <!-- ── incoming requests ─────────────────────────── -->
    <section v-else class="px-4 pt-5">
      <!-- loading -->
      <div v-if="loadingRequests && requests.length === 0" class="flex flex-col items-center pt-20 text-center">
        <p class="animate-pulse text-sm font-semibold text-text-secondary">Loading requests…</p>
      </div>

      <!-- empty state -->
      <div v-else-if="requests.length === 0" class="flex flex-col items-center pt-20 text-center">
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
        <li v-for="r in requests" :key="r.friend_request_id" class="rounded-2xl bg-chip/60 p-4">
          <div class="flex items-center gap-3">
            <img
              :src="r.sender.profile_picture"
              :alt="r.sender.name"
              class="h-14 w-14 shrink-0 rounded-full object-cover"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-base font-bold text-text-primary">{{ r.sender.name }}</p>
              <p class="truncate text-xs font-medium text-text-secondary">{{ displayPhone(r.sender.phone) }}</p>
              <p class="mt-0.5 text-xs text-text-secondary/80">Wants to be your friend</p>
            </div>
          </div>

          <!-- accept / reject, right under the request -->
          <div class="mt-4 flex gap-3">
            <button
              type="button"
              :disabled="!!responding"
              class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-b from-accent to-accent-dark text-sm font-semibold text-white shadow-md transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              @click="friends.respond(r.friend_request_id, 'accept')"
            >
              <CheckIcon class="h-5 w-5" />
              {{ isBusy(r.friend_request_id, 'accept') ? 'Accepting…' : 'Accept' }}
            </button>
            <button
              type="button"
              :disabled="!!responding"
              class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-danger/40 text-sm font-semibold text-danger transition-all hover:bg-danger/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              @click="friends.respond(r.friend_request_id, 'reject')"
            >
              <XMarkIcon class="h-5 w-5" />
              {{ isBusy(r.friend_request_id, 'reject') ? 'Rejecting…' : 'Reject' }}
            </button>
          </div>
        </li>
      </TransitionGroup>
    </section>
  </SubPageLayout>
</template>


<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
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
import { toApiPhone } from '../../services/api.ts'
import { useFriendsStore } from '../../store/friends.ts'
import type { RespondAction } from '../../types/api.ts'


const route = useRoute()
const friends = useFriendsStore()
const {
  searchResult, searching, hasSearched,
  requests, loadingRequests, sentIds, sendingTo, responding, pendingCount,
  suggestions, loadingSuggestions, allSuggestions, loadingAll, hasMoreAll,
} = storeToRefs(friends)

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

const onInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  // drop a leading 0 so 0801... and 801... both work
  digits.value = el.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 10)
  el.value = formatted.value
}

// search once the full number is typed
watch(digits, (val) => {
  if (val.length === 10) friends.search(toApiPhone(val))
  else friends.clearSearch()
})

// ── suggestions: short preview by default, "See all" switches to the full paged list
const showAll = ref(false)
const visibleSuggestions = computed(() => (showAll.value ? allSuggestions.value : suggestions.value))
const loadingList = computed(() => (showAll.value ? loadingAll.value : loadingSuggestions.value))

const toggleAll = () => {
  showAll.value = !showAll.value
  if (showAll.value && allSuggestions.value.length === 0) friends.fetchAllSuggestions()
}

const initial = (name: string) => name.trim().charAt(0).toUpperCase() || '?'
const displayPhone = (phone: string) => `(+234) ${phone.replace(/^0/, '')}`
const isRequested = (id: number) => sentIds.value.includes(id)
const isBusy = (id: number, action: RespondAction) =>
  responding.value?.id === id && responding.value.action === action

onMounted(() => {
  friends.fetchRequests()
  friends.fetchSuggestions()
})
</script>