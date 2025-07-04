<template>
  <main class="theme-dark">
    <div class="screen">
      <RouterView />
    </div>
  </main>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('App mounted')
})
</script>
