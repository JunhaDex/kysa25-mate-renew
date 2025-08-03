<template>
  <Header :has-back="true" title="게시글 작성" />
  <section class="p-4">
    <form @submit.prevent="submitPost">
      <div class="s-input-wrap mb-4">
        <label class="label" for="postImageInput">이미지 업로드</label>
        <div class="s-input-box">
          <input
            class="hidden"
            id="postImageInput"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            @change="selectImage"
          />
          <div v-if="userInput.image === null" class="image-empty" @click="openFileInput">
            <div>
              <Image :size="24" />
            </div>
            <div class="text-sm font-medium">PNG, JPG, JPEG</div>
          </div>
          <div v-else class="preview">
            <img :src="userInput.preview" alt="user-image" />
          </div>
        </div>
      </div>
      <div class="s-input-wrap mb-6">
        <label class="label" for="postContentInput">게시글 내용</label>
        <div class="s-input-box" id="postTitleInput">
          <textarea
            v-model="userInput.content"
            class="s-input-field"
            id="postContentInput"
            type="text"
            placeholder="게시글 내용을 입력하세요..."
            rows="5"
            @input="adjustInputHeight"
          />
        </div>
      </div>
      <button class="s-btn btn-primary w-full block" type="submit">게시글 작성하기</button>
    </form>
  </section>
</template>
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import { Image } from 'lucide-vue-next'
import { ref } from 'vue'
import { convertBlobToBase64 } from '@/utils/use.util.ts'
import { PostService } from '@/services/post.service.ts'

const postSvc = new PostService()
const props = defineProps<{
  id: string
}>()
const userInput = ref<{
  image: File | null
  preview: string
  content: string
}>({
  image: null,
  preview: '',
  content: '',
})

function adjustInputHeight(e: Event) {
  const input = e.target as HTMLTextAreaElement
  input.style.height = 'auto'
  input.style.height = `${input.scrollHeight}px`
}

function openFileInput() {
  const fileInput = document.getElementById('postImageInput') as HTMLInputElement
  if (fileInput) {
    fileInput.click()
  }
}

async function selectImage(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    userInput.value.image = input.files[0]
    userInput.value.preview = await convertBlobToBase64(userInput.value.image)
  }
}

async function submitPost() {
  let imageUrl
  if (userInput.value.image) {
    const uploaded = await postSvc.uploadImage('post', userInput.value.image)
    imageUrl = uploaded.location
  }
  await postSvc.createPost({
    groupRef: props.id,
    message: userInput.value.content,
    image: imageUrl,
  })
}
</script>
<style scoped>
.image-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-border-active);
  background-color: var(--color-background-2);
  border: 1px dashed var(--color-border-default);
  border-radius: 0.75rem;
  padding: 1rem;
  height: 116px;
  cursor: pointer;
}

.s-input-box {
  & .preview {
    position: relative;
  }
}
</style>
