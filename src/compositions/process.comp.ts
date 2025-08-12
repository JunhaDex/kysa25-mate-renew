import { ref } from 'vue'

export function useLockHandler() {
  const isLocked = ref(false)

  async function lockProcess<T>(process: () => Promise<T>) {
    if (isLocked.value) return
    try {
      isLocked.value = true
      return await process()
    } catch (e) {
      throw e
    } finally {
      isLocked.value = false
    }
  }

  return { isLocked, lockProcess }
}
