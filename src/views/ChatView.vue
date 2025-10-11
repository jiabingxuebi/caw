<template>
  <div class="flex h-screen flex-col">
    <ChatHeader :character="character" />

    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-if="isLoadingPreview" class="flex justify-center py-6 text-base-content/70">
        <span class="loading loading-spinner loading-md"></span>
      </div>

      <div v-else>
        <div v-if="hasPreviewContents">
          <MessageItem :message="messagePreview" message-id="chat" />
        </div>

        <div v-if="!hasPreviewContents" class="text-center text-base-content/60">暂无预览消息，开始对话吧。</div>
      </div>
    </div>

    <ChatInput @send="handleSendMessage" />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ChatHeader from '../components/ChatHeader.vue'
import ChatInput from '../components/ChatInput.vue'
import MessageItem from '../components/message/MessageItem.vue'
import api from '@/api'
import hljs from 'highlight.js'

const DEFAULT_AVATAR = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'

const route = useRoute()

const toSingleValue = value => {
  if (Array.isArray(value)) {
    return value[0]
  }
  return value ?? ''
}

const character = ref({
  id: '',
  name: '角色名称',
  avatar: DEFAULT_AVATAR,
})

const firstMessage = ref('')
const alternateGreetings = ref([])
const messagePreview = ref(null)
const hasPreviewContents = computed(() => Array.isArray(messagePreview.value?.contents) && messagePreview.value.contents.length > 0)
const isLoadingPreview = ref(false)

const applyRouteMeta = () => {
  const id = toSingleValue(route.query.characterId)
  const name = toSingleValue(route.query.name)
  const avatar = toSingleValue(route.query.avatar)

  character.value = {
    id,
    name: name || character.value.name || '角色名称',
    avatar: avatar || character.value.avatar || DEFAULT_AVATAR,
  }
}

const loadPreview = async characterId => {
  if (!characterId) return
  isLoadingPreview.value = true
  try {
    const preview = await api.character.getCharacterPreview(characterId)
    firstMessage.value = preview?.firstMessage || ''
    alternateGreetings.value = Array.isArray(preview?.alternateGreetings) ? preview.alternateGreetings : []
    character.value = {
      ...character.value,
      id: preview?.characterId || characterId,
    }
    // 聚合为 message.contents
    const contents = []
    if (typeof firstMessage.value === 'string' && firstMessage.value.trim()) {
      contents.push(firstMessage.value)
    }
    if (alternateGreetings.value.length) {
      contents.push(...alternateGreetings.value.filter(s => typeof s === 'string' && s.trim()))
    }
    messagePreview.value = {
      id: preview?.characterId || characterId || 'preview',
      role: 'assistant',
      contents,
    }
  } catch (error) {
    console.error('获取角色预览失败:', error)
    firstMessage.value = ''
    alternateGreetings.value = []
    messagePreview.value = { id: characterId || 'preview', role: 'assistant', contents: [] }
  } finally {
    isLoadingPreview.value = false
  }
}

const initialize = () => {
  applyRouteMeta()
  loadPreview(character.value.id)
}

onMounted(() => {
  initialize()
})

watch(
  () => [route.query.characterId, route.query.name, route.query.avatar],
  () => {
    applyRouteMeta()
    loadPreview(toSingleValue(route.query.characterId))
  }
)

watch(firstMessage, () => {
  nextTick(() => {
    hljs.highlightAll()
  })
})

const handleSendMessage = message => {
  console.log('发送消息:', message)
}
</script>
