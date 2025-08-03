<template>
  <div class="chat-bubble-wrap" :class="type === 'receive' ? 'chat-receive' : 'chat-send'">
    <div v-if="type === 'receive'" class="sender-profile"></div>
    <div class="max-w-[65%]">
      <h3 v-if="type === 'receive'" class="text-sm font-bold text-shadow-tx-gray-1 pl-2 mb-2">
        {{ sender?.nickname }}
      </h3>
      <template v-if="chat.encoded">
        <div
          v-if="encoded.type === 'ticket'"
          class="chat-bubble"
          :class="type === 'receive' ? 'bubble-left' : 'bubble-right'"
        >
          <div class="text-sm text-shadow-tx-gray-2">
            <p>
              <b>{{ encoded.from.nickname }} 님</b>이 호감을 표현했습니다.<br />
              나도 호감에 답해볼까요?
            </p>
            <button class="s-btn btn-primary w-full block">관심에 답하기</button>
          </div>
        </div>
        <div
          v-else-if="encoded.type === 'reply'"
          class="chat-bubble"
          :class="type === 'receive' ? 'bubble-left' : 'bubble-right'"
        >
          <div class="text-sm text-shadow-tx-gray-2">
            <p>
              <b>{{ encoded.from.nickname }} 님</b>이 관심에 답했습니다.<br />
              좋은 대화가 계속 되기를 바래요 🎉
            </p>
          </div>
        </div>
        <div v-else-if="encoded.type === 'postman'">
          <div class="chat-bubble" :class="type === 'receive' ? 'bubble-left' : 'bubble-right'">
            <div class="text-sm text-shadow-tx-gray-2">
              <p>
                <b>{{ encoded.to.nickname }} 님</b>, 편지가 도착했습니다.<br />
                운영본부에서 수령해 주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="chat-bubble" :class="type === 'receive' ? 'bubble-left' : 'bubble-right'">
          <p class="text-sm text-shadow-tx-gray-2">
            {{ chat.message }}
          </p>
        </div>
      </template>
    </div>
    <div class="chat-time">
      <span class="text-xs text-shadow-tx-gray-3">{{ tts }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Chat } from '@/types/chat.type.ts'
import type { UserProfile } from '@/types/friend.type.ts'
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{
  type: 'receive' | 'send'
  chat: Chat
  users: UserProfile[]
}>()
const sender = computed<UserProfile>(() => {
  const user = props.users.find((user) => user.id === props.chat.sender)
  if (!user) {
    return { id: -1, nickname: '알수없음' } as UserProfile
  }
  return user
})
const encoded = computed(() => {
  if (props.chat.encoded) {
    return JSON.parse(props.chat.message.replace(/^:::type__express_ticket:::/, ''))
  }
  return props.chat.message
})

const tts = computed(() => {
  // tts = time to string
  const received = dayjs(props.chat.createdAt)
  const us = received.format('A h:mm')
  // switch to korean: 오전 오후
  if (us.startsWith('AM')) {
    return `오전 ${us.replace('AM', '').trim()}`
  } else if (us.startsWith('PM')) {
    return `오후 ${us.replace('PM', '').trim()}`
  }
})
</script>
<style scoped>
.sender-profile {
  background-color: var(--color-background-3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  aspect-ratio: 1;
}

.chat-bubble-wrap {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
  margin-bottom: 1rem;

  &.chat-receive {
    flex-direction: row;
  }

  &.chat-send {
    flex-direction: row-reverse;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.chat-bubble {
  padding: 0.75rem;
  border-radius: 0.75rem;

  &.bubble-left {
    background-color: var(--color-bg-primary);
    border: 1px solid var(--color-border-default);
  }

  &.bubble-right {
    background-color: var(--color-background-3);
  }
}

.chat-time {
  display: flex;
  align-items: end;
  justify-content: start;
}
</style>
