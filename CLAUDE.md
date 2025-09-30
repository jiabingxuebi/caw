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

## DaisyUI 组件使用

项目使用 DaisyUI 作为 UI 组件库，**优先使用 DaisyUI 组件而非自定义样式**：

### 常用组件
- **按钮**: `btn`, `btn-primary`, `btn-ghost`, `btn-circle`
- **卡片**: `card`, `card-body`
- **下拉菜单**: `dropdown`, `dropdown-content`, `menu`
- **表单**: `input`, `textarea`, `select`, `toggle`
- **加载状态**: `loading`, `loading-spinner`
- **模态框**: `modal`

### DaisyUI 优先原则
1. 检查功能需求，优先查找对应的 DaisyUI 组件
2. 使用 DaisyUI 的语义化类名而非自定义 Tailwind 组合
3. 利用 DaisyUI 的主题系统自动适配明暗主题

## API 请求工具

项目提供了完整的API请求解决方案，按功能模块组织：

### 目录结构
```
src/api/
├── index.js          # API统一入口
├── http.js           # HTTP客户端工具
├── characterApi.js   # 角色相关API
└── messageApi.js     # 消息/聊天相关API
```

### 基础用法
```javascript
import api from '@/api'

// 角色相关操作
const characters = await api.character.getCharacterList({ page: 1, limit: 10 })
const character = await api.character.createCharacter(characterData)

// 消息/聊天操作
const message = await api.message.sendMessage({ chatId: '123', content: 'Hello!' })
const chat = await api.chat.createChat({ characterId: '456' })
```

### API模块说明
- **api.character**: 角色管理（创建、更新、删除、上传头像、导入导出等）
- **api.message**: 消息操作（发送、编辑、删除、点赞等）
- **api.chat**: 聊天会话管理（创建、归档、分享、导出等）
- **api.realtime**: 实时功能（WebSocket、打字状态等）

### 配置说明
- 在 `.env` 文件中设置 `VITE_API_BASE_URL` 配置API基础地址
- 自动处理认证token（从localStorage或sessionStorage获取）
- 支持请求/响应拦截器
- 自动重试机制（网络错误和5xx错误）
- 请求超时处理（默认10秒）

### 新建API模块
创建新的API模块时，参考现有文件结构：
1. 创建 `xxxApi.js` 文件
2. 导出具体的API方法
3. 在 `api/index.js` 中导入并导出

### 示例
```html
<!-- ✅ 好：使用 DaisyUI dropdown -->
<div class="dropdown dropdown-end">
  <div tabindex="0" role="button" class="btn btn-ghost btn-circle">⋮</div>
  <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box shadow">
    <li><a>选项1</a></li>
  </ul>
</div>

<!-- ❌ 避免：自定义下拉菜单样式 -->
<div class="relative">
  <button class="w-8 h-8 rounded-lg hover:bg-base-200">⋮</button>
  <div class="absolute bg-base-100 border rounded-lg shadow">...</div>
</div>
```