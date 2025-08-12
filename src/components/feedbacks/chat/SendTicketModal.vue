<template>
  <div class="lottie-wrap" :class="{ hidden: !isOpen || step !== 'result' }">
    <div class="content-area">
      <Vue3Lottie
        :animationData="Confetti"
        :loop="true"
        :auto-play="false"
        class="lottie-bg"
        ref="LottieRef"
      />
    </div>
  </div>
  <div class="modal-wrap" :class="{ show: isOpen && step === 'info' }" @close-modal="emit('close')">
    <div class="s-modal p-4">
      <h2 class="text-lg font-bold mb-4">관심 알림 보내기</h2>
      <p>
        관심 알림을 보내면 <b class="font-semibold">{{ target.nickname }}</b> 님에게
      </p>
      <div class="chat-sample my-4">
        <div class="chat chat-start">
          <div class="chat-image chat-profile profile-md"></div>
          <div class="ticket-send ticket-send-start">
            <div class="text-center text-xs">
              <span>
                <b class="font-semibold"> {{ me?.nickname ?? '' }} </b>
                님이 호감을 표현했습니다.
              </span>
              <br />
              <span>나도 호감을 표현해볼까요?</span><br />
              <button class="s-btn btn-primary btn-sm mt-4">호감보내기에 답하기</button>
            </div>
          </div>
        </div>
      </div>
      <p>
        라는 알림과 메세지가 표시됩니다. <b class="font-semibold">{{ target.nickname }}</b> 님에게
        관심 알림을 보낼까요?
      </p>
      <div class="mt-6 mb-2 text-sm font-semibold text-shadow-tx-gray-3 text-right">
        오늘 남은 관심보내기 {{ authStore.ticket }} 개
      </div>
      <div class="flex justify-between items-center gap-4">
        <button class="s-btn btn-secondary w-full block" @click="emit('close')">취소</button>
        <button class="s-btn btn-primary w-full block" @click="sendTicket" :disabled="isLocked">
          <span v-if="isLocked" class="icon icon-loading" />
          <span v-else>호감 보내기</span>
        </button>
      </div>
    </div>
  </div>
  <div
    class="modal-wrap"
    :class="{ show: isOpen && step === 'result' }"
    @close-modal="emit('close')"
  >
    <div class="s-modal p-4">
      <h2 class="text-lg font-bold mb-4">관심 알림 전송완료</h2>
      <p>
        <b class="font-semibold">{{ target.nickname }}</b
        >님에게 호감을 보냈습니다! 🎉 <br />좋은 소식이 있을지도?
      </p>
      <div class="mt-6 mb-2 text-sm font-semibold text-shadow-tx-gray-3 text-right">
        오늘 남은 호감보내기 {{ authStore.ticket }}개
      </div>
      <div class="flex justify-between items-center gap-4">
        <button class="s-btn btn-primary w-full block" @click="emit('close')">닫기</button>
      </div>
    </div>
  </div>
  <div v-if="isOpen" class="s-backdrop" @click="() => emit('close')"></div>
</template>
<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import type { UserProfile } from '@/types/friend.type.ts'
import { useAuthStore } from '@/stores/auth.store.ts'
import Confetti from '@/assets/lottie/confetti_main.json'
import { Vue3Lottie } from 'vue3-lottie'
import { useLockHandler } from '@/compositions/process.comp.ts'
import { ChatService } from '@/services/chat.service.ts'

const authStore = useAuthStore()
const chatSvc = new ChatService()
const { isLocked, lockProcess } = useLockHandler()
const props = defineProps<{
  isOpen: boolean
  target: UserProfile
}>()
const emit = defineEmits(['close'])
const step = ref<'info' | 'result'>('info')
const lottie = useTemplateRef<typeof Vue3Lottie>('LottieRef')
const me = computed(() => authStore.myInfo)
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      step.value = 'info'
    }
  },
)
watch(
  () => step.value,
  (newVal) => {
    if (lottie.value) {
      if (newVal === 'result') {
        lottie.value.play()
      } else {
        lottie.value.stop()
      }
    }
  },
)

async function sendTicket() {
  await lockProcess(async () => {
    await chatSvc.sendTicket(props.target.ref)
    authStore.ticket = await chatSvc.countTicketRemain()
  })
  step.value = 'result'
}
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

.chat-sample {
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-default);
  padding: 0.8rem;
  pointer-events: none;
}

.chat-sample * {
  pointer-events: none;
}

.chat-profile {
  border-radius: 50%;
  overflow: hidden;
}

.ticket-send {
  position: relative;
  display: block;
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 1rem;
  border: 1px solid var(--color-border-default);
  background-color: var(--color-bg-primary);
}

.ticket-send-start {
  border-radius: 0 1rem 1rem 1rem;
}

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
