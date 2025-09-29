<template>
  <!-- 移动端独立页面容器 - 无底部导航 -->
  <div class="lg:hidden min-h-screen">
    <!-- 移动端头部 -->
    <MobileTabHeader>
      <template #left>
        <button
          @click="goBack"
          class="btn btn-ghost btn-circle"
          title="返回"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="ml-3 text-lg font-semibold">{{ currentPageTitle }}</h1>
      </template>

      <template #right>
        <button
          v-if="$route.name === 'settings'"
          class="btn btn-ghost btn-circle"
          title="更多选项"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
        <button
          v-else-if="$route.name === 'chat-detail'"
          class="btn btn-ghost btn-circle"
          title="更多选项"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </template>
    </MobileTabHeader>

    <!-- 页面内容区域 -->
    <main class="min-h-screen" style="padding-top: var(--header-height)">
      <router-view />
    </main>
  </div>

  <!-- 桌面端重定向提示 -->
  <div class="hidden lg:flex min-h-screen items-center justify-center p-4">
    <div class="text-center">
      <h1 class="text-xl font-bold mb-4">请使用桌面端界面</h1>
      <p class="text-base-content/60 mb-6">当前页面在桌面端使用侧边栏导航。</p>
      <button
        @click="goBack"
        class="btn btn-primary"
      >
        返回
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MobileTabHeader from '../../components/MobileTabHeader.vue'

const router = useRouter()
const route = useRoute()

// 根据路由名称获取页面标题
const currentPageTitle = computed(() => {
  const titleMap = {
    'settings': '设置',
    'chat-detail': '聊天详情',
    'character-detail': '角色详情'
  }
  return titleMap[route.name] || '页面'
})

// 返回上一页或主页
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/explore')
  }
}
</script>

<style>
/* 确保CSS变量可用 */
:root {
  --sidebar-width-collapsed: 3.75rem;
  --sidebar-width-expanded: 16rem;
  --header-height: 3.75rem;
  --dock-height: 5rem;
}
</style>