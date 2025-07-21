<template>
  <div class="s-card">
    <div class="chat-list-item">
      <div class="user-profile"></div>
      <div class="sender-info flex-1">
        <div class="name-time">
          <h3 class="font-bold">보낸사람</h3>
          <span class="text-xs text-shadow-tx-gray-3">오후 3:30</span>
        </div>
        <div class="message-preview">
          <p class="text-sm text-shadow-tx-gray-2">메시지 내용이 여기에 표시됩니다...</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
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
