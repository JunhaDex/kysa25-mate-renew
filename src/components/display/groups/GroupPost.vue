<template>
  <div class="group-post" @click="router.push(`/group/post/${post.id}`)">
    <div class="author mb-2">
      <div class="profile">
        <img
          :src="post.author.profileImg"
          alt="author"
          @error="(e) => ((e.target! as HTMLImageElement).src = ProfileDefault)"
        />
      </div>
      <div class="author-info flex-1">
        <h3 class="text-sm font-bold">{{ post.author.nickname }}</h3>
        <p class="text-tx-gray-3 text-xs">{{post.author.team?.name || ''}}</p>
      </div>
      <span class="text-xs text-tx-gray-3 font-medium">{{ timeStr }}</span>
    </div>
    <div class="content mb-4">
      <img v-if="post.image" :src="post.image" alt="post-image" class="mb-2" />
      <p>{{ post.content }}</p>
    </div>
    <div class="action-wrap pb-4">
      <button class="action-icon" @click.stop="toggleLike">
        <Heart
          :size="16"
          :fill="likeState.isLiked ? `var(--color-tx-red)` : 'transparent'"
          :color="likeState.isLiked ? 'var(--color-tx-red)' : 'var(--color-tx-gray-1)'"
        />
        <span class="count">{{ likeState.count }}</span>
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
import { computed, ref } from 'vue'
import { timeToStr } from '@/utils/use.util.ts'
import { PostService } from '@/services/post.service.ts'
import { useRouter } from 'vue-router'
import ProfileDefault from '@/assets/images/profile_empty.png'

const props = defineProps<{
  post: Post
}>()
const router = useRouter()
const postSvc = new PostService()
const likeState = ref<{ count: number; isLiked: boolean }>({
  count: props.post.likes,
  isLiked: props.post.isLiked,
})
const timeStr = computed(() => timeToStr(props.post.createdAt))

async function toggleLike() {
  likeState.value.isLiked = !likeState.value.isLiked
  if (likeState.value.isLiked) {
    likeState.value.count += 1
  } else {
    likeState.value.count -= 1
  }
  await postSvc.likePost(props.post.id, likeState.value.isLiked)
}
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

    img {
      width: 100%;
      height: 100%;
    }
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
</style>
