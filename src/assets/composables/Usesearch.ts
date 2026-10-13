import { ref } from 'vue'
const query = ref('')

export function useSearch() {
  return { query }
}