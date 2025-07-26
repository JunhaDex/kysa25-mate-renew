<template>
  <div class="s-safe-area login-layout bg-background-2">
    <img class="bg-img" src="@/assets/images/login_bg.jpg" alt="background" />
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
      <button class="s-btn btn-primary w-full block" @click="login">로그인</button>
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

const authSvc = new AuthService()
const router = useRouter()
const userLoginInput = ref<{
  id: string
  pwd: string
}>({
  id: '',
  pwd: '',
})

async function login() {
  await authSvc.login({
    ...userLoginInput.value,
  })
  router.push('/')
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
