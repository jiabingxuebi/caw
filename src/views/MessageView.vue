<template>
  <div class="flex h-screen flex-col">
    <MessageHeader :character="character" />

    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div v-if="isLoadingPreview" class="flex justify-center py-6 text-base-content/70">
        <span class="loading loading-spinner loading-md"></span>
      </div>

      <div v-else>
        <div v-if="firstMessage" class="chat chat-start">
          <div class="chat-image avatar">
            <div class="w-10 rounded-full">
              <img :src="character.avatar" :alt="character.name" />
            </div>
          </div>
          <div class="chat-bubble" v-html="firstMessage"></div>
        </div>

        <div v-if="alternateGreetings.length" class="space-y-2">
          <p class="text-sm text-base-content/70">其他问候</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="greeting in alternateGreetings" :key="greeting" class="badge badge-neutral badge-outline whitespace-normal">
              {{ greeting }}
            </span>
          </div>
        </div>

        <div v-if="!firstMessage && !alternateGreetings.length" class="text-center text-base-content/60">暂无预览消息，开始对话吧。</div>
      </div>
    </div>

    <MessageInput @send="handleSendMessage" />
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MessageHeader from '../components/MessageHeader.vue'
import MessageInput from '../components/MessageInput.vue'
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
  } catch (error) {
    console.error('获取角色预览失败:', error)
    firstMessage.value = ''
    alternateGreetings.value = []
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
