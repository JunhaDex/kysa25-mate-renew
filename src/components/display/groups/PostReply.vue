<template>
  <div class="post-reply">
    <div class="author mb-2">
      <div class="profile"></div>
      <div class="author-info flex-1">
        <h3 class="text-sm font-bold">{{ reply.author.nickname }}</h3>
        <p class="text-tx-gray-3 text-xs">1조</p>
      </div>
      <span class="text-xs text-tx-gray-3 font-medium">{{ timeStr }}</span>
    </div>
    <div class="content mb-4">
      <p>{{ reply.message }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Reply } from '@/types/group.type.ts'
import { computed } from 'vue'
import { timeToStr } from '@/utils/use.util.ts'

const props = defineProps<{
  reply: Reply
}>()

const timeStr = computed(() => timeToStr(props.reply.createdAt))
</script>
<style scoped>
.post-reply {
  border-bottom: 1px solid var(--color-border-default);
}

.author {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & .profile {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--color-background-3);
    overflow: hidden;
    flex-shrink: 0;
  }
}

.content {
  padding: 0 1rem;
}
</style>
