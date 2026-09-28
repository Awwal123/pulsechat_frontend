<template>
  <div class="flex min-h-screen flex-col bg-page">
    <!-- top bar -->
    <header class="relative flex items-center justify-center px-4 pt-6">
      <button
        type="button"
        aria-label="Go back"
        class="absolute left-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-ink shadow-md transition-transform active:scale-95"
        @click="router.back()"
      >
        <ArrowLeftIcon class="h-5 w-5" />
      </button>
      <h1 class="text-lg font-bold text-ink">PIN Security</h1>
    </header>

    <p class="mt-8 text-center text-sm text-ink">Protect your account with a secure PIN</p>

    <!-- pin boxes -->
    <main class="flex-1 px-4 pt-8">
      <div class="flex justify-between gap-5">
        <input
          v-for="(_, i) in LENGTH"
          :key="i"
          :ref="(el) => (inputs[i] = el as HTMLInputElement)"
          :value="pin[i]"
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
    </main>

    <!-- actions -->
    <footer class="flex gap-4 px-4 pb-8">
      <button
        type="button"
        class="h-[52px] flex-1 cursor-pointer rounded-full bg-pill-soft text-[15px] font-semibold text-accent transition-all active:scale-95"
        @click="showCongratulations"
      >
        Skip
      </button>
      <button
        type="button"
        :disabled="!isComplete"
        class="h-[52px] flex-1 rounded-full bg-linear-to-b from-accent to-accent-dark text-[15px] font-semibold text-white shadow-md transition-all"
        :class="isComplete ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-40 shadow-none'"
        @click="onContinue"
      >
        Continue
      </button>
    </footer>

    <CongratulationsModal ref="modalRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import CongratulationsModal from '../../../assets/components/CongratulationsModal.vue'

const LENGTH = 4
const router = useRouter()

const pin = reactive<string[]>(Array(LENGTH).fill(''))
const inputs = ref<HTMLInputElement[]>([])
const activeIndex = ref(0)
const modalRef = ref<any>(null)

const isComplete = computed(() => pin.every((d) => d !== ''))

const focusAt = (i: number) => inputs.value[Math.max(0, Math.min(LENGTH - 1, i))]?.focus()

const onInput = (i: number, e: Event) => {
  const el = e.target as HTMLInputElement
  const digit = el.value.replace(/\D/g, '').slice(-1)
  pin[i] = digit
  el.value = digit
  if (digit && i < LENGTH - 1) focusAt(i + 1) // auto-advance
}

const onKeydown = (i: number, e: KeyboardEvent) => {
  if (e.key === 'Backspace' && !pin[i] && i > 0) {
    pin[i - 1] = ''
    focusAt(i - 1)
    e.preventDefault()
  } else if (e.key === 'ArrowLeft') focusAt(i - 1)
  else if (e.key === 'ArrowRight') focusAt(i + 1)
  else if (e.key === 'Enter') onContinue()
}

const onPaste = (e: ClipboardEvent) => {
  const digits = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, LENGTH)
  if (!digits) return
  digits.split('').forEach((d, idx) => (pin[idx] = d))
  focusAt(Math.min(digits.length, LENGTH - 1))
}

const showCongratulations = () => modalRef.value?.openModal()

const onContinue = () => {
  if (!isComplete.value) return
  // TODO: save pin.join('') securely (hash it, don't store it in plain text)
  showCongratulations()
}

onMounted(() => focusAt(0))
</script>