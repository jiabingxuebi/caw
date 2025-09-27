<template>
  <div>
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
import CharacterCard from '../components/CharacterCard.vue'
import CharacterTagFilterDialog from '../components/CharacterTagFilterDialog.vue'
import DesktopCharacterFilter from '../components/DesktopCharacterFilter.vue'
import MobileCharacterFilter from '../components/MobileCharacterFilter.vue'

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
  allCharacters.forEach(char => {
    char.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

// 过滤后的角色列表（基于完整数据库）
const filteredCharacters = computed(() => {
  if (selectedTags.value.length === 0) {
    return allCharacters
  }
  return allCharacters.filter(char => selectedTags.value.some(tag => char.tags.includes(tag)))
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

// 模拟完整角色数据库
const allCharacters = [
  {
    id: 1,
    name: 'Wriothesley',
    username: '@milaaqwq',
    description: 'A Wolf in heat',
    image: 'https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp',
    tags: ['Dominant', 'FemalePOV', 'NSFW', 'Smell', 'Romantic', 'Gentle Dom'],
    conversations: '31.5k',
    likes: 100,
    users: 177,
  },
  {
    id: 2,
    name: 'Elena',
    username: '@artlover',
    description: 'Creative soul and dreamer',
    image: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    tags: ['Creative', 'Artist', 'Romantic', 'SFW'],
    conversations: '12.3k',
    likes: 95,
    users: 89,
  },
  {
    id: 3,
    name: 'Marcus',
    username: '@warrior',
    description: 'Knight in shining armor',
    image: 'https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp',
    tags: ['Protective', 'Strong', 'Medieval', 'Hero'],
    conversations: '8.7k',
    likes: 98,
    users: 145,
  },
  {
    id: 4,
    name: 'Luna',
    username: '@moonchild',
    description: 'Mystical and enchanting',
    image: 'https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp',
    tags: ['Mystical', 'Magic', 'Fantasy', 'Elegant'],
    conversations: '15.2k',
    likes: 97,
    users: 203,
  },
  {
    id: 5,
    name: 'Alex',
    username: '@techgeek',
    description: 'Future tech enthusiast',
    image: 'https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp',
    tags: ['Tech', 'Futuristic', 'Smart', 'Innovation'],
    conversations: '9.1k',
    likes: 92,
    users: 67,
  },
  {
    id: 6,
    name: 'Sophia',
    username: '@healer',
    description: 'Gentle healer with ancient wisdom',
    image: 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
    tags: ['Healer', 'Wisdom', 'SFW', 'Gentle', 'Caring'],
    conversations: '22.1k',
    likes: 156,
    users: 298,
  },
  {
    id: 7,
    name: 'Raven',
    username: '@darksoul',
    description: 'Dark and mysterious assassin',
    image: 'https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp',
    tags: ['Dark', 'Mysterious', 'Assassin', 'NSFW', 'Dangerous'],
    conversations: '18.7k',
    likes: 134,
    users: 201,
  },
  {
    id: 8,
    name: 'Phoenix',
    username: '@firebird',
    description: 'Immortal guardian of fire',
    image: 'https://img.daisyui.com/images/stock/photo-1629904853893-c2c8981a1dc5.webp',
    tags: ['Fire', 'Immortal', 'Guardian', 'Powerful', 'Magical'],
    conversations: '26.3k',
    likes: 189,
    users: 312,
  },
  {
    id: 9,
    name: 'Aurora',
    username: '@lightbringer',
    description: 'Bringer of dawn and hope',
    image: 'https://img.daisyui.com/images/stock/photo-1580489944761-15a19d654956.webp',
    tags: ['Light', 'Hope', 'Dawn', 'Positive', 'Inspiring'],
    conversations: '14.2k',
    likes: 167,
    users: 234,
  },
  {
    id: 10,
    name: 'Shadow',
    username: '@nightwalker',
    description: 'Master of stealth and shadows',
    image: 'https://img.daisyui.com/images/stock/photo-1568602471122-7832951cc4c5.webp',
    tags: ['Stealth', 'Shadow', 'Night', 'Silent', 'Ninja'],
    conversations: '19.8k',
    likes: 145,
    users: 189,
  },
  {
    id: 11,
    name: 'Crystal',
    username: '@gemkeeper',
    description: 'Guardian of precious crystals',
    image: 'https://img.daisyui.com/images/stock/photo-1572635196237-14b3f281503f.webp',
    tags: ['Crystal', 'Guardian', 'Precious', 'Magic', 'Protection'],
    conversations: '11.4k',
    likes: 123,
    users: 156,
  },
  {
    id: 12,
    name: 'Storm',
    username: '@thundergod',
    description: 'Controller of thunder and lightning',
    image: 'https://img.daisyui.com/images/stock/photo-1589681424213-023c2da5d0ac.webp',
    tags: ['Thunder', 'Lightning', 'Storm', 'Power', 'Elemental'],
    conversations: '23.6k',
    likes: 178,
    users: 267,
  },
]
</script>
