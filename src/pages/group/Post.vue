<template>
  <Header :has-back="true" title="게시글 상세" />
  <div class="s-progress" :class="{ hidden: isReady }"></div>
  <template v-if="postDetail === undefined"></template>
  <template v-else>
    <section class="post-detail p-4">
      <div class="author mb-4">
        <div class="profile">
          <img
            :src="postDetail.author.profileImg"
            alt="Author profile"
            @error="(e) => ((e.target! as HTMLImageElement).src = ProfileDefault)"
          />
        </div>
        <div class="author-info flex-1">
          <h3 class="text-lg font-bold">
            {{ postDetail.author.nickname }}
            <span class="text-tx-gray-3 text-sm font-medium ml-1">{{ postDetail.author.team?.name || '' }}</span>
          </h3>
          <p class="text-tx-gray-3 text-sm">{{ timeStr }}</p>
        </div>
        <span
          v-if="isMine"
          class="text-xs text-tx-red font-medium underline cursor-pointer select-none"
          @click="isOpenDelete = true"
        >
          삭제하기
        </span>
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
      <PostReply
        v-for="reply in replyList"
        :key="reply.id"
        class="mb-4"
        :reply="reply"
        :post-id="Number(props.id)"
        @remove="removeReply"
      />
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
      <button class="s-btn btn-primary" @click="submitReply" :disabled="isLocked">
        <span v-if="isLocked" class="icon icon-loading" />
        <span v-else>댓글작성</span>
      </button>
    </div>
  </div>
  <Modal :is-open="isOpenDelete" @close-modal="isOpenDelete = false">
    <div class="s-modal p-4">
      <h2 class="text-lg font-semibold mb-2">게시글 삭제</h2>
      <p>정말로 이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.</p>
      <div class="flex justify-between gap-4 mt-4">
        <button class="s-btn btn-secondary w-full block" @click="isOpenDelete = false">취소</button>
        <button class="s-btn btn-red w-full block" @click="deletePost">삭제</button>
      </div>
    </div>
  </Modal>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import { computed, onMounted, ref } from 'vue'
import { PostService } from '@/services/post.service.ts'
import type { Post, Reply } from '@/types/group.type.ts'
import { sleep, timeToStr } from '@/utils/use.util.ts'
import { Heart, MessageCircleMore } from 'lucide-vue-next'
import { usePagination } from '@/compositions/pages.comp.ts'
import PostReply from '@/components/display/groups/PostReply.vue'
import { useLockHandler } from '@/compositions/process.comp.ts'
import ScrollObserver from '@/components/layouts/ScrollObserver.vue'
import { useLoadHandler } from '@/compositions/loading.comp.ts'
import { useAuthStore } from '@/stores/auth.store.ts'
import Modal from '@/components/feedbacks/Modal.vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui.store.ts'
import ProfileDefault from '@/assets/images/profile_empty.png'
import { useTeamStore } from '@/stores/team.store.ts'

const props = defineProps<{
  id: string
}>()
const postSvc = new PostService()
const authStore = useAuthStore()
const uiStore = useUiStore()
const teamStore = useTeamStore()
const router = useRouter()
const { isLocked, lockProcess } = useLockHandler()
const { pageInfo, onLoad, hasMore, fetchListData } = usePagination()
const { isReady, setReady } = useLoadHandler()
const postDetail = ref<Post>()
const replyList = ref<Reply[]>([])
const userInputReply = ref('')
const isOpenDelete = ref(false)
const likeState = ref<{ count: number; isLiked: boolean }>({
  count: postDetail.value?.likes || 0,
  isLiked: !!postDetail.value?.isLiked,
})
const timeStr = computed(() => timeToStr(postDetail.value?.createdAt || ''))
const isMine = computed(() => {
  if (postDetail.value) {
    return postDetail.value.author.ref === authStore.myInfo?.ref
  }
  return false
})
onMounted(async () => {
  await fetchPostDetail()
  setReady()
})

async function fetchPostDetail() {
  const { post, reply } = await postSvc.getPostById(Number(props.id))
  postDetail.value = post
  pageInfo.value = reply.meta
  replyList.value = reply.list
}

async function fetchReplyList() {
  const replyPage = await postSvc.getPostReply(Number(props.id))
  pageInfo.value = replyPage.meta
  replyList.value = replyPage.list
}

async function fetchNext() {
  if (!hasMore.value || onLoad.value) return
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

async function deletePost() {
  if (!isMine.value) return
  await postSvc.deletePost(Number(props.id))
  isOpenDelete.value = false
  await sleep(0)
  router.back()
  uiStore.showToast('게시글이 삭제되었습니다.', 'success')
}

async function removeReply(reply: Reply) {
  const index = replyList.value.findIndex((r) => r.id === reply.id)
  if (index !== -1) {
    replyList.value.splice(index, 1)
  }
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
