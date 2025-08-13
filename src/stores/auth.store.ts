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
    const fcm = ref<string>('')
    const device = ref<string>('')
    const myInfo = ref<Friend>()
    const ticket = ref<number>(0)
    return {
      ui,
      token,
      fcm,
      device,
      myInfo,
      ticket,
    }
  },
  { persist: true },
)
