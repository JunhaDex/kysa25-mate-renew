<template>
  <main :class="authStore.ui.isDark ? 'theme-dark' : 'theme-light'">
    <div class="screen" id="AppContainer">
      <RouterView />
    </div>
    <sub>
      <Toast />
    </sub>
  </main>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import Toast from '@/components/feedbacks/Toast.vue'
import { FirebaseProvider } from '@/providers/firebase.provider.ts'
import { useUiStore } from '@/stores/ui.store.ts'


const authStore = useAuthStore()
const uiStore = useUiStore()
const firebase = new FirebaseProvider()
onMounted(async () => {
  try {
    const fcm = await firebase.getUserToken()
    if(fcm) {
      authStore.fcm = fcm
      firebase.setupMessageListener(() => {
        uiStore.showToast('새로운 메시지가 도착했습니다.', 'message')
      })
    }
  } catch (e) {
    console.error(e)
  }
})
</script>
