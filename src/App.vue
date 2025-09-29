<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import DesktopLauncherView from './views/DesktopLauncherView.vue'
import MobileLauncherView from './views/MobileLauncherView.vue'

// 监听屏幕尺寸变化
const isDesktop = ref(false)

// 检查屏幕尺寸
const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 1024 // lg breakpoint
}

// 根据屏幕尺寸选择组件
const currentLauncher = computed(() => {
  return isDesktop.value ? DesktopLauncherView : MobileLauncherView
})

// 生命周期
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <div id="app" class="min-h-screen bg-base-100">
    <!-- 响应式容器：根据屏幕尺寸自动选择桌面端或移动端布局 -->
    <component :is="currentLauncher" />
  </div>
</template>

<style>
:root {
  --sidebar-width-collapsed: 3.75rem;
  --sidebar-width-expanded: 16rem;
  --header-height: 3.75rem;
  --dock-height: 5rem;
}
</style>
