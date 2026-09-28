<template>
  <MainLayout activeTab="more">
    <div class="px-5 py-4">
      <!-- preferences -->
      <ul>
        <li class="flex items-center gap-4 py-3.5">
          <MoonIcon class="h-6 w-6 shrink-0 text-text-primary" />
          <span class="flex-1 text-[15px] font-semibold text-text-primary">Dark Mode</span>
          <button
            type="button"
            role="switch"
            :aria-checked="isDark"
            aria-label="Dark mode"
            :class="switchTrack(isDark)"
            @click="toggleTheme"
          >
            <span :class="switchKnob(isDark)" />
          </button>
        </li>

        <li class="flex items-center gap-4 py-3.5">
          <SpeakerXMarkIcon class="h-6 w-6 shrink-0 text-text-primary" />
          <span class="flex-1 text-[15px] font-semibold text-text-primary">Mute Notification</span>
          <button
            type="button"
            role="switch"
            :aria-checked="muted"
            aria-label="Mute notifications"
            :class="switchTrack(muted)"
            @click="muted = !muted"
          >
            <span :class="switchKnob(muted)" />
          </button>
        </li>

        <li>
          <button type="button" class="flex w-full cursor-pointer items-center gap-4 py-3.5 text-left" @click="todo('notifications')">
            <BellIcon class="h-6 w-6 shrink-0 text-text-primary" />
            <span class="flex-1 text-[15px] font-semibold text-text-primary">Custom Notification</span>
            <ChevronRightIcon class="h-5 w-5 shrink-0 text-text-primary" />
          </button>
        </li>
      </ul>

      <div class="my-2 border-t border-text-secondary/30" />

      <!-- navigation rows -->
      <ul>
        <li>
          <RouterLink to="/friends/add" class="flex items-center gap-4 py-3.5">
            <UserPlusIcon class="h-6 w-6 shrink-0 text-text-primary" />
            <span class="flex-1 text-[15px] font-semibold text-text-primary">Invite Friends</span>
            <ChevronRightIcon class="h-5 w-5 shrink-0 text-text-primary" />
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/groups" class="flex items-center gap-4 py-3.5">
            <UserGroupIcon class="h-6 w-6 shrink-0 text-text-primary" />
            <span class="flex-1 text-[15px] font-semibold text-text-primary">Joined Groups</span>
            <ChevronRightIcon class="h-5 w-5 shrink-0 text-text-primary" />
          </RouterLink>
        </li>

        <!-- hide chat history: switch + chevron -->
        <li class="flex items-center gap-4 py-3.5">
          <EyeIcon class="h-6 w-6 shrink-0 text-text-primary" />
          <span class="flex-1 text-[15px] font-semibold text-text-primary">Hide Chat History</span>
          <button
            type="button"
            role="switch"
            :aria-checked="hideHistory"
            aria-label="Hide chat history"
            :class="switchTrack(hideHistory)"
            @click="hideHistory = !hideHistory"
          >
            <span :class="switchKnob(hideHistory)" />
          </button>
          <ChevronRightIcon class="h-5 w-5 shrink-0 text-text-primary" />
        </li>

        <!-- security: switch + chevron -->
        <li class="flex items-center gap-4 py-3.5">
          <ShieldCheckIcon class="h-6 w-6 shrink-0 text-text-primary" />
          <span class="flex-1 text-[15px] font-semibold text-text-primary">Security</span>
          <button
            type="button"
            role="switch"
            :aria-checked="security"
            aria-label="Security lock"
            :class="switchTrack(security)"
            @click="security = !security"
          >
            <span :class="switchKnob(security)" />
          </button>
          <ChevronRightIcon class="h-5 w-5 shrink-0 text-text-primary" />
        </li>

        <li v-for="item in links" :key="item.key">
          <button type="button" class="flex w-full cursor-pointer items-center gap-4 py-3.5 text-left" @click="todo(item.key)">
            <component :is="item.icon" class="h-6 w-6 shrink-0 text-text-primary" />
            <span class="flex-1 text-[15px] font-semibold text-text-primary">{{ item.label }}</span>
            <ChevronRightIcon class="h-5 w-5 shrink-0 text-text-primary" />
          </button>
        </li>

        <li>
          <button type="button" class="flex w-full cursor-pointer items-center gap-4 py-3.5 text-left" @click="logout">
            <ArrowRightOnRectangleIcon class="h-6 w-6 shrink-0 text-danger" />
            <span class="flex-1 text-[15px] font-semibold text-danger">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  EyeIcon,
  InformationCircleIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  SpeakerXMarkIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'
import MainLayout from '../layout/MainLayout.vue'

/* ── theme (your toggle logic) ────────────────────── */
// App already applies the saved theme on startup, so just read the current state
const isDark = ref(document.documentElement.classList.contains('dark'))

const toggleTheme = () => {
  const isDarkNow = document.documentElement.classList.toggle('dark')
  isDark.value = isDarkNow
  localStorage.setItem('theme', isDarkNow ? 'dark' : 'light')
}

/* ── other switches (local only for now) ──────────── */
const muted = ref(false)
const hideHistory = ref(false)
const security = ref(false)

const switchTrack = (on: boolean) => [
  'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
  on ? 'bg-accent' : 'bg-text-secondary/40',
]
const switchKnob = (on: boolean) => [
  'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
  on ? 'translate-x-5' : 'translate-x-0',
]

/* ── rows without a page yet ──────────────────────── */
const links = [
  { key: 'terms', label: 'Term of Service', icon: DocumentTextIcon },
  { key: 'about', label: 'About App', icon: InformationCircleIcon },
  { key: 'help', label: 'Help Center', icon: QuestionMarkCircleIcon },
]

const todo = (key: string) => {
  // TODO: router.push to the matching page once it exists
  console.log('open', key)
}

const logout = () => {
  // TODO: clear auth state / token, then router.push('/login')
}
</script>