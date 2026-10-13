<template>
  <div
    class="onb h-screen w-full flex flex-col bg-page overflow-hidden select-none touch-pan-y"
    @touchstart.passive="dragStart($event.touches[0].clientX)"
    @touchmove.passive="dragMove($event.touches[0].clientX)"
    @touchend="dragEnd"
    @mousedown="dragStart($event.clientX)"
    @mousemove="dragMove($event.clientX)"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <!-- slide content: follows your finger, then animates between slides -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 pt-8">
      <div class="flex w-full flex-col items-center" :style="dragStyle">
        <Transition :name="direction" mode="out-in">
          <div :key="current" class="flex w-full flex-col items-center">
            <div class="item" style="--d: 0ms">
              <div class="relative">
                <img
                  :src="slide.image"
                  alt=""
                  class="float w-68 h-40 object-contain mb-4"
                  draggable="false"
                />
                <span class="float-shadow" />
              </div>
            </div>

            <h2
              class="item text-3xl font-bold text-blue-500 text-center mb-2"
              style="--d: 90ms"
            >
              {{ slide.title }}
            </h2>

            <p
              class="item text-blue-500 text-center text-md max-w-md leading-relaxed"
              style="--d: 170ms"
            >
              {{ slide.desc }}
            </p>
          </div>
        </Transition>
      </div>
    </div>

    <div class="relative flex-1 flex flex-col items-center justify-end pb-8">
      <!-- two waves drifting at different speeds -->
      <div class="absolute top-0 left-0 w-full overflow-hidden" style="height: 120px">
        <svg
          class="wave wave-a"
          viewBox="0 0 2880 200"
          preserveAspectRatio="none"
          style="height: 120px"
        >
          <path
            d="M0,100 Q360,50 720,100 T1440,100 T2160,100 T2880,100 L2880,200 L0,200 Z"
            fill="#A0CDEB"
            opacity="0.6"
          />
        </svg>
      </div>

      <div class="absolute top-16 left-0 w-full overflow-hidden" style="height: 140px">
        <svg
          class="wave wave-b"
          viewBox="0 0 2880 240"
          preserveAspectRatio="none"
          style="height: 140px"
        >
          <path
            d="M0,80 Q360,20 720,80 T1440,80 T2160,80 T2880,80 L2880,240 L0,240 Z"
            fill="#8DC1E3"
          />
        </svg>
      </div>

      <div class="absolute inset-0 top-1/3 bg-linear-to-b from-header-from to-header-to"></div>

      <button
        class="cta relative z-10 bg-linear-to-r from-[#0891B2] to-[#0284C7] hover:from-[#0369A1] hover:to-[#0267AA] text-white font-semibold py-3 px-20 rounded-full mb-6 transition-all active:scale-95"
        @click="getStarted"
      >
        Get started
      </button>

      <div class="relative z-10 flex items-center gap-2 mb-4">
        <button
          v-for="(_, index) in slides"
          :key="index"
          :aria-label="`Go to slide ${index + 1}`"
          class="h-2.5 rounded-full transition-all duration-300 cursor-pointer"
          :class="index === current ? 'w-8 bg-[#0891B2]' : 'w-2.5 bg-[#3DB4D9]'"
          @click="go(index)"
        ></button>
      </div>

      <div class="relative z-10 w-full flex justify-between px-8 text-sm">
        <button
          class="text-[#0891B2] font-medium hover:opacity-80 transition-opacity"
          @click="skip"
        >
          Skip
        </button>

        <button
          class="bg-[#B3D9F2] text-[#0891B2] font-medium px-5 py-2 rounded-full hover:bg-[#A0CDEB] transition-colors active:scale-95"
          @click="next"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Img1Light from "@/assets/images/Group-Light.png";
import Img2Light from "@/assets/images/Video-Light.png";
import Img3Light from "@/assets/images/Message-Light.png";
import Img4Light from "@/assets/images/Cross-Light.png";

import Img1Dark from "@/assets/images/Group-Dark.png";
import Img2Dark from "@/assets/images/Video-Dark.png";
import Img3Dark from "@/assets/images/Message-Dark.png";
import Img4Dark from "@/assets/images/Cross-Dark.png";

const router = useRouter();

const slides = [
  { title: "Group Chatting", desc: "Connect with multiple members in group chats." },
  { title: "Video And Voice Calls", desc: "Instantly connect via video and voice calls." },
  { title: "Message Encryption", desc: "Ensure privacy with encrypted messages." },
  { title: "Fast Performance", desc: "Lightning fast messaging experience." },
];
const lightImages = [Img1Light, Img2Light, Img3Light, Img4Light];
const darkImages = [Img1Dark, Img2Dark, Img3Dark, Img4Dark];

const current = ref(0);
const direction = ref("slide-next"); // which way the next transition moves
const isDarkMode = ref(false);

const slide = computed(() => ({
  ...slides[current.value],
  image: (isDarkMode.value ? darkImages : lightImages)[current.value],
}));
const isLast = computed(() => current.value === slides.length - 1);

/* ── navigation ─────────────────────────────────── */
const go = (i) => {
  if (i < 0 || i >= slides.length || i === current.value) return;
  direction.value = i > current.value ? "slide-next" : "slide-prev";
  current.value = i;
};
const next = () => (isLast.value ? getStarted() : go(current.value + 1));
const skip = () => go(slides.length - 1);
const getStarted = () => router.replace("/signup/phone");

/* ── swipe / drag: the content follows the pointer ─ */
const SWIPE_THRESHOLD = 50; // px
const dragX = ref(0);
const dragging = ref(false);
let startX = 0;

const dragStart = (x) => {
  startX = x;
  dragX.value = 0;
  dragging.value = true;
};
const dragMove = (x) => {
  if (dragging.value) dragX.value = x - startX;
};
const dragEnd = () => {
  if (!dragging.value) return;
  dragging.value = false;
  if (dragX.value < -SWIPE_THRESHOLD) go(current.value + 1);
  else if (dragX.value > SWIPE_THRESHOLD) go(current.value - 1);
  dragX.value = 0; // springs back
};

const dragStyle = computed(() => {
  // harder to pull when there is no slide in that direction
  const atEdge =
    (dragX.value > 0 && current.value === 0) || (dragX.value < 0 && isLast.value);
  return {
    transform: `translateX(${dragX.value * (atEdge ? 0.12 : 0.4)}px)`,
    transition: dragging.value
      ? "none"
      : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
  };
});

/* ── theme (swap light / dark illustrations) ────── */
let observer;
const checkTheme = () => {
  isDarkMode.value = document.documentElement.classList.contains("dark");
};
onMounted(() => {
  checkTheme();
  observer = new MutationObserver(checkTheme);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});
onUnmounted(() => observer?.disconnect());
</script>

<style scoped>
/* ── slide transition: old content fades out, new content glides in, piece by piece ── */
.slide-next-enter-active,
.slide-prev-enter-active {
  transition: opacity 0.35s ease;
}
.slide-next-leave-active,
.slide-prev-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.slide-next-enter-from,
.slide-prev-enter-from,
.slide-next-leave-to,
.slide-prev-leave-to {
  opacity: 0;
}
.slide-next-leave-to {
  transform: translateX(-40px);
}
.slide-prev-leave-to {
  transform: translateX(40px);
}

.item {
  transition:
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms),
    opacity 0.4s ease var(--d, 0ms);
}
.slide-next-enter-from .item {
  transform: translateX(48px);
}
.slide-prev-enter-from .item {
  transform: translateX(-48px);
}

/* ── idle motion ── */
.float {
  animation: float 4s ease-in-out infinite;
}
.float-shadow {
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 96px;
  height: 10px;
  margin-left: -48px;
  border-radius: 9999px;
  background: rgba(8, 145, 178, 0.2);
  filter: blur(4px);
  animation: shadow 4s ease-in-out infinite;
}

.wave {
  display: block;
  width: 200%;
  max-width: none; /* tailwind's preflight would clamp this to 100% */
}
.wave-a {
  animation: drift 16s linear infinite;
}
.wave-b {
  animation: drift 11s linear infinite reverse;
}

.cta {
  animation: glow 2.6s ease-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-9px);
  }
}
@keyframes shadow {
  0%,
  100% {
    transform: scaleX(1);
    opacity: 1;
  }
  50% {
    transform: scaleX(0.78);
    opacity: 0.55;
  }
}
@keyframes drift {
  to {
    transform: translateX(-50%);
  }
}
@keyframes glow {
  0% {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.2),
      0 0 0 0 rgba(255, 255, 255, 0.5);
  }
  70%,
  100% {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.2),
      0 0 0 14px rgba(255, 255, 255, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .onb *,
  .onb *::before,
  .onb *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>