import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToastMessage } from '@/types/common.type.ts'

export const useUiStore = defineStore('ui', () => {
  const toastList = ref<ToastMessage[]>([])

  function showToast(message: string) {
    toastList.value.push({ id: Date.now(), message: message })
  }

  return {
    toastList,
    showToast,
  }
})
