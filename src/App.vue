<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()

// 侧边栏状态
const sidebarCollapsed = ref(false)

// 切换侧边栏状态
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 导航项配置
const navItems = [
  {
    name: 'explore',
    path: '/explore',
    label: '探索',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    name: 'chat',
    path: '/chat',
    label: '聊天',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    name: 'create',
    path: '/create',
    label: '创建',
    icon: 'M12 4v16m8-8H4',
  },
  {
    name: 'message',
    path: '/message',
    label: '消息',
    icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    name: 'profile',
    path: '/profile',
    label: '我的',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
]

// 当前页面标题
const currentPageTitle = computed(() => {
  const currentItem = navItems.find(item => item.name === route.name)
  return currentItem ? currentItem.label : '应用名称'
})
</script>

<template>
  <div id="app" class="min-h-screen bg-base-100">
    <!-- 桌面端布局 -->
    <div class="hidden lg:flex min-h-screen">
      <!-- 侧边栏 -->
      <div
        class="bg-base-200 transition-[width] duration-200 ease-out flex-shrink-0 overflow-hidden"
        :class="sidebarCollapsed ? 'w-15' : 'w-64'"
      >
        <!-- 侧边栏头部 -->
        <div class="p-2 border-b border-base-300">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <!-- Logo - 收起状态下点击展开 -->
              <button
                @click="toggleSidebar"
                class="w-11 h-11 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/80 transition-colors flex-shrink-0"
                title="展开侧边栏"
              >
                <svg class="w-5 h-5 text-primary-content" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </button>

              <h2 class="ml-3 text-xl font-bold whitespace-nowrap">应用名称</h2>
            </div>

            <!-- 收起按钮 - 只在展开状态显示 -->
            <button
              v-if="!sidebarCollapsed"
              @click="toggleSidebar"
              class="w-6 h-6 hover:bg-base-300 rounded flex items-center justify-center transition-colors flex-shrink-0"
              title="收起侧边栏"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 导航菜单 -->
        <div class="p-2">
          <ul class="space-y-1">
            <li v-for="item in navItems" :key="item.name">
              <router-link
                :to="item.path"
                :class="{
                  'bg-primary text-primary-content': $route.name === item.name,
                  'hover:bg-base-300': $route.name !== item.name,
                }"
                class="group relative flex items-center p-3 rounded-lg transition-colors duration-200"
                :title="sidebarCollapsed ? item.label : ''"
              >
                <!-- 图标 - 固定位置，永不移动 -->
                <div class="w-5 h-5 flex-shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
                  </svg>
                </div>

                <!-- 文字标签 - 固定位置，通过overflow隐藏 -->
                <span class="ml-6 text-sm font-medium whitespace-nowrap">
                  {{ item.label }}
                </span>

                <!-- 收起状态的悬浮提示 -->
                <div
                  v-if="sidebarCollapsed"
                  class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap"
                >
                  {{ item.label }}
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex-1 flex flex-col">
        <!-- 顶部Header -->
        <AppHeader />

        <main class="flex-1 overflow-auto">
          <router-view />
        </main>
      </div>
    </div>

    <div class="lg:hidden min-h-screen flex flex-col">
      <!-- 顶部Header -->
      <AppHeader />

      <!-- 页面内容 -->
      <main class="flex-1 pb-20">
        <router-view />
      </main>

      <!-- 底部导航 -->
      <div class="dock">
        <button
          v-for="item in navItems"
          :key="item.name"
          :class="{ 'text-primary': $route.name === item.name }"
          @click="$router.push(item.path)"
        >
          <svg class="size-[1.2em]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
          <span class="dock-label">{{ item.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
