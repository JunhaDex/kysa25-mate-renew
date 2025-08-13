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
          <div v-if="type === 'receive'" class="text-sm text-shadow-tx-gray-2">
            <p class="mb-4">
              <b>{{ encoded.from.nickname }} 님</b>이 관심을 표현했습니다.<br />
              나도 호감에 답해볼까요?
            </p>
            <button class="s-btn btn-primary w-full block" @click="replyTicket" :disabled="replied">
              <span v-if="replied">답변 완료</span>
              <span v-else>관심에 답하기</span>
            </button>
          </div>
          <div v-else class="text-sm text-shadow-tx-gray-2">
            <p>
              <b>{{ encoded.to.nickname }}</b> 님에게 관심을 표현했습니다.<br />
              좋은 소식이 있을지도?
            </p>
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
              <p class="font-semibold mb-2">[연애편지 도착 안내]</p>
              <p class="mb-2">
                <b>{{ encoded.to.nickname }} 님</b>, 누군가 당신에게 편지를 보냈어요!<br />
                연애편지부스 (11호관 1층 로비)에 방문하셔서 성함을 확인하고 찾아가시기 비랍니다. 🙂
              </p>
              <ul>
                <li>※ 수령 여부는 보내신 분에게는 알리지 않습니다.</li>
                <li>※ 8/16(토) 밤까지 찾아가지 않으신 편지는 추후 전달이 어렵습니다.</li>
              </ul>

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
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { ChatService } from '@/services/chat.service.ts'

const chatSvc = new ChatService()
const props = defineProps<{
  type: 'receive' | 'send'
  chat: Chat
  users: UserProfile[]
}>()
const emit = defineEmits(['reply'])
const sender = computed<UserProfile>(() => {
  const user = props.users.find((user) => user.id === props.chat.sender)
  if (!user) {
    return { id: -1, nickname: '알수없음' } as UserProfile
  }
  return user
})
const replied = ref<boolean>(parseReplied())
const encoded = computed(() => {
  if (props.chat.encoded) {
    if (props.chat.message.startsWith(':::type__express_ticket:::')) {
      return JSON.parse(props.chat.message.replace(/^:::type__express_ticket:::/, ''))
    } else if (props.chat.message.startsWith(':::type__postman_alert:::')) {
      return JSON.parse(props.chat.message.replace(/^:::type__postman_alert:::/, ''))
    }
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
  return us
})

function parseReplied(): boolean {
  if (props.chat.encoded) {
    let msg: any
    if (props.chat.message.startsWith(':::type__express_ticket:::')) {
      msg = JSON.parse(props.chat.message.replace(/^:::type__express_ticket:::/, ''))
    } else if (props.chat.message.startsWith(':::type__postman_alert:::')) {
      msg = JSON.parse(props.chat.message.replace(/^:::type__postman_alert:::/, ''))
    }
    return msg.replied
  }
  return false
}

async function replyTicket() {
  if (!replied.value) {
    replied.value = true
    const parent = encoded.value
    await chatSvc.sendTicket(parent.from.ref, parent.chatId)
  }
}
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
