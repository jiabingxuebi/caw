<template>
  <dialog ref="filterModal" class="modal">
    <div class="modal-box">
      <!-- 标题和右上角关闭按钮 -->
      <form method="dialog">
        <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="font-bold text-lg mb-4">选择标签</h3>

      <!-- 标签选择区域 -->
      <div class="grid grid-cols-2 md:grid-cols-3 max-h-96 overflow-y-auto">
        <label
          v-for="tag in allTags"
          :key="tag"
          class="label cursor-pointer justify-start gap-2 hover:bg-base-200 rounded p-2 transition-colors"
        >
          <input
            type="checkbox"
            class="checkbox checkbox-primary checkbox-sm"
            :value="tag"
            v-model="localSelectedTags"
          />
          <span class="label-text text-sm">{{ tag }}</span>
        </label>
      </div>

      <!-- 底部操作按钮 -->
      <div class="modal-action">
        <form method="dialog">
          <button @click="applyFilters" class="btn btn-primary">
            确定
            <span v-if="localSelectedTags.length > 0" class="ml-1">({{ localSelectedTags.length }})</span>
          </button>
        </form>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal" style="cursor: default">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  allTags: {
    type: Array,
    default: () => [],
  },
  selectedTags: {
    type: Array,
    default: () => [],
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emits = defineEmits(['update:selectedTags', 'update:isOpen', 'apply-filters'])

// 本地状态
const localSelectedTags = ref([...props.selectedTags])
const filterModal = ref(null)

// 监听props变化
watch(
  () => props.selectedTags,
  newTags => {
    localSelectedTags.value = [...newTags]
  },
  { deep: true }
)

// 监听弹窗开关状态
watch(
  () => props.isOpen,
  async isOpen => {
    if (isOpen) {
      // 每次打开弹窗时，重新同步本地状态
      localSelectedTags.value = [...props.selectedTags]
      await nextTick()
      filterModal.value?.showModal()
    } else {
      filterModal.value?.close()
    }
  }
)

// 关闭弹窗（取消操作，不保存更改）
const closeModal = () => {
  // 恢复到原始状态
  localSelectedTags.value = [...props.selectedTags]
  emits('update:isOpen', false)
}

// 应用过滤器
const applyFilters = () => {
  emits('update:selectedTags', [...localSelectedTags.value])
  emits('apply-filters', [...localSelectedTags.value])
  emits('update:isOpen', false)
}

// 监听弹窗的关闭事件（处理ESC键和点击外部关闭）
const handleDialogClose = () => {
  if (props.isOpen) {
    // 如果是通过ESC或点击外部关闭，恢复原始状态
    localSelectedTags.value = [...props.selectedTags]
    emits('update:isOpen', false)
  }
}

// 生命周期钩子
onMounted(() => {
  filterModal.value?.addEventListener('close', handleDialogClose)
})

onUnmounted(() => {
  filterModal.value?.removeEventListener('close', handleDialogClose)
})
</script>
