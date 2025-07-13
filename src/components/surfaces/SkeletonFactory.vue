<template>
  <div class="skeleton-wrap">
    <template v-for="(setup, index) in setups" :key="index">
      <Component v-if="setup === 'list-card'" :is="IListCard" />
    </template>
  </div>
</template>
<script setup lang="ts">
import type { SkeletonUIType } from '@/types/common.type.ts'
import IListCard from '@/components/surfaces/skeleton/IListCard.vue'

withDefaults(
  defineProps<{
    setups: SkeletonUIType[]
  }>(),
  {
    setups: () => [],
  },
)
</script>
<style scoped>
.skeleton-wrap {
  display: grid;
  gap: 1rem;
}
</style>
