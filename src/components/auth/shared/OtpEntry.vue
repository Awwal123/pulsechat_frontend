<template>
  <div class="flex min-h-screen flex-col bg-page">
    <AuthHeader :mode="mode" heading="Enter OTP Code" :subheading="`Sent to : (+44) ${formatted}`" />

    <main class="flex-1 px-4 pt-10">
      <div class="mb-12 flex items-center justify-center gap-4 text-sm">
        <span class="flex items-center gap-2 font-bold text-ink">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
          </svg>
          {{ timeLabel }}
        </span>
        <button
          type="button"
          class="font-bold underline"
          :class="seconds === 0 ? 'cursor-pointer text-accent' : 'cursor-not-allowed text-link'"
          :disabled="seconds > 0"
          @click="resend"
        >
          Resend Code
        </button>
      </div>

      <div class="flex justify-between gap-5">
        <input
          v-for="(_, i) in LENGTH"
          :key="i"
          :ref="(el) => (inputs[i] = el as HTMLInputElement)"
          :value="code[i]"
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="1"
          class="w-full min-w-0 border-0 border-b-2 bg-transparent pb-1 text-center text-[32px] font-medium text-ink caret-transparent outline-none transition-colors"
          :class="activeIndex === i ? 'border-accent/70' : 'border-ink'"
          @input="onInput(i, $event)"
          @keydown="onKeydown(i, $event)"
          @focus="activeIndex = i"
          @paste.prevent="onPaste($event)"
        />
      </div>

      <div class="mt-6 flex justify-end">
        <ArrowButton :disabled="!isComplete" @click="verify" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import AuthHeader from './AuthHeader.vue'
import ArrowButton from './ArrowButton.vue'
import { usePhone } from '../../../assets/composables/Usephone.ts';


defineProps<{ mode: 'login' | 'register' }>()
const emit = defineEmits<{ verified: [code: string] }>()

const LENGTH = 4
const RESEND_AFTER = 45

const { formatted } = usePhone()
const code = reactive<string[]>(Array(LENGTH).fill(''))
const inputs = ref<HTMLInputElement[]>([])
const activeIndex = ref(0)
const isComplete = computed(() => code.every((c) => c !== ''))

const focusAt = (i: number) => inputs.value[Math.max(0, Math.min(LENGTH - 1, i))]?.focus()

const onInput = (i: number, e: Event) => {
  const el = e.target as HTMLInputElement
  const digit = el.value.replace(/\D/g, '').slice(-1)
  code[i] = digit
  el.value = digit
  if (digit && i < LENGTH - 1) focusAt(i + 1) // auto-advance
}

const onKeydown = (i: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !code[i] && i > 0) {
    code[i - 1] = ''
    focusAt(i - 1)
    e.preventDefault()
  } else if (e.key === 'ArrowLeft') focusAt(i - 1)
  else if (e.key === 'ArrowRight') focusAt(i + 1)
  else if (e.key === 'Enter') verify()
}

const onPaste = (e: ClipboardEvent) => {
  const digits = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, LENGTH)
  if (!digits) return
  digits.split('').forEach((d, idx) => (code[idx] = d))
  focusAt(Math.min(digits.length, LENGTH - 1))
}

const verify = () => {
  if (isComplete.value) emit('verified', code.join('')) // TODO: verify against your API first
}

/* countdown */
const seconds = ref(RESEND_AFTER)
let timer: ReturnType<typeof setInterval> | undefined
const timeLabel = computed(() => `00 : ${String(seconds.value).padStart(2, '0')}`)

const startTimer = () => {
  clearInterval(timer)
  seconds.value = RESEND_AFTER
  timer = setInterval(() => {
    if (seconds.value > 0) seconds.value--
    else clearInterval(timer)
  }, 1000)
}
const resend = () => {
  code.fill('')
  focusAt(0)
  startTimer() // TODO: call your resend endpoint
}

onMounted(() => {
  focusAt(0)
  startTimer()
})
onBeforeUnmount(() => clearInterval(timer))
</script>