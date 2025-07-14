<template>
  <div ref="scrollObserver"></div>
</template>
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const emit = defineEmits(['loadMore'])
const scrollObserver = useTemplateRef<HTMLDivElement>('scrollObserver')
useIntersectionObserver(
  scrollObserver,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      emit('loadMore')
    }
  },
  {
    threshold: 0.1,
  },
)
</script>
