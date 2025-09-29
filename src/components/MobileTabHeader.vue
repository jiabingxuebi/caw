<template>
  <div class="fixed top-0 left-0 right-0 z-50 bg-base-100 border-b border-base-300 flex items-center justify-between px-4 py-2 lg:hidden">
    <!-- 左侧内容区域 -->
    <div class="flex items-center">
      <slot name="left">
        <!-- 默认内容：简单标题 -->
        <h1 class="text-lg font-semibold text-base-content">默认标题</h1>
      </slot>
    </div>

    <!-- 右侧内容区域 -->
    <div class="flex items-center gap-2">
      <slot name="right">
        <!-- 默认内容：空 -->
      </slot>
    </div>
  </div>
</template>

<script setup>
// 这个组件是纯布局组件，不需要任何逻辑
// 所有的交互逻辑都通过 slot 内容由父组件处理
</script>