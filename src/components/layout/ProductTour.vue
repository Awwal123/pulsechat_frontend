<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="phase === 'welcome'"
        class="fixed inset-0 z-100 flex items-center justify-center bg-black/60 px-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-welcome-title"
      >
        <div class="w-full max-w-sm rounded-3xl bg-sheet p-6 text-center shadow-2xl">
          <div
            class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-b from-accent to-accent-dark text-white shadow-md"
          >
            <ChatBubbleOvalLeftEllipsisIcon class="h-9 w-9" />
          </div>
          <h2 id="tour-welcome-title" class="mt-5 text-xl font-bold text-text-primary">
            Welcome to Pulse Chat 👋
          </h2>
          <p class="mt-2 text-[15px] leading-relaxed text-text-secondary">
            We'll show you around the main features in about a minute. You can replay this tour any time from More.
          </p>
          <div class="mt-6 flex flex-col gap-3">
            <button
              ref="startBtn"
              type="button"
              class="h-12 cursor-pointer rounded-full bg-linear-to-b from-accent to-accent-dark text-[15px] font-semibold text-white shadow-md transition-all active:scale-95"
              @click="tour.begin()"
            >
              Get Started
            </button>
            <button
              type="button"
              class="h-12 cursor-pointer rounded-full bg-chip text-[15px] font-semibold text-text-primary transition-all active:scale-95"
              @click="tour.skip()"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </Transition>
    <template v-if="phase === 'tour' && current">
      <div class="fixed inset-0 z-100" :class="rect ? '' : 'bg-black/60'" @click.stop />
      <div v-if="rect" class="pointer-events-none fixed z-101" :style="spotStyle" />
      <div
        ref="tipEl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        class="fixed z-102 rounded-2xl bg-sheet p-4 shadow-2xl transition-opacity duration-150"
        :class="ready ? 'opacity-100' : 'opacity-0'"
        :style="tipStyle"
      >
        <span v-if="rect" class="absolute h-3 w-3 rotate-45 bg-sheet" :style="arrowStyle" />

        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold text-text-secondary">Step {{ index + 1 }} of {{ total }}</p>
          <button
            type="button"
            class="cursor-pointer text-xs font-semibold text-text-secondary underline-offset-2 hover:text-text-primary hover:underline"
            @click="tour.skip()"
          >
            Skip Tour
          </button>

        </div>
        <h3 id="tour-title" class="mt-2 text-base font-bold text-text-primary">{{ current.title }}</h3>
        <p class="mt-1 text-[14px] leading-relaxed text-text-secondary">{{ current.body }}</p>
        <div
          v-if="current.preview === 'composer'"
          class="mt-3 flex items-center gap-2 rounded-xl bg-page p-2 ring-1 ring-text-secondary/20"
          aria-hidden="true"
        >
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-chip text-accent">
            <PlusIcon class="h-5 w-5" />
          </span>
          <span class="flex h-9 min-w-0 flex-1 items-center rounded-lg bg-field px-3 text-[13px] text-text-secondary/70">
            Type a message ...
          </span>
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-accent to-accent-dark text-white"
          >
            <PaperAirplaneIcon class="-mt-0.5 ml-0.5 h-4 w-4 -rotate-45" />
          </span>
        </div>
        <div
          class="mt-4 flex items-center justify-center gap-1.5"
          role="progressbar"
          :aria-valuenow="index + 1"
          aria-valuemin="1"
          :aria-valuemax="total"
        >
          <span
            v-for="(_, i) in total"
            :key="i"
            class="h-1.5 rounded-full transition-all duration-200"
            :class="i === index ? 'w-5 bg-accent' : i < index ? 'w-1.5 bg-accent/50' : 'w-1.5 bg-text-secondary/30'"
          />
        </div>

        <div class="mt-4 flex gap-3">
          <button
            v-if="index > 0"
            type="button"
            class="h-11 flex-1 cursor-pointer rounded-full bg-chip text-[14px] font-semibold text-text-primary transition-all active:scale-95"
            @click="tour.back()"
          >
            Back
          </button>
          <button
            ref="nextBtn"
            type="button"
            class="h-11 flex-1 cursor-pointer rounded-full bg-linear-to-b from-accent to-accent-dark text-[14px] font-semibold text-white shadow-md transition-all active:scale-95"
            @click="tour.next()"
          >
            {{ index === total - 1 ? 'Finish' : 'Next' }}
          </button>
        </div>
      </div>
    </template>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { ChatBubbleOvalLeftEllipsisIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { PaperAirplaneIcon } from '@heroicons/vue/24/solid'
import { useTourStore } from '../../store/tour.ts'
import { useAuthStore } from '../../store/auth.ts'

const DASHBOARD = '/chats' 
const PAD = 8 
const GAP = 12 
const MARGIN = 12 

const tour = useTourStore()
const auth = useAuthStore()
const route = useRoute()
const { phase, index, current, total } = storeToRefs(tour)

const startBtn = ref<HTMLButtonElement | null>(null)
const nextBtn = ref<HTMLButtonElement | null>(null)
const tipEl = ref<HTMLElement | null>(null)

const rect = ref<{ top: number; left: number; width: number; height: number } | null>(null)
const radius = ref(16)
const tip = ref({ top: 0, left: 0, arrow: 24, placement: 'bottom' as 'top' | 'bottom' | 'center' })
const ready = ref(false)

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), Math.max(min, max))
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const isVisible = (el: Element) => el.getClientRects().length > 0

const query = (selectors: string[]) => {
  for (const s of selectors) {
    const el = document.querySelector<HTMLElement>(s)
    if (el && isVisible(el)) return el
  }
  return null
}

const waitFor = (selectors: string[], timeout = 1800) =>
  new Promise<HTMLElement | null>((resolve) => {
    const start = performance.now()
    const tick = () => {
      const el = query(selectors)
      if (el) return resolve(el)
      if (performance.now() - start > timeout) return resolve(null)
      setTimeout(tick, 60)
    }
    tick()
  })


let target: HTMLElement | null = null
let observer: ResizeObserver | null = null
let raf = 0
let token = 0 

function measure() {
  if (phase.value !== 'tour') return
  if (target && document.contains(target)) {
    const r = target.getBoundingClientRect()
    rect.value = {
      top: r.top - PAD,
      left: r.left - PAD,
      width: r.width + PAD * 2,
      height: r.height + PAD * 2,
    }
    radius.value = (parseFloat(getComputedStyle(target).borderRadius) || 12) + PAD
  } else {
    rect.value = null
  }
  place()
}

function place() {
  const el = tipEl.value
  if (!el) return
  const vw = window.innerWidth
  const vh = window.innerHeight
  const tw = el.offsetWidth
  const th = el.offsetHeight
  const r = rect.value

  if (!r) {
    tip.value = {
      top: Math.max(MARGIN, (vh - th) / 2),
      left: Math.max(MARGIN, (vw - tw) / 2),
      arrow: 0,
      placement: 'center',
    }
    return
  }

  const below = vh - (r.top + r.height) - GAP - MARGIN
  const above = r.top - GAP - MARGIN
  const pref = current.value?.placement

  let placement: 'top' | 'bottom'
  if (pref === 'top' && above >= th) placement = 'top'
  else if (pref === 'bottom' && below >= th) placement = 'bottom'
  else placement = below >= th || below >= above ? 'bottom' : 'top'

  const top = placement === 'bottom' ? r.top + r.height + GAP : r.top - GAP - th
  const centerX = r.left + r.width / 2
  const left = clamp(centerX - tw / 2, MARGIN, vw - tw - MARGIN)

  tip.value = {
    top: clamp(top, MARGIN, vh - th - MARGIN),
    left,
    arrow: clamp(centerX - left, 22, tw - 22),
    placement,
  }
}

const schedule = () => {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(measure)
}

function detach() {
  observer?.disconnect()
  observer = null
  target = null
}

function cleanup() {
  token++
  detach()
  rect.value = null
  ready.value = false
}

async function showStep() {
  const step = current.value
  const mine = ++token
  ready.value = false
  rect.value = null
  detach()
  if (!step) return

  if (step.target) {
    const selectors = Array.isArray(step.target) ? step.target : [step.target]
    const el = await waitFor(selectors)
    if (mine !== token) return
    target = el
    if (el) {
      el.scrollIntoView({ block: 'center', inline: 'nearest' })
      observer = new ResizeObserver(schedule)
      observer.observe(el)
      await sleep(step.openMenu ? 260 : 40)
      if (mine !== token) return
    }
  }

  await nextTick()
  measure()
  ready.value = true
  nextBtn.value?.focus({ preventScroll: true })
}

const spotStyle = computed(() => ({
  top: `${rect.value?.top ?? 0}px`,
  left: `${rect.value?.left ?? 0}px`,
  width: `${rect.value?.width ?? 0}px`,
  height: `${rect.value?.height ?? 0}px`,
  borderRadius: `${radius.value}px`,
  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.62)',
  outline: '2px solid var(--color-accent)',
  transition: 'top .2s ease, left .2s ease, width .2s ease, height .2s ease',
}))

const tipStyle = computed(() => ({
  top: `${tip.value.top}px`,
  left: `${tip.value.left}px`,
  width: 'min(340px, calc(100vw - 24px))',
}))

const arrowStyle = computed(() => ({
  left: `${tip.value.arrow - 6}px`,
  [tip.value.placement === 'bottom' ? 'top' : 'bottom']: '-6px',
}))

watch(
  [phase, index],
  async () => {
    if (phase.value === 'welcome') {
      await nextTick()
      startBtn.value?.focus()
    }
    if (phase.value === 'tour') showStep()
    else cleanup()
  },
  { flush: 'post' },
)

let startTimer: number | undefined
watch(
  () => [route.path, auth.isAuthenticated] as const,
  ([path, authed]) => {
    clearTimeout(startTimer)
    if (phase.value !== 'idle' && path !== DASHBOARD) {
      tour.skip()
      return
    }
    if (authed && path === DASHBOARD) {
      startTimer = window.setTimeout(() => {
        if (route.path === DASHBOARD) tour.autoStart()
      }, 700)
    }
  },
  { immediate: true },
)

watch(
  () => auth.isAuthenticated,
  (ok) => {
    if (!ok) tour.reset()
  },
)

const onKey = (e: KeyboardEvent) => {
  if (phase.value === 'idle') return
  if (e.key === 'Escape') tour.skip()
  else if (phase.value === 'tour' && e.key === 'ArrowRight') tour.next()
  else if (phase.value === 'tour' && e.key === 'ArrowLeft') tour.back()
}

onMounted(() => {
  window.addEventListener('resize', schedule)
  window.addEventListener('scroll', schedule, true) 
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', schedule)
  window.removeEventListener('scroll', schedule, true)
  window.removeEventListener('keydown', onKey)
  clearTimeout(startTimer)
  cancelAnimationFrame(raf)
  cleanup()
})
</script>