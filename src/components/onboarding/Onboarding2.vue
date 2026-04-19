<script setup>
import EchatLogoLight from "@/assets/images/E-Chat-Logo-Light.png";
import EchatLogoDark from "@/assets/images/E-Chat-Logo-Dark.png";
import ChatRound from "@/assets/images/Chat-Round-Light.png";
import { ref, onMounted, onUnmounted  } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const logo = ref(EchatLogoLight);
let observer;


const checkTheme = () => {
  const isDark = document.documentElement.classList.contains("dark");
  logo.value = isDark ? EchatLogoDark : EchatLogoLight;
};

onMounted(() => {
  checkTheme();
  const observer = new MutationObserver(checkTheme);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  setTimeout(() => {
    router.replace("/splash"); 
  }, 2000);

  onUnmounted(() => {
  observer?.disconnect();
});
});

</script>
<template>
  <div
    class="bg-page h-screen w-full  flex flex-col justify-between items-center"
  >
    <div class="mt-8">
      <img :src="logo" alt="E-Chat Logo" class="w-45 object-contain" />
    </div>
    <div class="flex-1 flex items-center justify-center">
      <div class="relative w-64 h-64 flex items-center justify-center">
        <img
          :src="ChatRound"
          alt="Stay Connected"
          class="w-full h-full object-contain"
        />
        <div
          class="absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <p class="text-accent font-bold text-xl">Stay Connected</p>

          <p class="text-accent font-bold text-xl mt-1">Stay Chatting</p>
        </div>
      </div>
    </div>
    <p class="mb-6 text-sm text-accent font-medium">Version 2.1.0</p>
  </div>
</template>

<style scoped>

</style>
