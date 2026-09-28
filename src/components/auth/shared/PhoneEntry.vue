<template>
  <div class="flex min-h-screen flex-col bg-page">
    <AuthHeader :mode="mode" heading="Enter your mobile phone" :curved="!focused && !digits" />

    <main class="flex-1 px-4 pt-10">
      <p class="mb-8 text-center text-[17px] text-form">You will get a code via sms.</p>

      <label
        class="flex items-center gap-3 border-b-2 pb-2 transition-colors"
        :class="focused || digits ? 'border-accent/70' : 'border-ink'"
      >
        <svg class="h-6 w-6 shrink-0 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
        <span class="text-[19px] text-muted">(+234)</span>
        <input
          :value="formatted"
          type="tel"
          inputmode="numeric"
          autocomplete="tel-national"
          placeholder="00 0000 0000"
          class="w-full min-w-0 bg-transparent text-[19px] text-ink outline-none placeholder:text-muted/70"
          @input="onInput"
          @focus="focused = true"
          @blur="focused = false"
          @keyup.enter="next"
        />
      </label>

      <div class="mt-6 flex items-center justify-between">
        <label class="flex cursor-pointer items-center gap-3">
          <input v-model="remember" type="checkbox" class="h-[18px] w-[18px] cursor-pointer rounded-[4px] accent-accent" />
          <span class="text-[15px] font-bold text-ink">Remember me</span>
        </label>
        <ArrowButton :disabled="!isValid" @click="next" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthHeader from './AuthHeader.vue'
import ArrowButton from './ArrowButton.vue'
import { usePhone } from '../../../assets/composables/Usephone.ts';


defineProps<{ mode: 'login' | 'register' }>()
const emit = defineEmits<{ next: [] }>()

const { digits, formatted, isValid, PHONE_LENGTH } = usePhone()
const remember = ref(false)
const focused = ref(false)

const onInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  digits.value = el.value.replace(/\D/g, '').slice(0, PHONE_LENGTH)
  el.value = formatted.value
}

const next = () => {
  if (isValid.value) emit('next')
}
</script>