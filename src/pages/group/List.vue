<template>
  <Header />
  <section class="section-search bg-background-1 p-4">
    <SearchInput
      v-model="searchWord"
      placeholder="동아리명으로 검색"
      @update:model-value="searchGroupList"
    />
  </section>
  <section class="section-list bg-background-2 p-4">
    <GroupListCard v-for="(group, index) in groupList" :key="index" :group="group" class="mb-4" />
    <SkeletonFactory
      v-if="hasMore && onLoad"
      :setups="['list-card', 'list-card', 'list-card', 'list-card', 'list-card']"
    />
    <div v-else-if="!onLoad && groupList.length === 0" class="no-result">
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
import Footer from '@/components/layouts/Footer.vue'
import SearchInput from '@/components/inputs/SearchInput.vue'
import GroupListCard from '@/components/display/groups/GroupListCard.vue'
import { GroupService } from '@/services/group.service.ts'
import { onMounted, ref } from 'vue'
import type { Group } from '@/types/group.type.ts'
import SkeletonFactory from '@/components/surfaces/SkeletonFactory.vue'
import { usePagination } from '@/compositions/pages.comp.ts'
import { useDebounceFn } from '@vueuse/core'
import ScrollObserver from '@/components/layouts/ScrollObserver.vue'

const groupSvc = new GroupService()
const { pageInfo, onLoad, hasMore, fetchListData } = usePagination()
const groupList = ref<Group[]>([])
const searchWord = ref<string>('')

onMounted(async () => {
  await fetchGroupList()
})

async function fetchGroupList() {
  groupList.value = await fetchListData(
    groupSvc.listGroups({
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
    groupSvc.listGroups({
      page: {
        page: pageInfo.value.pageNo + 1,
        size: pageInfo.value.pageSize,
      },
      name: searchWord.value || undefined,
    }),
  )
  groupList.value.push(...list)
}

const debounceSearch = useDebounceFn(async () => {
  console.log('search: ', searchWord.value)
  await fetchGroupList()
}, 300)

async function searchGroupList() {
  pageInfo.value.totalPage = 0
  groupList.value = []
  await debounceSearch()
}
</script>
<style scoped>
.section-list {
  min-height: calc(100vh - 135px);
}
</style>
