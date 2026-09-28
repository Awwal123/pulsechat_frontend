<template>
  <div class="flex min-h-screen flex-col bg-page">
    <header class="relative overflow-hidden rounded-br-[2.5rem] bg-linear-to-br from-header-from to-header-to px-4 py-4">
      <!-- soft glow, like the design -->
      <div class="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full bg-white/10" />
      <div class="relative flex items-center">
        <button
          type="button"
          aria-label="Go back"
          class="z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-transform active:scale-95"
          @click="router.back()"
        >
          <ArrowLeftIcon class="h-5 w-5" />
        </button>
        <h1 class="pointer-events-none absolute inset-x-0 text-center text-lg font-bold text-white">{{ title }}</h1>
      </div>
    </header>

    <main class="flex-1"><slot /></main>

    <footer v-if="$slots.footer" class="px-4 pt-3 pb-6"><slot name="footer" /></footer>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

defineProps<{ title: string }>()
const router = useRouter()
</script>