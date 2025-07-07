<template>
  <div class="s-card">
    <div class="friend-card">
      <div class="friend-title">
        <h3 class="text-lg font-bold">김준하</h3>
        <p class="text-xs font-medium text-shadow-tx-gray-3">경기 수지</p>
      </div>
      <div class="friend-title">
        <h3 class="text-lg font-bold">김준하</h3>
        <p class="text-xs font-medium text-shadow-tx-gray-3">경기 수지</p>
      </div>
      <div class="friend-title">
        <h3 class="text-lg font-bold">김준하</h3>
        <p class="text-xs font-medium text-shadow-tx-gray-3">경기 수지</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.friend-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin: 0.25rem 0.5rem;
  border-bottom: 1px solid var(--color-border-default);
  transition: all 0.15s ease-in-out;
  border-radius: 0.25rem;

  &:first-child {
    margin-top: 0;
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: none;
  }

  &:active {
    background-color: var(--color-background-3);
    transform: scale(0.98);
  }
}
</style>
