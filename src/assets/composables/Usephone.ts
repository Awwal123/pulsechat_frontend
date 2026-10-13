import { computed, ref } from 'vue'


const digits = ref('') 
const otpVerified = ref(false) 
const PHONE_LENGTH = 10

export function usePhone() {
  const formatted = computed(() => {
    const d = digits.value
    return [d.slice(0, 2), d.slice(2, 6), d.slice(6, 10)].filter(Boolean).join(' ')
  })
  const isValid = computed(() => digits.value.length === PHONE_LENGTH)
  return { digits, formatted, isValid, otpVerified, PHONE_LENGTH }
}