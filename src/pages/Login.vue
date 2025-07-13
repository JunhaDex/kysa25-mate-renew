<template>
  <div class="s-safe-area login-layout bg-background-2">
    <div class="s-card login-card">
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
  height: calc(100% - 57px);
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
