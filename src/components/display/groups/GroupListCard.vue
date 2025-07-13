<template>
  <div class="s-card">
    <div class="group-card">
      <div class="group-image">
        <img :src="group.coverImg" alt="동아리 이미지" />
      </div>
      <div class="group-info flex-1">
        <div class="group-title">
          <h3 class="text-lg font-bold">{{ group.groupName }}</h3>
          <p class="text-shadow-tx-gray-3">동아리 소개: ...</p>
        </div>
        <div class="group-stats">
          <Users :size="14" />
          <span class="text-xs text-shadow-tx-gray-3">가입자 수: 10명</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Users } from 'lucide-vue-next'
import type { Group } from '@/types/group.type.ts'

const props = defineProps<{
  group: Group
}>()
</script>
<style scoped>
.group-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.group-image {
  background-color: var(--color-background-2);
  border-radius: 0.5rem;
  width: 64px;
  height: 64px;
  aspect-ratio: 1;
}

.group-stats {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
