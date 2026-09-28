<script setup lang="ts">
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark')
}
</script>

<template>
  <router-view />
</template>