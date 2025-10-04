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
      <CharacterCreateOrModify ref="characterFormRef" :initial-data="uploadedCharacterData" @character-saved="handleCharacterSaved" @character-draft-saved="handleCharacterDraftSaved" />
    </div>

    <!-- Loading Dialog -->
    <LoadingDialog v-model="loading.show" :title="loading.title" :description="loading.description" :show-progress="loading.showProgress" :progress="loading.progress" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CharacterCreateOrModify from '@/components/CharacterCreateOrModify.vue'
import MobileTabHeader from '@/components/MobileTabHeader.vue'
import LoadingDialog from '@/components/LoadingDialog.vue'
import api from '@/api'

// 组件引用
const characterFormRef = ref(null)

// 上传的角色数据
const uploadedCharacterData = ref(null)

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
      return
    }

    // 验证文件大小（限制10MB）
    if (file.size > 10 * 1024 * 1024) {
      return
    }

    try {
      // 显示加载对话框
      showLoading('上传中', '', false)

      // 使用角色API上传文件
      const result = await api.characterMeta.uploadCharacterCard(file)

      hideLoading()
      console.log('角色卡上传成功:', result)

      // 将上传返回的角色数据填充到表单中
      if (result && typeof result === 'object') {
        uploadedCharacterData.value = result
        // watch 监听器会自动调用 loadInitialData()，不需要手动调用
      }
    } catch (error) {
      hideLoading()
      console.error('角色卡上传失败:', error)
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

    // 可以跳转到角色详情页或列表页
    // router.push(`/characters/${result.id}`)
  } catch (error) {
    hideLoading()
    console.error('保存到服务器失败:', error)
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
  } catch (error) {
    hideLoading()
    console.error('草稿保存失败:', error)
  }
}
</script>
