<template>
  <SubPageLayout title="About Pulse Chat">
    <div class="px-4 pb-10 pt-6">
      <section class="rise flex flex-col items-center text-center" style="--d: 0ms">
        <div class="flex h-32 w-32 items-center justify-center rounded-full bg-accent/10">
          <div class="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-b from-accent to-accent-dark shadow-lg">
            <ChatBubbleLeftRightIcon class="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 class="mt-5 text-2xl font-extrabold text-text-primary">
          Pulse <span class="text-accent">Chat</span>
        </h2>
        <p class="mt-1 text-sm font-semibold text-accent">Stay Connected. Stay Chatting.</p>
        <span class="mt-3 rounded-full bg-chip px-3 py-1 text-xs font-semibold text-text-secondary">
          Version {{ VERSION }}
        </span>
      </section>
      <section class="rise mt-8 rounded-2xl bg-chip/60 p-5" style="--d: 120ms">
        <h3 class="text-base font-bold text-text-primary">About Pulse Chat</h3>
        <p class="mt-2 text-[15px] leading-relaxed text-text-secondary">
          Pulse Chat is a simple, modern messaging platform built to make staying connected easier.
          From real-time conversations and friend requests to instant notifications, it brings the
          essentials of everyday communication into one place.
        </p>
      </section>
      <section class="mt-6">
        <h3 class="rise px-1 text-sm font-bold uppercase tracking-wide text-text-secondary" style="--d: 220ms">
          What you can do
        </h3>
        <ul class="mt-3 grid grid-cols-2 gap-3">
          <li
            v-for="(f, i) in features"
            :key="f.title"
            class="rise rounded-2xl bg-chip/60 p-4"
            :style="{ '--d': 280 + i * 90 + 'ms' }"
          >
            <div class="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
              <component :is="f.icon" class="h-6 w-6" />
            </div>
            <p class="mt-3 text-[15px] font-bold text-text-primary">{{ f.title }}</p>
            <p class="mt-1 text-xs leading-relaxed text-text-secondary">{{ f.text }}</p>
          </li>
        </ul>
      </section>
      <section class="rise mt-6 rounded-2xl bg-chip/60 p-5" style="--d: 700ms">
        <div class="flex items-center gap-3">
       <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-b from-accent to-accent-dark shadow-md">
  <img
    :src="Ameer"
    alt="Ameer"
    class="h-full w-full object-cover"
  />
</div>
          <div class="min-w-0">
            <p class="truncate text-base font-bold text-text-primary">Ameer</p>
            <p class="flex items-center gap-1.5 text-xs font-semibold text-accent">
              <CodeBracketIcon class="h-4 w-4" /> Developer of Pulse Chat
            </p>
          </div>
        </div>
        <p class="mt-4 text-[15px] leading-relaxed text-text-secondary">
          Developed by Ameer, Pulse Chat is a project built with a passion for software development
          and the idea of making communication feel seamless, simple, and personal.
        </p>
      </section>

      <p class="rise mt-8 text-center text-xs text-text-secondary/80" style="--d: 800ms">
        © {{ year }} Pulse Chat. All rights reserved.
      </p>
    </div>
  </SubPageLayout>
</template>

<script setup lang="ts">
import {
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'
import SubPageLayout from '../../components/layout/SubPageLayout.vue'
import Ameer from "../images/ameer.jpg"
const VERSION = '2.1.0' 
const year = new Date().getFullYear()

const features = [
  {
    title: 'Real-time chat',
    text: 'Messages arrive instantly, with typing indicators and read receipts.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: 'Friend requests',
    text: 'Find people by phone number and send a request in one tap.',
    icon: UserPlusIcon,
  },
  {
    title: 'Instant notifications',
    text: 'Never miss a message, even when the app is closed.',
    icon: BellAlertIcon,
  },
  {
    title: 'Group chats',
    text: 'Bring your friends together in one conversation.',
    icon: UserGroupIcon,
  },
]
</script>

<style scoped>
.rise {
  animation: rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rise {
    animation: none;
  }
}
</style>