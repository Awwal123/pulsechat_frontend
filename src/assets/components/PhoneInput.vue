<template>
  <div class="flex items-center gap-3 border-b-2 border-text-primary focus-within:border-[#0891B2] pb-2 transition-colors">
    <div class="shrink-0 relative">
      <button 
        @click="toggleDropdown"
        class="flex items-center gap-2 px-3 py-2  rounded-lg hover:bg-(--color-surface-secondary) transition-colors"
      >
        <img 
          :src="getFlagUrl(selectedCountry)" 
          :alt="selectedCountry"
          class="w-6 h-4 rounded object-cover"
          @error="handleFlagError"
        />

        <svg class="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
      <div 
        v-if="isDropdownOpen"
        class="absolute top-full left-0 mt-1 bg-(--color-surface) border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto min-w-32"
      >
        <button
          v-for="country in countries"
          :key="country.code"
          @click="selectCountry(country)"
          class="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-(--color-surface-secondary)"
        >
          <img 
            :src="getFlagUrl(country.code)" 
            class="w-5 h-3 rounded object-cover"
          />
          <span class="text-sm">{{ country.code }}</span>
        </button>
      </div>
    </div>
    <span class="text-text-secondary text-sm whitespace-nowrap">
      (+{{ countryDialCode }})
    </span>

    <input
      v-model="phoneNumber"
      type="tel"
      :placeholder="placeholder"
      class="flex-1 bg-transparent outline-none text-text-primary placeholder-text-secondary"
    />
  </div>

  <div 
    v-if="isDropdownOpen" 
    @click="isDropdownOpen = false" 
    class="fixed inset-0 z-40"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const phoneNumber = ref('')
const selectedCountry = ref('NG')
const isDropdownOpen = ref(false)
const placeholder = ref('801 234 5678')

const countries = ref([
  { code: 'NG', dialCode: '234', name: 'Nigeria' },
  { code: 'GB', dialCode: '44', name: 'United Kingdom' },
  { code: 'US', dialCode: '1', name: 'United States' },
  { code: 'CA', dialCode: '1', name: 'Canada' },
  { code: 'AU', dialCode: '61', name: 'Australia' },
  { code: 'DE', dialCode: '49', name: 'Germany' },
  { code: 'FR', dialCode: '33', name: 'France' },
  { code: 'IT', dialCode: '39', name: 'Italy' },
  { code: 'ES', dialCode: '34', name: 'Spain' },
  { code: 'NL', dialCode: '31', name: 'Netherlands' },
  { code: 'SE', dialCode: '46', name: 'Sweden' },
  { code: 'CH', dialCode: '41', name: 'Switzerland' },
  { code: 'JP', dialCode: '81', name: 'Japan' },
  { code: 'CN', dialCode: '86', name: 'China' },
  { code: 'IN', dialCode: '91', name: 'India' },
  { code: 'BR', dialCode: '55', name: 'Brazil' },
  { code: 'MX', dialCode: '52', name: 'Mexico' },
  { code: 'ZA', dialCode: '27', name: 'South Africa' },
  { code: 'SG', dialCode: '65', name: 'Singapore' },
  { code: 'HK', dialCode: '852', name: 'Hong Kong' },
  { code: 'AE', dialCode: '971', name: 'United Arab Emirates' },
  { code: 'KE', dialCode: '254', name: 'Kenya' },
  { code: 'GH', dialCode: '233', name: 'Ghana' },
  { code: 'UG', dialCode: '256', name: 'Uganda' },
  { code: 'EG', dialCode: '20', name: 'Egypt' },
  { code: 'MA', dialCode: '212', name: 'Morocco' },
  { code: 'PK', dialCode: '92', name: 'Pakistan' },
  { code: 'BD', dialCode: '880', name: 'Bangladesh' },
  { code: 'TH', dialCode: '66', name: 'Thailand' },
  { code: 'MY', dialCode: '60', name: 'Malaysia' },
  { code: 'ID', dialCode: '62', name: 'Indonesia' },
  { code: 'PH', dialCode: '63', name: 'Philippines' },
  { code: 'VN', dialCode: '84', name: 'Vietnam' },
  { code: 'KR', dialCode: '82', name: 'South Korea' },
])

const countryDialCode = computed(() => {
  const country = countries.value.find(c => c.code === selectedCountry.value)
  return country?.dialCode || '234'
})

const getFlagUrl = (code: string) =>
  `https://flagcdn.com/16x12/${code.toLowerCase()}.png`

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectCountry = (country: any) => {
  selectedCountry.value = country.code
  isDropdownOpen.value = false
}

const handleFlagError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
div {
  transition: opacity 0.2s ease;
}
</style>``