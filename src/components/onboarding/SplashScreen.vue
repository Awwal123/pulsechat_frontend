<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import wordmarkLight from "@/assets/images/pulsechat-wordmark.svg";
import wordmarkDark from "@/assets/images/pulsechat-wordmark-dark.svg";

const router = useRouter();
const GO_TO_NEXT_AT = 6000; // ms

// same shapes as pulsechat-icon.svg (512 grid)
const BUBBLE =
  "M168 96H344A72 72 0 0 1 416 168V272A72 72 0 0 1 344 344H252L186 405Q168 420 168 392V344A72 72 0 0 1 96 272V168A72 72 0 0 1 168 96Z";
const PULSE = "M128 220H190L220 150L268 290L300 220H384";

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

  timer = setTimeout(() => router.push("/onboarding2"), GO_TO_NEXT_AT);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  clearTimeout(timer);
});
</script>

<template>
  <div
    class="splash bg-page relative flex h-screen flex-col items-center justify-center overflow-hidden"
  >
    <!-- logo + glow + sonar rings -->
    <div class="stage">
      <span class="glow" />
      <span class="ring ring-a" />
      <span class="ring ring-b" />

      <div class="logo">
        <svg viewBox="0 0 512 512" class="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="splash-tile" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#2bbcf5" />
              <stop offset="1" stop-color="#0a79b3" />
            </linearGradient>
          </defs>
          <rect width="512" height="512" rx="116" fill="url(#splash-tile)" />
          <path class="bubble" :d="BUBBLE" fill="#fff" />
          <path
            class="pulse"
            :d="PULSE"
            pathLength="1"
            fill="none"
            stroke="#0a8fc7"
            stroke-width="24"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- name reveals left to right -->
    <div class="wordmark">
      <img
        :src="isDark ? wordmarkDark : wordmarkLight"
        alt="Pulse Chat"
        class="h-9 w-auto"
      />
    </div>

    <div class="absolute inset-x-0 bottom-10 text-center">
      <p class="tagline text-[18px] font-semibold text-primary">
        As fast as lightning,<br />
        as delicious as thunder!
      </p>
    </div>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  width: 132px;
  height: 132px;
}

/* soft light behind the logo */
.glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 340px;
  height: 340px;
  margin: -170px 0 0 -170px;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    rgba(23, 162, 216, 0.26) 0%,
    rgba(23, 162, 216, 0) 65%
  );
  animation: fade 1.4s ease-out 0.1s both;
}

/* 1. tile pops in  2. heartbeat starts */
.logo {
  position: relative;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 14px 24px rgba(10, 121, 179, 0.35));
  animation:
    pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both,
    beat 1.7s ease-in-out 2.6s infinite;
}

/* the bubble settles in, then the pulse line draws itself */
.bubble {
  transform-box: fill-box;
  transform-origin: 50% 60%;
  animation: bubble-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s both;
}
.pulse {
  stroke-dasharray: 1 2;
  animation: draw 0.95s cubic-bezier(0.65, 0, 0.35, 1) 1.4s both;
}

.ring {
  position: absolute;
  inset: 0;
  border-radius: 23%;
  border: 2px solid var(--color-accent);
  opacity: 0;
  animation: ripple 2.6s ease-out infinite;
}
.ring-a {
  animation-delay: 2.6s;
}
.ring-b {
  animation-delay: 3.5s;
}

.wordmark {
  margin-top: 34px;
  animation: reveal 0.9s cubic-bezier(0.65, 0, 0.35, 1) 2s both;
}

.tagline {
  animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 2.9s both;
}

@keyframes fade {
  from {
    opacity: 0;
  }
}
@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.4) rotate(-8deg);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes bubble-in {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
}
@keyframes draw {
  from {
    stroke-dashoffset: 1.05;
  }
  to {
    stroke-dashoffset: 0;
  }
}
/* lub-dub */
@keyframes beat {
  0%,
  70%,
  100% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.07);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.045);
  }
}
@keyframes ripple {
  0% {
    opacity: 0.45;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.85);
  }
}
@keyframes reveal {
  from {
    opacity: 0;
    clip-path: inset(0 100% 0 0);
  }
  to {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .splash *,
  .splash *::before,
  .splash *::after {
    animation: none !important;
  }
}
</style>