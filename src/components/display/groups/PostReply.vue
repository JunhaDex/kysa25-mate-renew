<template>
  <div class="post-reply">
    <div class="author mb-2">
      <div class="profile">
        <img
          :src="reply.author.profileImg"
          alt="author"
          @error="(e) => ((e.target! as HTMLImageElement).src = ProfileDefault)"
        />
      </div>
      <div class="author-info flex-1">
        <h3 class="text-sm font-bold">{{ reply.author.nickname }}</h3>
        <p class="text-tx-gray-3 text-xs">1조</p>
      </div>
      <span
        v-if="isMine"
        class="text-xs text-tx-red font-medium underline cursor-pointer select-none"
        @click="deleteReply"
      >
        삭제하기
      </span>
      <span v-else class="text-xs text-tx-gray-3 font-medium">{{ timeStr }}</span>
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
import { useAuthStore } from '@/stores/auth.store.ts'
import { PostService } from '@/services/post.service.ts'
import { useUiStore } from '@/stores/ui.store.ts'
import ProfileDefault from '@/assets/images/profile_empty.png'

const postSvc = new PostService()
const authStore = useAuthStore()
const uiStore = useUiStore()
const props = defineProps<{
  reply: Reply
  postId: number
}>()
const emit = defineEmits(['remove'])

const timeStr = computed(() => timeToStr(props.reply.createdAt))
const isMine = computed(() => {
  return props.reply.author.ref === authStore.myInfo?.ref
})

async function deleteReply() {
  if (!isMine.value) return
  await postSvc.deleteReply(props.postId, props.reply.id)
  emit('remove', props.reply)
  uiStore.showToast('댓글이 삭제되었습니다.', 'success')
}
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
