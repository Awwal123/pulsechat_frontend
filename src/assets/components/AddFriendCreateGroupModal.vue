<template>
  <!-- Backdrop -->
  <div
    v-if="modelValue"
    @click="close"
    class="fixed inset-0 bg-black/40 z-40 transition-opacity"
  ></div>

  <!-- Modal - Centered card from top -->
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-6"
  >
    <div class="bg-(--color-surface) rounded-2xl shadow-2xl w-full max-w-sm animate-slide-down">
      <!-- Options -->
      <div class="px-6 py-6 space-y-4">
        <!-- Add Friend Option -->
        <button
          @click="selectOption('add-friend')"
          class="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-(--color-surface-secondary) transition-colors text-left"
        >
          <div class="w-10 h-10 bg-(--color-surface-secondary) rounded-full flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 8.048M9 11H3v5a4 4 0 004 4h14a4 4 0 004-4v-5h-6m0 0a4 4 0 11-8 0m0 0a4 4 0 104 4m-6-4h6" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-primary">Add Friend</h3>
          </div>
        </button>

        <!-- Create Group Option -->
        <button
          @click="selectOption('create-group')"
          class="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-(--color-surface-secondary) transition-colors text-left"
        >
          <div class="w-10 h-10 bg-(--color-surface-secondary) rounded-full flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2H0v-2a9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-text-primary">Create Group</h3>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const close = () => {
  emit('update:modelValue', false)
}

const selectOption = (option: 'add-friend' | 'create-group') => {
  console.log('Selected:', option)
  // You can emit additional events or navigate here
  close()
}
</script>

<style scoped>
@keyframes slide-down {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}
</style>
