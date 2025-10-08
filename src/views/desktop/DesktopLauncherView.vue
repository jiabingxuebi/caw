<template>
  <!-- 桌面端布局 -->
  <div class="hidden lg:flex min-h-screen">
    <!-- 侧边栏 -->
    <div
      class="fixed left-0 top-0 h-screen bg-base-200 transition-[width] duration-200 ease-out overflow-hidden z-40 flex flex-col"
      :style="{ width: sidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)' }"
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

    <div
      class="flex-1 flex flex-col transition-[margin-left] duration-200 ease-out"
      :style="{ marginLeft: sidebarCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)' }"
    >
      <!-- 顶部Header -->
      <WebHeader :sidebar-collapsed="sidebarCollapsed" />

      <main class="flex-1 overflow-auto" style="padding-top: var(--header-height)">
        <router-view />
      </main>
    </div>
  </div>

  <!-- 移动端重定向提示 -->
  <div class="lg:hidden min-h-screen flex items-center justify-center p-4">
    <div class="text-center">
      <h1 class="text-xl font-bold mb-4">请使用移动端界面</h1>
      <p class="text-base-content/60 mb-6">当前界面专为桌面端设计，请在移动设备上使用。</p>
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="item in navItems"
          :key="item.name"
          @click="$router.push(item.path)"
          class="btn btn-outline btn-sm"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import WebHeader from '../../components/WebHeader.vue'

const route = useRoute()

// 侧边栏状态
const sidebarCollapsed = ref(false)

// 切换侧边栏状态
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 桌面端导航项配置
const navItems = [
  {
    name: 'explore',
    path: '/explore',
    label: '探索',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    name: 'chat',
    path: '/chats',
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
    name: 'member',
    path: '/member',
    label: '会员',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
  {
    name: 'profile',
    path: '/profile',
    label: '我的',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
]
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
