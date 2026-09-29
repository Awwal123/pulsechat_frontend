<template>
  <div
    class="h-screen w-full flex flex-col bg-page overflow-hidden"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <div class="flex-1 flex flex-col items-center justify-center px-6 pt-8">
      <img
        :src="getCurrentSlide().image"
        class="w-68 h-40 object-contain mb-4"
        draggable="false"
      />

      <h2 class="text-3xl font-bold text-blue-500 text-center mb-2">
        {{ getCurrentSlide().title }}
      </h2>

      <p class="text-blue-500 text-center text-md max-w-md leading-relaxed">
        {{ getCurrentSlide().desc }}
      </p>
    </div>

    <div class="relative flex-1 flex flex-col items-center justify-end pb-8">
      <svg
        class="absolute top-0 left-0 w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        style="height: 120px;"
      >
        <path
          d="M0,100 Q360,50 720,100 T1440,100 L1440,200 L0,200 Z"
          fill="#A0CDEB"
          opacity="0.6"
        />
      </svg>

      <svg
        class="absolute top-16 left-0 w-full"
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        style="height: 140px;"
      >
        <path
          d="M0,80 Q360,20 720,80 T1440,80 L1440,240 L0,240 Z"
          fill="#8DC1E3"
        />
      </svg>

      <div class="absolute inset-0 top-1/3 bg-linear-to-b from-header-from to-header-to"></div>

      <button
        class="relative z-10 bg-linear-to-r from-[#0891B2] to-[#0284C7] hover:from-[#0369A1] hover:to-[#0267AA] text-white font-semibold py-3 px-20 rounded-full shadow-lg mb-6 transition-all active:scale-95"
        @click="getStarted"
      >
        Get started
      </button>

      <div class="relative z-10 flex items-center gap-2 mb-4">
        <button
          v-for="(item, index) in slides"
          :key="index"
          @click="current = index"
          class="w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer"
          :class="index === current ? 'bg-[#0891B2] w-8' : 'bg-[#3DB4D9]'"
        ></button>
      </div>

      <div class="relative z-10 w-full flex justify-between px-8 text-sm">
        <button
          @click="skip"
          class="text-[#0891B2] font-medium hover:opacity-80 transition-opacity"
        >
          Skip
        </button>

        <button
          @click="next"
          class="bg-[#B3D9F2] text-[#0891B2] font-medium px-5 py-2 rounded-full hover:bg-[#A0CDEB] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Img1Light from "@/assets/images/Group-Light.png";
import Img2Light from "@/assets/images/Video-Light.png";
import Img3Light from "@/assets/images/Message-Light.png";
import Img4Light from "@/assets/images/Cross-Light.png";

import Img1Dark from "@/assets/images/Group-Dark.png";
import Img2Dark from "@/assets/images/Video-Dark.png";
import Img3Dark from "@/assets/images/Message-Dark.png";
import Img4Dark from "@/assets/images/Cross-Dark.png";
import { useRouter } from "vue-router";

const router = useRouter();

const current = ref(0);
const isDarkMode = ref(false);
let observer;
let startX = 0;
let currentX = 0;
let isDragging = false;
let dragOffset = 0;

const slides = ref([
  {
    titleLight: "Group Chatting",
    titleDark: "Group Chatting",
    desc: "Connect with multiple members in group chats.",
  },
  {
    titleLight: "Video And Voice Calls",
    titleDark: "Video And Voice Calls",
    desc: "Instantly connect via video and voice calls.",
  },
  {
    titleLight: "Message Encryption",
    titleDark: "Message Encryption",
    desc: "Ensure privacy with encrypted messages.",
  },
  {
    titleLight: "Fast Performance",
    titleDark: "Fast Performance",
    desc: "Lightning fast messaging experience.",
  },
]);


const getCurrentSlide = () => {
  const slide = slides.value[current.value];
  const images = isDarkMode.value
    ? [Img1Dark, Img2Dark, Img3Dark, Img4Dark]
    : [Img1Light, Img2Light, Img3Light, Img4Light];

  return {
    image: images[current.value],
    title: isDarkMode.value ? slide.titleDark : slide.titleLight,
    desc: slide.desc,
  };
};


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

onUnmounted(() => {
  observer?.disconnect();
});

const waveTopColor = () => (isDarkMode.value ? "#1F3A5F" : "#A0CDEB");
const waveBottomColor = () => (isDarkMode.value ? "#16324F" : "#8DC1E3");
const bottomFillColor = () => (isDarkMode.value ? "#16324F" : "#8DC1E3");

const handleTouchStart = (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
  dragOffset = 0;
};

const handleTouchMove = (e) => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX;
  dragOffset = currentX - startX;
};

const handleTouchEnd = () => {
  isDragging = false;
  handleDragEnd();
};


const handleMouseDown = (e) => {
  startX = e.clientX;
  isDragging = true;
  dragOffset = 0;
};

const handleMouseMove = (e) => {
  if (!isDragging) return;
  currentX = e.clientX;
  dragOffset = currentX - startX;
};

const handleMouseUp = () => {
  isDragging = false;
  handleDragEnd();
};

const handleDragEnd = () => {
  const threshold = 50; // Minimum drag distance to trigger slide change

  if (dragOffset > threshold) {
    // Swiped/dragged right
    if (current.value > 0) {
      current.value--;
    }
  } else if (dragOffset < -threshold) {
    // Swiped/dragged left
    if (current.value < slides.value.length - 1) {
      current.value++;
    }
  }
};

const next = () => {
  if (current.value < slides.value.length - 1) {
    current.value++;
  } else {
    getStarted();
  }
};


const skip = () => {
  current.value = slides.value.length - 1;
};

const getStarted = () => {
 router.replace("/signup/phone")
};
</script>
