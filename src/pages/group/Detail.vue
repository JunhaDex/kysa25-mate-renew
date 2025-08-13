<template>
  <Header :has-back="true" title="동아리 상세" />
  <div class="s-progress" :class="{ hidden: isReady }"></div>
  <template v-if="groupDetail === undefined"></template>
  <template v-else>
    <section class="group-header">
      <div class="g-cover">
        <img :src="groupDetail.coverImg" alt="group-cover" />
      </div>
      <div class="g-profile">
        <div class="profile-img">
          <img :src="groupDetail.profileImg" alt="group-profile" />
        </div>
        <h1 class="group-title">{{ groupDetail.groupName }}</h1>
        <div class="profile-info mt-2">
          <p class="text-tx-gray-3 mb-4">{{ groupDetail.introduce }}</p>
          <div class="stats flex items-center gap-2">
            <span class="text-tx-gray-3 font-semibold">
              <Users :size="16" class="inline-block mr-1" />
              <span class="text-sm leading-[24px]">회원 {{ groupDetail.followers }}명</span>
            </span>
            <span class="text-tx-gray-3 font-semibold">
              <NotepadText :size="16" class="inline-block mr-1" />
              <span class="text-sm leading-[16px]">게시글 50개</span>
            </span>
          </div>
        </div>
      </div>
    </section>
    <div class="bg-background-2 h-[1rem]"></div>
    <section class="group-content">
      <GroupPost v-for="post in postList" class="mb-4" :key="post.id" :post="post" />
      <div v-if="!onLoad && postList.length === 0" class="no-result">
        <span>게시글이 없습니다.</span>
      </div>
      <ScrollObserver @load-more="fetchNext" />
    </section>
    <button
      class="s-btn btn-primary btn-cta-round"
      :class="{ expand: isExpandBtn }"
      @click="router.push(`/group/${id}/new`)"
    >
      <Plus :size="20" class="inline-block" />
      <span v-if="isExpandBtn" class="leading-[20px] ml-2 text-nowrap">글작성</span>
    </button>
  </template>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import { Users, NotepadText, Plus } from 'lucide-vue-next'
import GroupPost from '@/components/display/groups/GroupPost.vue'
import { GroupService } from '@/services/group.service.ts'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { Group, Post } from '@/types/group.type.ts'
import { PostService } from '@/services/post.service.ts'
import { usePagination } from '@/compositions/pages.comp.ts'
import { useRouter } from 'vue-router'
import ScrollObserver from '@/components/layouts/ScrollObserver.vue'
import { useLoadHandler } from '@/compositions/loading.comp.ts'

const props = defineProps<{
  id: string
}>()
const groupSvc = new GroupService()
const postSvc = new PostService()
const router = useRouter()
const { pageInfo, onLoad, hasMore, fetchListData } = usePagination()
const { isReady, setReady } = useLoadHandler()
const groupDetail = ref<Group>()
const postList = ref<Post[]>([])
const isExpandBtn = ref(true)
let scrollContainer: HTMLElement | null = null

onMounted(async () => {
  await fetchGroupDetail()
  scrollContainer = document.getElementById('AppContainer')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll)
  }
  setReady()
})
onBeforeUnmount(async () => {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
})

function handleScroll(event: Event) {
  const target = event.target as HTMLElement
  if (target.scrollTop > 100) {
    isExpandBtn.value = false
  } else {
    isExpandBtn.value = true
  }
}

async function fetchGroupDetail() {
  groupDetail.value = await groupSvc.getGroupByRef(props.id)
  postList.value = await fetchListData(
    postSvc.getGroupPosts(props.id, {
      page: {
        page: pageInfo.value.pageNo,
        size: pageInfo.value.pageSize,
      },
    }),
  )
}

async function fetchNext() {
  if (!hasMore.value || onLoad.value) return
  const list = await fetchListData(
    postSvc.getGroupPosts(props.id, {
      page: {
        page: pageInfo.value.pageNo + 1,
        size: pageInfo.value.pageSize,
      },
    }),
  )
  postList.value.push(...list)
}
</script>
<style scoped>
.group-header {
  position: relative;
  width: 100%;
}

.g-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background-color: var(--color-background-3);
  @media (min-width: 640px) {
    aspect-ratio: 16 / 9;
  }

  & img {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    max-width: none;
  }
}

.g-profile {
  position: relative;
  padding: 1rem;

  & .profile-img {
    position: absolute;
    top: -48px;
    left: 1rem;
    width: 96px;
    height: 96px;
    border-radius: 0.75rem;
    background-color: var(--color-background-2);
    overflow: hidden;

    & img {
      width: 100%;
      height: 100%;
    }
  }

  & .group-title {
    margin-left: calc(96px + 0.5rem);
    font-size: var(--text-2xl);
    font-weight: var(--font-weight-bold);
  }
}

.group-content {
  padding: 1rem;
}

.btn-cta-round {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 48px;
  height: 48px;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  border-radius: 999px;

  &.expand {
    width: 108px;
  }
}
</style>
