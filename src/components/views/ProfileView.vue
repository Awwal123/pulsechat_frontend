<template>
  <MainLayout :activeTab="'profile'">
    <div class="px-6 py-8 flex flex-col items-center">
      <!-- Profile Avatar with Edit Icon -->
      <div class="relative mb-6">
        <img
          src="https://i.pravatar.cc/150?img=1"
          alt="Profile"
          class="w-28 h-28 rounded-full object-cover border-4 border-[color:var(--color-surface)]"
        />
        <button class="absolute bottom-0 right-0 bg-[#0891B2] text-white p-2 rounded-full shadow-lg hover:bg-[#0369A1] transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      <!-- Name -->
      <h2 class="text-2xl font-bold text-[color:var(--color-text-primary)] mb-8">John Lennon</h2>

      <!-- Profile Info -->
      <div class="w-full space-y-4 mb-8">
        <!-- Phone -->
        <div class="flex items-center justify-between py-3 border-b border-[color:var(--color-border)]">
          <div class="flex items-center gap-3">
            <span class="text-[color:var(--color-text-primary)] font-medium">Phone :</span>
            <span class="text-[color:var(--color-text-secondary)]">(+44) 20 1234 5689</span>
          </div>
          <button class="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <!-- Gender -->
        <div class="flex items-center justify-between py-3 border-b border-[color:var(--color-border)]">
          <div class="flex items-center gap-3">
            <span class="text-[color:var(--color-text-primary)] font-medium">Gender :</span>
            <span class="text-[color:var(--color-text-secondary)]">Male</span>
          </div>
          <button class="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <!-- Birthday -->
        <div class="flex items-center justify-between py-3 border-b border-[color:var(--color-border)]">
          <div class="flex items-center gap-3">
            <span class="text-[color:var(--color-text-primary)] font-medium">Birthday :</span>
            <span class="text-[color:var(--color-text-secondary)]">12/01/1997</span>
          </div>
          <button class="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <!-- Email -->
        <div class="flex items-center justify-between py-3 border-b border-[color:var(--color-border)]">
          <div class="flex items-center gap-3">
            <span class="text-[color:var(--color-text-primary)] font-medium">Email :</span>
            <span class="text-[color:var(--color-text-secondary)]">john.lennon@mail.com</span>
          </div>
          <button class="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="w-full space-y-3">
        <button class="w-full bg-[#0891B2] hover:bg-[#0369A1] text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </button>

        <button class="w-full bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-colors">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
          </svg>
          Logout
        </button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../layout/MainLayout.vue';
</script>
