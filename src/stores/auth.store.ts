import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const ui = ref<{
      isDark: boolean
    }>({
      isDark: false,
    })
    return {
      ui,
    }
  },
  { persist: true },
)
