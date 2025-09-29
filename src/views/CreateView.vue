<template>
  <div class="px-4 max-w-4xl mx-auto">
    <!-- 页面标题 - 只在桌面端显示 -->
    <div class="mb-6 hidden lg:block">
      <h1 class="text-2xl font-bold text-base-content mb-2">创建角色</h1>
      <p class="text-base-content/60">创建你的专属聊天机器人角色，打造独特的对话体验。</p>
    </div>

    <!-- 角色创建表单 -->
    <CharacterCreateOrModify mode="inline" @character-saved="handleCharacterSaved" @character-draft-saved="handleCharacterDraftSaved" />
  </div>
</template>

<script setup>
import CharacterCreateOrModify from '../components/CharacterCreateOrModify.vue'

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
