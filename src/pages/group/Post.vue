<template>
  <Header :has-back="true" title="게시글 상세" />
  <template v-if="postDetail === undefined"></template>
  <template v-else>
    <section class="post-detail p-4">
      <div class="author mb-4">
        <div class="profile"></div>
        <div class="author-info flex-1">
          <h3 class="text-lg font-bold">
            {{ postDetail.author.nickname }}
            <span class="text-tx-gray-3 text-sm font-medium ml-1"> 1조</span>
          </h3>
          <p class="text-tx-gray-3 text-sm">{{ timeStr }}</p>
        </div>
        <span class="text-xs text-tx-gray-3 font-medium underline">삭제하기</span>
      </div>
      <div class="content mb-4">
        <div v-if="postDetail.image" class="post-image mb-2">
          <img :src="postDetail.image" alt="Post image" />
        </div>
        <p class="post-text">{{ postDetail.content }}</p>
      </div>
      <div class="action-wrap">
        <button class="action-icon" @click="toggleLike">
          <Heart
            :size="16"
            :fill="likeState.isLiked ? `var(--color-tx-red)` : 'transparent'"
            :color="likeState.isLiked ? 'var(--color-tx-red)' : 'var(--color-tx-gray-1)'"
          />
          <span class="count">{{ likeState.count }}</span>
        </button>
        <button class="action-icon">
          <MessageCircleMore :size="16" />
          <span class="count">{{ postDetail.comments }}</span>
        </button>
      </div>
    </section>
    <div class="bg-background-2 h-[1rem]"></div>
    <section class="post-reply-wrap px-4 pt-4">
      <PostReply v-for="reply in replyList" :key="reply.id" class="mb-4" :reply="reply" />
      <div v-if="!onLoad && replyList.length === 0" class="no-result">
        <span>첫번째 댓글을 남기세요!</span>
      </div>
      <ScrollObserver @load-more="fetchNext" />
    </section>
  </template>
  <div class="sticky-input">
    <div class="flex justify-between items-stretch gap-2 p-4">
      <div class="s-input-box flex-1">
        <textarea
          v-model="userInputReply"
          class="s-input-field"
          type="text"
          placeholder="메시지를 입력하세요..."
          rows="1"
          @input="adjustInputHeight"
        />
      </div>
      <button class="s-btn btn-primary" @click="submitReply">댓글작성</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import { computed, onMounted, ref } from 'vue'
import { PostService } from '@/services/post.service.ts'
import type { Post, Reply } from '@/types/group.type.ts'
import { timeToStr } from '@/utils/use.util.ts'
import { Heart, MessageCircleMore } from 'lucide-vue-next'
import { usePagination } from '@/compositions/pages.comp.ts'
import PostReply from '@/components/display/groups/PostReply.vue'
import { useLockHandler } from '@/compositions/process.comp.ts'
import ScrollObserver from '@/components/layouts/ScrollObserver.vue'

const props = defineProps<{
  id: string
}>()
const postSvc = new PostService()
const { isLocked, lockProcess } = useLockHandler()
const { pageInfo, onLoad, hasMore, fetchListData } = usePagination()
const postDetail = ref<Post>()
const replyList = ref<Reply[]>([])
const userInputReply = ref('')
const likeState = ref<{ count: number; isLiked: boolean }>({
  count: postDetail.value?.likes || 0,
  isLiked: !!postDetail.value?.isLiked,
})
const timeStr = computed(() => timeToStr(postDetail.value?.createdAt || ''))
onMounted(async () => {
  await fetchPostDetail()
})

async function fetchPostDetail() {
  const { post, reply } = await postSvc.getPostById(Number(props.id))
  postDetail.value = post
  pageInfo.value = reply.meta
  replyList.value = reply.list
}

async function fetchReplyList() {
  replyList.value = await fetchListData(postSvc.getPostReply(Number(props.id)))
}

async function fetchNext() {
  const list = await fetchListData(
    postSvc.getPostReply(Number(props.id), {
      page: {
        page: pageInfo.value.pageNo + 1,
        size: pageInfo.value.pageSize,
      },
    }),
  )
  replyList.value.push(...list)
}

function adjustInputHeight(e: Event) {
  const input = e.target as HTMLTextAreaElement
  input.style.height = 'auto'
  input.style.height = `${input.scrollHeight}px`
}

async function toggleLike() {
  likeState.value.isLiked = !likeState.value.isLiked
  if (likeState.value.isLiked) {
    likeState.value.count += 1
  } else {
    likeState.value.count -= 1
  }
  await postSvc.likePost(Number(props.id), likeState.value.isLiked)
}

async function submitReply() {
  if (userInputReply.value.trim() === '') return
  await lockProcess(async () => {
    await postSvc.createComment(Number(props.id), { message: userInputReply.value })
    userInputReply.value = ''
  })
  await fetchReplyList()
}
</script>
<style scoped>
.author {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & .profile {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--color-background-3);
    overflow: hidden;
    flex-shrink: 0;
  }
}

.post-image {
  border-radius: 0.5rem;
  overflow: hidden;
}

.action-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-reply-wrap {
  margin-bottom: calc(76px + 1rem);
}

.sticky-input {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 768px;
  background-color: var(--color-background-1);
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}
</style>
