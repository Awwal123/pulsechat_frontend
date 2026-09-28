<template>
  <button
    type="button"
    :disabled="disabled"
    class="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-linear-to-b from-accent to-accent-dark text-white shadow-md transition-all"
    :class="disabled ? 'cursor-not-allowed opacity-40 shadow-none' : 'cursor-pointer active:scale-95'"
  >
    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{ disabled?: boolean }>()
</script>