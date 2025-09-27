<template>
  <div>
    <!-- 顶部 Header -->
    <ExploreHeader />

    <!-- 页面内容 -->
    <div class="p-4">
      <!-- 搜索框 -->
      <div class="mb-6">
        <div class="w-full lg:w-96">
          <div class="relative">
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
              class="input input-bordered w-full pl-10"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
            />
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
import { ref } from 'vue'
import ExploreHeader from '../components/ExploreHeader.vue'
import CharacterCard from '../components/CharacterCard.vue'

// 搜索状态
const searchQuery = ref('')

// 搜索处理函数
const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
  // 这里可以添加实际的搜索逻辑
}

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
