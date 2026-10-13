<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import logoLight from "@/assets/images/pulsechat-logo.svg";
import logoDark from "@/assets/images/pulsechat-logo-dark.svg";
import ChatRound from "@/assets/images/Chat-Round-Light.png";

const router = useRouter();
const GO_TO_SPLASH_AT = 2600; // ms

// theme: read the .dark class directly (does not depend on Tailwind's dark: variant)
const isDark = ref(document.documentElement.classList.contains("dark"));
let observer;
let timer;

onMounted(() => {
  observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains("dark");
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  timer = setTimeout(() => router.replace("/splash"), GO_TO_SPLASH_AT);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  clearTimeout(timer);
});

// speech-bubble outline (circle + tail at the bottom-left), same shape as the icon
const BUBBLE_RING = "M105.6 216.5A102 102 0 1 0 36.2 152.9L38 213Z";
</script>

<template>
  <div
    class="onb bg-page h-screen w-full flex flex-col justify-between items-center overflow-hidden"
  >
    <div class="logo-in mt-8">
      <img
        :src="isDark ? logoDark : logoLight"
        alt="Pulse Chat"
        class="h-16 w-auto"
      />
    </div>

    <div class="flex-1 flex items-center justify-center">
      <div class="relative w-64 h-64 flex items-center justify-center">
        <svg class="ring ring-a" viewBox="0 0 256 256" aria-hidden="true">
          <path
            :d="BUBBLE_RING"
            fill="none"
            stroke="#43c3ff"
            stroke-width="22"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        </svg>
        <svg class="ring ring-b" viewBox="0 0 256 256" aria-hidden="true">
          <path
            :d="BUBBLE_RING"
            fill="none"
            stroke="#43c3ff"
            stroke-width="22"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        </svg>

        <!-- the real bubble sits above the echoes -->
        <div class="bubble-in relative z-10 h-full w-full">
          <img
            :src="ChatRound"
            alt="Stay Connected"
            class="float h-full w-full object-contain"
          />
        </div>

        <div
          class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
        >
          <p class="line text-accent font-bold text-xl" style="--d: 700ms">
            Stay Connected
          </p>
          <p class="line text-accent font-bold text-xl mt-1" style="--d: 950ms">
            Stay Chatting
          </p>
        </div>
      </div>
    </div>

    <p class="version mb-6 text-sm text-accent font-medium">Version 2.1.0</p>
  </div>
</template>

<style scoped>
.logo-in {
  animation: logo-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}
.bubble-in {
  animation: pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s both;
}
.float {
  animation: float 3.6s ease-in-out 1.1s infinite;
}
.line {
  animation: rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both;
}
.version {
  animation: fade 1s ease-out 1.2s both;
}

/* the <svg> box itself is static and invisible */
.ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible; /* the shape grows past the 256x256 viewBox */
  border: 0;
  outline: none;
  background: transparent;
  box-shadow: none;
}

/* only the shape animates: it grows from the middle of the bubble's circle */
.ring path {
  opacity: 0;
  transform-box: view-box;
  transform-origin: 52% 46%;
  animation: ripple 2.4s ease-out infinite;
}
.ring-a path {
  animation-delay: 0.9s;
}
.ring-b path {
  animation-delay: 1.7s;
}

@keyframes logo-in {
  from {
    opacity: 0;
    transform: translateY(-14px) scale(0.92);
  }
}
@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.65);
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}
@keyframes fade {
  from {
    opacity: 0;
  }
}
@keyframes ripple {
  0% {
    opacity: 0.45;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .onb *,
  .onb *::before,
  .onb *::after {
    animation: none !important;
  }
}
</style>