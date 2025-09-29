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
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
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
  </div>
</template>

<script setup>
import CharacterCreateOrModify from '@/components/CharacterCreateOrModify.vue'
import MobileTabHeader from '@/components/MobileTabHeader.vue'

// 上传角色卡处理函数
const handleUploadCharacterCard = () => {
  // TODO: 实现上传角色卡功能
  console.log('上传角色卡功能待实现')
  alert('上传角色卡功能即将推出！')
}

// 处理角色保存成功
const handleCharacterSaved = characterData => {
  console.log('角色创建/更新成功:', characterData)

  // 可以在这里添加成功后的逻辑，比如：
  // 1. 显示成功消息
  // 2. 跳转到角色管理页面
  // 3. 清空表单等

  // 例如跳转到探索页面查看创建的角色
  // router.push('/explore')
}

// 处理草稿保存成功
const handleCharacterDraftSaved = characterData => {
  console.log('草稿保存成功:', characterData)
}
</script>
