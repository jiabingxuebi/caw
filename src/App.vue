<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DesktopLauncherView from './views/desktop/DesktopLauncherView.vue'
import MobileLauncherView from './views/mobile/MobileLauncherView.vue'

const route = useRoute()

const isDesktop = ref(false)

const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 1024
}

const currentLauncher = computed(() => {
  if (isDesktop.value) {
    return DesktopLauncherView
  }

  if (route.meta?.standalone) {
    return null
  }

  return MobileLauncherView
})

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
    <component v-if="currentLauncher" :is="currentLauncher" />
    <router-view v-else />
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
