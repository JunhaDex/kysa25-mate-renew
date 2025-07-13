<template>
  <Header />
  <section class="section-search bg-background-1 p-4">
    <SearchInput />
  </section>
  <section class="section-list bg-background-2 p-4">
    <GroupListCard v-for="(group, index) in groupList" :key="index" :group="group" class="mb-4" />
    <SkeletonFactory :setups="['list-card']" />
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
import type { PageMeta } from '@/types/common.type.ts'
import SkeletonFactory from '@/components/surfaces/SkeletonFactory.vue'

const groupSvc = new GroupService()
const groupList = ref<Group[]>([])
const pageInfo = ref<PageMeta>({
  pageNo: 1,
  pageSize: 10,
  totalPage: 0,
  totalCount: 0,
})
onMounted(async () => {
  await fetchGroupList()
})

async function fetchGroupList() {
  const res = await groupSvc.listGroups()
  groupList.value = res.list
  pageInfo.value = res.meta
}
</script>
<style scoped></style>
