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
      <h1 class="text-lg font-bold mb-2">일자별 주제</h1>
      <div class="s-card">
        foo
      </div>
    </div>
    <div class="home-content s-safe-area mb-4">
      <h1 class="text-lg font-bold mb-2">대회 일정</h1>
      <div class="s-card">
        <div class="timetable-grid">
          <div></div>
          <div class="day-label">
            <span class="text-xs font-semibold">8/14 목</span>
          </div>
          <div class="day-label">
            <span class="text-xs font-semibold">8/15 금</span>
          </div>
          <div class="day-label">
            <span class="text-xs font-semibold">8/16 토</span>
          </div>
          <div class="day-label">
            <span class="text-xs font-semibold">8/17 일</span>
          </div>

          <template v-for="idx in timeDiff" :key="idx">
            <div class="time-label">
              <span class="text-xs font-semibold text-nowrap">{{
                dayjs(timetable.timeframe.start, 'HH:mm')
                  .add(idx - 1, 'hour')
                  .format('h:mm A')
              }}</span>
            </div>
            <div v-for="dd in 4" :key="`${dd}.${idx}`" class="grid-slot"></div>
          </template>
        </div>
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
import { computed, ref } from 'vue'
import dayjs from 'dayjs'

const timetable = ref<{
  timeframe: {
    start: string
    end: string
  }
}>({
  timeframe: {
    start: '09:00',
    end: '23:00',
  },
})
const timeDiff = computed<number>(() => {
  const start = dayjs(timetable.value.timeframe.start, 'HH:mm')
  const end = dayjs(timetable.value.timeframe.end, 'HH:mm')
  console.log(start, end)
  return end.diff(start, 'hour') + 1
})
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

.profile-wrap {
  display: inline-block;
  text-align: center;

  & .profile-image {
    background-color: var(--color-background-2);
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin: 0 auto;
  }
}

.timetable-grid {
  position: relative;
  display: grid;
  grid-template-columns: 60px repeat(4, 1fr);
  gap: 4px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;

  & .time-label,
  & .day-label {
    text-align: center;
    padding: 5px;
  }

  & .day-label {
    font-weight: bold;
  }

  & .grid-slot {
    position: relative;
    background-color: var(--color-background-2);
    height: 50px;
    transition: background-color 0.15s ease-in-out;
    border-radius: 0.5rem;
  }
}
</style>
