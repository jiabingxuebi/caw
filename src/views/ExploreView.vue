<template>
  <div>
    <!-- 顶部 Header -->
    <ExploreHeader />

    <!-- 页面内容 -->
    <div class="p-4">
      <!-- 搜索框和过滤器 -->
      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <!-- 搜索框 -->
        <div class="relative w-full lg:w-96">
          <div class="absolute top-1/2 left-3 transform -translate-y-1/2 pointer-events-none z-10">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="搜索角色..."
            class="input w-full pl-10 focus:outline-none focus:ring-1 focus:ring-primary"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- 过滤器和排序 -->
        <div class="flex items-center gap-3 justify-start lg:justify-end">
          <!-- 标签过滤器 -->
          <div class="relative flex items-center bg-base-100 border border-base-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-base-200 transition-colors">
            <svg class="w-4 h-4 text-base-content" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 4h2v2H3V4zm4 0h14v2H7V4zM3 10h2v2H3v-2zm4 0h14v2H7v-2zM3 16h2v2H3v-2zm4 0h14v2H7v-2z"/>
            </svg>
            <div class="absolute -top-1 -right-1 bg-base-content text-base-100 text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">3</div>
          </div>

          <!-- 排序功能 -->
          <div class="relative">
            <div
              @click="toggleSortDropdown"
              class="flex items-center bg-base-100 border border-base-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-base-200 transition-colors min-w-[110px]"
            >
              <div class="flex items-center justify-between w-full gap-2">
                <span class="text-sm font-medium text-base-content">{{ currentSort }}</span>
                <svg
                  class="w-4 h-4 text-base-content transition-transform duration-200 flex-shrink-0"
                  :class="{ 'rotate-180': sortDropdownOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>

            <!-- 下拉菜单 -->
            <div
              v-show="sortDropdownOpen"
              class="absolute top-full mt-1 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg py-1 w-full z-20"
            >
              <div
                v-for="option in sortOptions"
                :key="option"
                @click="selectSort(option)"
                class="px-3 py-2 text-sm text-base-content hover:bg-base-200 cursor-pointer transition-colors"
                :class="{ 'bg-base-200 font-medium': option === currentSort }"
              >
                {{ option }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 角色卡片网格 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <CharacterCard v-for="character in characters" :key="character.id" :character="character" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ExploreHeader from '../components/ExploreHeader.vue'
import CharacterCard from '../components/CharacterCard.vue'

// 搜索状态
const searchQuery = ref('')

// 排序状态
const sortDropdownOpen = ref(false)
const currentSort = ref('Trending')
const sortOptions = ['Trending', 'Top Rated', 'Popular', 'Latest', 'Name']

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
const selectSort = (option) => {
  currentSort.value = option
  sortDropdownOpen.value = false
  console.log('选择排序:', option)
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  const sortElement = event.target.closest('.relative')
  if (!sortElement) {
    sortDropdownOpen.value = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 模拟角色数据
const characters = ref([
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
])
</script>
