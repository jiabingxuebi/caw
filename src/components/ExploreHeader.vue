<template>
  <div class="flex justify-between items-center gap-3 p-4">
    <!-- 应用 Logo - 只在手机模式显示 -->
    <div class="lg:hidden">
      <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-primary-content" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
    </div>

    <!-- 右侧按钮组 -->
    <div class="flex items-center gap-3">
    <!-- 主题切换按钮 -->
    <button
      class="btn btn-ghost btn-circle"
      title="切换主题"
      @click="toggleTheme"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>

    <!-- 用户头像 -->
    <div class="avatar">
      <div class="w-10 rounded-full">
        <img
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          alt="用户头像"
        />
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
// 暂时的主题切换函数，稍后实现
const toggleTheme = () => {
  console.log('切换主题')
}
</script>