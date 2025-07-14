<template>
  <div class="s-input-wrap">
    <div class="s-input-box">
      <input
        class="s-input-field"
        type="text"
        :placeholder="placeholder ?? ''"
        :value="modelValue"
        @input="handleInput"
      />
      <Search :size="24" class="s-icon input-suffix" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()
const emit = defineEmits(['update:modelValue'])

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', input.value)
}
</script>
