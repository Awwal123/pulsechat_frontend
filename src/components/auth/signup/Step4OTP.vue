<template>
  <OtpEntry mode="register" @verified="onVerified" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import OtpEntry from '../shared/OtpEntry.vue'
import { usePhone } from '../../../assets/composables/Usephone.ts'
import type { VerifyOtpPayload } from '../../../types/api.ts'


const router = useRouter()
const { otpVerified } = usePhone()

const onVerified = (payload: VerifyOtpPayload) => {
  otpVerified.value = true
  router.push('/signup/name')
}
</script>