<template>
  <Header />
  <section class="section-search bg-background-1 p-4">
    <SearchInput />
  </section>
  <section class="section-list bg-background-2 p-4">
    <GroupListCard />
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
</script>
<style scoped></style>
