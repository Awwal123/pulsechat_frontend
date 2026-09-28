<template>
  <div class="flex items-center gap-3 py-2.5">
    <img :src="avatar" :alt="name" class="h-11 w-11 shrink-0 rounded-full object-cover" />
    <div class="min-w-0 flex-1">
      <p class="truncate text-[15px] font-bold text-text-primary">{{ name }}</p>
      <p class="truncate text-xs font-semibold text-text-secondary">{{ subtitle }}</p>
    </div>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ name: string; subtitle: string; avatar: string }>()
</script>