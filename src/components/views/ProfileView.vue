<template>
  <MainLayout activeTab="profile">
    <div class="flex flex-col items-center px-5 pb-8 pt-8">
      <!-- avatar -->
      <div class="relative">
        <img
          :src="previewUrl || profile.avatar"
          alt="Profile photo"
          class="h-36 w-36 rounded-full border-4 border-white object-cover shadow-md"
        />
        <div
          v-if="changingPhoto"
          class="absolute inset-0 flex animate-pulse items-center justify-center rounded-full bg-black/40 text-xs font-semibold text-white"
        >
          Uploading…
        </div>
        <button
          type="button"
          aria-label="Change photo"
          class="absolute right-1 top-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-accent text-white shadow-md ring-2 ring-page transition-transform active:scale-95"
          @click="fileInput?.click()"
        >
          <PencilIcon class="h-4 w-4" />
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onPhotoPicked"
        />
      </div>

      <h2 class="mt-6 text-2xl font-bold text-text-primary">
        {{ profile.name }}
      </h2>

      <!-- info rows -->
      <ul class="mt-8 w-full space-y-1">
        <li
          v-for="row in rows"
          :key="row.key"
          class="flex items-center gap-3 py-2.5"
        >
          <p class="min-w-0 flex-1 truncate text-[15px]">
            <span class="font-medium text-text-secondary"
              >{{ row.label }} :</span
            >
            <span
              class="ml-2 font-semibold text-text-primary"
              >{{ row.value }}</span
            >
          </p>
          <button
            type="button"
            :aria-label="`Copy ${row.label.toLowerCase()}`"
            class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-chip hover:text-text-primary"
            @click="copy(row.key, row.value)"
          >
            <CheckIcon
              v-if="copiedKey === row.key"
              class="h-5 w-5 text-accent"
            />
            <ClipboardDocumentIcon v-else class="h-5 w-5" />
          </button>
        </li>
      </ul>

      <!-- actions -->
      <div class="mt-6 w-full space-y-3">
        <button
          type="button"
          class="flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-b from-accent to-accent-dark py-3.5 text-[15px] font-semibold text-white shadow-md transition-all active:scale-[0.98]"
          @click="openEdit"
        >
          <PencilSquareIcon class="h-5 w-5" />
          Edit Profile
        </button>

        <button
          type="button"
          :disabled="loggingOut"
          class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-danger/10 py-3.5 text-[15px] font-semibold text-danger transition-all hover:bg-danger/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          @click="logout"
        >
          <ArrowRightOnRectangleIcon class="h-5 w-5" />
          {{ loggingOut ? 'Logging out…' : 'Logout' }}
        </button>
      </div>
    </div>

    <!-- edit sheet -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition duration-200"
        leave-to-class="opacity-0"
      >
        <div
          v-if="editing"
          class="fixed inset-0 z-50 bg-black/50"
          @click="closeEdit"
        />
      </Transition>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-full"
        leave-active-class="transition duration-200 ease-in"
        leave-to-class="translate-y-full"
      >
        <form
          v-if="editing"
          class="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-sheet px-5 pb-6 pt-3 shadow-2xl"
          novalidate
          @submit.prevent="save"
          @keydown.esc="closeEdit"
        >
          <div class="mx-auto h-1 w-12 rounded-full bg-text-secondary/40" />
          <h3
            class="mb-5 mt-3 text-center text-[15px] font-semibold text-text-primary"
          >
            Edit Profile
          </h3>

          <div class="space-y-4">
            <!-- name -->
            <div>
              <label
                for="p-name"
                class="mb-1.5 block text-sm text-text-secondary"
                >Name</label
              >
              <input
                id="p-name"
                v-model="draft.name"
                type="text"
                autocomplete="name"
                :class="[fieldClass, nameError ? 'border-danger' : 'border-text-secondary/40 focus:border-accent']"
              />
              <p v-if="nameError" class="mt-1 text-xs text-danger">
                {{ nameError }}
              </p>
            </div>

            <!-- phone (locked) -->
            <div>
              <label
                for="p-phone"
                class="mb-1.5 block text-sm text-text-secondary"
                >Phone Number</label
              >
              <div
                class="flex h-12 cursor-not-allowed items-center gap-3 rounded-xl border border-text-secondary/30 bg-field/50 px-4 opacity-60"
              >
                <svg
                  class="h-5 w-7 shrink-0 rounded-sm"
                  viewBox="0 0 60 30"
                  aria-hidden="true"
                >
                  <clipPath id="uk-s">
                    <path d="M0,0 v30 h60 v-30 z" />
                  </clipPath>
                  <clipPath id="uk-t">
                    <path
                      d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"
                    />
                  </clipPath>
                  <g clip-path="url(#uk-s)">
                    <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                    <path
                      d="M0,0 L60,30 M60,0 L0,30"
                      stroke="#fff"
                      stroke-width="6"
                    />
                    <path
                      d="M0,0 L60,30 M60,0 L0,30"
                      clip-path="url(#uk-t)"
                      stroke="#C8102E"
                      stroke-width="4"
                    />
                    <path
                      d="M30,0 v30 M0,15 h60"
                      stroke="#fff"
                      stroke-width="10"
                    />
                    <path
                      d="M30,0 v30 M0,15 h60"
                      stroke="#C8102E"
                      stroke-width="6"
                    />
                  </g>
                </svg>
                <span class="text-sm text-text-secondary">(+234)</span>
                <input
                  id="p-phone"
                   :value="nationalPhone"
                  type="tel"
                  disabled
                  class="w-full min-w-0 cursor-not-allowed bg-transparent text-[15px] text-text-primary outline-none"
                />
                <LockClosedIcon class="h-4 w-4 shrink-0 text-text-secondary" />
              </div>
              <p class="mt-1 text-xs text-text-secondary">
                Phone number can't be changed.
              </p>
            </div>

            <!-- gender -->
            <div>
              <label
                for="p-gender"
                class="mb-1.5 block text-sm text-text-secondary"
                >Gender</label
              >
              <div class="relative">
                <select
                  id="p-gender"
                  v-model="draft.gender"
                  :class="[fieldClass, 'appearance-none border-text-secondary/40 pr-11 focus:border-accent']"
                >
                  <option v-for="g in genders" :key="g" :value="g">
                    {{ g }}
                  </option>
                </select>
                <ChevronDownIcon
                  class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
                />
              </div>
            </div>

            <!-- birthday -->
            <div>
              <label
                for="p-birthday"
                class="mb-1.5 block text-sm text-text-secondary"
                >Birthday</label
              >
              <div class="relative">
                <input
                  id="p-birthday"
                  v-model="draft.birthday"
                  type="date"
                  :max="today"
                  :class="[
                    fieldClass,
                    'border-text-secondary/40 pr-11 focus:border-accent',
                    '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0',
                  ]"
                />
                <CalendarDaysIcon
                  class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary"
                />
              </div>
            </div>

            <!-- email -->
            <div>
              <label
                for="p-email"
                class="mb-1.5 block text-sm text-text-secondary"
                >Email</label
              >
              <input
                id="p-email"
                v-model="draft.email"
                type="email"
                autocomplete="email"
                :class="[fieldClass, emailError ? 'border-danger' : 'border-text-secondary/40 focus:border-accent']"
              />
              <p v-if="emailError" class="mt-1 text-xs text-danger">
                {{ emailError }}
              </p>
            </div>
          </div>

          <div class="mt-7 flex gap-3">
            <button
              type="button"
              :disabled="updatingProfile"
              class="h-13 flex-1 cursor-pointer rounded-full bg-white py-3.5 text-[15px] font-semibold text-accent transition-all active:scale-95 disabled:opacity-50"
              @click="closeEdit"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!canSave || updatingProfile"
              class="h-13 flex-1 rounded-full bg-linear-to-b from-accent to-accent-dark py-3.5 text-[15px] font-semibold text-white shadow-md transition-all"
              :class="canSave && !updatingProfile ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-50'"
            >
              {{ updatingProfile ? 'Saving…' : 'Save' }}
            </button>
          </div>
        </form>
      </Transition>
    </Teleport>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import {
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  LockClosedIcon,
  PencilIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline'
import MainLayout from '../layout/MainLayout.vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../store/auth.ts'

interface Profile {
  name: string
  phone: string
  gender: string
  birthday: string // ISO yyyy-mm-dd
  email: string
  avatar: string
}

const router = useRouter()
const auth = useAuthStore()
const { user, updatingProfile, loggingOut } = storeToRefs(auth)

const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

// now comes from the store instead of mock data
const profile = computed<Profile>(() => ({
  name: user.value?.name ?? '',
  phone: user.value?.phone ?? '',
  gender: capitalize(user.value?.gender),
  birthday: user.value?.birthday?.slice(0, 10) ?? '',
  email: user.value?.email ?? '',
  avatar: user.value?.profile_picture ?? '',
}))

const nationalPhone = computed(() => profile.value.phone.replace(/^0/, ''))

const genders = ['Male', 'Female',]
const today = new Date().toISOString().slice(0, 10)

const fieldClass =
  'h-12 w-full rounded-xl border bg-transparent px-4 text-[15px] text-text-primary outline-none transition-colors'

/* ── display rows ─────────────────────────────────── */
const formatDate = (iso: string) => (iso ? iso.split('-').reverse().join('/') : '—')

const rows = computed(() => [
  { key: 'phone', label: 'Phone', value: `(+234) ${nationalPhone.value}` },
  { key: 'gender', label: 'Gender', value: profile.value.gender || '—' },
  { key: 'birthday', label: 'Birthday', value: formatDate(profile.value.birthday) },
  { key: 'email', label: 'Email', value: profile.value.email || '—' },
])

/* ── copy to clipboard ────────────────────────────── */
const copiedKey = ref<string | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const copy = async (key: string, value: string) => {
  try {
    await navigator.clipboard.writeText(value)
    copiedKey.value = key
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copiedKey.value = null), 1500)
  } catch {
    /* clipboard blocked (e.g. non-HTTPS): ignore */
  }
}

/* ── avatar: upload, then save the URL to the profile ─ */
const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const changingPhoto = ref(false)

const onPhotoPicked = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = '' // lets the user pick the same file again
  if (!file || changingPhoto.value) return

  changingPhoto.value = true
  previewUrl.value = URL.createObjectURL(file) // instant preview while uploading
  try {
    const url = await auth.uploadPhoto(file)
    if (url) await auth.updateProfile({ profile_picture: url })
  } finally {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
    changingPhoto.value = false
  }
}

onBeforeUnmount(() => {
  clearTimeout(copyTimer)
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

/* ── edit sheet ───────────────────────────────────── */
const editing = ref(false)
const draft = ref<Profile>({ ...profile.value })

const openEdit = () => {
  draft.value = { ...profile.value }
  editing.value = true
}
const closeEdit = () => {
  if (updatingProfile.value) return
  editing.value = false
}

const nameError = computed(() => (draft.value.name.trim() ? '' : 'Name is required'))
const emailError = computed(() => {
  const email = draft.value.email.trim()
  if (!email) return 'Email is required'
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email'
})
const canSave = computed(() => !nameError.value && !emailError.value)

const save = async () => {
  if (!canSave.value || updatingProfile.value) return
  const ok = await auth.updateProfile({
    name: draft.value.name.trim(),
    email: draft.value.email.trim(),
    gender: draft.value.gender.toLowerCase(), // API uses "male"
    birthday: draft.value.birthday,
    // phone is intentionally never sent
  })
  if (ok) editing.value = false
}

const logout = async () => {
  if (loggingOut.value) return
  await auth.signOut()
  router.replace('/login') // use your login route
}
</script>
