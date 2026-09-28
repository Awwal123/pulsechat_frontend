<template>
  <PhoneEntry mode="login" @next="router.push('/login/otp')" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PhoneEntry from '../shared/PhoneEntry.vue'

const router = useRouter()
</script>