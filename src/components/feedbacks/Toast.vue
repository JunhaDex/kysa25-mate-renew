<template>
  <div class="s-toast" :class="{ show: isShow }">
    <span class="toast-icon">
      <Check :size="16" />
    </span>
    <p class="flex-1 font-semibold text-sm">{{ currentMessage?.message ?? '' }}</p>
  </div>
</template>
<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui.store.ts'
import { computed, ref, watch } from 'vue'
import type { ToastMessage } from '@/types/common.type.ts'

const uiStore = useUiStore()
const currentMessage = ref<ToastMessage>()
watch(
  () => uiStore.toastList.length,
  () => {
    if (currentMessage.value === undefined) {
      setCurrentMessage(uiStore.toastList[0])
    }
  },
)
const isShow = computed<boolean>(() => currentMessage.value !== undefined)

function setCurrentMessage(message: ToastMessage) {
  currentMessage.value = message
  uiStore.toastList = uiStore.toastList.filter((m) => m.id !== message.id)
  setTimeout(() => {
    currentMessage.value = undefined
  }, 3000)
}
</script>
<style scoped>
.s-toast {
  position: fixed;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  left: 50%;
  bottom: -48px;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: var(--color-white);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  z-index: 12;
  min-width: 180px;
  transition: all 0.3s ease-in;

  &.show {
    transform: translateY(calc(-100px - 1rem)) translateX(-50%);
    opacity: 1;
  }
}

.toast-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  background-color: var(--color-white);
  border-radius: 50%;
}
</style>
