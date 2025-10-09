<template>
  <div class="border-t border-base-300 bg-base-100 p-4">
    <div class="flex items-end gap-2">
      <button class="btn btn-ghost btn-circle btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <textarea ref="textareaRef" v-model="message" class="textarea textarea-bordered flex-1 resize-none overflow-y-auto daisy-clean" rows="1" :style="{ height: textareaHeight, maxHeight: maxHeight, minHeight: minHeight }" @input="autoResize" @keydown="handleKeydown"></textarea>

      <button class="btn btn-circle btn-primary" @click="handleSend">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['send'])

const textareaRef = ref(null)
const message = ref('')
const textareaHeight = ref('2.5rem')

const minHeight = '2.5rem'
const lineHeight = 40
const maxLines = 5
const maxHeight = computed(() => `${lineHeight * maxLines}px`)

const autoResize = event => {
  const textarea = event.target
  textarea.style.height = '2.5rem'
  const newHeight = Math.min(textarea.scrollHeight, lineHeight * maxLines)
  textareaHeight.value = newHeight + 'px'
}

const handleKeydown = event => {
  if (event.key !== 'Enter') return

  const isDesktop = window.innerWidth >= 1024

  if (isDesktop) {
    if (!event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }
}

const handleSend = () => {
  if (!message.value.trim()) return
  emit('send', message.value)
  message.value = ''
  textareaHeight.value = '2.5rem'
}
</script>

