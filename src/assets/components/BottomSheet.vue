<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-end justify-center">
        <div class="absolute inset-0 bg-black/50" @click="close" />

        <section
          class="panel relative flex h-[92vh] w-full max-w-md flex-col rounded-t-3xl bg-sheet shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          <div class="mx-auto mt-3 h-1 w-10 rounded-full bg-text-secondary/50" />
          <h2 v-if="title" class="mt-4 text-center text-sm font-medium text-text-primary/90">{{ title }}</h2>

          <div class="min-h-0 flex-1 overflow-y-auto"><slot /></div>

          <div v-if="$slots.footer" class="px-4 pt-3 pb-6"><slot name="footer" /></div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps<{ modelValue: boolean; title?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const close = () => emit('update:modelValue', false)
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && props.modelValue && close()

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.sheet-enter-active,
.sheet-leave-active { transition: opacity 0.25s ease; }
.sheet-enter-from,
.sheet-leave-to { opacity: 0; }
.sheet-enter-active .panel,
.sheet-leave-active .panel { transition: transform 0.3s ease; }
.sheet-enter-from .panel,
.sheet-leave-to .panel { transform: translateY(100%); }
</style>