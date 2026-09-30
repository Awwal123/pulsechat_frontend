<template>
  <OtpEntry mode="register" @verified="onVerified" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import OtpEntry from '../shared/OtpEntry.vue'
import { usePhone } from '../../../assets/composables/Usephone.ts'

const router = useRouter()
const { otpVerified } = usePhone()

const onVerified = () => {
  otpVerified.value = true
  router.push('/signup/name')
}
</script>
