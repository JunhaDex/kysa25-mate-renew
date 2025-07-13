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
    const token = ref<string>('')
    return {
      ui,
      token
    }
  },
  { persist: true },
)
