<!-- Toast 通知组件 -->
<template>
  <div class="toast toast-top toast-center z-50">
    <div v-for="(toast, index) in toasts" :key="toast.id" :class="getToastClass(toast.type)" class="alert">
      <span>{{ toast.message }}</span>
      <button @click="removeToast(index)" class="btn btn-sm btn-circle btn-ghost ml-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Toast 列表
const toasts = ref([])

// Toast 类型样式映射
const getToastClass = (type) => {
  switch (type) {
    case 'success':
      return 'alert-success'
    case 'error':
      return 'alert-error'
    case 'warning':
      return 'alert-warning'
    case 'info':
    default:
      return 'alert-info'
  }
}

// 添加 Toast
const addToast = (message, type = 'info', duration = 4000) => {
  const id = Date.now() + Math.random()
  const toast = { id, message, type }

  toasts.value.push(toast)

  // 自动移除
  if (duration > 0) {
    setTimeout(() => {
      removeToastById(id)
    }, duration)
  }

  return id
}

// 移除指定位置的 Toast
const removeToast = (index) => {
  toasts.value.splice(index, 1)
}

// 通过 ID 移除 Toast
const removeToastById = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    removeToast(index)
  }
}

// 清空所有 Toast
const clearToasts = () => {
  toasts.value = []
}

// 暴露方法给父组件
defineExpose({
  success: (message, duration) => addToast(message, 'success', duration),
  error: (message, duration) => addToast(message, 'error', duration),
  warning: (message, duration) => addToast(message, 'warning', duration),
  info: (message, duration) => addToast(message, 'info', duration),
  addToast,
  clearToasts
})
</script>

<style scoped>
.toast {
  position: fixed;
}
</style>