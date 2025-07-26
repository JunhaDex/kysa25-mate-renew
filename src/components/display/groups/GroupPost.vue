<template>
  <div class="group-post">
    <div class="author mb-2">
      <div class="profile"></div>
      <div class="author-info flex-1">
        <h3 class="text-sm font-bold">{{ post.author.nickname }}</h3>
        <p class="text-tx-gray-3 text-xs">1조</p>
      </div>
      <span class="text-xs text-tx-gray-3 font-medium">{{ timeStr }}</span>
    </div>
    <div class="content mb-4">
      <img v-if="post.image" :src="post.image" alt="post-image" class="mb-2" />
      <p>{{ post.content }}</p>
    </div>
    <div class="action-wrap pb-4">
      <button class="action-icon">
        <Heart :size="16" />
        <span class="count">{{ post.likes }}</span>
      </button>
      <button class="action-icon">
        <MessageCircleMore :size="16" />
        <span class="count">{{ post.comments }}</span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Heart, MessageCircleMore } from 'lucide-vue-next'
import type { Post } from '@/types/group.type.ts'
import { computed } from 'vue'
import { timeToStr } from '@/utils/use.util.ts'

const props = defineProps<{
  post: Post
}>()
const timeStr = computed(() => timeToStr(props.post.createdAt))
</script>
<style scoped>
.group-post {
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

.action-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-icon {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--color-background-2);
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: var(--color-background-3);
  }

  & .count {
    font-size: var(--text-xs);
    color: var(--color-text-default);
  }
}
</style>
