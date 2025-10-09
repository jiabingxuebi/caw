<template>
  <!-- 简单演示：一个包含 <body> 的文档块 + 一个普通代码块 -->
  <section style="padding:12px">
    <h2>MessageIframe Demo</h2>
    <p>下方第一个为 HTML 文档（启用 Blob 渲染与 vh 兼容），第二个为可折叠的普通代码块。</p>

    <MessageIframe
      :blocks="blocks"
      message-id="demo"
      :default-show-loading="true"
      :default-collapsed="false"
      :default-blob="false"
      :user-avatar-url="userAvatar"
      :char-avatar-url="charAvatar"
      @render-started="onStarted"
      @render-ended="onEnded"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import MessageIframe from './MessageIframe.vue'

// 为演示方便，这里使用 data:URL 作为头像占位图，可替换为实际 URL
const userAvatar = ref('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><rect width=%2232%22 height=%2232%22 fill=%22%23a3e635%22/></svg>')
const charAvatar = ref('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><rect width=%2232%22 height=%2232%22 fill=%22%23678fff%22/></svg>')

// 示例 blocks：一个 HTML 文档块（包含 <body> 标签）、一个普通代码块
const blocks = ref([
  `<!-- enable-blob-url-render -->\n<body>\n  <h3>示例文档区域</h3>\n  <p>这是一个包含 &lt;body&gt; 的片段，会在 iframe 中渲染。</p>\n  <div style="min-height:50vh;background:#eef;border:1px dashed #99c;padding:8px">\n    使用了 <code>min-height:50vh</code>，将触发 vh 兼容处理。\n  </div>\n  <p>头像类名占位测试：<span class="user-avatar" style="display:inline-block;width:24px;height:24px;background-size:cover;border-radius:50%"></span> / <span class="char-avatar" style="display:inline-block;width:24px;height:24px;background-size:cover;border-radius:50%"></span></p>\n</body>`,
  `// 普通代码块示例\nfunction hello(){\n  console.log('Hello from code block');\n}\nhello();\n`
])

function onStarted(id) {
  // 可在此记录日志或做埋点
  console.log('[render-started]', id)
}
function onEnded(id) {
  console.log('[render-ended]', id)
}
</script>

<style scoped>
section { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
h2 { margin: 0 0 8px; font-size: 16px; }
p { margin: 6px 0 12px; color: #475569; }
</style>
