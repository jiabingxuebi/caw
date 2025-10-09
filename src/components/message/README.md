# MessageIframe 自包含组件

该目录提供一个不依赖项目其他文件的自包含 Vue 组件：用于把包含 `<body>...</body>` 的代码块以 `iframe` 渲染（含加载遮罩、Blob/srcdoc 切换、vh 兼容），未包含 `<body>` 的代码块以可折叠文本显示。

## 目录结构

- `MessageIframe.vue` 组件本体
- `Demo.vue` 示例父组件（演示传入 blocks 使用方式）
- `README.md` 使用说明

## 功能要点

- 自动识别：代码块包含 `<body>` 与 `</body>` 时走 `iframe` 渲染；否则作为普通代码块显示并支持折叠/展开。
- 加载遮罩：默认显示，10 秒后提示文案变为“如加载时间过长，请检查网络”，加载完成后淡出。
- Blob/srcdoc：支持两种方式注入 HTML；内容内可用注释控制。
- vh 兼容：检测到 `min-height:*vh` 或 `Nvh` 时，自动把 `vh` 转换为基于 `--viewport-height` 的表达式，并通过 `postMessage` 在加载后同步视口高度。
- 自包含：不引用项目其他工具/样式/脚本。

## Props（JavaScript）

- `blocks` 要渲染的代码块数组（必填）。
- `messageId` 组件内生成 `iframe` 的 id 前缀，默认：`"local"`。
- `defaultCollapsed` 非 HTML 文档代码块默认是否折叠，默认：`false`。
- `defaultShowLoading` 是否默认显示加载遮罩，默认：`true`。
- `defaultBlob` 当未在内容中使用启用注释时，是否默认使用 Blob 渲染，默认：`false`。
- `userAvatarUrl` 注入到 iframe 内部的 `.user_avatar/.user-avatar` 背景图 URL，可选。
- `charAvatarUrl` 注入到 iframe 内部的 `.char_avatar/.char-avatar` 背景图 URL，可选。

## 事件（JavaScript）

- `render-started(iframeId)` 设置 `src/srcdoc` 之前触发。
- `render-ended(iframeId)` `iframe` `load` 事件触发后触发。

## 内容内控制注释

- `<!-- disable-default-loading -->` 关闭加载遮罩。
- `<!-- enable-blob-url-render -->` 启用 Blob URL 渲染（否则使用 `srcdoc`）。

## 使用示例

见同目录 `Demo.vue`。在实际项目里，可以像下方这样引入（JavaScript 版本）：

```vue
<template>
  <MessageIframe :blocks="blocks" message-id="demo" />
  <!-- 也可传入 userAvatarUrl/charAvatarUrl、defaultBlob 等可选项 -->
  <!-- <MessageIframe :blocks="blocks" :default-blob="true" :user-avatar-url="'/u.png'" /> -->
```

```js
import MessageIframe from './MessageIframe.vue'

const blocks = [
  `<!-- enable-blob-url-render -->\n<body>\n  <h3>示例文档</h3>\n  <div style="min-height:50vh;background:#eef">需要 vh 兼容处理</div>\n</body>`,
  `console.log('普通代码块');`
]
```

## 注意事项

- Blob 渲染会创建临时 URL，组件在卸载时会自动 `URL.revokeObjectURL` 释放。
- 使用 Blob 渲染时组件会注入 `<base href="window.location.origin/">`，以便内容里相对路径资源可正确解析。
- 如需更严格的隔离，可自行在 `MessageIframe.vue` 的 `<iframe>` 上添加 `sandbox`、`referrerpolicy` 等属性。

### 完整 <script setup> 示例（JavaScript）

```vue
<template>
  <MessageIframe :blocks="blocks" message-id="demo" />
</template>

<script setup>
import { ref } from 'vue'
import MessageIframe from './MessageIframe.vue'

const blocks = ref([
  `<!-- enable-blob-url-render -->\n<body>\n  <h3>示例文档</h3>\n  <div style="min-height:50vh;background:#eef">需要 vh 兼容处理</div>\n</body>`,
  `console.log('普通代码块');`
])
</script>
```
