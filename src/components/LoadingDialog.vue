<!-- Loading Dialog 组件 -->
<template>
  <dialog class="modal" :class="{ 'modal-open': modelValue }">
    <div class="modal-box w-80 max-w-sm">
      <div class="flex flex-col items-center py-6">
        <!-- Loading 动画 -->
        <div class="loading loading-spinner loading-lg text-primary mb-4"></div>

        <!-- 主要文本 -->
        <h3 class="font-bold text-lg text-center mb-2">{{ title }}</h3>

        <!-- 描述文本 -->
        <p v-if="description" class="text-sm text-base-content/70 text-center">{{ description }}</p>

        <!-- 进度条 (可选) -->
        <div v-if="showProgress" class="w-full mt-4">
          <div class="flex justify-between text-xs mb-1">
            <span>进度</span>
            <span>{{ progress }}%</span>
          </div>
          <progress class="progress progress-primary w-full" :value="progress" max="100"></progress>
        </div>
      </div>
    </div>

    <!-- 背景蒙层 -->
    <div class="modal-backdrop bg-black/50"></div>
  </dialog>
</template>

<script setup>
// Props
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '加载中...'
  },
  description: {
    type: String,
    default: ''
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  }
})

// Emits
defineEmits(['update:modelValue'])
</script>

<style scoped>
/* 确保对话框在最顶层 */
.modal {
  z-index: 9999;
}

/* 防止对话框被点击关闭 */
.modal-backdrop {
  pointer-events: none;
}
</style>