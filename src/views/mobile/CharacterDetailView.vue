<template>
  <div class="p-4">
    <!-- 角色信息卡片 -->
    <div class="card bg-base-100 shadow mb-4">
        <div class="card-body">
          <div class="flex items-center mb-4">
            <img
              :src="characterData.avatar"
              :alt="characterData.name"
              class="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h2 class="text-xl font-bold">{{ characterData.name }}</h2>
              <p class="text-base-content/60">{{ characterData.category }}</p>
            </div>
          </div>
          <p class="text-base-content/80">{{ characterData.description }}</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-2 mb-4">
        <button class="btn btn-primary flex-1">开始聊天</button>
        <button class="btn btn-outline">编辑角色</button>
      </div>

      <!-- 角色详细信息 -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h3 class="card-title">角色设定</h3>
          <div class="space-y-3">
            <div>
              <span class="font-medium">性格特点：</span>
              <span class="text-base-content/80">{{ characterData.personality }}</span>
            </div>
            <div>
              <span class="font-medium">背景故事：</span>
              <span class="text-base-content/80">{{ characterData.background }}</span>
            </div>
            <div>
              <span class="font-medium">创建时间：</span>
              <span class="text-base-content/60">{{ characterData.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 角色数据
const characterData = ref({
  id: null,
  name: '',
  avatar: '',
  category: '',
  description: '',
  personality: '',
  background: '',
  createdAt: ''
})

// 初始化角色数据
onMounted(() => {
  const characterId = route.params.id

  // 模拟从API获取角色数据
  characterData.value = {
    id: characterId,
    name: `角色 ${characterId}`,
    avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    category: '虚拟助手',
    description: '这是一个智能虚拟角色，可以与用户进行有趣的对话。',
    personality: '友善、幽默、善于倾听',
    background: '来自数字世界的AI角色，致力于为用户提供最佳的对话体验。',
    createdAt: '2024-01-15'
  }
})
</script>