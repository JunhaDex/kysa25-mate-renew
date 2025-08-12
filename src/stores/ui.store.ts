import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToastMessage } from '@/types/common.type.ts'

export const useUiStore = defineStore('ui', () => {
  const toastList = ref<ToastMessage[]>([])

  function showToast(message: string, type?: 'success' | 'error' | 'info' | 'message') {
    toastList.value.push({ id: Date.now(), message: message, type: type || 'info' })
  }

  return {
    toastList,
    showToast,
  }
})
