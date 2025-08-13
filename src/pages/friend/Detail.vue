<template>
  <Header :has-back="true" title="친구 프로필" />
  <div class="s-progress" :class="{ hidden: isReady }"></div>
  <template v-if="friendDetail === undefined"></template>
  <template v-else>
    <div class="profile-header p-4">
      <div class="user-profile">
        <div class="profile-image">
          <img :src="friendDetail.profileImg" alt="user-profile" />
        </div>
        <div class="profile-info">
          <h3 class="text-xl font-bold mb-2">{{ friendDetail.nickname }}</h3>
          <div class="info-sub text-sm">
            <span class="text-tx-gray-3"> {{ friendDetail.geo }}</span>
            <span class="text-tx-gray-3"> {{ friendDetail.team.teamName }} </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-background-2 h-[1rem]"></div>
    <div class="introduce p-4">
      <h2 class="text-lg font-bold mb-2">상태 메세지</h2>
      <p>{{ friendDetail.introduce }}</p>
    </div>
    <div class="bg-background-2 h-[1rem]"></div>
    <div class="qna p-4">
      <h2 class="text-lg font-bold mb-2">자기소개</h2>
      <div v-if="extraEmpty" class="no-extra">
        <p>등록된 정보가 없습니다.</p>
      </div>
      <ul v-else>
        <li class="mb-1" v-for="key in Object.keys(friendExtra).sort()" :key="key">
          <span class="text-sm font-bold align-middle"> ▸ {{ USER_EXTRA_LIST[key].alias }}: </span>
          <span>{{ friendExtra[key] }}</span>
        </li>
      </ul>
    </div>
  </template>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import { computed, onMounted, ref } from 'vue'
import type { Friend } from '@/types/friend.type.ts'
import { FriendService } from '@/services/friend.service.ts'
import { USER_EXTRA_LIST } from '@/constants/extra.constant.ts'
import { useLoadHandler } from '@/compositions/loading.comp.ts'

const friendSvc = new FriendService()
const { isReady, setReady } = useLoadHandler()
const props = defineProps<{
  id: string
}>()
const friendDetail = ref<Friend>()
const friendExtra = ref()

const extraEmpty = computed(() => {
  if (friendExtra.value) {
    return Object.keys(friendExtra.value).length === 0
  }
  return true
})
onMounted(async () => {
  await fetchFriendDetail()
  setReady()
})

async function fetchFriendDetail() {
  const { friend, extra } = await friendSvc.getFriend(props.id)
  friendDetail.value = friend
  friendExtra.value = extra
}
</script>
<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;

  & .profile-image {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: var(--color-background-3);
    overflow: hidden;

    & img {
      width: 100%;
      height: 100%;
    }
  }
}

.profile-info {
  flex: 1;

  & .info-sub {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-start;
    color: var(--color-tx-gray-3);
  }
}
</style>
