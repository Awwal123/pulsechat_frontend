<template>
  <div class="min-h-screen bg-page flex flex-col">
    <div
      class="bg-linear-to-b flex flex-col from-header-from to-header-to text-white pt-6 pb-20"
    >
      <div>
        <div class="flex items-center justify-between px-6 mb-8">
          <button
            class="bg-page hover:bg-white/30 text-primary px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer transition-colors"
          >
            ← Login
          </button>
          <h1 class="text-3xl text-(--color-text-auth)  font-bold">Register</h1>
        </div>
      </div>
      <div class="flex justify-center">
        <div class="relative mt-12">
          <div
            class="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-[#A0CDEB] flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="w-full h-full object-cover"
            />

            <svg
              v-else
              class="w-16 h-16 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14c-4 0-6 2-6 4v4h12v-4c0-2-2-4-6-4z" />
            </svg>
          </div>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
          <button
            @click="handleEditClick"
            class="absolute top-2 right-1 bg-[#0891B2] text-white rounded-full p-2 shadow-lg hover:bg-[#0369A1] transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class=" bg-wave  py-8"></div>
    <div class="flex-1 px-6 py-8 flex flex-col items-center justify-center">
      <div class="w-full  mt-8 max-w-sm mb-8">
        <div
          class="flex items-center gap-2 border-b-2 border-text-primary pb-2"
        >
          <svg
            class="w-6 h-6 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
          <input
            type="text"
            placeholder="Your Name"
            class="flex-1 bg-transparent border-none text-text-primary placeholder-text-secondary focus:outline-none font-medium"
          />
        </div>
      </div>
      <div class="flex justify-end mb-8 w-full">
        <button
          class="bg-[#0891B2] hover:bg-[#0369A1] text-white rounded-full p-4 shadow-lg transition-all active:scale-95"
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

import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const imageUrl = ref<string | null>(null)

// trigger file picker
const handleEditClick = () => {
  fileInput.value?.click()
}

// handle file selection
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  // preview image
  imageUrl.value = URL.createObjectURL(file)
}
</script>
