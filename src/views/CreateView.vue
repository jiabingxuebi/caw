<template>
  <div class="p-4">
    <!-- 页面标题和创建按钮 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-base-content">我的角色</h1>
      <button
        @click="openCreateDialog"
        class="btn btn-primary gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        创建角色
      </button>
    </div>

    <!-- 角色卡片网格 -->
    <div v-if="myCharacters.length > 0">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <CharacterCard
          v-for="character in displayedCharacters"
          :key="character.id"
          :character="character"
          :show-actions="true"
          @edit="handleEditCharacter"
          @delete="handleDeleteCharacter"
        />
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center items-center mt-8 py-8">
        <span class="loading loading-spinner loading-md"></span>
        <span class="ml-2 text-base-content/60">正在加载更多角色...</span>
      </div>

      <!-- 没有更多数据提示 -->
      <div
        v-if="!hasMore && !isLoading && displayedCharacters.length > 0"
        class="text-center mt-8 py-4 text-base-content/60"
      >
        已显示所有角色
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-col items-center justify-center py-16">
      <div class="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6">
        <svg class="w-12 h-12 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-base-content mb-2">还没有创建任何角色</h2>
      <p class="text-base-content/60 text-center mb-6 max-w-sm">
        开始创建你的第一个聊天机器人角色，打造独特的对话体验。
      </p>
      <button
        @click="openCreateDialog"
        class="btn btn-primary gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        创建第一个角色
      </button>
    </div>

    <!-- 角色创建Dialog -->
    <CharacterCreateDialog
      v-model:isOpen="isDialogOpen"
      @character-created="handleCharacterCreated"
    />

    <!-- 角色编辑Dialog -->
    <CharacterCreateDialog
      v-model:isOpen="isEditDialogOpen"
      :initial-data="editingCharacter"
      @character-created="handleCharacterUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CharacterCard from '../components/CharacterCard.vue'
import CharacterCreateDialog from '../components/CharacterCreateDialog.vue'

// Dialog状态
const isDialogOpen = ref(false)
const isEditDialogOpen = ref(false)
const editingCharacter = ref(null)

// 分页状态
const pageSize = 12
const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)

// 打开创建Dialog
const openCreateDialog = () => {
  isDialogOpen.value = true
}

// 处理角色创建成功
const handleCharacterCreated = (characterData) => {
  console.log('角色创建成功:', characterData)

  // 添加到角色列表开头
  const newCharacter = {
    id: Date.now(), // 简单的ID生成，实际应用中应该使用服务器返回的ID
    name: characterData.name,
    username: '@me', // 当前用户
    description: characterData.title,
    image: characterData.mainImageUrl || 'https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp',
    avatar: characterData.avatarUrl || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    tags: characterData.visibility === 'public' ? ['Public'] : characterData.visibility === 'unlisted' ? ['Unlisted'] : ['Private'],
    conversations: '0',
    likes: 0,
    users: 0,
    greeting: characterData.greeting,
    personality: characterData.personality,
    visibility: characterData.visibility,
    createdAt: new Date().toISOString()
  }

  myCharacters.value.unshift(newCharacter)
}

// 处理角色编辑
const handleEditCharacter = (character) => {
  editingCharacter.value = {
    name: character.name,
    title: character.description,
    greeting: character.greeting,
    personality: character.personality,
    visibility: character.visibility,
    mainImage: null,
    mainImageUrl: character.image,
    avatar: null,
    avatarUrl: character.avatar
  }
  isEditDialogOpen.value = true
}

// 处理角色更新
const handleCharacterUpdated = (characterData) => {
  console.log('角色更新成功:', characterData)

  // 找到并更新角色
  const index = myCharacters.value.findIndex(char => char.id === editingCharacter.value.id)
  if (index !== -1) {
    myCharacters.value[index] = {
      ...myCharacters.value[index],
      name: characterData.name,
      description: characterData.title,
      greeting: characterData.greeting,
      personality: characterData.personality,
      visibility: characterData.visibility,
      image: characterData.mainImageUrl || myCharacters.value[index].image,
      avatar: characterData.avatarUrl || myCharacters.value[index].avatar,
      tags: characterData.visibility === 'public' ? ['Public'] : characterData.visibility === 'unlisted' ? ['Unlisted'] : ['Private']
    }
  }

  editingCharacter.value = null
}

// 处理角色删除
const handleDeleteCharacter = (character) => {
  if (confirm(`确定要删除角色"${character.name}"吗？此操作不可撤销。`)) {
    const index = myCharacters.value.findIndex(char => char.id === character.id)
    if (index !== -1) {
      myCharacters.value.splice(index, 1)
    }
    console.log('角色删除成功:', character.name)
  }
}

// 当前页显示的角色
const displayedCharacters = computed(() => {
  const end = currentPage.value * pageSize
  const result = myCharacters.value.slice(0, end)
  // 更新是否还有更多数据
  hasMore.value = end < myCharacters.value.length
  return result
})

// 加载更多
const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  currentPage.value++
  isLoading.value = false
}

// 防抖timer
let scrollTimer = null

// 滚动监听器
const handleScroll = () => {
  // 防抖处理
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }

  scrollTimer = setTimeout(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // 当滚动到距离底部200px时开始加载
    if (scrollTop + windowHeight >= documentHeight - 200) {
      loadMore()
    }
  }, 100)
}

// 初始化数据
const initializeData = async () => {
  // 初始显示第一页数据
  currentPage.value = 1

  // 等待DOM渲染完成后检查是否需要加载更多内容
  await new Promise(resolve => setTimeout(resolve, 100))

  // 如果页面内容不足以产生滚动条，自动加载更多
  const checkAndLoadMore = () => {
    const documentHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight

    // 如果页面高度不足以产生滚动，且还有更多数据，则继续加载
    if (documentHeight <= windowHeight && hasMore.value && !isLoading.value) {
      loadMore().then(() => {
        // 递归检查，确保有足够内容
        setTimeout(checkAndLoadMore, 100)
      })
    }
  }

  checkAndLoadMore()
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  initializeData()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // 清理防抖timer
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
})

// 模拟用户创建的角色数据
const myCharacters = ref([
  {
    id: 1,
    name: 'Elara Nightshade',
    username: '@me',
    description: '著名的考古学家',
    image: 'https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp',
    avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    tags: ['Private', 'Fantasy', 'Adventure'],
    conversations: '127',
    likes: 89,
    users: 45,
    greeting: '你在一个有趣的时刻找到了我。古老的文字在低语，废墟在召唤。',
    personality: '著名的考古学家Elara Nightshade有着神秘的过去，她花费了数十年时间探索世界各地被遗忘的神庙和古代遗迹。',
    visibility: 'private',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Marcus Steel',
    username: '@me',
    description: '科幻小说作家',
    image: 'https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp',
    avatar: 'https://img.daisyui.com/images/stock/photo-1565564040-0f35735fb8bb.webp',
    tags: ['Public', 'Sci-Fi', 'Creative'],
    conversations: '89',
    likes: 156,
    users: 78,
    greeting: '欢迎来到未来世界，这里有无限的可能等待着我们去探索。',
    personality: 'Marcus是一位富有想象力的科幻作家，专注于探索人工智能和未来科技对人类社会的影响。',
    visibility: 'public',
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 3,
    name: 'Luna Moonwhisper',
    username: '@me',
    description: '神秘的占星师',
    image: 'https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp',
    avatar: 'https://img.daisyui.com/images/stock/photo-1580489944761-15a19d654956.webp',
    tags: ['Unlisted', 'Mystical', 'Wisdom'],
    conversations: '234',
    likes: 201,
    users: 123,
    greeting: '星辰指引着命运的轨迹，让我为你解读天空中隐藏的秘密。',
    personality: 'Luna是一位神秘的占星师，擅长通过星象为人们提供指导和智慧。她温和而充满洞察力。',
    visibility: 'unlisted',
    createdAt: '2024-01-05T09:15:00Z'
  }
])
</script>