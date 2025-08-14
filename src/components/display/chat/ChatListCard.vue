<template>
  <div class="s-card">
    <div class="chat-list-item" @click="moveToChatRoom">
      <div class="user-profile">
        <img
          :src="other?.profileImg"
          @error="(e) => ((e.target! as HTMLImageElement).src = ProfileDefault)"
          alt="User Profile"
        />
      </div>
      <div class="sender-info flex-1">
        <div class="name-time">
          <h3 class="font-bold flex-1">{{ room.title }}</h3>
          <div>
            <span class="text-xs text-shadow-tx-gray-3">{{ tts }}</span>
            <span v-if="hasUnread" class="new-dot ml-2"></span>
          </div>
        </div>
        <div class="message-preview">
          <p class="text-sm text-shadow-tx-gray-2">{{ preview }}</p>
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
import { useAuthStore } from '@/stores/auth.store.ts'
import ProfileDefault from '@/assets/images/profile_empty.png'

const router = useRouter()
const authStore = useAuthStore()
const props = defineProps<{
  room: ChatRoom
}>()
const other = computed(() => {
  return props.room.party.find((m) => m.id !== authStore.myInfo?.id)
})
const tts = computed(() => timeToStr(props.room.lastChat.createdAt))
const hasUnread = computed<boolean>(() => {
  const isNotMe = props.room.lastChat.sender !== authStore.myInfo?.id
  const hasUnread = props.room.lastChat.id > props.room.lastRead
  return isNotMe && hasUnread
})
const preview = computed(() => {
  if (props.room.lastChat.id) {
    return props.room.lastChat.encoded ? '메세지가 도착했습니다.' : props.room.lastChat.message
  }
  return '아직 대화가 없습니다.'
})

function moveToChatRoom() {
  const chatRoute = router.getRoutes().find((route) => route.name === 'chat-detail')
  if (chatRoute) {
    chatRoute.meta.recipient = props.room
  }
  router.push(`/chat/${props.room.ref}`)
}
</script>
<style scoped>
.new-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: var(--color-tx-red);
  border-radius: 50%;
}

.chat-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;

  & .message-preview {
    min-width: 0;
    p {
      width: 100%;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
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
  overflow: hidden;

  & img {
    width: 100%;
    height: 100%;
  }
}
</style>
