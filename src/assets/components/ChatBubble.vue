<template>
  <div class="flex" :class="mine ? 'justify-end' : 'justify-start'">
    <div
      ref="el"
      class="max-w-[80%] select-none rounded-2xl px-3.5 py-2 [-webkit-touch-callout:none]"
      :class="mine ? 'rounded-br-md bg-accent text-white' : 'rounded-bl-md bg-chip text-text-primary'"
      @pointerdown="start"
      @pointerup="cancel"
      @pointerleave="cancel"
      @pointercancel="cancel"
      @contextmenu.prevent="open"
    >
      <!-- reply quote -->
      <div
        v-if="message.reply_to"
        class="mb-1.5 rounded-lg border-l-4 px-2.5 py-1.5 text-xs"
        :class="mine ? 'border-white/70 bg-white/15' : 'border-accent bg-black/5'"
      >
        <p class="truncate font-bold">{{ replyAuthor }}</p>
        <p class="truncate opacity-80" :class="message.reply_to.is_deleted && 'italic'">
          {{ message.reply_to.is_deleted ? 'This message was deleted' : message.reply_to.message }}
        </p>
      </div>

      <p
        class="whitespace-pre-wrap break-words text-[15px]"
        :class="message.is_deleted && 'italic opacity-70'"
      >
        {{ message.is_deleted ? 'This message was deleted' : message.message }}
      </p>

      <div
        class="mt-0.5 flex items-center justify-end gap-1 text-[11px]"
        :class="mine ? 'text-white/70' : 'text-text-secondary'"
      >
        <span v-if="message.edited_at && !message.is_deleted">edited</span>
        <span>{{ formatChatTime(message.created_at) }}</span>

        <!-- ticks: 1 = sent, 2 = read -->
        <svg
          v-if="mine && !message.is_deleted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
          :class="read ? 'text-white' : 'text-white/60'"
          :aria-label="read ? 'Read' : 'Sent'"
        >
          <path d="M3 12.5l5 5L18 7" />
          <path v-if="read" d="M12 15.5l1.5 2L22 7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChatMessage } from '../../types/api.ts'
import { formatChatTime } from '../../utils/formatTime.ts'

const props = defineProps<{
  message: ChatMessage
  mine: boolean
  read: boolean
  friendId: number
}>()

const emit = defineEmits<{ (e: 'menu', message: ChatMessage, rect: DOMRect): void }>()

const el = ref<HTMLElement | null>(null)
let timer: number | undefined

const canAct = computed(() => props.mine && !props.message.is_deleted)

const replyAuthor = computed(() => {
  const r = props.message.reply_to
  if (!r) return ''
  return r.sender_id === props.friendId ? r.sender.name : 'You'
})

const open = () => {
  if (!canAct.value || !el.value) return
  emit('menu', props.message, el.value.getBoundingClientRect())
}
const start = () => {
  if (!canAct.value) return
  clearTimeout(timer)
  timer = window.setTimeout(open, 400) // long-press
}
const cancel = () => clearTimeout(timer)
</script>