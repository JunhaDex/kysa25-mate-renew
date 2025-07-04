<template>
  <Header />
  <section class="section-intro">
    <div class="home-hero">
      <div class="hero-image"></div>
      <div class="hero-title">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4">신입생 여러분을 환영합니다!</h2>
        <p class="mb-2">3박 4일의 청년대회 함께 즐겨요~</p>
        <button class="s-btn btn-primary">환영받기</button>
      </div>
    </div>
    <div class="home-about s-safe-area my-4">
      <h1 class="text-lg font-bold mb-2">바로가기</h1>
      <div class="flex justify-center items-center gap-4">
        <a href="/schedule" class="s-btn btn-secondary">대회 일정</a>
        <a href="/schedule" class="s-btn btn-secondary">동아리방</a>
        <a href="/notice" class="s-btn btn-secondary">셔틀버스</a>
        <a href="/faq" class="s-btn btn-secondary">대회 필독</a>
      </div>
    </div>
    <div class="home-message s-safe-area mb-4">
      <h1 class="text-lg font-bold mb-2">대회 소개</h1>
      <p class="font-bold mb-2">수강중인 강의</p>
      <div class="s-card mb-4">
        <p class="font-semibold mb-2">2025 그리스도에게로 나아옴 101</p>
        <p class="text-sm text-shadow-tx-gray-3">강의 소개: ...</p>
      </div>
      <div class="banner bg-bg-primary p-4 rounded-lg">
        <h3 class="text-lg font-bold mb-2 text-tx-primary">주제 성구</h3>
        <p class="text-sm text-shadow-tx-gray-3">
          "너희는 먼저 그의 나라와 그의 의를 구하라 그리하면 이 모든 것을 너희에게 더하시리라"
        </p>
      </div>
    </div>
  </section>
  <section class="section-schedule bg-background-2 py-4">
    <div class="home-content s-safe-area mb-4">
      <h1 class="text-lg font-bold mb-2">환영사</h1>
      <div class="s-card">
        <p>환영합니다 환영합니다 환영합니다</p>
      </div>
    </div>
    <div class="home-content s-safe-area mb-4">
      <h1 class="text-lg font-bold mb-2">대회 일정</h1>
      <div class="s-card">
        <p>환영합니다 환영합니다 환영합니다</p>
      </div>
    </div>
  </section>
  <div class="bg-background-2">
    <Footer />
  </div>
</template>
<script lang="ts" setup>
import Header from '@/components/layouts/Header.vue'
import Footer from '@/components/layouts/Footer.vue'
</script>
<style scoped>
.home-hero {
  position: relative;
}

.hero-image {
  background-color: var(--color-background-2);
  width: 100%;
  aspect-ratio: 1;

  @media (min-width: 640px) {
    aspect-ratio: 4 / 3;
  }
}

.hero-title {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
