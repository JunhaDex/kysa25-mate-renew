<template>
  <div class="s-card">
    <div class="friend-card">
      <div v-for="friend in list" class="friend-title" :key="friend.id">
        <div class="inner">
          <h3 class="text-lg font-bold">{{ friend.nickname }}</h3>
          <p class="text-xs font-medium text-shadow-tx-gray-3">{{ friend.geo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Friend } from '@/types/friend.type.ts'

const props = defineProps<{
  list: Friend[]
}>()
</script>
<style scoped>
.friend-title {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--color-border-default);
  transition: all 0.15s ease-in-out;
  border-radius: 0.25rem;

  & .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    transition: transform 0.15s ease-in-out;
  }

  &:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: none;
  }

  &:active {
    background-color: var(--color-background-3);

    & .inner {
      transform: scale(0.98);
    }
  }
}
</style>
