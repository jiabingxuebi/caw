# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发命令

```bash
# 开发服务器 (热重载)
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码格式化
npm run format
```

## 项目架构

### 技术栈
- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **样式**: Tailwind CSS 4 + DaisyUI
- **开发工具**: Prettier

### 响应式布局架构
项目采用独特的响应式设计模式，根据屏幕尺寸动态切换完全不同的布局：

- **桌面端 (≥1024px)**: 使用 `DesktopLauncherView`，包含可折叠侧边栏 + 主内容区
- **移动端 (<1024px)**: 使用 `MobileLauncherView` 或 `MobileStandaloneView`，包含头部 + 底部 Tab 导航

核心逻辑在 `src/App.vue` 中，通过 `computed` 属性 `currentLauncher` 动态选择布局组件。

### 目录结构说明

- `src/views/desktop/` - 桌面端专用页面组件
- `src/views/mobile/` - 移动端专用页面组件
- `src/views/` - 共享页面组件 (ExploreView, ChatView, CreateView 等)
- `src/components/` - 可复用组件
- `src/composables/` - Vue 3 组合式函数 (如 `useTheme`)
- `src/stores/` - Pinia 状态管理

### 路由配置
- 基础路由指向共享页面组件
- 独立页面使用 `meta: { standalone: true }` 标记，移动端不显示底部导航
- 桌面端和移动端使用相同的路由，但渲染不同的布局

### 主题系统
使用 `src/composables/useTheme.js` 管理明暗主题：
- 支持系统偏好检测
- localStorage 持久化
- DaisyUI 主题集成 (`data-theme` 属性)

### CSS 变量
根元素定义了布局相关的 CSS 变量：
```css
--sidebar-width-collapsed: 3.75rem
--sidebar-width-expanded: 16rem
--header-height: 3.75rem
--dock-height: 5rem
```

## 开发注意事项

- 使用 `@` 别名指向 `src/` 目录
- 移动端和桌面端组件应分别放在对应目录下
- 新页面需要在 `src/router/index.js` 中注册路由
- 独立页面 (无底部导航) 需添加 `meta: { standalone: true }`
- 遵循现有的 Tailwind + DaisyUI 样式规范