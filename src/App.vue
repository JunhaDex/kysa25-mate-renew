<template>
  <main :class="authStore.ui.isDark ? 'theme-dark' : 'theme-light'">
    <div class="screen">
      <RouterView />
    </div>
  </main>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'

const authStore = useAuthStore()
onMounted(() => {
  console.log('App mounted')
})
</script>
