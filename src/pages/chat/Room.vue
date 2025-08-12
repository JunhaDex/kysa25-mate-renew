<template>
  <Header :has-back="true" :title="chatRoom.title" />
  <section class="chat-bubble-list bg-background-2 p-4">
    <template v-if="chatRoom && users">
      <ChatBubble
        v-for="chat in chatList"
        :key="chat.id"
        :chat="chat"
        :users="users"
        :type="chat.sender === chatRoom.userId ? 'send' : 'receive'"
      />
    </template>
  </section>
  <div class="input-fixed">
    <div class="flex justify-between items-stretch gap-2 p-4">
      <div class="s-input-box flex-1">
        <textarea
          v-model="userMessage"
          class="s-input-field"
          type="text"
          placeholder="메시지를 입력하세요..."
          rows="1"
          @input="adjustInputHeight"
        />
      </div>
      <button v-if="userMessage.length > 0" class="s-btn btn-primary" @click="sendMessage">
        전송
      </button>
      <button v-else class="s-btn btn-outline" @click="sendTicket">관심보내기</button>
    </div>
  </div>
  <SendTicketModal
    v-if="recipient"
    :is-open="userSendTicket.isOpen"
    :target="recipient"
    @close="userSendTicket.isOpen = false"
  />
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import ChatBubble from '@/components/display/chat/ChatBubble.vue'
import { computed, onMounted, ref } from 'vue'
import { ChatService } from '@/services/chat.service.ts'
import type { Chat, ChatRoom } from '@/types/chat.type.ts'
import { useUiStore } from '@/stores/ui.store.ts'
import { usePagination } from '@/compositions/pages.comp.ts'
import type { Friend, UserProfile } from '@/types/friend.type.ts'
import { useRouter } from 'vue-router'
import SendTicketModal from '@/components/feedbacks/chat/SendTicketModal.vue'

const router = useRouter()
const props = defineProps<{
  id: string
}>()
const chatSvc = new ChatService()
const uiStore = useUiStore()
const { pageInfo, onLoad, hasMore, fetchListData } = usePagination()
const chatList = ref<Chat[]>([])
const chatRoom = ref<ChatRoom>((router.currentRoute.value.meta?.recipient as ChatRoom) ?? undefined)
const users = ref<UserProfile[]>([])
const recipient = computed(() => {
  return users.value.find((user) => user.id !== chatRoom.value.userId)
})
const userMessage = ref<string>('')
const userSendTicket = ref<{
  isOpen: boolean
}>({
  isOpen: false,
})
let chatSocket: WebSocket
onMounted(async () => {
  await initSocket()
  await fetchChatMessages()
  const element = document.querySelector('#AppContainer')
  if (element) {
    element.scrollTo({ top: element.scrollHeight, behavior: 'instant' })
  }
})

async function fetchChatMessages() {
  const info = await chatSvc.getChatRoomDetail(props.id)
  chatRoom.value = info.room
  users.value = info.users
  chatList.value = await fetchListData(chatSvc.getChatRoom(props.id))
}

async function initSocket() {
  let isSuccess = false
  try {
    chatSocket = chatSvc.getSocket(props.id)
    isSuccess = true
    console.log('socket connected')
  } catch (e) {
    console.error('soekcet failed', e)
  }
  if (isSuccess) {
    chatSocket.onmessage = (event) => {
      try {
        const newChat = chatSvc.parseSocketMessage(JSON.parse(event.data))
        chatList.value.push(newChat)
        const element = document.querySelector('#AppContainer')
        if (element) {
          element.scrollTo({ top: element.scrollHeight, behavior: 'instant' })
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}

function adjustInputHeight(e: Event) {
  const input = e.target as HTMLTextAreaElement
  input.style.height = 'auto'
  input.style.height = `${input.scrollHeight}px`
}

function sendTicket() {
  userSendTicket.value.isOpen = true
}

function sendMessage() {
  chatSocket.send(JSON.stringify({ message: userMessage.value, encoded: false }))
  userMessage.value = ''
}
</script>
<style scoped>
.input-fixed {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 768px;
  background-color: var(--color-background-1);
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.chat-bubble-list {
  min-height: 100vh;
  margin-bottom: 92px; /* Adjust based on input height */
}
</style>
