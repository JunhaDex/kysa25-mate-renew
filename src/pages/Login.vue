<template>
  <div class="s-safe-area login-layout bg-background-2">
    <img class="bg-img" src="@/assets/images/login_bg.png" alt="background" />
    <div class="s-card login-card">
      <div class="mb-6 flex items-center">
        <div class="brand-logo mr-2">
          <img src="@/assets/images/logo_mate.png" alt="app-logo" />
        </div>
        <h1 class="leading-[24px] text-lg font-bold text-center">Mate 로그인</h1>
      </div>
      <div class="s-input-wrap mb-4">
        <label class="label title" for="loginUserId">아이디</label>
        <div class="s-input-box">
          <input
            v-model="userLoginInput.id"
            class="s-input-field"
            id="loginUserId"
            type="text"
            placeholder="아이디를 입력하세요."
          />
        </div>
      </div>
      <div class="s-input-wrap mb-6">
        <label class="label title" for="loginPassword">비밀번호</label>
        <div class="s-input-box">
          <input
            v-model="userLoginInput.pwd"
            class="s-input-field"
            id="loginPassword"
            type="password"
            placeholder="비밀번호를 입력하세요."
          />
        </div>
      </div>
      <button class="s-btn btn-primary w-full block" @click="login" :disabled="isLocked">
        <span v-if="isLocked" class="icon icon-loading" />
        <span v-else>로그인</span>
      </button>
      <p v-if="showErr" class="login-error text-tx-red text-sm mt-2">
        기본 계정은 아이디: 이름.생년 2자리 / 비밀번호: 생년월일 6자리 입니다. (예시: 아이디:
        홍길동.02 / 비밀번호: 020814)
      </p>
    </div>
  </div>
  <div class="bg-background-2">
    <Footer />
  </div>
</template>
<script setup lang="ts">
import Footer from '@/components/layouts/Footer.vue'
import { AuthService } from '@/services/auth.service.ts'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLockHandler } from '@/compositions/process.comp.ts'
import { useUiStore } from '@/stores/ui.store.ts'
import { ChatService } from '@/services/chat.service.ts'
import { useAuthStore } from '@/stores/auth.store.ts'

const authSvc = new AuthService()
const chatSvc = new ChatService()
const router = useRouter()
const uiStore = useUiStore()
const authStore = useAuthStore()
const { isLocked, lockProcess } = useLockHandler()
const userLoginInput = ref<{
  id: string
  pwd: string
}>({
  id: '',
  pwd: '',
})
const showErr = ref(false)

async function login() {
  showErr.value = false
  try {
    await lockProcess<void>(async () => {
      await authSvc.login({
        ...userLoginInput.value,
      })
      authStore.ticket = await chatSvc.countTicketRemain()
    })
    router.push('/')
  } catch (e) {
    showErr.value = true
    uiStore.showToast('로그인에 실패했습니다', 'error')
  }
}
</script>
<style scoped>
.login-layout {
  position: relative;
  height: calc(100% - 57px);
}

.bg-img {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
}

.login-card {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: end;
  width: calc(100% - 2rem);
  top: 50%;
  transform: translateY(-50%);
  animation: mounted 0.5s ease-in-out;
}

@keyframes mounted {
  from {
    opacity: 0;
    top: 80%;
  }
  to {
    opacity: 1;
    top: 50%;
  }
}
</style>
