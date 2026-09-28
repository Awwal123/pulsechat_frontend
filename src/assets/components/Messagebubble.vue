<template>
  <!-- outgoing -->
  <div v-if="mine" class="flex justify-end">
    <div class="max-w-[80%] rounded-[20px] bg-bubble-out px-4 py-3 text-white">
      <p class="text-[17px] leading-snug whitespace-pre-line">{{ text }}</p>
      <div class="mt-2 flex items-center justify-end gap-1.5 text-xs font-medium text-white/90">
        {{ time }}
        <svg class="h-3.5 w-3.5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 13l4 4L14 8M10 15l2 2 8-9" />
        </svg>
      </div>
    </div>
  </div>

  <!-- incoming (with avatar + name in group chats) -->
  <div v-else class="flex items-start gap-2">
    <img v-if="sender" :src="sender.avatar" :alt="sender.name" class="mt-0.5 h-6 w-6 shrink-0 rounded-full object-cover" />
    <div class="min-w-0 max-w-[80%]">
      <p v-if="sender" class="mb-1.5 text-xs text-text-secondary">{{ sender.name }}</p>
      <div class="rounded-[20px] bg-white px-4 py-3 text-[#23233a]">
        <p class="text-[17px] leading-snug whitespace-pre-line">{{ text }}</p>
        <p class="mt-2 text-xs font-medium text-slate-300">{{ time }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Person } from '../composables/Usecontacts';



defineProps<{
  text: string
  time: string
  mine: boolean
  sender?: Person | null // only passed in group chats
}>()
</script>