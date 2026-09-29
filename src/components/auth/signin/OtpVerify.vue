<template>
  <OtpEntry mode="login" @verified="onVerified" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import OtpEntry from '../shared/OtpEntry.vue'
import type { VerifyOtpPayload } from '../../../types/api.ts'

const router = useRouter()

const onVerified = (payload: VerifyOtpPayload) => {
  if (payload.requires_pin) {
    router.push('/pin/verify') // user has a PIN, so ask for it
  } else {
    router.replace('/chats') // no PIN, so login is done
  }
}
</script>