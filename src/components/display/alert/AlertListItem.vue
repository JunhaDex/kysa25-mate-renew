<template>
  <div class="notification-container" @click="handleClick">
    <div class="noti-header mb-2">
      <h3 class="text-sm font-semibold">{{ item.title }}</h3>
      <div class="sub">
        <span class="text-xs text-shadow-tx-gray-3">{{ tts }}</span>
        <span v-if="!item.readAt" class="new-dot ml-2"></span>
      </div>
    </div>
    <div class="noti-content">
      <p>{{ item.message }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Notification } from '@/types/common.type.ts'
import { computed } from 'vue'
import { timeToStr } from '@/utils/use.util.ts'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{
  item: Notification
}>()

const tts = computed(() => timeToStr(props.item.createdAt))

function handleClick() {
  if (props.item.payload.clickUrl.includes('chat')) {
    router.push(props.item.payload.clickUrl)
  }
}
</script>
<style scoped>
.notification-container {
  border-bottom: 1px solid var(--color-border-default);
  padding: 1rem;

  & .noti-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & h3 {
      flex: 1;
    }

    & .sub {
      flex-shrink: 0;
    }
  }
}

.new-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: var(--color-tx-red);
  border-radius: 50%;
}
</style>
