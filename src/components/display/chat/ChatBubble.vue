<template>
  <div v-if="type === 'receive'" class="chat-bubble-wrap chat-receive">
    <div class="sender-profile"></div>
    <div class="max-w-[65%]">
      <h3 class="text-sm font-bold text-shadow-tx-gray-1 pl-2 mb-2">보낸사람</h3>
      <div class="chat-bubble bubble-left">
        <p class="text-sm text-shadow-tx-gray-2">
          메시지 내용이 여기에 표시됩니다... 메시지 내용이 여기에 표시됩니다... 메시지 내용이 여기에
          표시됩니다...
        </p>
      </div>
    </div>
    <div class="chat-time">
      <span class="text-xs text-shadow-tx-gray-3">오후 3:30</span>
    </div>
  </div>
  <div v-else-if="type === 'send'" class="chat-bubble-wrap chat-send">
    <div class="max-w-[75%]">
      <div class="chat-bubble bubble-right">
        <p class="text-sm text-shadow-tx-gray-2">
          메시지 내용이 여기에 표시됩니다... 메시지 내용이 여기에 표시됩니다... 메시지 내용이 여기에
          표시됩니다...
        </p>
      </div>
    </div>
    <div class="chat-time">
      <span class="text-xs text-shadow-tx-gray-3">오후 3:30</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  type: 'receive' | 'send'
}>()
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
