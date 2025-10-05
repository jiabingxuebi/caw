<template>
  <div>
    <!-- 手机端头部 -->
    <MobileTabHeader>
      <template #left>
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-primary-content" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 class="ml-3 text-lg font-semibold">探索</h1>
      </template>

      <template #right>
        <button
          class="btn btn-ghost btn-circle"
          :title="isDark() ? '切换到亮色模式' : '切换到暗色模式'"
          @click="toggleTheme"
        >
          <!-- 太阳图标 (亮色模式时显示) -->
          <svg v-if="!isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>

          <!-- 月亮图标 (暗色模式时显示) -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>
      </template>
    </MobileTabHeader>

    <!-- 页面内容 -->
    <div class="p-4">
      <!-- 桌面模式过滤器 -->
      <DesktopCharacterFilter
        v-model:searchQuery="searchQuery"
        v-model:unlimitedMode="unlimitedMode"
        :selectedTags="selectedTags"
        :currentSort="currentSort"
        :sortOptions="sortOptions"
        :sortDropdownOpen="sortDropdownOpen"
        @search="handleSearch"
        @open-filter="openFilterModal"
        @toggle-sort="toggleSortDropdown"
        @select-sort="selectSort"
      />

      <!-- 移动模式过滤器 -->
      <MobileCharacterFilter
        v-model:searchQuery="searchQuery"
        v-model:unlimitedMode="unlimitedMode"
        :selectedTags="selectedTags"
        :currentSort="currentSort"
        :sortOptions="sortOptions"
        :sortDropdownOpen="sortDropdownOpen"
        @search="handleSearch"
        @open-filter="openFilterModal"
        @toggle-sort="toggleSortDropdown"
        @select-sort="selectSort"
      />

      <!-- 角色卡片网格 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <CharacterCard v-for="character in displayedCharacters" :key="character.id" :character="character" />
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

    <!-- 标签过滤器弹窗 -->
    <CharacterTagFilterDialog
      :allTags="allTags"
      :selectedTags="selectedTags"
      :isOpen="filterModalOpen"
      @update:selectedTags="selectedTags = $event"
      @update:isOpen="filterModalOpen = $event"
      @apply-filters="handleFiltersApplied"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MobileTabHeader from '../components/MobileTabHeader.vue'
import CharacterCard from '../components/CharacterCard.vue'
import CharacterTagFilterDialog from '../components/CharacterTagFilterDialog.vue'
import DesktopCharacterFilter from '../components/DesktopCharacterFilter.vue'
import MobileCharacterFilter from '../components/MobileCharacterFilter.vue'
import { useTheme } from '../composables/useTheme'
import api from '@/api'

// 主题切换
const { toggleTheme, isDark } = useTheme()

// 角色数据
const allCharacters = ref([])

// 搜索状态
const searchQuery = ref('')

// 排序状态
const sortDropdownOpen = ref(false)
const currentSort = ref('Trending')
const sortOptions = ['Trending', 'Top Rated', 'Popular', 'Latest', 'Name']

// 过滤器状态
const filterModalOpen = ref(false)
const selectedTags = ref([])

// 无限制模式状态
const unlimitedMode = ref(false)

// 分页状态
const pageSize = 12
const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)

// 计算所有唯一标签
const allTags = computed(() => {
  const tags = new Set()
  allCharacters.value.forEach(char => {
    if (char.tags) {
      char.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).sort()
})

// 过滤后的角色列表（基于完整数据库）
const filteredCharacters = computed(() => {
  if (selectedTags.value.length === 0) {
    return allCharacters.value
  }
  return allCharacters.value.filter(char => char.tags && selectedTags.value.some(tag => char.tags.includes(tag)))
})

// 当前页显示的角色
const displayedCharacters = computed(() => {
  const end = currentPage.value * pageSize
  const result = filteredCharacters.value.slice(0, end)
  // 更新是否还有更多数据
  hasMore.value = end < filteredCharacters.value.length
  return result
})

// 搜索处理函数
const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
  // 这里可以添加实际的搜索逻辑
}

// 切换排序下拉菜单
const toggleSortDropdown = () => {
  sortDropdownOpen.value = !sortDropdownOpen.value
}

// 选择排序选项
const selectSort = option => {
  currentSort.value = option
  sortDropdownOpen.value = false
  console.log('选择排序:', option)
}

// 打开过滤器弹窗
const openFilterModal = () => {
  filterModalOpen.value = true
}

// 处理过滤器应用
const handleFiltersApplied = tags => {
  console.log('应用过滤器:', tags)
  // 重置分页
  currentPage.value = 1
}

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

// 点击外部关闭下拉菜单
const handleClickOutside = event => {
  const sortElement = event.target.closest('.relative')
  if (!sortElement) {
    sortDropdownOpen.value = false
  }
}

// 获取角色数据
const fetchCharacters = async () => {
  try {
    const data = await api.character.getCharacters()
    allCharacters.value = data.map(char => ({
      id: char.id,
      name: char.name,
      username: '',
      description: char.description,
      image: char.backgroundImageUrl || 'https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp',
      tags: [],
      conversations: '0',
      likes: 0,
      users: 0,
    }))
  } catch (error) {
    console.error('获取角色数据失败:', error)
  }
}

// 初始化数据
const initializeData = async () => {
  await fetchCharacters()

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
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll)
  initializeData()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
  // 清理防抖timer
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
})
</script>
