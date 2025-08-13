import { ref } from 'vue'

export function useLoadHandler() {
  const isReady = ref(false)

  function setReady() {
    isReady.value = true
  }

  return { isReady, setReady }
}
