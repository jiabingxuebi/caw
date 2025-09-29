<template>
  <form @submit.prevent="handleSubmit">
    <!-- 角色信息 -->
    <div class="pb-4">
      <div class="pb-2">
        <div class="flex items-center gap-3">
          <div class="w-1 h-4 bg-primary rounded-full"></div>
          <h3 class="text-lg font-medium text-base-content">角色信息</h3>
        </div>
      </div>
      <div>
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">角色名称</legend>
          <input v-model="formData.name" type="text" class="input w-full focus:outline-none" placeholder="Elara Nightshade" required />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">角色描述</legend>
          <input v-model="formData.title" type="text" class="input w-full focus:outline-none" placeholder="著名的考古学家" required />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">背景图片</legend>

          <div class="flex gap-3 md:gap-6">
            <!-- 背景图片上传区域 -->
            <div class="flex-1 md:w-40 md:flex-shrink-0">
              <div class="relative border-2 border-dashed border-base-300 rounded-lg bg-base-200 hover:bg-base-300 transition-colors cursor-pointer group" :class="{ 'border-primary': isDragOver }" @click="triggerMainImageUpload" @dragover.prevent="isDragOver = true" @dragleave.prevent="isDragOver = false" @drop.prevent="handleMainImageDrop">
                <input ref="mainImageInput" type="file" accept="image/*" class="hidden" @change="handleMainImageChange" />

                <!-- 预览图片 -->
                <div v-if="formData.mainImage" class="relative aspect-[3/4] w-full">
                  <img :src="formData.mainImageUrl" alt="角色背景图" class="w-full h-full object-cover rounded-lg" />
                  <button type="button" @click.stop="removeMainImage" class="absolute top-1 right-1 md:top-2 md:right-2 btn btn-circle btn-xs md:btn-sm btn-error opacity-80 hover:opacity-100">
                    <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- 上传区域 -->
                <div v-else class="aspect-[3/4] flex flex-col items-center justify-center p-2 md:p-4 text-center">
                  <svg class="w-6 h-6 md:w-10 md:h-10 text-base-content/50 mb-1 md:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <div class="text-xs md:text-sm font-medium text-base-content/70 mb-1">上传图片</div>
                  <div class="text-xs text-base-content/50 hidden md:block">或拖拽图片到此处</div>
                </div>
              </div>
            </div>

            <!-- 上传说明和要求 -->
            <div class="flex-1 space-y-3 md:space-y-4">
              <div>
                <h4 class="text-sm font-semibold text-base-content mb-1 md:mb-2">上传要求</h4>
                <ul class="text-xs md:text-sm text-base-content/70 space-y-1">
                  <li>• 建议上传 9:16 或 3:4 比例的图片</li>
                  <li>• 图片大小不超过 5MB</li>
                  <li>• 支持 JPG、PNG 格式</li>
                </ul>
              </div>

              <div>
                <h4 class="text-sm font-semibold text-error mb-1 md:mb-2">社区规范</h4>
                <p class="text-xs md:text-sm text-base-content/70">为维护社区环境，请不要上传涉及未成年人色情和过分暴露引起他人不适的图像。</p>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </div>

    <!-- 角色设定 -->
    <div class="pb-4">
      <div class="pb-2">
        <div class="flex items-center gap-3">
          <div class="w-1 h-4 bg-primary rounded-full"></div>
          <h3 class="text-lg font-medium text-base-content">角色设定</h3>
        </div>
      </div>

      <div>
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">问候语</legend>
          <textarea v-model="formData.greeting" class="textarea w-full h-24 focus:outline-none" placeholder="你在一个有趣的时刻找到了我。古老的文字在低语，废墟在召唤。我们要不要一起揭开隐藏在下面的秘密？也许我们会发现一些非凡的东西。" required></textarea>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">角色性格</legend>
          <textarea v-model="formData.personality" class="textarea w-full h-32 focus:outline-none" placeholder="著名的考古学家Elara Nightshade有着神秘的过去，她花费了数十年时间探索世界各地被遗忘的神庙和古代遗迹。她有着标志性的银色条纹黑发和穿透性的琥珀色眼睛，在学术界备受尊敬，同时保持着神秘的气质。传说她掌握着违背常理的神秘文物知识..." required></textarea>
        </fieldset>

        <fieldset class="fieldset border-none">
          <legend class="fieldset-legend text-base font-medium text-base-content/80">可见性</legend>
          <select v-model="formData.visibility" class="select w-full focus:outline-none focus:shadow-none focus:ring-0" style="box-shadow: none !important; outline: none !important">
            <option value="private">私有：只有你可以聊天</option>
            <option value="unlisted">未列出：任何有链接的人</option>
            <option value="public">公开：任何人都可以聊天</option>
          </select>
        </fieldset>
      </div>
    </div>

    <!-- 高级设置 -->
    <div class="pb-4">
      <div class="pb-4">
        <div class="flex items-center gap-3">
          <div class="w-1 h-4 bg-primary rounded-full"></div>
          <h3 class="text-lg font-medium text-base-content">高级设置</h3>
        </div>
      </div>

      <div>
        <p class="text-sm text-base-content/60 text-center py-8">高级设置功能即将推出...</p>
      </div>
    </div>
  </form>

  <!-- 操作按钮区域 -->
  <div class="flex gap-3" :class="buttonAlignment">
    <button type="button" @click="saveAsDraft" class="btn btn-outline" :class="buttonClass" :disabled="isSubmitting">
      <span v-if="isSubmitting && currentAction === 'draft'" class="loading loading-spinner loading-sm"></span>
      {{ isSubmitting && currentAction === 'draft' ? '保存中...' : '存为草稿' }}
    </button>
    <button type="button" @click="handleSubmit" class="btn btn-primary" :class="buttonClass" :disabled="isSubmitting">
      <span v-if="isSubmitting && currentAction === 'publish'" class="loading loading-spinner loading-sm"></span>
      {{ getSubmitButtonText() }}
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted, watch, computed } from 'vue'

// Props
const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'dialog', // 'dialog' | 'inline'
    validator: value => ['dialog', 'inline'].includes(value),
  },
})

// Emits
const emit = defineEmits(['character-saved', 'character-draft-saved'])

// 表单数据
const formData = reactive({
  name: '',
  title: '',
  greeting: '',
  personality: '',
  visibility: 'private',
  mainImage: null,
  mainImageUrl: '',
})

// 提交状态
const isSubmitting = ref(false)
const currentAction = ref('') // 'draft' 或 'publish'

// 图片上传状态
const isDragOver = ref(false)
const mainImageInput = ref(null)

// 计算属性：按钮样式
const buttonAlignment = computed(() => {
  return props.mode === 'dialog' ? 'lg:justify-end' : 'justify-center'
})

const buttonClass = computed(() => {
  return props.mode === 'dialog' ? 'flex-1 lg:flex-none lg:w-32' : 'w-32'
})

// 获取提交按钮文本
const getSubmitButtonText = () => {
  if (isSubmitting.value && currentAction.value === 'publish') {
    return props.initialData ? '保存中...' : '创建中...'
  }
  return props.initialData ? '保存修改' : '创建角色'
}

// 重置表单
const resetForm = () => {
  // 清理图片URL
  if (formData.mainImageUrl) {
    URL.revokeObjectURL(formData.mainImageUrl)
  }

  // 重置表单数据
  Object.assign(formData, {
    name: '',
    title: '',
    greeting: '',
    personality: '',
    visibility: 'private',
    mainImage: null,
    mainImageUrl: '',
  })

  // 重置文件输入
  if (mainImageInput.value) {
    mainImageInput.value.value = ''
  }
}

// 加载初始数据（编辑模式）
const loadInitialData = () => {
  if (!props.initialData) return

  Object.assign(formData, {
    name: props.initialData.name || '',
    title: props.initialData.title || '',
    greeting: props.initialData.greeting || '',
    personality: props.initialData.personality || '',
    visibility: props.initialData.visibility || 'private',
    mainImage: props.initialData.mainImage || null,
    mainImageUrl: props.initialData.mainImageUrl || '',
  })
}

// 监听初始数据变化
watch(
  () => props.initialData,
  newData => {
    if (newData) {
      loadInitialData()
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// 存为草稿
const saveAsDraft = async () => {
  try {
    currentAction.value = 'draft'
    isSubmitting.value = true

    // 基本验证（草稿只需要姓名）
    if (!formData.name.trim()) {
      alert('请至少填写角色姓名')
      return
    }

    // 设置为私有（草稿状态）
    const draftData = { ...formData, visibility: 'private' }

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('保存草稿:', draftData)

    // 发送保存成功事件
    emit('character-draft-saved', draftData)

    alert('草稿保存成功！')
  } catch (error) {
    console.error('保存草稿失败:', error)
    alert('保存草稿失败，请重试')
  } finally {
    isSubmitting.value = false
    currentAction.value = ''
  }
}

// 表单提交处理（发布）
const handleSubmit = async () => {
  try {
    currentAction.value = 'publish'
    isSubmitting.value = true

    // 表单验证
    if (!formData.name.trim() || !formData.title.trim() || !formData.greeting.trim() || !formData.personality.trim()) {
      alert('请填写所有必填字段')
      return
    }

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log(props.initialData ? '更新聊天机器人:' : '创建聊天机器人:', formData)

    // 发送创建/更新成功事件
    emit('character-saved', { ...formData })

    alert(props.initialData ? '角色更新成功！' : '聊天机器人创建成功！')
  } catch (error) {
    console.error(props.initialData ? '更新失败:' : '创建失败:', error)
    alert(props.initialData ? '更新失败，请重试' : '创建失败，请重试')
  } finally {
    isSubmitting.value = false
    currentAction.value = ''
  }
}

// 清理内存泄漏
onUnmounted(() => {
  if (formData.mainImageUrl) {
    URL.revokeObjectURL(formData.mainImageUrl)
  }
})

// 主图片上传相关函数
const triggerMainImageUpload = () => {
  mainImageInput.value?.click()
}

const handleMainImageChange = event => {
  const file = event.target.files?.[0]
  if (file) {
    processMainImage(file)
  }
}

const handleMainImageDrop = event => {
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processMainImage(file)
  }
}

const processMainImage = file => {
  // 检查文件大小 (5MB 限制)
  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过 5MB')
    return
  }

  formData.mainImage = file
  formData.mainImageUrl = URL.createObjectURL(file)
}

const removeMainImage = () => {
  if (formData.mainImageUrl) {
    URL.revokeObjectURL(formData.mainImageUrl)
  }
  formData.mainImage = null
  formData.mainImageUrl = ''
  if (mainImageInput.value) {
    mainImageInput.value.value = ''
  }
}

// 暴露方法给父组件使用
defineExpose({
  resetForm,
  loadInitialData,
})
</script>
