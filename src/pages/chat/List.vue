<template>
  <Header />
  <div class="s-progress" :class="{ hidden: isReady }"></div>
  <section class="section-list bg-background-2 p-4">
    <h2 class="text-lg font-semibold mb-2">최근 메세지</h2>
    <ChatListCard v-for="(room, index) in roomList" :key="index" :room="room" class="mb-4" />
    <ScrollObserver @load-more="fetchNext" />
  </section>
  <div class="bg-background-2">
    <Footer />
  </div>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import ChatListCard from '@/components/display/chat/ChatListCard.vue'
import Footer from '@/components/layouts/Footer.vue'
import { onMounted, ref } from 'vue'
import { ChatService } from '@/services/chat.service.ts'
import type { ChatRoom } from '@/types/chat.type.ts'
import { usePagination } from '@/compositions/pages.comp.ts'
import ScrollObserver from '@/components/layouts/ScrollObserver.vue'
import { useLoadHandler } from '@/compositions/loading.comp.ts'

const chatSvc = new ChatService()
const { pageInfo, onLoad, hasMore, fetchListData } = usePagination()
const { isReady, setReady } = useLoadHandler()
const roomList = ref<ChatRoom[]>([])

onMounted(async () => {
  await fetchChatList()
  setReady()
})

async function fetchChatList() {
  roomList.value = await fetchListData(
    chatSvc.listChats({
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
    chatSvc.listChats({
      page: {
        page: pageInfo.value.pageNo + 1,
        size: pageInfo.value.pageSize,
      },
    }),
  )
  roomList.value.push(...list)
}
</script>
<style scoped>
.section-list {
  min-height: calc(100vh - 112px);
}
</style>
