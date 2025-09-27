import { ref, watch } from 'vue'

const STORAGE_KEY = 'caw-theme'
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
}

// 全局主题状态
const currentTheme = ref(THEMES.LIGHT)

export function useTheme() {
  // 初始化主题
  const initTheme = () => {
    // 从 localStorage 获取保存的主题
    const savedTheme = localStorage.getItem(STORAGE_KEY)

    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      currentTheme.value = savedTheme
    } else {
      // 检查系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      currentTheme.value = prefersDark ? THEMES.DARK : THEMES.LIGHT
    }

    applyTheme(currentTheme.value)
  }

  // 应用主题到 DOM
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  // 切换主题
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
  }

  // 设置特定主题
  const setTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) {
      currentTheme.value = theme
    }
  }

  // 监听主题变化并保存
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
  })

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    // 只有在没有手动设置主题时才跟随系统
    if (!localStorage.getItem(STORAGE_KEY)) {
      currentTheme.value = e.matches ? THEMES.DARK : THEMES.LIGHT
    }
  })

  return {
    currentTheme,
    themes: THEMES,
    initTheme,
    toggleTheme,
    setTheme,
    isDark: () => currentTheme.value === THEMES.DARK
  }
}