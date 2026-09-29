<template>
  <div class="flex min-h-screen flex-col bg-page">
    <AuthHeader mode="register" curved>
      <!-- avatar -->
      <div class="mt-3 flex justify-center">
        <div class="relative h-[120px] w-[120px]">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="Profile photo"
            class="h-full w-full rounded-full object-cover"
          />
          <svg v-else class="h-full w-full" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="60" fill="white" fill-opacity="0.45" />
            <circle cx="60" cy="46" r="18" fill="white" />
            <ellipse cx="60" cy="88" rx="33" ry="15" fill="white" />
          </svg>

          <button
            type="button"
            aria-label="Edit photo"
            class="absolute top-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#0f4fa8] text-white transition-transform active:scale-95"
            @click="fileInput?.click()"
          >
            <svg
              class="h-[18px] w-[18px]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M3 17.25V21h3.75L18.4 9.35l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.33-2.33a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.82-1.84z"
              />
            </svg>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFile"
          />
        </div>
      </div>
    </AuthHeader>

    <main class="flex-1 px-4 pt-14">
      <label
        class="flex items-center gap-4 border-b-2 pb-2 transition-colors"
        :class="focused || name ? 'border-accent/70' : 'border-ink'"
      >
        <svg
          class="h-6 w-6 shrink-0 text-ink"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="7.5" r="4" />
          <path d="M3.5 20.5c0-3.6 3.2-6 8.5-6s8.5 2.4 8.5 6v.5h-17v-.5z" />
        </svg>
        <input
          v-model="name"
          type="text"
          placeholder="Your Name"
          autocomplete="name"
          maxlength="40"
          class="w-full min-w-0 bg-transparent text-[22px] text-ink outline-none placeholder:text-muted/60"
          @focus="focused = true"
          @blur="focused = false"
          @keyup.enter="next"
        />
      </label>

      <div class="mt-6 flex items-center justify-end gap-3">
        <span v-if="uploading" class="animate-pulse text-sm text-muted"
          >Uploading photo…</span
        >
        <ArrowButton :disabled="!canContinue" @click="next" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthHeader from '../shared/AuthHeader.vue'
import ArrowButton from '../shared/ArrowButton.vue'
import { storeToRefs } from 'pinia'
import { useSignupStore } from '../../../store/signup.ts'

const router = useRouter()
const signup = useSignupStore()
const { uploading } = storeToRefs(signup)
const name = ref(signup.name) // keeps the name if they come back from the PIN page

const focused = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
const avatarUrl = ref('')

const canContinue = computed(() => name.value.trim().length >= 2 && !uploading.value)

const onFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (avatarUrl.value) URL.revokeObjectURL(avatarUrl.value)
  avatarFile.value = file
  avatarUrl.value = URL.createObjectURL(file)
}

const next = async () => {
  if (!canContinue.value || uploading.value) return
  if (avatarFile.value) {
    const ok = await signup.uploadAvatar(avatarFile.value)
    if (!ok) return // the error toast already showed
  }
  signup.name = name.value.trim()
  router.push('/pin/setpin')
}
onBeforeUnmount(() => avatarUrl.value && URL.revokeObjectURL(avatarUrl.value))
</script>
