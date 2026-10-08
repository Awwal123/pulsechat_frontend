<template>
  <div class="flex min-h-screen flex-col bg-page">
    <AuthHeader
      :mode="mode"
      :heading="mode === 'register' ? 'Create your account' : 'Enter your mobile phone'"
      :curved="!focused && !digits && !email"
    />

    <main class="flex-1 px-4 pt-10">
      <p class="mb-8 text-center text-[17px] text-form">
        {{
          mode === 'register'
            ? 'Enter your phone number and email. We will send a code to your email.'
            : 'We will send a code to the email on your account.'
        }}
      </p>

      <!-- phone -->
      <label
        class="flex items-center gap-3 border-b-2 pb-2 transition-colors"
        :class="focused || digits ? 'border-accent/70' : 'border-ink'"
      >
        <svg
          class="h-6 w-6 shrink-0 text-ink"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
          />
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

      <!-- email (signup only) -->
      <div v-if="mode === 'register'" class="mt-8">
        <label
          class="flex items-center gap-3 border-b-2 pb-2 transition-colors"
          :class="emailFocused || email ? 'border-accent/70' : 'border-ink'"
        >
          <svg
            class="h-6 w-6 shrink-0 text-ink"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          <input
            v-model="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            autocapitalize="none"
            spellcheck="false"
            placeholder="you@example.com"
            class="w-full min-w-0 bg-transparent text-[19px] text-ink outline-none placeholder:text-muted/70"
            @focus="emailFocused = true"
            @blur="emailFocused = false"
            @keyup.enter="next"
          />
        </label>
        <p v-if="email && !emailValid && !emailFocused" class="mt-2 text-sm text-red-500">
          Enter a valid email address.
        </p>
      </div>

      <div class="mt-6 flex items-center justify-between">
        <label class="flex cursor-pointer items-center gap-3">
          <input
            v-model="remember"
            type="checkbox"
            class="h-[18px] w-[18px] cursor-pointer rounded-[4px] accent-accent"
          />
          <span class="text-[15px] font-bold text-ink">Remember me</span>
        </label>
        <div class="flex items-center gap-3">
          <span v-if="sendingOtp" class="animate-pulse text-sm text-muted">Sending code…</span>
          <ArrowButton :disabled="!canSubmit || sendingOtp" @click="next" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AuthHeader from './AuthHeader.vue'
import ArrowButton from './ArrowButton.vue'
import { usePhone } from '../../../assets/composables/Usephone.ts'
import { useAuthStore } from '../../../store/auth.ts'
import { toApiPhone } from '../../../services/api.ts'

const props = defineProps<{ mode: 'login' | 'register' }>()
const emit = defineEmits<{ next: [] }>()

const auth = useAuthStore()
const { sendingOtp, pendingEmail } = storeToRefs(auth)

const { digits, formatted, isValid, PHONE_LENGTH } = usePhone()
const remember = ref(false)
const focused = ref(false)
const emailFocused = ref(false)

// prefill if the user comes back from the OTP screen
const email = ref(pendingEmail.value ?? '')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const emailValid = computed(() => EMAIL_RE.test(email.value.trim()))

const canSubmit = computed(
  () => isValid.value && (props.mode === 'login' || emailValid.value),
)

const onInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  digits.value = el.value.replace(/\D/g, '').slice(0, PHONE_LENGTH)
  el.value = formatted.value
}

const next = async () => {
  if (!canSubmit.value || sendingOtp.value) return
  const ok = await auth.sendOtp(
    toApiPhone(digits.value),
    props.mode,
    props.mode === 'register' ? email.value.trim().toLowerCase() : undefined,
  )
  if (ok) emit('next') // only move on if the OTP was actually sent
}
</script>