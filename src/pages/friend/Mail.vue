<template>
  <Header />
  <section class="search-section p-4">
    <SearchInput
      class="mb-2"
      v-model="searchWord"
      placeholder="친구이름 및 조별 검색"
      @update:model-value="searchFriendList"
    />
    <p class="text-sm font-medium px-2">{{ userSelectRecipient.length }}명 선택됨</p>
  </section>
  <section class="section-list bg-background-1 p-4">
    <div v-for="friend in friendList" :key="friend.id" class="friend-select">
      <div class="inner">
        <label class="checkbox checkbox-sm mr-2">
          <input type="checkbox" :value="friend.id" @change="handleCheckboxChange" />
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
    <button class="s-btn btn-primary btn-cta-round" @click="isOpenConfirm = true">
      <span class="text-lg text-nowrap text-center">전송하기</span>
    </button>
    <Modal :is-open="mailAuth.isOpen">
      <div class="s-modal p-4">
        <h2 class="text-2xl font-semibold mb-4">접근 제한 구역</h2>
        <div>
          <p>
            허용된 사용자만 접근할 수 있습니다. 비밀번호를 입력하세요. <br />
            서비스 로그인이 필요합니다.
          </p>
          <div class="s-input-wrap mb-4">
            <input
              v-model="mailAuth.userKey"
              id="mailRoomKeyInput"
              type="password"
              class="s-input-field"
              placeholder="******"
            />
          </div>
        </div>
        <button class="s-btn btn-primary w-full" @click="requestAccess" :disabled="isLocked">
          <span v-if="isLocked" class="icon icon-loading" />
          <span v-else>인증하기</span>
        </button>
      </div>
    </Modal>
    <Modal :is-open="isOpenConfirm" @close-modal="isOpenConfirm = false">
      <div class="s-modal p-4">
        <h2 class="text-2xl font-semibold mb-4">편지 알림 전송</h2>
        <p class="text-sm mb-4">선택한 {{ userSelectRecipient.length }}명에게 메세지를 보냅니다.</p>
        <div class="flex justify-between gap-2">
          <button class="s-btn btn-secondary w-full" @click="isOpenConfirm = false">취소</button>
          <button class="s-btn btn-primary w-full" @click="sendPostmanAlert" :disabled="isLocked">
            <span v-if="isLocked" class="icon icon-loading" />
            <span v-else>보내기</span>
          </button>
        </div>
      </div>
    </Modal>
  </section>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import { usePagination } from '@/compositions/pages.comp.ts'
import { onMounted, ref } from 'vue'
import type { Friend } from '@/types/friend.type.ts'
import { FriendService } from '@/services/friend.service.ts'
import ScrollObserver from '@/components/layouts/ScrollObserver.vue'
import SkeletonFactory from '@/components/surfaces/SkeletonFactory.vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { ChatService } from '@/services/chat.service.ts'
import Modal from '@/components/feedbacks/Modal.vue'
import { useLockHandler } from '@/compositions/process.comp.ts'
import { sleep } from '@/utils/use.util.ts'
import { useUiStore } from '@/stores/ui.store.ts'

const router = useRouter()
const uiStore = useUiStore()
const friendSvc = new FriendService()
const chatSvc = new ChatService()
const { pageInfo, onLoad, hasMore, fetchListData } = usePagination()
const { isLocked, lockProcess } = useLockHandler()
const friendList = ref<Friend[]>([])
const userSelectRecipient = ref<Friend[]>([])
const searchWord = ref<string>('')
const mailAuth = ref<{
  isOpen: boolean
  userKey: string
}>({
  isOpen: false,
  userKey: '',
})
const isOpenConfirm = ref(false)

onMounted(async () => {
  mailAuth.value.isOpen = true
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

async function handleCheckboxChange(event: Event) {
  const target = event.target as HTMLInputElement
  const friend = friendList.value.find((f) => f.id === Number(target.value))
  if (target.checked && friend) {
    userSelectRecipient.value.push(friend)
  } else {
    userSelectRecipient.value = userSelectRecipient.value.filter(
      (f) => f.id !== Number(target.value),
    )
  }
}

async function requestAccess() {
  const res = await lockProcess<boolean>(() => chatSvc.authPostmanAccess(mailAuth.value.userKey))
  if (res) {
    mailAuth.value.isOpen = false
  } else {
    router.push('/')
  }
}

async function sendPostmanAlert() {
  if (mailAuth.value.userKey === '') {
    userSelectRecipient.value = []
    isOpenConfirm.value = false
    await sleep(0)
    mailAuth.value.isOpen = true
    return
  }
  const userRefs = userSelectRecipient.value.map((f) => f.ref)
  if (userRefs.length > 0) {
    try {
      await lockProcess(async () => chatSvc.sendPostmanAlert(userRefs, mailAuth.value.userKey))
      userSelectRecipient.value = []
      uiStore.showToast('알림이 전송되었습니다.', 'success')
    } catch (e) {
      console.error(e)
      uiStore.showToast('전송 실패', 'error')
    }
  }
  isOpenConfirm.value = false
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
