<template>
  <div>
    <!-- 顶部 Header -->
    <ExploreHeader />

    <!-- 页面内容 -->
    <div class="p-4">
      <!-- 角色卡片网格 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <CharacterCard v-for="character in characters" :key="character.id" :character="character" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ExploreHeader from '../components/ExploreHeader.vue'
import CharacterCard from '../components/CharacterCard.vue'

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
