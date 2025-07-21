<template>
  <Header />
  <section class="section-list bg-background-2 p-4">
    <h2 class="text-lg font-semibold mb-2">최근 메세지</h2>
    <ChatListCard />
  </section>
  <div class="bg-background-2">
    <Footer />
  </div>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import ChatListCard from '@/components/display/chat/ChatListCard.vue'
import Footer from '@/components/layouts/Footer.vue'
import { onMounted } from 'vue'
import { ChatService } from '@/services/chat.service.ts'

const chatSvc = new ChatService()

onMounted(async () => {
  await fetchChatList()
})

async function fetchChatList() {
  await chatSvc.listChats()
}
</script>
<style scoped>
.section-list {
  min-height: calc(100vh - 112px);
}
</style>
