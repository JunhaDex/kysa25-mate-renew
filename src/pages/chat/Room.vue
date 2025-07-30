<template>
  <Header />
  <section class="chat-bubble-list bg-background-2 p-4">
    <ChatBubble type="receive" />
    <ChatBubble type="send" />
  </section>
  <div class="sticky-input">
    <div class="flex justify-between items-end gap-2 p-4">
      <div class="s-input-box flex-1">
        <textarea
          class="s-input-field"
          type="text"
          placeholder="메시지를 입력하세요..."
          rows="1"
          @input="adjustInputHeight"
        />
      </div>
      <button class="s-btn btn-outline" @click="handleClick">관심보내기</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import ChatBubble from '@/components/display/chat/ChatBubble.vue'
import { onMounted, ref } from 'vue'
import { ChatService } from '@/services/chat.service.ts'
import type { Chat } from '@/types/chat.type.ts'
import { useUiStore } from '@/stores/ui.store.ts'

const props = defineProps<{
  id: string
}>()
const chatSvc = new ChatService()
const uiStore = useUiStore()
const chatList = ref<Chat[]>([])
onMounted(async () => {
  await fetchChatMessages()
})

async function fetchChatMessages() {
  await chatSvc.getChatRoom(props.id)
}

function adjustInputHeight(e: Event) {
  const input = e.target as HTMLTextAreaElement
  input.style.height = 'auto'
  input.style.height = `${input.scrollHeight}px`
}

function handleClick() {
  uiStore.showToast('테스트 메세지')
}
</script>
<style scoped>
.sticky-input {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: var(--color-background-1);
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.chat-bubble-list {
  min-height: 100vh;
}
</style>
