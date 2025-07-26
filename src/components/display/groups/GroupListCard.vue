<template>
  <div class="s-card">
    <div class="group-card" @click="router.push(`group/${group.ref}`)">
      <div class="group-image">
        <img :src="group.profileImg" alt="동아리 이미지" />
      </div>
      <div class="group-info flex-1">
        <div class="group-title">
          <h3 class="text-lg font-bold">{{ group.groupName }}</h3>
          <p class="text-tx-gray-3 text-wrap">{{ group.introduce }}</p>
        </div>
        <div class="group-stats text-border-active mt-2">
          <Users :size="14" />
          <span class="text-xs">가입자 수: {{ group.followers }}명</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Users } from 'lucide-vue-next'
import type { Group } from '@/types/group.type.ts'
import { useRouter } from 'vue-router'

const props = defineProps<{
  group: Group
}>()
const router = useRouter()
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
  width: 96px;
  height: 96px;
  aspect-ratio: 1;
  overflow: hidden;
}

.group-stats {
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-wrap {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 48px;
}
</style>
