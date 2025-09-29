<template>
  <div class="p-4">
    <!-- 设置项目 -->
    <div class="space-y-4">
        <!-- 账户设置 -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">账户设置</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span>用户名</span>
                <span class="text-base-content/60">用户123</span>
              </div>
              <div class="flex items-center justify-between">
                <span>邮箱</span>
                <span class="text-base-content/60">user@example.com</span>
              </div>
              <button class="btn btn-outline btn-sm">修改密码</button>
            </div>
          </div>
        </div>

        <!-- 外观设置 -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">外观设置</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span>主题模式</span>
                <button
                  class="btn btn-ghost btn-circle"
                  :title="isDark() ? '切换到亮色模式' : '切换到暗色模式'"
                  @click="toggleTheme"
                >
                  <svg v-if="!isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 通知设置 -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">通知设置</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span>推送通知</span>
                <input type="checkbox" class="toggle toggle-primary" checked />
              </div>
              <div class="flex items-center justify-between">
                <span>邮件通知</span>
                <input type="checkbox" class="toggle toggle-primary" />
              </div>
            </div>
          </div>
        </div>

        <!-- 关于 -->
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">关于</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span>版本</span>
                <span class="text-base-content/60">1.0.0</span>
              </div>
              <button class="btn btn-outline btn-sm">检查更新</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '../../composables/useTheme'

const { toggleTheme, isDark } = useTheme()
</script>