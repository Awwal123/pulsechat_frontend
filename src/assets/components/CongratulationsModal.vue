<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
    @click="closeModal"
  ></div>

  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center z-50 px-6"
  >
   <div class="bg-(--color-surface) rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
      <h2 class="text-3xl font-bold text-text-primary mb-6">
        Congratulations!
      </h2>
      <div class="mb-8 flex justify-center">
      <img :src="CongratBg" alt="bg" class="w-auto h-auto" >
      </div>
      <p class="text-text-secondary text-center mb-8 leading-relaxed">
        Your account is now ready to use.
        <br />
        You will be redirected to the Home page shortly
      </p>
      <div class="flex justify-center mb-2">
        <div class="relative w-10 h-10">
          <div
            class="absolute inset-0 rounded-full border-4 border-[#E5E7EB] border-t-[#0891B2] animate-spin"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref} from 'vue'
import { useRouter } from 'vue-router'
import CongratBg from "@/assets/images/congratulations.png"

const isOpen = ref(false)
const router = useRouter()

const openModal = () => {
  isOpen.value = true
  setTimeout(() => {
    router.push('/chats')
  }, 3000)
}

const closeModal = () => {
  isOpen.value = false
}

defineExpose({
  openModal,
  closeModal,
})
</script>