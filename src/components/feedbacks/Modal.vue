<template>
  <div class="modal-wrap" :class="{ show: isOpen }">
    <slot />
  </div>
  <div v-if="isOpen" class="s-backdrop" @click="() => emit('closeModal')"></div>
</template>
<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()
watch(
  () => props.isOpen,
  (changed) => {
    const container = document.getElementById('AppContainer')
    if (changed) {
      container?.classList.add('no-scroll')
    } else {
      container?.classList.remove('no-scroll')
    }
  },
)
const emit = defineEmits(['closeModal'])
</script>
<style scoped>
.modal-wrap {
  position: fixed;
  opacity: 0;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 12;
  transition: all 0.3s ease;

  &.show {
    opacity: 1;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
