<template>
  <MainLayout activeTab="more">
    <div class="px-5 py-4">
      <!-- preferences -->
      <ul>
        <li class="flex items-center gap-4 py-3.5">
          <MoonIcon class="h-6 w-6 shrink-0 text-text-primary" />
          <span class="flex-1 text-[15px] font-semibold text-text-primary"
            >Dark Mode</span
          >
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
      </ul>

      <div class="my-2 border-t border-text-secondary/30" />
      <!-- navigation rows -->
      <ul>
        <li>
          <RouterLink to="/friends/add" class="flex items-center gap-4 py-3.5">
            <UserPlusIcon class="h-6 w-6 shrink-0 text-text-primary" />
            <span class="flex-1 text-[15px] font-semibold text-text-primary"
              >Invite Friends</span
            >
            <ChevronRightIcon class="h-5 w-5 shrink-0 text-text-primary" />
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/groups" class="flex items-center gap-4 py-3.5">
            <UserGroupIcon class="h-6 w-6 shrink-0 text-text-primary" />
            <span class="flex-1 text-[15px] font-semibold text-text-primary"
              >Joined Groups</span
            >
            <ChevronRightIcon class="h-5 w-5 shrink-0 text-text-primary" />
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/about" class="flex items-center gap-4 py-3.5">
            <InformationCircleIcon class="h-6 w-6 shrink-0 text-text-primary" />
            <span class="flex-1 text-[15px] font-semibold text-text-primary"
              >About App</span
            >
            <ChevronRightIcon class="h-5 w-5 shrink-0 text-text-primary" />
          </RouterLink>
        </li>

        <li>
          <button
            type="button"
            class="flex w-full cursor-pointer items-center gap-4 py-3.5 text-left"
            @click="restartTour"
          >
            <SparklesIcon class="h-6 w-6 shrink-0 text-text-primary" />
            <span class="flex-1 text-[15px] font-semibold text-text-primary"
              >Take the Tour</span
            >
            <ChevronRightIcon class="h-5 w-5 shrink-0 text-text-primary" />
          </button>
        </li>
      </ul>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ChevronRightIcon,
  InformationCircleIcon,
  MoonIcon,
  SparklesIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'
import MainLayout from '../layout/MainLayout.vue'
import router from '../../router/index.ts'
import { useTourStore } from '../../store/tour.ts'

const tour = useTourStore()
const restartTour = async () => {
  await router.push('/chats')
  tour.restart()
}

const isDark = ref(document.documentElement.classList.contains('dark'))

const toggleTheme = () => {
  const isDarkNow = document.documentElement.classList.toggle('dark')
  isDark.value = isDarkNow
  localStorage.setItem('theme', isDarkNow ? 'dark' : 'light')
}

const switchTrack = (on: boolean) => [
  'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
  on ? 'bg-accent' : 'bg-text-secondary/40',
]
const switchKnob = (on: boolean) => [
  'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
  on ? 'translate-x-5' : 'translate-x-0',
]
</script>