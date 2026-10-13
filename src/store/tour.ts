import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAuthStore } from "./auth.ts";
import { tourSteps } from "../utils/tourSteps.ts";

type Phase = "idle" | "welcome" | "tour";
const key = (userId: number | string) => `pulsechat_tour_done:${userId}`;
const isDone = (userId: number | string) => {
  try {
    return localStorage.getItem(key(userId)) === "1";
  } catch {
    return false;
  }
};
const markDone = (userId: number | string) => {
  try {
    localStorage.setItem(key(userId), "1");
  } catch {

  }
};

export const useTourStore = defineStore("tour", () => {
  const phase = ref<Phase>("idle");
  const index = ref(0);
  const steps = tourSteps;
  const total = steps.length;

  const active = computed(() => phase.value !== "idle");
  const current = computed(() => (phase.value === "tour" ? (steps[index.value] ?? null) : null));
  const menuOpen = computed(() => !!current.value?.openMenu);

  const userId = () => useAuthStore().user?.id;

  function autoStart() {
    const id = userId();
    if (!id || phase.value !== "idle" || isDone(id)) return;
    phase.value = "welcome";
  }

  function begin() {
    index.value = 0;
    phase.value = "tour";
  }

  function restart() {
    index.value = 0;
    phase.value = "tour";
  }

  function next() {
    if (index.value < total - 1) index.value++;
    else close();
  }

  function back() {
    if (index.value > 0) index.value--;
  }

  
  function skip() {
    close();
  }

  function close() {
    const id = userId();
    if (id) markDone(id);
    phase.value = "idle";
    index.value = 0;
  }

 
  function reset() {
    phase.value = "idle";
    index.value = 0;
  }

  return { phase, index, steps, total, active, current, menuOpen, autoStart, begin, restart, next, back, skip, reset };
});