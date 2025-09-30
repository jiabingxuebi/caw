<template>
  <div class="flex flex-col h-full max-w-4xl mx-auto">
    <!-- 移动端头部 -->
    <MobileTabHeader class="lg:hidden flex-shrink-0">
      <template #left>
        <h1 class="text-xl font-semibold text-base-content">创建角色</h1>
      </template>
      <template #right>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
            <li><a @click="handleUploadCharacterCard">上传角色卡</a></li>
          </ul>
        </div>
      </template>
    </MobileTabHeader>

    <!-- 角色创建表单 -->
    <div class="flex-1 overflow-y-auto px-4 pt-4">
      <CharacterCreateOrModify mode="inline" @character-saved="handleCharacterSaved" @character-draft-saved="handleCharacterDraftSaved" />
    </div>

    <!-- Loading Dialog -->
    <LoadingDialog v-model="loading.show" :title="loading.title" :description="loading.description" :show-progress="loading.showProgress" :progress="loading.progress" />
    <!-- Toast 通知 -->
    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CharacterCreateOrModify from '@/components/CharacterCreateOrModify.vue'
import MobileTabHeader from '@/components/MobileTabHeader.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import Toast from '@/components/Toast.vue'
import api from '@/api'

// Toast 组件引用
const toast = ref(null)

// Loading 状态
const loading = ref({
  show: false,
  title: '加载中...',
  description: '',
  showProgress: false,
  progress: 0,
})

// 显示 Loading
const showLoading = (title = '加载中...', description = '', showProgress = false) => {
  loading.value = {
    show: true,
    title,
    description,
    showProgress,
    progress: 0,
  }
}

// 隐藏 Loading
const hideLoading = () => {
  loading.value.show = false
}

// 上传角色卡处理函数
const handleUploadCharacterCard = async () => {
  // 创建文件选择器
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,.png,image/png,application/json'
  input.multiple = false

  input.onchange = async event => {
    const file = event.target.files[0]
    if (!file) return

    // 验证文件类型
    const fileName = file.name.toLowerCase()
    const isValidType = fileName.endsWith('.json') || fileName.endsWith('.png')

    if (!isValidType) {
      toast.value?.error('只支持上传 JSON 或 PNG 格式的文件')
      return
    }

    // 验证文件大小（限制10MB）
    if (file.size > 10 * 1024 * 1024) {
      toast.value?.error('文件大小不能超过 10MB')
      return
    }

    try {
      // 显示加载对话框
      showLoading('上传中', '', false)

      // 使用角色API上传文件
      const result = await api.character.uploadCharacterCard(file)

      hideLoading()
      console.log('角色卡上传成功:', result)

      const fileType = fileName.endsWith('.json') ? 'JSON角色卡' : 'PNG角色卡'
      toast.value?.success(`${fileType}上传成功！`)

      // 可以在这里添加后续处理逻辑
      // 比如刷新角色列表、跳转到角色详情页等
    } catch (error) {
      hideLoading()
      console.error('角色卡上传失败:', error)

      let errorMessage = '角色卡上传失败'

      if (error.status === 400) {
        errorMessage = '文件无效或格式不正确，请检查文件内容'
      } else if (error.status === 413) {
        errorMessage = '文件太大，请选择小于 10MB 的文件'
      } else if (error.status === 415) {
        errorMessage = '不支持的文件类型，请上传 JSON 或 PNG 文件'
      } else if (error.message.includes('timeout')) {
        errorMessage = '上传超时，请检查网络连接后重试'
      } else if (error.message.includes('Network')) {
        errorMessage = '网络连接失败，请检查网络后重试'
      }

      toast.value?.error(errorMessage)
    }
  }

  // 触发文件选择
  input.click()
}

// 处理角色保存成功
const handleCharacterSaved = async characterData => {
  console.log('角色创建/更新成功:', characterData)

  try {
    // 显示加载对话框
    showLoading(characterData.id ? '更新中' : '创建中', '', false)

    // 使用角色API保存到服务器
    let result
    if (characterData.id) {
      // 更新现有角色
      result = await api.character.updateCharacter(characterData.id, characterData)
    } else {
      // 创建新角色
      result = await api.character.createCharacter(characterData)
    }

    hideLoading()
    console.log('角色保存到服务器成功:', result)
    toast.value?.success(characterData.id ? '角色更新成功！' : '角色创建成功！')

    // 可以跳转到角色详情页或列表页
    // router.push(`/characters/${result.id}`)
  } catch (error) {
    hideLoading()
    console.error('保存到服务器失败:', error)
    toast.value?.error('保存到服务器失败: ' + error.message)
  }
}

// 处理草稿保存成功
const handleCharacterDraftSaved = async characterData => {
  console.log('草稿保存成功:', characterData)

  try {
    // 显示加载对话框
    showLoading('保存中', '', false)

    // 使用角色API保存草稿到服务器
    const result = await api.character.saveDraft(characterData)

    hideLoading()
    console.log('草稿保存到服务器成功:', result)
    toast.value?.success('草稿保存成功！')
  } catch (error) {
    hideLoading()
    console.error('草稿保存失败:', error)
    toast.value?.error('草稿保存失败: ' + error.message)
  }
}
</script>
