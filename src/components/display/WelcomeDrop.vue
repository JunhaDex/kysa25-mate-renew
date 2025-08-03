<template>
  <div class="lottie-wrap" :class="{ hidden: !isOpen }">
    <div class="content-area">
      <Vue3Lottie :animationData="Confetti" :loop="false" :auto-play="false" class="lottie-bg" ref="LottieRef" />
      <div class="welcome-message text-center z-[12]">
        <h2 class="text-2xl font-bold mb-6 text-white">
          {{ authStore.myInfo?.nickname }} 님 <br />
          청년대회에 오신 것을 환영합니다!
        </h2>
        <button class="s-btn btn-primary" @click="emit('close')">닫기</button>
      </div>
    </div>
  </div>
  <div v-if="isOpen" class="s-backdrop"></div>
</template>
<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import Confetti from '@/assets/lottie/confetti_main.json'
import { useTemplateRef, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'

const props = defineProps<{
  isOpen: boolean
}>()
const authStore = useAuthStore()
const emit = defineEmits(['close'])
const lottie = useTemplateRef<typeof Vue3Lottie>('LottieRef')

watch(
  () => props.isOpen,
  (newVal) => {
    if (lottie.value) {
      if (newVal) {
        lottie.value.play()
      } else {
        lottie.value.stop()
      }
    }
  },
  { immediate: true },
)
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
</script>
<style scoped>
.lottie-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11;

  & .content-area {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 768px;
    min-height: 100vh;
    margin: 0 auto;
  }
}

.lottie-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
