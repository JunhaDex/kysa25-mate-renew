<template>
  <Header :has-back="true" title="프로필 수정" />
  <div class="profile-header p-4">
    <div class="user-profile">
      <div class="profile-image" @click="openFileInput">
        <input
          class="hidden"
          id="profileImageInput"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          @change="selectImage"
        />
        <img
          :src="userInput.profile.preview"
          alt="user-profile"
          @error="(e) => ((e.target! as HTMLImageElement).src = ProfileDefault)"
        />
      </div>
      <span class="upload-icon">
        <UserPen :size="16" color="var(--color-tx-gray-1)" />
      </span>
      <div class="profile-info">
        <h3 class="text-xl font-bold mb-2">{{ myInfo.nickname }}</h3>
        <div class="info-sub text-sm">
          <span class="text-tx-gray-3"> {{ myInfo.geo }}</span>
          <span class="text-tx-gray-3"> {{ myInfo.team.teamName }} </span>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-background-2 h-[1rem]"></div>
  <div class="password p-4">
    <h2 class="text-lg font-bold mb-2">비밀번호 변경</h2>
    <div class="s-input-wrap mb-4">
      <label class="label title" for="currentPassword">현재 비밀번호</label>
      <div class="s-input-box">
        <input
          v-model="userInput.password.current"
          id="currentPassword"
          type="password"
          class="s-input-field"
          placeholder="현재 비밀번호를 입력하세요."
        />
      </div>
    </div>
    <div class="s-input-wrap mb-4">
      <label class="label title" for="newPassword">새 비밀번호</label>
      <div class="s-input-box">
        <input
          v-model="userInput.password.new"
          id="newPassword"
          type="password"
          class="s-input-field"
          placeholder="새 비밀번호를 입력하세요."
        />
      </div>
    </div>
    <div class="s-input-wrap mb-6">
      <label class="label title" for="confirmPassword">비밀번호 확인</label>
      <div class="s-input-box">
        <input
          v-model="userInput.password.confirm"
          id="confirmPassword"
          type="password"
          class="s-input-field"
          placeholder="비밀번호를 다시 입력하세요."
        />
      </div>
    </div>

    <button class="s-btn btn-primary w-full block" :disabled="isLocked" @click="updatePassword">
      비밀번호 변경
    </button>
  </div>
  <div class="bg-background-2 h-[1rem]"></div>
  <div class="introduce p-4">
    <h2 class="text-lg font-bold mb-2">상태 메세지</h2>
    <div class="s-input-wrap mb-4">
      <label class="label title" for="statusMessageInput">상태 메세지</label>
      <div class="s-input-box">
        <textarea
          v-model="userInput.statusMessage"
          class="s-input-field"
          id="statusMessageInput"
          type="text"
          rows="5"
          placeholder="상태 메세지를 입력하세요."
        />
      </div>
    </div>
  </div>
  <div class="bg-background-2 h-[1rem]"></div>
  <div class="qna p-4">
    <h2 class="text-lg font-bold mb-2">자기소개</h2>
    <div class="extra-header mb-4">
      <p class="text-sm mb-2">항목추가를 눌러 자기소개를 추가하세요</p>
      <button class="s-btn btn-outline w-full block leading-[16px]" @click="addExtraItem">
        <Plus :size="16" class="inline-block mr-2" />
        <span>항목 추가</span>
      </button>
    </div>
    <div class="extra-content">
      <div v-for="(line, idx) in userExtraInput" :key="idx" class="form-row mb-2">
        <div class="select-wrap relative">
          <select v-model="line.key" class="select select-item">
            <option value="" disabled selected>선택</option>
            <option v-for="extra in extraSelectList" :value="extra.key" :key="extra.key">
              {{ extra.alias }}
            </option>
          </select>
          <ChevronDown :size="16" />
        </div>
        <div class="s-input-box">
          <input v-model="line.value" class="s-input-field" type="text" placeholder="내용 입력" />
          <span class="icon-x" @click="removeExtraItem(idx)"><X :size="16" /></span>
        </div>
      </div>
    </div>
  </div>
  <div class="cta-wrap">
    <button class="s-btn btn-primary w-full block" @click="editUserProfile" :disabled="isLocked">
      <span v-if="isLocked" class="icon icon-loading" />
      <span v-else>수정하기</span>
    </button>
  </div>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Friend } from '@/types/friend.type.ts'
import { UserPen, X, Plus, ChevronDown } from 'lucide-vue-next'
import { convertBlobToBase64 } from '@/utils/use.util.ts'
import { AuthService } from '@/services/auth.service.ts'
import { PostService } from '@/services/post.service.ts'
import { USER_EXTRA_LIST } from '@/constants/extra.constant.ts'
import { FriendService } from '@/services/friend.service.ts'
import { useLockHandler } from '@/compositions/process.comp.ts'
import { useUiStore } from '@/stores/ui.store.ts'
import ProfileDefault from '@/assets/images/profile_empty.png'

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()
const { isLocked, lockProcess } = useLockHandler()
const authSvc = new AuthService()
const postSvc = new PostService()
const friendSvc = new FriendService()
const userInput = ref({
  profile: {
    image: null as File | null,
    preview: '',
  },
  password: {
    current: '',
    new: '',
    confirm: '',
  },
  statusMessage: '',
})
const userExtraInput = ref<any[]>([])
const myInfo = computed<Friend>(() => {
  return authStore.myInfo! as Friend
})
const extraSelectList = computed(() => Object.values(USER_EXTRA_LIST))
onMounted(async () => {
  if (!authStore.myInfo) {
    router.push('/login')
  }
  userInput.value.profile.preview = myInfo.value.profileImg
  userInput.value.statusMessage = myInfo.value.introduce || ''
  await fetchMyInfo()
})

async function fetchMyInfo() {
  const { friend, extra } = await friendSvc.getFriend(myInfo.value.ref)
  const list = []
  for (const key of Object.keys(extra)) {
    list.push({
      key,
      value: extra[key],
    })
  }
  userExtraInput.value = list
  userExtraInput.value.push({ key: '', value: '' })
}

async function addExtraItem() {
  userExtraInput.value.push({ key: '', value: '' })
}

async function removeExtraItem(index: number) {
  if (userExtraInput.value.length > 1) {
    userExtraInput.value.splice(index, 1)
  }
}

async function selectImage(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    userInput.value.profile.image = input.files[0]
    userInput.value.profile.preview = await convertBlobToBase64(userInput.value.profile.image)
  }
}

async function openFileInput() {
  const fileInput = document.getElementById('profileImageInput') as HTMLInputElement
  if (fileInput) {
    fileInput.click()
  }
}

function removeProfileDuplicate() {
  const cleaned = new Map()
  for (const info of userExtraInput.value) {
    if (info.key && info.value) {
      cleaned.set(info.key, info.value)
    }
  }
  return Object.fromEntries(cleaned)
}

async function updatePassword() {
  if (
    userInput.value.password.current === '' ||
    userInput.value.password.new === '' ||
    userInput.value.password.confirm === ''
  ) {
    uiStore.showToast('모든 비밀번호 필드를 입력해주세요.', 'error')
    return
  }
  if (userInput.value.password.new !== userInput.value.password.confirm) {
    uiStore.showToast('새 비밀번호가 일치하지 않습니다.', 'error')
    return
  }
  await lockProcess(async () => {
    await authSvc.updateMyPass(myInfo.value.ref, {
      oldPwd: userInput.value.password.current,
      newPwd: userInput.value.password.new,
    })
  })
  userInput.value.password = {
    current: '',
    new: '',
    confirm: '',
  }
  uiStore.showToast('비밀번호가 변경되었습니다.', 'success')
}

async function editUserProfile() {
  let userImageUrl: string | undefined
  await lockProcess(async () => {
    if (userInput.value.profile.image) {
      const uploaded = await postSvc.uploadImage('user-profile', userInput.value.profile.image, {
        nickname: myInfo.value.nickname,
      })
      userImageUrl = uploaded.location
    }
    await authSvc.updateMyInfo(myInfo.value.ref, {
      profileImg: userImageUrl,
      introduce: userInput.value.statusMessage,
    })
    if (userExtraInput.value.length) {
      const payload = removeProfileDuplicate()
      await authSvc.updateMyExtraInfo(myInfo.value.ref, payload)
    }
  })
  await authSvc.getMyInfo()
  uiStore.showToast('프로필이 수정되었습니다.', 'success')
}
</script>
<style scoped>
.user-profile {
  position: relative;
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

  & .upload-icon {
    position: absolute;
    bottom: 0;
    left: calc(64px - 24px);
    width: 32px;
    height: 32px;
    background-color: var(--color-background-1);
    border: 2px solid var(--color-tx-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
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

.qna {
  padding-bottom: 90px;
}

.form-row {
  display: flex;
  width: 100%;
  gap: 0.5rem;
  align-items: center;

  & .select-wrap {
    & svg {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%);
      pointer-events: none;
    }
  }

  & .select-item {
    appearance: none;
    flex: 1;
    min-width: 0;
    font-size: 0.875rem;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: 2px solid var(--color-border-default);
    border-radius: 0.5rem;
  }

  & .s-input-box {
    position: relative;
    flex: 3;
    min-width: 0;

    & .icon-x {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
}

.cta-wrap {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 768px;
  padding: 1rem;
  background-color: var(--color-background-1);
  border-top: 2px solid var(--color-border-default);
  border-radius: 0.5rem 0.5rem 0 0;
}
</style>
