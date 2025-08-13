<template>
  <Header />
  <section class="search-section p-4">
    <SearchInput
      v-model="searchWord"
      placeholder="친구이름 및 조별 검색"
      @update:model-value="searchFriendList"
    />
  </section>
  <section class="section-list bg-background-2 p-4">
    <template v-for="(friends, team) in groupByTeam" :key="team">
      <h2 class="text-lg font-semibold mb-2">{{ team }}</h2>
      <FriendListCard :list="friends" @select-friend="selectFriend" class="mb-4" />
    </template>
    <SkeletonFactory
      v-if="hasMore && onLoad"
      :setups="['list-card', 'list-card', 'list-card', 'list-card', 'list-card']"
    />
    <div v-else-if="!onLoad && friendList.length === 0" class="no-result">
      <span>검색 결과가 없습니다.</span>
    </div>
    <ScrollObserver @load-more="fetchNext" />
  </section>
  <div class="bg-background-2">
    <Footer />
  </div>
  <Modal :is-open="friendInfo.isOpen" @close-modal="friendInfo.isOpen = false">
    <div class="s-modal py-4">
      <div v-if="friendInfo.friend" class="user-profile mb-4">
        <div class="profile">
          <img
            :src="friendInfo.friend.profileImg"
            @error="(e) => ((e.target! as HTMLImageElement).src = ProfileDefault)"
          />
        </div>
        <div class="flow-sign font-mono mt-4 mb-2">
          <span class="sign-content">
            KYSA2025 MATE APP KYSA2025 MATE APP KYSA2025 MATE APP KYSA2025 MATE APP KYSA2025 MATE
            APP KYSA2025 MATE APP KYSA2025 MATE APP KYSA2025 MATE APP
          </span>
          <span class="sign-content">
            KYSA2025 MATE APP KYSA2025 MATE APP KYSA2025 MATE APP KYSA2025 MATE APP KYSA2025 MATE
            APP KYSA2025 MATE APP KYSA2025 MATE APP KYSA2025 MATE APP
          </span>
        </div>
        <h2 class="text-2xl font-semibold">{{ friendInfo.friend.nickname }}</h2>
        <div class="text-tx-gray-2 text-sm font-semibold mb-2">
          {{ friendInfo.friend.team.teamName }}
        </div>
        <p class="introduce" :class="{ 'text-tx-gray-3': !friendInfo.friend.introduce }">
          {{ friendInfo.friend.introduce || '등록된 상태 메세지가 없습니다.' }}
        </p>
      </div>
      <div class="flex justify-between items-center gap-2 px-4">
        <button class="s-btn btn-primary w-full block" @click="getChatRoom" :disabled="isLocked">
          <span v-if="isLocked" class="icon icon-loading" />
          <span v-else>메세지 보내기</span>
        </button>
        <button
          class="s-btn btn-secondary w-full block"
          @click="router.push(`/friend/${friendInfo.friend?.ref}`)"
        >
          프로필 상세
        </button>
      </div>
    </div>
  </Modal>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import FriendListCard from '@/components/display/friends/FriendListCard.vue'
import Footer from '@/components/layouts/Footer.vue'
import { usePagination } from '@/compositions/pages.comp.ts'
import { computed, onMounted, ref } from 'vue'
import type { Friend } from '@/types/friend.type.ts'
import { FriendService } from '@/services/friend.service.ts'
import ScrollObserver from '@/components/layouts/ScrollObserver.vue'
import SkeletonFactory from '@/components/surfaces/SkeletonFactory.vue'
import { useDebounceFn } from '@vueuse/core'
import Modal from '@/components/feedbacks/Modal.vue'
import { useRouter } from 'vue-router'
import { ChatService } from '@/services/chat.service.ts'
import ProfileDefault from '@/assets/images/profile_empty.png'
import { useLockHandler } from '@/compositions/process.comp.ts'

const router = useRouter()
const friendSvc = new FriendService()
const chatSvc = new ChatService()
const { pageInfo, onLoad, hasMore, fetchListData } = usePagination()
const { isLocked, lockProcess } = useLockHandler()
const friendList = ref<Friend[]>([])
const searchWord = ref<string>('')
const friendInfo = ref<{
  isOpen: boolean
  friend: Friend | null
}>({
  isOpen: false,
  friend: null,
})
const groupByTeam = computed<Record<string, Friend[]>>(() => {
  return friendList.value.reduce(
    (acc, friend) => {
      const team = friend.team.teamName
      if (!acc[team]) {
        acc[team] = []
      }
      acc[team].push(friend)
      return acc
    },
    {} as Record<string, Friend[]>,
  )
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
  if (!hasMore.value || onLoad.value) return
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
    let roomRef
    await lockProcess(async () => {
      roomRef = await chatSvc.getChatRoomRef(friendInfo.value.friend!.ref)
    })
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

.user-profile {
  text-align: center;

  & .profile {
    width: 96px;
    height: 96px;
    background-color: var(--color-background-3);
    border-radius: 50%;
    margin: 0 auto;
    overflow: hidden;

    & img {
      width: 100%;
      height: 100%;
    }
  }
}

.flow-sign {
  width: 100%;
  height: 1.6rem;
  background-color: var(--color-black);
  color: var(--color-white);
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
}

.sign-content {
  display: inline-block;
  padding-right: 4px;
  animation: ticker 20s linear infinite;
  font-size: 0.7rem;
  line-height: 1rem;
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
