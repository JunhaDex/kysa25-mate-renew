import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Friend } from '@/types/friend.type.ts'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const ui = ref<{
      isDark: boolean
    }>({
      isDark: false,
    })
    const token = ref<string>('')
    const myInfo = ref<Friend>()
    return {
      ui,
      token,
      myInfo,
    }
  },
  { persist: true },
)
