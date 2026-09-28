<template>
  <OtpEntry mode="login" @verified="onVerified" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import OtpEntry from '../shared/OtpEntry.vue'

const router = useRouter()
const onVerified = (_code: string) => {
  router.push('/chats')
}
</script>