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

const authStore = useAuthStore()
onMounted(() => {
  console.log('App mounted')
})
</script>
