<template>
  <div class="min-h-screen bg-page flex flex-col">
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

      <div class="px-6 flex justify-end">
        <h2
          class="text-3xl md:text-center text-right max-w-50 font-semibold text-(--color-text-auth) "
        >
          Enter your mobile phone
        </h2>
      </div>
    </div>

    <div class=" bg-wave  py-8"></div>

    <div class="flex-1 px-6 py-8 flex flex-col">
      <p class="text-center text-form mb-8">You will get a code via sms.</p>

      <div class="mb-8">
        <PhoneInput v-model="phone" @change="handlePhone" />
      </div>

      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            id="remember"
            class="w-5 h-5 rounded border-2 border-light cursor-pointer accent-[#0891B2]"
          />
          <label for="remember" class="text-primary cursor-pointer font-medium">
            Remember me
          </label>
        </div>

        <div class="flex justify-end ">
          <button
            class="bg-accent hover:bg-[#0369A1] text-white rounded-full p-4 shadow-lg transition-all active:scale-95"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PhoneInput from '../../../assets/components/PhoneInput.vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const phone = ref('')
const handlePhone = (data: any) => {
  console.log(data)

}

const next = () => {
 router.push("/signup/otp")
};
</script>
