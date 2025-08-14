<template>
  <Header />
  <section class="section-intro">
    <div class="home-hero">
      <div class="hero-image">
        <img src="@/assets/images/hero_main.png" alt="main-hero" />
      </div>
      <div class="hero-title">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4">신입생 여러분을 환영합니다!</h2>
        <div class="relative">
          <button class="s-btn btn-primary text-lg" @click="openWelcome">환영받기</button>
          <span class="btn-tail-label text-xs font-medium text-tx-gray-3">
            버튼을 눌러보세요
            <MousePointerClick :size="12" />
          </span>
        </div>
      </div>
    </div>
    <div class="home-about s-safe-area my-4">
      <h1 class="text-lg font-bold mb-2">바로가기</h1>
      <div class="flex justify-center items-center gap-4">
        <div class="tray-item" @click="scrollToTimetable">
          <CalendarDays :size="36" />
          <span class="text-sm font-semibold text-nowrap">대회일정</span>
        </div>
        <router-link to="/group">
          <div class="tray-item">
            <Blocks :size="36" />
            <span class="text-sm font-semibold text-nowrap">동아리방</span>
          </div>
        </router-link>
        <a
          href="https://early-ton-133.notion.site/2025-KYSA-24cd9c5d4423801a90c8cea1d08d5393?source=copy_link"
          target="_blank"
        >
          <div class="tray-item" @click="scrollToMap">
            <FerrisWheel :size="36" />
            <span class="text-sm font-semibold text-nowrap">프로그램</span>
          </div>
        </a>
        <a href="https://linktr.ee/hminje" target="_blank">
          <div class="tray-item">
            <BadgeInfo :size="36" />
            <span class="text-sm font-semibold text-nowrap">안내사항</span>
          </div>
        </a>
      </div>
    </div>
    <div class="home-message s-safe-area mb-4">
      <h1 class="text-lg font-bold mb-2">대회 소개</h1>
      <p class="font-bold mb-2">수강중인 강의</p>
      <div class="s-card mb-4">
        <p class="font-semibold mb-2">2025 그리스도에게로 나아옴 101</p>
        <p class="text-sm text-shadow-tx-gray-3">
          예수 그리스도의 가르침을 배우고 삶에 적용하며 하나님의 자녀로써 함께 나아갑니다. 일자별
          주제를 통해 영적 발전을 이루고 강화됩니다
        </p>
      </div>
      <div class="banner">
        <div class="left">
          <img src="@/assets/images/ad_script.png" alt="banner" />
        </div>
        <div class="right">
          <h3 class="text-lg font-bold mb-2 text-tx-primary">주제 성구 - 교성 88:63</h3>
          <p class="text-sm text-shadow-tx-gray-3">
            "내게 가까이 오라. 그리하면 내가 너희에게 가까이 가리라."
          </p>
        </div>
      </div>
    </div>
  </section>
  <section class="section-schedule bg-background-2 py-4">
    <div class="home-content s-safe-area mb-4">
      <h1 class="text-lg font-bold mb-2">일자별 주제</h1>
      <div class="s-card">
        <div class="topic">
          <div class="topic-icon day-1">
            <img src="@/assets/images/topic_day1.png" alt="day1-icon" />
          </div>
          <div>
            <h3 class="title">첫째날(8/14)&nbsp;<b>'오라'</b></h3>
            청년대회에 온 것을 환영하며, 주님께 함께 가까이 가기.
          </div>
        </div>
      </div>
      <div class="s-card">
        <div class="topic">
          <div class="topic-icon day-2">
            <img src="@/assets/images/topic_day2.png" alt="day1-icon" />
          </div>
          <div>
            <h3 class="title">둘째날(8/15) &nbsp;<b>'찾으라'</b></h3>
            하나님의 자녀라는 정체성을 가지고 그 정체성을 공유하는 친구들과 즐거움을 찾기.
          </div>
        </div>
      </div>
      <div class="s-card">
        <div class="topic">
          <div class="topic-icon day-3">
            <img src="@/assets/images/topic_day3.png" alt="day1-icon" />
          </div>
          <div>
            <h3 class="title">셋째날(8/16)&nbsp; <b>'구하라'</b></h3>
            주님과 성약을 맺고, 이 생을 살아갈 힘과 소망하는 것들을 얻을 힘을 구하기
          </div>
        </div>
      </div>
      <div class="s-card">
        <div class="topic">
          <div class="topic-icon day-4">
            <img src="@/assets/images/topic_day4.png" alt="day1-icon" />
          </div>
          <div>
            <h3 class="title">넷째날(8/17)&nbsp;<b>'두드리라'</b></h3>
            간증을 가지고 앞으로 나아가기.
          </div>
        </div>
      </div>
    </div>
    <div class="home-content s-safe-area mb-4" id="TimeSchduleBox">
      <h1 class="text-lg font-bold mb-2">대회 일정</h1>
      <div class="s-card">
        <div class="timetable-grid">
          <div>
            <!--Empty cell for grid alignment-->
          </div>
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
                  .format('h A')
              }}</span>
            </div>
            <div v-for="dd in 4" :key="`${dd}.${idx}`" class="grid-slot"></div>
          </template>
          <div
            v-for="(event, idx) in eventList"
            :key="`e${idx}`"
            class="time-box"
            :style="event.style"
          >
            <div class="text-[10px] leading-[10px] font-medium text-tx-gray-3 mb-1">
              {{ dayjs(event.begin, 'HH:mm').format('h:mm A') }} -
              {{ dayjs(event.end, 'HH:mm').format('h:mm A') }}
            </div>
            <span class="title">{{ event.title }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="home-content s-safe-area mb-4" id="CampusMap">
      <h1 class="text-lg font-bold">대회 지도</h1>
      <p class="text-sm mb-2 text-tx-gray-3">이미지를 길게 눌러 - 새탭에서 이미지 열기</p>
      <div class="s-card">
        <div class="rounded-lg overflow-hidden">
          <img src="@/assets/images/campus_map.png" alt="Campus Map" />
        </div>
      </div>
    </div>
  </section>
  <div class="bg-background-2">
    <Footer />
  </div>
  <WelcomeDrop :is-open="isWelcome" @close="() => (isWelcome = false)" />
</template>
<script lang="ts" setup>
import Header from '@/components/layouts/Header.vue'
import Footer from '@/components/layouts/Footer.vue'
import { computed, onMounted, ref } from 'vue'
import { CalendarDays, Blocks, BadgeInfo, MousePointerClick, FerrisWheel } from 'lucide-vue-next'
import dayjs from 'dayjs'
import scheduleData from '@/assets/statics/schedule.json'
import WelcomeDrop from '@/components/display/WelcomeDrop.vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import { useUiStore } from '@/stores/ui.store.ts'
import router from '@/router'

const authStore = useAuthStore()
const uiStore = useUiStore()
const isWelcome = ref<boolean>(false)
const timetable = ref<{
  timeframe: {
    start: string
    end: string
  }
}>({
  timeframe: {
    start: '07:00',
    end: '22:00',
  },
})
const timeDiff = computed<number>(() => {
  const start = dayjs(timetable.value.timeframe.start, 'HH:mm')
  const end = dayjs(timetable.value.timeframe.end, 'HH:mm')
  return end.diff(start, 'hour') + 1
})
const eventList = computed<
  {
    begin: string
    end: string
    title: string
    color: string
    style: any
  }[]
>(() => {
  const gridStart = dayjs(timetable.value.timeframe.start, 'HH:mm').hour() * 60
  const gridHeight = 50
  const gridGap = 4
  const topOffset = (gridHeight + gridGap) / 60
  const events: {
    begin: string
    end: string
    title: string
    color: string
    style: any
  }[] = []
  let gridCol = 0
  const keys = Object.keys(scheduleData) as (keyof typeof scheduleData)[]
  for (const key of keys) {
    gridCol++
    scheduleData[key].forEach((event: any) => {
      const begin = dayjs(event.begin, 'HH:mm')
      const end = dayjs(event.end, 'HH:mm')
      const eventStart = begin.hour() * 60 + begin.minute()
      const duration = end.diff(begin, 'minute')
      const top = (eventStart - gridStart) * topOffset
      const height = duration * topOffset - gridGap
      events.push({
        ...event,
        style: {
          top: `${top + 36}px`,
          height: `${height}px`,
          backgroundColor: event.color,
          gridColumn: `${gridCol + 1} / span 1`,
        },
      })
    })
  }
  return events
})

function openWelcome() {
  if (!authStore.myInfo) {
    uiStore.showToast('로그인이 필요합니다')
    router.push('/login')
    return
  }
  isWelcome.value = true
}

function scrollToTimetable() {
  const element = document.querySelector('#TimeSchduleBox')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

function scrollToMap() {
  const element = document.querySelector('#CampusMap')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
<style scoped>
.home-hero {
  position: relative;
}

.hero-image {
  position: relative;
  background-color: var(--color-background-2);
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;

  @media (min-width: 640px) {
    aspect-ratio: 16 / 9;
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
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
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

.topic {
  display: flex;
  align-items: center;
  gap: 1rem;

  & h3 {
    font-size: var(--text-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: 0.5rem;
  }

  & .topic-icon {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    background-color: var(--color-background-2);

    &.day-1 {
      background-color: var(--color-teal-600);
    }

    &.day-2 {
      background-color: var(--color-orange-600);
    }

    &.day-3 {
      background-color: var(--color-blue-600);
    }

    &.day-4 {
      background-color: var(--color-purple-600);
    }

    & img {
      width: 100%;
      height: 100%;
    }
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
  grid-template-columns: 48px repeat(4, 1fr);
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
    border: 1px solid var(--color-border-default);
    height: 50px;
    transition: background-color 0.15s ease-in-out;
    border-radius: 0.5rem;
  }
}

.time-box {
  position: absolute;
  border-radius: 0.5rem;
  padding: 0.3rem;
  overflow: hidden;
  width: 100%;
  min-height: 48px;
  text-wrap: pretty;
  line-height: 1;

  & .title {
    font-size: var(--text-sm);
  }
}

.btn-tail-label {
  position: absolute;
  display: inline-flex;
  align-items: center;
  z-index: 2;
  left: 50%;
  bottom: -0.25rem;
  transform: translate(-50%, 100%);
  text-wrap: nowrap;
}
</style>
