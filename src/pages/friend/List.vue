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
      <FriendListCard :list="friends" />
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

const friendSvc = new FriendService()
const { pageInfo, onLoad, hasMore, fetchListData } = usePagination()
const friendList = ref<Friend[]>([])
const searchWord = ref<string>('')
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
</script>
<style scoped>
.section-list {
  min-height: calc(100vh - 135px);
}
</style>
