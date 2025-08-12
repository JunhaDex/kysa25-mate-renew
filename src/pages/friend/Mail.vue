<template>
  <Header />
  <section class="search-section p-4">
    <SearchInput
      class="mb-2"
      v-model="searchWord"
      placeholder="친구이름 및 조별 검색"
      @update:model-value="searchFriendList"
    />
    <p class="text-sm font-medium px-2">0명 선택됨</p>
  </section>
  <section class="section-list bg-background-1 p-4">
    <div v-for="friend in friendList" :key="friend.id" class="friend-select">
      <div class="inner">
        <label class="checkbox checkbox-sm mr-2">
          <input type="checkbox" />
          <span class="control"></span>
        </label>
        <div class="flex-1">
          <span class="text-xs leading-[10px] text-shadow-tx-gray-3">
            {{ friend.team.teamName }}</span
          >
          <h3 class="text-lg font-bold">{{ friend.nickname }}</h3>
        </div>
        <p class="text-xs font-medium text-shadow-tx-gray-3">{{ friend.geo }}</p>
      </div>
    </div>
    <!--    <template v-for="friend in friendList" :key="friend.id">-->
    <!--      <h2 class="text-lg font-semibold mb-2">{{ team }}</h2>-->
    <!--      <FriendListCard :list="friends" @select-friend="selectFriend" />-->
    <!--    </template>-->
    <SkeletonFactory
      v-if="hasMore && onLoad"
      :setups="['list-card', 'list-card', 'list-card', 'list-card', 'list-card']"
    />
    <div v-else-if="!onLoad && friendList.length === 0" class="no-result">
      <span>검색 결과가 없습니다.</span>
    </div>
    <ScrollObserver @load-more="fetchNext" />
    <button class="s-btn btn-primary btn-cta-round">
      <span class="text-lg text-nowrap text-center">전송하기</span>
    </button>
  </section>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import FriendListCard from '@/components/display/friends/FriendListCard.vue'
import { usePagination } from '@/compositions/pages.comp.ts'
import { computed, onMounted, ref } from 'vue'
import type { Friend } from '@/types/friend.type.ts'
import { FriendService } from '@/services/friend.service.ts'
import ScrollObserver from '@/components/layouts/ScrollObserver.vue'
import SkeletonFactory from '@/components/surfaces/SkeletonFactory.vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { ChatService } from '@/services/chat.service.ts'

const router = useRouter()
const friendSvc = new FriendService()
const chatSvc = new ChatService()
const { pageInfo, onLoad, hasMore, fetchListData } = usePagination()
const friendList = ref<Friend[]>([])
const searchWord = ref<string>('')
const friendInfo = ref<{
  isOpen: boolean
  friend: Friend | null
}>({
  isOpen: false,
  friend: null,
})

onMounted(async () => {
  await fetchFriendList()
})

async function fetchFriendList() {
  friendList.value = await fetchListData(
    friendSvc.listFriends({
      page: {
        page: pageInfo.value.pageNo,
        size: pageInfo.value.pageSize,
      },
      name: searchWord.value || undefined,
    }),
  )
}

async function fetchNext() {
  const list = await fetchListData(
    friendSvc.listFriends({
      page: {
        page: pageInfo.value.pageNo + 1,
        size: pageInfo.value.pageSize,
      },
    }),
  )
  friendList.value.push(...list)
}

const debounceSearch = useDebounceFn(async () => {
  console.log('search: ', searchWord.value)
  await fetchFriendList()
}, 300)

async function searchFriendList() {
  pageInfo.value.totalPage = 0
  await debounceSearch()
}

async function selectFriend(friend: Friend) {
  friendInfo.value.isOpen = true
  friendInfo.value.friend = friend
}

async function getChatRoom() {
  if (friendInfo.value.friend) {
    const roomRef = await chatSvc.getChatRoomRef(friendInfo.value.friend.ref)
    if (roomRef) {
      router.push(`/chat/${roomRef}`)
    }
  }
}
</script>
<style scoped>
.section-list {
  min-height: calc(100vh - 135px);
}

.friend-select {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--color-border-default);

  & .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    transition: transform 0.15s ease-in-out;
  }
}

.btn-cta-round {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  transform: translateX(0);
  border-radius: 999px;

  @media (min-width: 768px) {
    right: 50%;
    transform: translateX(368px);
  }
}

@keyframes ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
