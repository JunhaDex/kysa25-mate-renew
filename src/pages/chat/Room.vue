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
      <button class="s-btn btn-outline">관심보내기</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import ChatBubble from '@/components/display/chat/ChatBubble.vue'

function adjustInputHeight(e: Event) {
  const input = e.target as HTMLTextAreaElement
  input.style.height = 'auto'
  input.style.height = `${input.scrollHeight}px`
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
