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
</script>
<style scoped></style>
