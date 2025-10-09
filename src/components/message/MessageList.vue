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
    <div v-for="(item, idx) in items" :key="item.id" class="mi-raw" :ref="el => setBlockRef(idx, el)" v-html="item.original"></div>
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

// 块容器引用、定时器、Blob URL 的存储
const blockRefs = ref([])
const setBlockRef = (idx, el) => {
  blockRefs.value[idx] = el
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

  return `
  <html>
    <head>
      <style>
        ${rootVar}
        html,body{margin:0;padding:0;overflow:hidden!important;max-width:100%!important;box-sizing:border-box}
        .user_avatar,.user-avatar{${userAvatarUrl ? `background-image:url('${userAvatarUrl}');` : ''}}
        .char_avatar,.char-avatar{${charAvatarUrl ? `background-image:url('${charAvatarUrl}');` : ''}}
      </style>
      ${enableBlob ? `<base href="${baseHref}">` : ''}
      ${thirdPartyHtml || ''}
      <script src="${iframeJsUrl}"><\/script>
    </head>
    <body>
      ${bodyHtml}
      ${viewportAdjustInline}
    </body>
  </html>`
}

// —— 规范化与状态：仅保留原始内容，渲染后再处理 <pre>
const items = reactive(
  props.blocks.map((raw, i) => ({
    id: `${String(props.messageId)}-${i}`,
    original: raw,
  }))
)

// —— 生命周期：挂载后为每个 HTML 文档代码块设置 iframe 源 ——
onMounted(async () => {
  await nextTick()
  items.forEach((item, idx) => {
    const container = blockRefs.value[idx]
    if (!container) return
    let iframeCounter = 1
    const pres = Array.from(container.querySelectorAll('pre'))
    pres.forEach(preEl => {
      try {
        let extractedText = preEl.textContent || ''
        const hasBodyTag = extractedText.includes('<body') && extractedText.includes('</body>')
        if (!hasBodyTag) {
          // 添加折叠按钮与样式
          const toolbar = document.createElement('div')
          toolbar.style.cssText = 'background:#f8fafc;padding:6px;text-align:right;border:1px solid #e5e7eb;border-bottom:none;border-radius:6px 6px 0 0;'
          const btn = document.createElement('button')
          btn.textContent = props.defaultCollapsed ? '展开代码' : '折叠代码'
          btn.style.cssText = 'font-size:12px;padding:4px 8px;border:1px solid #cbd5e1;background:#fff;border-radius:4px;cursor:pointer;'
          let collapsed = !!props.defaultCollapsed
          preEl.style.display = collapsed ? 'none' : ''
          btn.onclick = () => {
            collapsed = !collapsed
            btn.textContent = collapsed ? '展开代码' : '折叠代码'
            preEl.style.display = collapsed ? 'none' : ''
          }
          toolbar.appendChild(btn)
          preEl.parentElement && preEl.parentElement.insertBefore(toolbar, preEl)
          preEl.style.cssText += 'margin:0;padding:10px;background:#0b1021;color:#e6edf3;overflow:auto;font-size:12px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 6px 6px;'
          return
        }

        const disableLoading = /<!--\s*disable-default-loading\s*-->/.test(extractedText)
        const enableBlobUrlRendering = /<!--\s*enable-blob-url-render\s*-->/.test(extractedText) || (!/<!--\s*enable-blob-url-render\s*-->/.test(extractedText) && props.defaultBlob)
        const hasMinVhFlag = /min-height:\s*[^;]*vh/.test(extractedText)
        const hasJsVhFlag = /\d+vh/.test(extractedText)
        const needsVhHandling = hasMinVhFlag || hasJsVhFlag
        if (needsVhHandling) extractedText = processAllVhUnits(extractedText)

        // 构建 wrapper + iframe
        const wrapper = document.createElement('div')
        wrapper.style.cssText = 'position:relative;width:100%'
        const iframe = document.createElement('iframe')
        iframe.id = `message-iframe-${props.messageId}-${iframeCounter++}`
        iframe.setAttribute('loading', 'lazy')
        iframe.style.cssText = 'margin:5px auto;border:none;width:100%;display:block'
        if (needsVhHandling) iframe.setAttribute('data-needs-vh', 'true')

        // 加载遮罩（与源结构一致）
        let loadingTimer = null
        let overlay = null
        if (props.defaultShowLoading && !disableLoading) {
          overlay = document.createElement('div')
          overlay.className = 'iframe-loading-overlay'
          overlay.innerHTML = `
            <div class="iframe-loading-content">
              <i class="fa-solid fa-spinner fa-spin"></i>
              <span class="loading-text">Loading...</span>
            </div>`
          loadingTimer = setTimeout(() => {
            const t = overlay && overlay.querySelector('.loading-text')
            if (t) t.textContent = '如加载时间过长，请检查网络'
          }, 10000)
          wrapper.appendChild(overlay)
        }

        wrapper.appendChild(iframe)

        // 生成 iframe 文档与脚本 URL（通过本地 script_url）
        const key = `iframe-script-${props.messageId}-${idx}-${iframeCounter}`
        script_url.set(key, iframeScriptRaw)
        scriptKeys.add(key)
        const iframeJsUrl = script_url.get(key) || ''

        const html = buildSrcContent({
          bodyHtml: extractedText,
          needsVh: needsVhHandling,
          enableBlob: enableBlobUrlRendering,
          userAvatarUrl: props.userAvatarUrl || '',
          charAvatarUrl: props.charAvatarUrl || '',
          iframeJsUrl,
        })

        emit('render-started', iframe.id)

        if (enableBlobUrlRendering && typeof URL !== 'undefined' && typeof Blob !== 'undefined') {
          const blob = new Blob([html], { type: 'text/html' })
          const url = URL.createObjectURL(blob)
          blobUrls.set(`html-${iframe.id}`, url)
          iframe.src = url
        } else {
          iframe.srcdoc = html
        }

        iframe.addEventListener(
          'load',
          () => {
            observeIframeContent(iframe)
            try {
              if (overlay) {
                overlay.style.opacity = '0'
                setTimeout(() => overlay && overlay.remove(), 300)
              }
              if (loadingTimer) clearTimeout(loadingTimer)
              if (iframe.getAttribute('data-needs-vh') === 'true') {
                iframe.contentWindow?.postMessage({ request: 'updateViewportHeight', newHeight: typeof window !== 'undefined' ? window.innerHeight : 0 }, '*')
              }
            } catch {}
            try {
              script_url.delete(key)
            } catch {}
            emit('render-ended', iframe.id)
          },
          { once: true }
        )

        // 用 wrapper 替换 pre
        preEl.replaceWith(wrapper)
      } catch {}
    })
  })
})

// 不再使用模板内 iframe/onLoad/toggle 的分支，逻辑已在挂载后处理

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

function observeIframeContent(iframe) {
  if (!iframe.contentWindow || !iframe.contentWindow.document.body) {
    return
  }
  try {
    const docBody = iframe.contentWindow.document.body

    const resizeObserver = getSharedResizeObserver()

    if (window._observedElements) {
      for (const [element, data] of window._observedElements.entries()) {
        if (data.iframe === iframe) {
          resizeObserver.unobserve(element)
          window._observedElements.delete(element)
          break
        }
      }
    }

    window._observedElements?.set(docBody, { iframe })
    resizeObserver.observe(docBody)

    adjustIframeHeight(iframe)
  } catch (error) {
    console.log('[Render] 设置 iframe 内容观察时出错')
    console.log(error)
  }
}

/**
 * 获取或创建共享的ResizeObserver实例
 */
function getSharedResizeObserver() {
  if (!window._sharedResizeObserver) {
    window._observedElements = new Map()

    window._sharedResizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const element = entry.target

        const data = window._observedElements?.get(element)
        if (data) {
          const { iframe } = data
          adjustIframeHeight(iframe)
        }
      }
    })
  }

  return window._sharedResizeObserver
}

/**
 * 调整iframe高度
 * @param iframe iframe元素
 */
function adjustIframeHeight(iframe) {
  if (!iframe.contentWindow || !iframe.contentWindow.document.body) {
    return
  }

  const doc = iframe.contentWindow.document

  const bodyHeight = doc.body.offsetHeight
  const htmlHeight = doc.documentElement.offsetHeight

  const newHeight = Math.max(bodyHeight, htmlHeight)
  const currentHeight = parseFloat(iframe.style.height || '0') || 0

  if (Math.abs(currentHeight - newHeight) > 5) {
    iframe.style.height += `${newHeight}px`

    if (iframe.getAttribute('data-needs-vh') === 'true' && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          request: 'updateViewportHeight',
          newHeight: window.innerHeight,
        },
        '*'
      )
    }
  }
}
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
.mi-raw {
  width: 100%;
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

<style>
.iframe-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
}
.iframe-loading-content {
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}
.iframe-loading-content i {
  font-size: 20px;
}
.loading-text {
  transition: opacity 0.3s ease;
}
</style>
