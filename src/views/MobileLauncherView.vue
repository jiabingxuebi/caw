<template>
  <!-- 移动端主容器 -->
  <div class="lg:hidden min-h-screen flex flex-col">
    <!-- Tab 页面内容区域 -->
    <main class="flex-1 pb-20">
      <router-view />
    </main>

    <!-- 底部 Tab 导航 -->
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

  <!-- 桌面端重定向提示 -->
  <div class="hidden lg:flex min-h-screen items-center justify-center p-4">
    <div class="text-center">
      <h1 class="text-xl font-bold mb-4">请使用桌面端界面</h1>
      <p class="text-base-content/60 mb-6">当前界面专为移动端设计，请在桌面上使用。</p>
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
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 移动端 Tab 导航项配置
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