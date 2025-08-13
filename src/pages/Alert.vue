<template>
  <Header :has-back="true" title="알림" />
  <div class="s-progress" :class="{ hidden: isReady }"></div>
  <section class="section-list py-4">
    <h2 class="text-lg font-semibold mb-4 px-4">최근 활동</h2>
    <AlertListItem v-for="noti in notiList" :key="noti.id" :item="noti" />
    <ScrollObserver @load-more="fetchNext" />
  </section>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import { useLoadHandler } from '@/compositions/loading.comp.ts'
import { onMounted, ref } from 'vue'
import { usePagination } from '@/compositions/pages.comp.ts'
import { AlertService } from '@/services/alert.service.ts'
import type { Notification } from '@/types/common.type.ts'
import AlertListItem from '@/components/display/alert/AlertListItem.vue'
import ScrollObserver from '@/components/layouts/ScrollObserver.vue'

const alertSvc = new AlertService()
const { isReady, setReady } = useLoadHandler()
const { pageInfo, onLoad, hasMore, fetchListData } = usePagination()
const notiList = ref<Notification[]>([])

onMounted(async () => {
  notiList.value = await fetchListData<Notification>(alertSvc.listNotifications())
  setReady()
  const ids = notiList.value.map((item) => item.id)
  try {
    await alertSvc.markAsRead({ ids })
  } catch (e) {
    console.error(e)
  }
})

async function fetchNext() {
  if (!hasMore.value || onLoad.value) return
  const list = await fetchListData<Notification>(
    alertSvc.listNotifications({
      page: {
        page: pageInfo.value.pageNo + 1,
      },
    }),
  )
  notiList.value.push(...list)
}
</script>
<style scoped>
</style>
