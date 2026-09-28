<template>
  <MainLayout :activeTab="'groups'">
    <div class="px-6 py-4 space-y-4">
      <div v-for="group in groups" :key="group.id" class="flex items-center gap-4 py-3 border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-secondary)] px-2 rounded cursor-pointer transition-colors">
        <!-- Avatar Stack -->
        <div class="relative w-12 h-12 flex-shrink-0">
          <div class="absolute flex items-center justify-center">
            <img
              v-if="group.avatars[0]"
              :src="group.avatars[0]"
              :alt="group.name"
              class="w-10 h-10 rounded-full object-cover border-2 border-[color:var(--color-surface)]"
            />
          </div>
          <div v-if="group.avatars[1]" class="absolute bottom-0 right-0">
            <img
              :src="group.avatars[1]"
              :alt="group.name"
              class="w-7 h-7 rounded-full object-cover border-2 border-[color:var(--color-surface)]"
            />
          </div>
          <!-- Member Count Badge -->
          <div v-if="group.memberCount > 2" class="absolute -bottom-1 -right-1 w-6 h-6 bg-[color:var(--color-text-secondary)] text-white text-xs rounded-full flex items-center justify-center font-bold">
            +{{ group.memberCount - 2 }}
          </div>
        </div>
        
        <!-- Group Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-semibold text-[color:var(--color-text-primary)]">{{ group.name }}</h3>
            <svg v-if="group.verified" class="w-4 h-4 text-[#0891B2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          <p class="text-sm text-[color:var(--color-text-secondary)] truncate">{{ group.message }}</p>
        </div>
        
        <!-- Time Badge -->
        <span class="text-xs text-[color:var(--color-text-secondary)] flex-shrink-0">{{ group.time }}</span>
        
        <!-- Unread Badge -->
        <div v-if="group.unread" class="w-6 h-6 bg-[#0891B2] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
          {{ group.unread }}
        </div>
      </div>
    </div>
  </MainLayout>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '../layout/MainLayout.vue';


const groups = ref([
  {
    id: 1,
    name: 'Diamond Team',
    message: 'Thanks a bunch! Have a great day! 😊',
    time: '10:25',
    avatars: ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2'],
    memberCount: 8,
    verified: true,
    unread: null,
  },
  {
    id: 2,
    name: 'Group Shares Experience About AI',
    message: 'Great, thanks so much! 😊',
    time: '09/05',
    avatars: ['https://i.pravatar.cc/150?img=3', 'https://i.pravatar.cc/150?img=4'],
    memberCount: 12,
    verified: false,
    unread: null,
  },
  {
    id: 3,
    name: 'My charity group',
    message: 'Appreciate it! See you soon! 🎉',
    time: '08/05',
    avatars: ['https://i.pravatar.cc/150?img=5', 'https://i.pravatar.cc/150?img=6'],
    memberCount: 5,
    verified: false,
    unread: null,
  },
  {
    id: 4,
    name: '🎮 Game 🎮',
    message: 'Hooray! 🎉',
    time: '05/05',
    avatars: ['https://i.pravatar.cc/150?img=7', 'https://i.pravatar.cc/150?img=8'],
    memberCount: 15,
    verified: false,
    unread: null,
  },
  {
    id: 5,
    name: 'Delivery',
    message: 'Your order has been successfully delivered',
    time: '05/05',
    avatars: ['https://i.pravatar.cc/150?img=9', 'https://i.pravatar.cc/150?img=10'],
    memberCount: 3,
    verified: false,
    unread: null,
  },
  {
    id: 6,
    name: 'Sky-diving Lion Team',
    message: 'See you soon!',
    time: '05/05',
    avatars: ['https://i.pravatar.cc/150?img=11', 'https://i.pravatar.cc/150?img=12'],
    memberCount: 6,
    verified: false,
    unread: null,
  },
  {
    id: 7,
    name: '⚽ football',
    message: 'New uniforms are ready 👕',
    time: '02/05',
    avatars: ['https://i.pravatar.cc/150?img=13', 'https://i.pravatar.cc/150?img=14'],
    memberCount: 11,
    verified: false,
    unread: null,
  },
  {
    id: 8,
    name: 'IT Training',
    message: 'Appreciate it! Hope you enjoy it!',
    time: '01/05',
    avatars: ['https://i.pravatar.cc/150?img=15', 'https://i.pravatar.cc/150?img=16'],
    memberCount: 9,
    verified: false,
    unread: null,
  },
])
</script>
