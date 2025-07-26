<template>
  <header class="s-header">
    <div class="header-left">
      <ArrowLeft v-if="hasBack" :size="24" color="var(--color-tx-gray-3)" @click="router.back()" />
      <div v-else class="brand-logo">
        <img src="@/assets/images/logo_mate.png" alt="app-logo" />
      </div>
      <h1 v-if="title" class="text-lg font-bold leading-[24px] ml-4">{{ title }}</h1>
    </div>
    <div class="header-right">
      <template v-if="hasAuth">
        <Bell :size="24" />
        <Menu :size="24" @click="() => (isMenuOpen = true)" />
      </template>
      <template v-else>
        <button class="s-btn btn-primary" @click="() => router.push('/login')">로그인</button>
      </template>
    </div>
  </header>
  <!--Menu-->
  <SideMenu :is-open="isMenuOpen" @close="() => (isMenuOpen = false)" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Menu, ArrowLeft } from 'lucide-vue-next'
import SideMenu from '@/components/display/SideMenu.vue'

const props = defineProps<{
  hasBack?: boolean
  title?: string
}>()
const hasAuth = ref(true)
const isMenuOpen = ref(false)
const router = useRouter()
</script>
<style scoped>
.s-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-background-1);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
