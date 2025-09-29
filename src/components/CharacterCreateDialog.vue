<template>
  <div v-if="isOpen" class="modal modal-open">
    <div class="modal-box max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
      <!-- 右上角关闭按钮 -->
      <button @click="closeDialog" class="absolute top-2 right-2 z-20 btn btn-ghost btn-circle btn-sm">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- 吸顶标题栏 -->
      <div class="sticky top-0 z-10 bg-base-100 border-b border-base-300 pb-2">
        <div class="flex items-center">
          <h2 class="text-xl font-semibold text-base-content">
            {{ props.initialData ? '编辑角色' : '创建角色' }}
          </h2>
          <div class="tooltip tooltip-bottom ml-1 mt-1" data-tip="阅读聊天机器人创建指南">
            <a
              href="#"
              class="text-primary hover:text-primary-focus cursor-pointer inline-flex items-center justify-center w-5 h-5 transition-colors"
              @click.prevent="openGuide"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- 滚动内容区域 -->
      <div class="flex-1 overflow-y-auto p-2">
        <CharacterCreateOrModify
          :initial-data="props.initialData"
          mode="dialog"
          @character-saved="handleCharacterSaved"
          @character-draft-saved="handleCharacterDraftSaved"
        />
      </div>
    </div>

    <!-- 背景遮罩，点击关闭 -->
    <div class="modal-backdrop" @click="closeDialog"></div>
  </div>
</template>

<script setup>
import CharacterCreateOrModify from './CharacterCreateOrModify.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: null,
  },
})

// Emits
const emit = defineEmits(['update:isOpen', 'character-created'])

// 关闭Dialog
const closeDialog = () => {
  emit('update:isOpen', false)
}

// 打开创建指南
const openGuide = () => {
  window.open('#', '_blank') // 这里应该替换为实际的指南链接
}

// 处理角色保存（发布）
const handleCharacterSaved = (characterData) => {
  emit('character-created', characterData)
  closeDialog()
}

// 处理角色草稿保存
const handleCharacterDraftSaved = (characterData) => {
  emit('character-created', characterData)
  closeDialog()
}
</script>
