<template>
  <Header />
  <section class="search-section p-4">
    <SearchInput />
  </section>
  <section class="section-list bg-background-2 p-4">
    <h2 class="text-lg font-semibold mb-2">1조</h2>
    <FriendListCard />
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
</script>
<style scoped></style>
