<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css' // remove this line if your version says it can't resolve it (v1)

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark')
}
</script>

<template>
  <Toaster position="top-center" rich-colors />
  <router-view />
</template>