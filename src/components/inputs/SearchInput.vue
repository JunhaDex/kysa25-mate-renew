<template>
  <div class="s-input-wrap">
    <div class="s-input-box">
      <input class="s-input-field" type="text" placeholder="동아리명으로 검색" />
      <Search :size="24" class="s-icon input-suffix" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Search } from 'lucide-vue-next'
</script>
