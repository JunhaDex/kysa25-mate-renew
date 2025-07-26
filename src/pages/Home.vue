<template>
  <Header />
  <section class="section-intro">
    <div class="home-hero">
      <div class="hero-image">
        <img src="@/assets/images/hero_main.png" alt="main-hero" />
      </div>
      <div class="hero-title">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4">신입생 여러분을 환영합니다!</h2>
        <p class="mb-2">3박 4일의 청년대회 함께 즐겨요~</p>
        <button class="s-btn btn-primary">환영받기</button>
      </div>
    </div>
    <div class="home-about s-safe-area my-4">
      <h1 class="text-lg font-bold mb-2">바로가기</h1>
      <div class="flex justify-center items-center gap-4">
        <a href="#">
          <div class="tray-item">
            <CalendarDays :size="36" />
            <span class="text-sm font-semibold text-nowrap">대회일정</span>
          </div>
        </a>
        <a href="#">
          <div class="tray-item">
            <Blocks :size="36" />
            <span class="text-sm font-semibold text-nowrap">동아리방</span>
          </div>
        </a>
        <a href="#">
          <div class="tray-item">
            <BusFront :size="36" />
            <span class="text-sm font-semibold text-nowrap">셔틀버스</span>
          </div>
        </a>
        <a href="#">
          <div class="tray-item">
            <BadgeInfo :size="36" />
            <span class="text-sm font-semibold text-nowrap">필독사항</span>
          </div>
        </a>
      </div>
    </div>
    <div class="home-message s-safe-area mb-4">
      <h1 class="text-lg font-bold mb-2">대회 소개</h1>
      <p class="font-bold mb-2">수강중인 강의</p>
      <div class="s-card mb-4">
        <p class="font-semibold mb-2">2025 그리스도에게로 나아옴 101</p>
        <p class="text-sm text-shadow-tx-gray-3">강의 소개: ...</p>
      </div>
      <div class="banner">
        <div class="left">
          <img src="@/assets/images/ad_script.png" alt="banner" />
        </div>
        <div class="right">
          <h3 class="text-lg font-bold mb-2 text-tx-primary">주제 성구 - 교성 88:63</h3>
          <p class="text-sm text-shadow-tx-gray-3">
            "너희는 먼저 그의 나라와 그의 의를 구하라 그리하면 이 모든 것을 너희에게 더하시리라"
          </p>
        </div>
      </div>
    </div>
  </section>
  <section class="section-schedule bg-background-2 py-4">
    <div class="home-content s-safe-area mb-4">
      <h1 class="text-lg font-bold mb-2">일자별 주제</h1>
      <div class="s-card">
        <ul>
          <li>첫째날(8/14): '오라' 청년대회에 온 것을 환영하며, 주님께 함께 가까이 가기.</li>
          <li>
            둘째날(8/15): '찾으라' 하나님의 자녀라는 정체성을 가지고 그 정체성을 공유하는 친구들과
            즐거움을 찾기.
          </li>
          <li>
            셋째날(8/16): '구하라' 주님과 성약을 맺고, 이 생을 살아갈 힘과 소망하는 것들을 얻을 힘을
            구하기
          </li>
          <li>넷째날(8/17): '두드리라' 간증을 가지고 앞으로 나아가기.</li>
        </ul>
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
import { CalendarDays, Blocks, BusFront, BadgeInfo } from 'lucide-vue-next'
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
  position: relative;
  background-color: var(--color-background-2);
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;

  @media (min-width: 640px) {
    aspect-ratio: 4 / 3;
  }

  & img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    height: 100%;
    max-width: none;
    transform: translateX(-50%);
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

.tray-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
}

.banner {
  display: flex;
  align-items: stretch;
  gap: 1rem;
  background-color: var(--color-bg-primary);
  border-radius: 0.75rem;
  padding: 1rem;

  & .left {
    position: relative;
    display: inline-block;
    width: 176px;
    max-width: 28%;
    height: 112px;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: var(--color-bg-secondary);

    & img {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      height: 100%;
      max-width: none;
    }
  }

  & .right {
    flex: 1;
  }
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
