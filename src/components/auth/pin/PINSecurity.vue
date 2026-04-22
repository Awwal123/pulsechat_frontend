<template>
  <div class="min-h-screen bg-page flex flex-col">
    <div class="px-6 flex justify-between pt-6 pb-8">
      <button
        class="text-primary cursor-pointer hover:opacity-70 transition-opacity mb-6"
      >
        <ArrowLeftIcon class="w-6 h-6" />
      </button>
      <h1 class="text-3xl font-bold text-primary mb-2">PIN Security</h1>

      <div></div>
    </div>
    <p class="text-text-secondary text-center text-sm">
      Protect your account with a secure PIN
    </p>

    <div class="flex-1 flex flex-col items-center justify-center px-6">
      <div class="flex gap-6 mb-20">
        <input
          v-for="(_, index) in pin"
          :key="index"
          v-model="pin[index]"
          type="text"
          inputmode="numeric"
          maxlength="1"
          placeholder="—"
          :ref="(el) => pinInputs[index] = el"
          @input="handlePinInput(index)"
          @keydown.backspace="handleBackspace(index)"
          @focus="(e) => (e.target as HTMLInputElement).select()"
          :class="[
            'w-12 h-12 text-center text-2xl font-bold border-b-2 bg-transparent text-primary focus:outline-none placeholder-text-secondary transition-colors',
            pin[index] ? 'border-[#0891B2]' : 'border-border'
          ]"
        />
      </div>
    </div>

    <div class="px-6 pb-8 flex items-center justify-between">
      <button
        class="text-[#0891B2] hover:opacity-70 font-semibold transition-opacity"
        @click="showCongratulations"
      >
        Skip
      </button>
      <button
        class="bg-[#0891B2] hover:bg-[#0369A1] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all active:scale-95"
        @click="showCongratulations"
      >
        Continue
      </button>
    </div>
    <CongratulationsModal ref="modalRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import CongratulationsModal from '../../../assets/components/CongratulationsModal.vue'



const pin = ref(['', '', '', ''])
const pinInputs = ref<any[]>([])

const modalRef = ref<any>(null)

    const showCongratulations = () => {
  modalRef.value?.openModal()
}

// Handle PIN input with auto-advance
const handlePinInput = (index: number) => {
  const value = pin.value[index]

  // Only allow digits
  pin.value[index] = value.replace(/[^0-9]/g, '').slice(0, 1)

  // Auto-advance to next input
  if (pin.value[index] && index < 3) {
    pinInputs.value[index + 1]?.focus()
  }
}

// Handle backspace to go to previous input
const handleBackspace = (index: number) => {
  if (!pin.value[index] && index > 0) {
    pin.value[index - 1] = ''
    pinInputs.value[index - 1]?.focus()
  }
}

onMounted(() => {
  // Auto-focus first input
  pinInputs.value[0]?.focus()
})
</script>
