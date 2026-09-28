import { ref } from 'vue'

// module-level => the header (MainLayout) and the page (ChatView) share the same value
const query = ref('')

export function useSearch() {
  return { query }
}