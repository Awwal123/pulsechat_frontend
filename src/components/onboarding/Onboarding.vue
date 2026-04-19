<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const frontStyle = ref({});
const backStyle = ref({});
const showText = ref(false);
const router = useRouter();

const stages = [
  {
    front: ["#dbe7f0", "#cfd8e3"],
    back: ["#e9eff5", "#d6dee8"],
  },
  {
    front: ["#6ec1e4", "#1e88e5"],
    back: ["#90caf9", "#1565c0"],
  },
  {
    front: ["#29b6f6", "#0288d1"],
    back: ["#1565c0", "#0d47a1"],
  },
];

const applyStage = (stage) => {
  frontStyle.value = {
    background: `linear-gradient(135deg, ${stage.front[0]}, ${stage.front[1]})`,
  };

  backStyle.value = {
    background: `linear-gradient(135deg, ${stage.back[0]}, ${stage.back[1]})`,
  };
};

onMounted(() => {
  applyStage(stages[0]);

  setTimeout(() => applyStage(stages[1]), 2500);
  setTimeout(() => applyStage(stages[2]), 5000);

  setTimeout(() => {
    showText.value = true;
  }, 6500);

  setTimeout(() => {
    router.push("/onboarding2");
  }, 9500);
});
</script>

<template>
  <div
    class="bg-page h-screen flex justify-center items-center overflow-hidden flex-col"
  >

    <div class="chat-wrapper">
      <div class="bubble back" :style="backStyle"></div>
      <div class="bubble front" :style="frontStyle"></div>
    </div>
   <p
  :class="[
    'absolute bottom-10 left-1/2 -translate-x-1/2 text-[18px] font-semibold text-primary text-center transition-all duration-700 ease-in-out transform',
    showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
  ]"
>
  As fast as lightning,<br />
  as delicious as thunder!
</p>
  </div>

</template>

<style scoped>
.onboarding {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f9fbfd;
  overflow: hidden;
}


.chat-wrapper {
  position: relative;
  width: 140px;
  height: 120px;
}

.bubble {
  position: absolute;
  width: 100px;
  height: 80px;
  border-radius: 16px;
  transition: all 1.2s ease;
}

.back {
  right: 0;
  bottom: 0;
  opacity: 0.9;
}


.front {
  left: 0;
  top: 0;
  z-index: 2;
}

/* Tail (chat pointer) */
.bubble::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 20px;
  width: 16px;
  height: 16px;
  background: inherit;
  transform: rotate(45deg);
  border-radius: 3px;
}

/* Offset back bubble tail */
.back::after {
  left: auto;
  right: 20px;
}


.text.show {
  opacity: 1;
  transform: translateY(0);
}
</style>
