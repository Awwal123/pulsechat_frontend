<template>
  <div class="min-h-screen bg-page flex flex-col">
    <!-- Blue Header -->
    <div
      class="bg-linear-to-b from-header-from to-header-to text-white pt-6 pb-20"
    >
      <div class="flex items-center justify-between px-6 mb-8">
             <button
          class="bg-page hover:bg-white/30 text-primary px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer transition-colors"
        >
          ← Login
        </button>
        <h1 class="text-3xl text-(--color-text-auth) font-bold">Register</h1>
      </div>


     <div class="px-6 flex flex-col items-end">
  <h2 class="text-3xl text-right  text-(--color-text-auth) font-semibold mb-2">
    Enter OTP Code
  </h2>

  <p class="text-xl text-right  text-(--color-text-auth) opacity-90">
    Sent to : (+44) 20 1234 5629
  </p>
</div>
    </div>

   <div class=" bg-wave  py-8"></div>

    <!-- Content -->
    <div class="flex-1 px-6 py-8 flex flex-col items-center justify-center">
      <!-- Timer & Resend -->
      <div class="flex items-center justify-center gap-4 mb-12">
        <div
          class="flex items-center gap-1 text-primary"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" stroke-width="2" />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6l4 2"
            />
          </svg>
          <span class="font-semibold">{{ formatTime(timer) }}</span>
        </div>
        <button
          @click="resendCode"
          :disabled="timer > 0"
          :class="[
            'font-medium transition-colors',
            timer > 0 
              ? 'text-text-secondary cursor-not-allowed opacity-50' 
              : 'text-[#0891B2] hover:text-[#0369A1] cursor-pointer'
          ]"
        >
          Resend Code
        </button>
      </div>

      <!-- OTP Input Boxes -->
      <div class="flex gap-4 mb-8">
        <input
          v-for="(_, index) in otp"
          :key="index"
          v-model="otp[index]"
          type="text"
          inputmode="numeric"
          maxlength="1"
          placeholder="—"
          :ref="(el) => otpInputs[index] = el"
          @input="handleOtpInput(index)"
          @keydown.backspace="handleBackspace(index)"
          @focus="(e) => (e.target as HTMLInputElement).select()"
          :class="[
            'w-12 h-12 text-center text-xl font-bold border-b-2 bg-transparent text-primary focus:outline-none placeholder-text-secondary transition-colors',
            otp[index] ? 'border-[#0891B2]' : 'border-border'
          ]"
        />
      </div>



      <!-- Action Button -->
      <div class="flex justify-end mb-8 w-full">
        <button
          class="bg-[#0891B2] hover:bg-[#0369A1] text-white rounded-full p-4 shadow-lg transition-all active:scale-95"
          @click="next"
          >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const next = () => {
  router.push("/signup/name")
}
const timer = ref(45)
const otp = ref(['', '', '', ''])
const otpInputs = ref<any[]>([])
let timerInterval: ReturnType<typeof setInterval> | null = null

// Format timer as MM:SS
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`
}

// Start countdown timer
const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, 1000)
}

// Handle OTP input with auto-advance
const handleOtpInput = (index: number) => {
  const value = otp.value[index]

  // Only allow digits
  otp.value[index] = value.replace(/[^0-9]/g, '').slice(0, 1)

  // Auto-advance to next input
  if (otp.value[index] && index < 3) {
    otpInputs.value[index + 1]?.focus()
  }
}

// Handle backspace to go to previous input
const handleBackspace = (index: number) => {
  if (!otp.value[index] && index > 0) {
    otp.value[index - 1] = ''
    otpInputs.value[index - 1]?.focus()
  }
}

// Resend code - reset timer
const resendCode = () => {
  if (timer.value === 0) {
    timer.value = 45
    otp.value = ['', '', '', '']
    otpInputs.value[0]?.focus()
    startTimer()
  }
}

onMounted(() => {
  startTimer()
  // Auto-focus first input
  otpInputs.value[0]?.focus()
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>
