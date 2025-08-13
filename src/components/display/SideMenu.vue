<template>
  <div class="side-menu" :class="{ open: isOpen }">
    <div class="menu-content">
      <div class="menu-top-place">
        <div class="brand-logo">
          <img src="@/assets/images/logo_mate.png" alt="app-logo" />
        </div>
      </div>
      <div v-if="authStore.myInfo" class="menu-user-profile">
        <div class="profile-image">
          <img
            :src="authStore.myInfo.profileImg"
            alt="user-profile"
            @error="(e) => ((e.target! as HTMLImageElement).src = ProfileDefault)"
          />
        </div>
        <div class="profile-info">
          <h3 class="text-lg font-bold">
            {{ authStore.myInfo.nickname }}
          </h3>
        </div>
        <Settings :size="24" @click="router.push('/user/profile')" />
      </div>
      <div v-else class="login mb-4">
        <button class="s-btn btn-primary w-full block" @click="goLogin">
          <span class="text-sm font-semibold">로그인</span>
        </button>
      </div>
      <ul class="menu-list">
        <li class="menu-item" @click="() => goMenu('/')">
          <Home :size="24" />
          <span class="menu-text">메인 페이지</span>
        </li>
        <li class="menu-item" @click="() => goMenu('/group')">
          <HeartHandshake :size="24" />
          <span class="menu-text">동아리방</span>
        </li>
        <li class="menu-item" @click="() => goMenu('/friend')">
          <Users :size="24" />
          <span class="menu-text">친구들</span>
        </li>
        <li class="menu-item" @click="() => goMenu('/chat')">
          <Send :size="24" />
          <span class="menu-text">메세지</span>
        </li>
      </ul>
      <div class="menu-footer">
        <ul class="menu-list">
          <li class="group-item" @click="() => (authStore.ui.isDark = !authStore.ui.isDark)">
            <Moon v-if="authStore.ui.isDark" :size="16" />
            <Sun v-else :size="16" />
            <div class="flex justify-between items-center w-full">
              <span class="item-text">{{ darkModeMenuName }}</span>
              <label class="switch" @click.stop="() => {}">
                <input v-model="authStore.ui.isDark" type="checkbox" />
                <span class="control"></span>
              </label>
            </div>
          </li>
          <li v-if="authStore.myInfo" class="group-item" @click="logout">
            <LogOut :size="16" />
            <span class="item-text">로그아웃</span>
          </li>
        </ul>
        <p class="footer-copy text-xs font-medium text-border-active text-center">
          © 2025 KYSA <i class="font-cursive">designed with</i> ❤️
        </p>
      </div>
    </div>
  </div>
  <div v-if="isOpen" class="s-backdrop" @click.prevent="closeMenu"></div>
</template>
<script lang="ts" setup>
import { Home, Send, Users, HeartHandshake, Settings, Sun, Moon, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store.ts'
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { sleep } from '@/utils/use.util.ts'
import { AuthService } from '@/services/auth.service.ts'
import { useUiStore } from '@/stores/ui.store.ts'
import ProfileDefault from '@/assets/images/profile_empty.png'

const props = defineProps<{
  isOpen: boolean
}>()
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
const emit = defineEmits(['close'])
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const authSvc = new AuthService()
const darkModeMenuName = computed(() => {
  return authStore.ui.isDark ? 'Dark Mode' : 'Light Mode'
})

function closeMenu() {
  emit('close')
}

async function goMenu(path: string) {
  emit('close')
  await sleep(0) // Ensure ui change
  router.push(path)
}

async function goLogin() {
  emit('close')
  await sleep(0) // Ensure ui change
  router.push('/login')
}

async function logout() {
  emit('close')
  await sleep(0) // Ensure ui change
  authSvc.logout()
  router.push('/')
  uiStore.showToast('로그아웃 되었습니다.', 'success')
}
</script>
<style scoped>
.side-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 55%;
  max-width: 270px;
  height: 100%;
  z-index: 10;
  border-radius: 0 0.75rem 0.75rem 0;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  background-color: var(--color-background-1);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;

  &.open {
    transform: translateX(0);
  }

  @media (min-width: 640px) {
    width: 35%;
  }
}

.menu-content {
  position: relative;
  padding: 1rem;
  height: 100%;
}

.menu-top-place {
  height: 64px;
}

.menu-user-profile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.5rem;

  & .profile-image {
    background-color: var(--color-background-2);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    aspect-ratio: 1;
    overflow: hidden;

    & img {
      width: 100%;
      height: 100%;
    }
  }

  & .profile-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
  }
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;

  & .menu-item,
  & .group-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    margin-bottom: 0.75em;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 0.5rem;
    user-select: none;

    &:active {
      background-color: var(--color-background-3);
      transform: scale(0.96);
    }

    &:last-child {
      margin-bottom: 1rem;
    }

    & .menu-text {
      font-size: 1rem;
    }
  }

  & .group-item {
    padding: 0.5rem 1rem;

    & .group-profile {
      background-color: var(--color-background-2);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      aspect-ratio: 1;
      overflow: hidden;
    }
  }
}

.menu-footer {
  position: absolute;
  bottom: 1rem;
  width: calc(100% - 2rem);
}
</style>
