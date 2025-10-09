<template>
  <!--
    自包含的 iframe 渲染组件（不依赖项目其他文件）
    - 功能对齐原逻辑：
      1) 对包含 <body>...</body> 的代码块，生成 iframe 渲染，带加载遮罩、Blob/srcdoc 切换、vh 兼容处理、视口高度更新。
      2) 对不包含 <body> 的代码块，提供一个展开/折叠按钮（模拟原 addToggleButtonToCodeBlock 行为）。
      3) 通过组件事件替代原事件总线：render-started / render-ended。
    - 所有逻辑均在本文件实现，无外部引用。
  -->
  <div class="mi-root">
    <template v-for="(item, idx) in items" :key="item.id">
      <!-- HTML 文档：走 iframe 渲染流程 -->
      <div v-if="item.isHtmlDoc" class="mi-wrapper">
        <div v-if="item.showLoading" class="mi-loading-overlay" :style="{ opacity: item.loadingOpacity }">
          <div class="mi-loading-content">
            <div class="mi-spinner" aria-hidden="true" />
            <span class="mi-loading-text">{{ item.loadingText }}</span>
          </div>
        </div>
        <iframe :id="`message-iframe-${messageId}-${idx}`" loading="lazy" class="mi-iframe" :ref="el => setIframeRef(idx, el)" @load="onIframeLoad(idx)" />
      </div>

      <!-- 非 HTML 文档：显示代码块 + 折叠按钮 -->
      <div v-else class="mi-codeblock">
        <div class="mi-codeblock-toolbar">
          <button class="mi-btn" type="button" @click="toggleCode(idx)">
            {{ item.collapsed ? '展开代码' : '折叠代码' }}
          </button>
        </div>
        <pre v-show="!item.collapsed"><code>{{ item.original }}</code></pre>
      </div>
    </template>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
// 引入同目录下的第三方 HTML 片段（以原始字符串形式注入 iframe）
import thirdPartyHtml from './third_party.html?raw'
// 以“源文件一致”的方式：把脚本文本转为 Blob URL 注入
import iframeScriptRaw from './iframe.js?raw'
import { script_url } from './script_url.js'

/**
 * 组件入参说明
 * - blocks: 传入若干“代码块”字符串；若字符串内包含 <body ...> 和 </body>，则按 HTML 文档渲染到 iframe；否则作为普通代码块显示并可折叠。
 * - messageId: 用于拼接 iframe 元素 id，便于外部追踪。
 * - defaultCollapsed: 非 HTML 文档代码块的默认折叠状态。
 * - defaultShowLoading: 是否默认显示加载遮罩；可被内容注释 <!-- disable-default-loading --> 覆盖。
 * - defaultBlob: 当内容中没有注释 <!-- enable-blob-url-render --> 时，是否默认走 Blob URL 渲染；默认 false（与原逻辑一致）。
 * - userAvatarUrl / charAvatarUrl: 注入到 iframe 内作为背景图的 URL（替代原 getUserAvatarPath / getCharAvatarPath）。
 */
const props = defineProps({
  blocks: { type: Array, required: true },
  messageId: { type: [String, Number], default: 'local' },
  defaultCollapsed: { type: Boolean, default: false },
  defaultShowLoading: { type: Boolean, default: true },
  defaultBlob: { type: Boolean, default: false },
  userAvatarUrl: { type: String, default: '' },
  charAvatarUrl: { type: String, default: '' },
})

const emit = defineEmits(['render-started', 'render-ended'])

// iframe 引用、定时器、Blob URL 的存储
const iframeRefs = ref([])
const setIframeRef = (idx, el) => {
  iframeRefs.value[idx] = el
}
const timers = new Map()
const blobUrls = new Map() // 仍用于 Blob HTML 的 URL
const scriptKeys = new Set() // 记录通过 script_url.set 创建的 key，卸载时删除

// —— 工具函数 ——
const hasBody = s => /<body[\s\S]*?>[\s\S]*<\/body>/i.test(s)
const hasMinVh = s => /min-height:\s*[^;]*vh/i.test(s)
const hasJsVhUsage = s => /\d+vh/i.test(s)
const hasDisableLoadingFlag = s => /<!--\s*disable-default-loading\s*-->/i.test(s)
const hasEnableBlobFlag = s => /<!--\s*enable-blob-url-render\s*-->/i.test(s)

/**
 * 将文本中的 vh 单位替换为基于 CSS 自定义变量的表达式。
 * 约定：外层会注入 :root { --viewport-height: <px>; }
 * 例如：height: 50vh -> height: calc(var(--viewport-height) * 0.5)
 */
function processAllVhUnits(text) {
  return text.replace(/(\d+(?:\.\d+)?)vh/gi, (_m, num) => {
    const n = parseFloat(num)
    const factor = n / 100
    return `calc(var(--viewport-height) * ${factor})`
  })
}

/**
 * 生成注入到 iframe 的完整 HTML 内容（含 head+body）。
 * - 注入样式重置与头像背景图
 * - 可选注入 :root --viewport-height
 * - 内联 viewport 调整脚本：接收 postMessage 更新变量值
 * - 支持 Blob 渲染时写入 <base href="..."> 以修正相对路径解析
 */
function buildSrcContent(opts) {
  const { bodyHtml, needsVh, enableBlob, userAvatarUrl, charAvatarUrl, iframeJsUrl } = opts
  const baseHref = typeof window !== 'undefined' ? `${window.location.origin}/` : '/'
  const rootVar = needsVh && typeof window !== 'undefined' ? `:root{--viewport-height:${window.innerHeight}px;}` : ''

  // 内联视口高度调整脚本（替代原 viewport_adjust_script 文件）
  const viewportAdjustInline = needsVh
    ? `<script>(function(){
         function apply(h){ try{ document.documentElement.style.setProperty('--viewport-height', h + 'px'); }catch(e){} }
         window.addEventListener('message', function(ev){
           var d = ev && ev.data; if(!d || d.request !== 'updateViewportHeight') return;
           if (typeof d.newHeight === 'number') apply(d.newHeight);
         });
       })();<\/script>`
    : ''

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      ${enableBlob ? `<base href="${baseHref}">` : ''}
      ${thirdPartyHtml || ''}
      <style>
        ${rootVar}
        html,body{margin:0;padding:0;overflow:hidden!important;max-width:100%!important;box-sizing:border-box}
        .user_avatar,.user-avatar{${userAvatarUrl ? `background-image:url('${userAvatarUrl}');` : ''}}
        .char_avatar,.char-avatar{${charAvatarUrl ? `background-image:url('${charAvatarUrl}');` : ''}}
      </style>
      <script src="${iframeJsUrl}"><\\/script>
    </head>
    <body>
      ${bodyHtml}
      ${viewportAdjustInline}
    </body>
  </html>`
}

// —— 规范化与状态 ——
const items = reactive(
  props.blocks.map((raw, i) => {
    const isHtmlDoc = hasBody(raw)
    const disableLoading = hasDisableLoadingFlag(raw)
    const enableBlob = hasEnableBlobFlag(raw) || (!hasEnableBlobFlag(raw) && props.defaultBlob)
    const needsVh = isHtmlDoc && (hasMinVh(raw) || hasJsVhUsage(raw))
    const bodyHtml = isHtmlDoc ? (needsVh ? processAllVhUnits(raw) : raw) : ''
    return {
      id: `${String(props.messageId)}-${i}`,
      original: raw,
      isHtmlDoc,
      needsVh,
      enableBlob,
      disableLoading,
      processedBody: bodyHtml,
      showLoading: props.defaultShowLoading && !disableLoading,
      loadingText: 'Loading...',
      loadingOpacity: 1,
      collapsed: props.defaultCollapsed,
    }
  })
)

// —— 生命周期：挂载后为每个 HTML 文档代码块设置 iframe 源 ——
onMounted(async () => {
  await nextTick()
  items.forEach((item, idx) => {
    if (!item.isHtmlDoc) return
    const ifr = iframeRefs.value[idx]
    if (!ifr) return

    const iframeId = `message-iframe-${props.messageId}-${idx}`
    emit('render-started', iframeId)

    // 10 秒后更新加载提示
    if (item.showLoading) {
      const t = setTimeout(() => {
        item.loadingText = '如加载时间过长，请检查网络'
      }, 10000)
      timers.set(idx, t)
    }

    // 使用本地 script_url：与源项目一致（内容 -> Blob URL 存储）
    const key = `iframe-script-${props.messageId}-${idx}`
    script_url.set(key, iframeScriptRaw)
    scriptKeys.add(key)
    const iframeJsUrl = script_url.get(key) || ''

    const html = buildSrcContent({
      bodyHtml: item.processedBody,
      needsVh: item.needsVh,
      enableBlob: item.enableBlob,
      userAvatarUrl: props.userAvatarUrl || '',
      charAvatarUrl: props.charAvatarUrl || '',
      iframeJsUrl,
    })

    if (item.enableBlob && typeof URL !== 'undefined' && typeof Blob !== 'undefined') {
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      blobUrls.set(idx, url)
      ifr.src = url
    } else {
      ifr.srcdoc = html
    }
  })
})

// iframe 加载完成回调：隐藏遮罩、通知内部更新视口高度
function onIframeLoad(idx) {
  const ifr = iframeRefs.value[idx]
  if (!ifr) return

  // 关闭加载遮罩：先改透明度，延时后完全移除
  const item = items[idx]
  if (item && item.showLoading) {
    item.loadingOpacity = 0
    setTimeout(() => {
      item.showLoading = false
    }, 300)
  }

  // 将当前视口高度通知给 iframe 内部脚本
  try {
    if (item.needsVh) {
      ifr.contentWindow?.postMessage({ request: 'updateViewportHeight', newHeight: typeof window !== 'undefined' ? window.innerHeight : 0 }, '*')
    }
  } catch {}

  emit('render-ended', `message-iframe-${props.messageId}-${idx}`)

  // 清理加载提示定时器
  const t = timers.get(idx)
  if (t) {
    clearTimeout(t)
    timers.delete(idx)
  }
}

// 展开/折叠普通代码块
function toggleCode(idx) {
  const item = items[idx]
  if (!item || item.isHtmlDoc) return
  item.collapsed = !item.collapsed
}

// 组件卸载时释放资源
onBeforeUnmount(() => {
  timers.forEach(t => clearTimeout(t))
  timers.clear()
  blobUrls.forEach(url => {
    try {
      if (typeof url === 'string') URL.revokeObjectURL(url)
    } catch {}
  })
  blobUrls.clear()
  scriptKeys.forEach(k => {
    try {
      script_url.delete(k)
    } catch {}
  })
  scriptKeys.clear()
})
</script>

<style scoped>
.mi-root {
  width: 100%;
}
.mi-wrapper {
  position: relative;
  width: 100%;
}
.mi-iframe {
  margin: 5px auto;
  border: none;
  width: 100%;
  display: block;
}

/* 加载遮罩与自绘旋转器（避免外部依赖 Font Awesome） */
.mi-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  z-index: 1;
}
.mi-loading-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}
.mi-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #999;
  border-top-color: transparent;
  border-radius: 50%;
  animation: mi-spin 1s linear infinite;
}
@keyframes mi-spin {
  to {
    transform: rotate(360deg);
  }
}

/* 普通代码块样式 */
.mi-codeblock {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin: 6px 0;
  overflow: hidden;
}
.mi-codeblock-toolbar {
  background: #f8fafc;
  padding: 6px;
  text-align: right;
}
.mi-btn {
  font-size: 12px;
  padding: 4px 8px;
  border: 1px solid #cbd5e1;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.mi-btn:hover {
  background: #f1f5f9;
}
pre {
  margin: 0;
  padding: 10px;
  background: #0b1021;
  color: #e6edf3;
  overflow: auto;
  font-size: 12px;
}
code {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
