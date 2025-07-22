<template>
  <div class="s-card">
    <div class="chat-list-item" @click="router.push(`/chat/${room.ref}`)">
      <div class="user-profile"></div>
      <div class="sender-info flex-1">
        <div class="name-time">
          <h3 class="font-bold">{{ room.title }}</h3>
          <span class="text-xs text-shadow-tx-gray-3">{{ tts }}</span>
        </div>
        <div class="message-preview">
          <p class="text-sm text-shadow-tx-gray-2">{{ room.lastChat.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { ChatRoom } from '@/types/chat.type.ts'
import { computed } from 'vue'
import { timeToStr } from '@/utils/use.util.ts'
import { useRouter } from 'vue-router'

const props = defineProps<{
  room: ChatRoom
}>()
const router = useRouter()
const tts = computed(() => timeToStr(props.room.lastChat.createdAt))
</script>
<style scoped>
.chat-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.name-time {
  display: flex;
  justify-content: space-between;
  align-items: start;
}

.user-profile {
  background-color: var(--color-background-2);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  aspect-ratio: 1;
}
</style>
