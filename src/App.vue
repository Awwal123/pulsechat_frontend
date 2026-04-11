<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  const isDarkNow = document.documentElement.classList.toggle('dark')
  isDark.value = isDarkNow
  localStorage.setItem('theme', isDarkNow ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')

  if (saved === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <!-- ✅ CRITICAL: text-primary here -->
  <div class="bg-page text-primary min-h-screen p-6 transition-colors duration-300">
    
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-primary">
        PulseChat
      </h1>

      <button
        @click="toggleTheme"
        class="bg-accent text-white px-4 py-2 rounded-lg border border-base hover:opacity-90 transition"
      >
        Toggle {{ isDark ? 'Light' : 'Dark' }}
      </button>
    </div>

    <!-- Card -->
    <div class="bg-surface p-6 rounded-xl shadow border border-base transition-colors duration-300">
      <h2 class="text-lg font-semibold text-primary mb-2">
        Chat Preview
      </h2>

      <p class="text-secondary mb-4">
        This is how your text will look in both modes.
      </p>

      <!-- Fake message -->
      <div class="bg-accent text-white p-3 rounded-lg w-fit">
        Hello from PulseChat 🚀
      </div>
    </div>

  </div>
</template>