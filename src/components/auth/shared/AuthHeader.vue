<template>
  <header class="relative" :class="curved ? 'h-[297px]' : 'pb-[52px]'">
    <!-- curved shell (idle / profile screens) -->
    <template v-if="curved">
      <div class="absolute inset-x-0 top-0 h-[297px] bg-wave" style="clip-path: ellipse(82% 100% at 50% 0)" />
      <div
        class="absolute inset-x-0 top-0 h-[245px] bg-linear-to-br from-header-from to-header-to"
        style="clip-path: ellipse(73% 100% at 50% 0)"
      />
    </template>
    <!-- flat shell (typing / OTP screens) -->
    <template v-else>
      <div class="absolute inset-x-0 top-0 bottom-[52px] bg-linear-to-br from-header-from to-header-to" />
      <div class="absolute inset-x-0 bottom-0 h-[52px] bg-wave" />
    </template>

    <div class="relative z-10 px-6 pt-6 text-(--color-text-auth)" :class="curved ? '' : 'pb-8'">
      <!-- top row -->
      <div class="flex items-center justify-between">
        <template v-if="mode === 'login'">
          <h1 class="text-[28px] font-bold tracking-wide">Login</h1>
          <RouterLink to="/signup/phone" class="rounded-full bg-pill px-6 py-3 text-base font-bold text-pill-text transition-opacity hover:opacity-90">
            Register
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/login" class="flex items-center gap-3 rounded-full bg-pill px-6 py-3 text-base font-bold text-pill-text transition-opacity hover:opacity-90">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 12H5M11 6l-6 6 6 6" />
            </svg>
            Login
          </RouterLink>
          <h1 class="text-[28px] font-bold tracking-wide">Register</h1>
        </template>
      </div>

      <!-- headings -->
      <div v-if="heading" class="mt-5" :class="mode === 'register' ? 'text-right' : 'text-left'">
        <h2 class="max-w-[220px] text-[26px] leading-tight font-semibold tracking-wide" :class="mode === 'register' && 'ml-auto'">
          {{ heading }}
        </h2>
        <p v-if="subheading" class="mt-2 text-lg font-medium tracking-wide">{{ subheading }}</p>
      </div>

      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    mode?: 'login' | 'register'
    heading?: string
    subheading?: string
    curved?: boolean
  }>(),
  { mode: 'login', curved: false },
)
</script>