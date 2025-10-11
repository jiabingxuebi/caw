<template>
  <!-- 单条消息渲染：message.contents 支持多个候选，通过左右箭头切换；仅复用同一渲染容器，不一次性渲染全部 -->
  <div class="mi-root">
    <button v-if="hasMultiple" class="mi-swipe-btn mi-swipe-left" type="button" aria-label="上一条" @click="() => onSwipe('left')">‹</button>

    <div class="mi-viewport">
      <div ref="containerRef" class="mi-raw" />
    </div>

    <button v-if="hasMultiple" class="mi-swipe-btn mi-swipe-right" type="button" aria-label="下一条" @click="() => onSwipe('right')">›</button>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import thirdPartyHtml from './third_party.html?raw'
import iframeScriptRaw from './iframe.js?raw'
import { script_url } from './script_url.js'
import { formatMessage } from '@/utils/MessageFormatUtil'

const props = defineProps({
  // 兼容旧接口：content 为单条字符串
  content: { type: String, required: false, default: '' },
  // 新接口：message 对象，包含 id、role、contents(String[])
  message: {
    type: Object,
    default: null,
  },
  messageId: { type: [String, Number], default: 'local' },
  defaultCollapsed: { type: Boolean, default: false },
  defaultShowLoading: { type: Boolean, default: true },
  defaultBlob: { type: Boolean, default: false },
  userAvatarUrl: { type: String, default: '' },
  charAvatarUrl: { type: String, default: '' },
})

const emit = defineEmits(['render-started', 'render-ended'])

const containerRef = ref(null)
const timers = new Map()
const blobUrls = new Map()
const scriptKeys = new Set()
const isAnimating = ref(false)
const swipeRange = 48 // px，参考需求进行轻微位移
const swipeDuration = 160 // ms

// 将 message/或旧 content 统一为数组
const contents = computed(() => {
  if (props.message && Array.isArray(props.message.contents) && props.message.contents.length > 0) {
    return props.message.contents
  }
  if (props.content) return [props.content]
  return []
})

const hasMultiple = computed(() => contents.value.length > 1)
const index = ref(0)
watch(
  () => props.message,
  () => {
    index.value = 0
  }
)
watch(
  () => props.content,
  () => {
    index.value = 0
  }
)

const currentHtml = computed(() => contents.value[index.value] || '')
const formattedCurrentHtml = computed(() => formatMessage(currentHtml.value || ''))

const hasMinVh = s => /min-height:\s*[^;]*vh/i.test(s)
const hasJsVhUsage = s => /\d+vh/i.test(s)

function processAllVhUnits(text) {
  return text.replace(/(\d+(?:\.\d+)?)vh/gi, (_m, num) => {
    const n = parseFloat(num)
    const factor = n / 100
    return `calc(var(--viewport-height) * ${factor})`
  })
}

function buildSrcContent(opts) {
  const { bodyHtml, needsVh, enableBlob, userAvatarUrl, charAvatarUrl, iframeJsUrl } = opts
  const baseHref = typeof window !== 'undefined' ? `${window.location.origin}/` : '/'
  const rootVar = needsVh && typeof window !== 'undefined' ? `:root{--viewport-height:${window.innerHeight}px;}` : ''

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

async function cleanupResources() {
  // 清理计时器
  timers.forEach(t => clearTimeout(t))
  timers.clear()
  // 清理 Blob URL
  blobUrls.forEach(url => {
    try {
      if (typeof url === 'string') URL.revokeObjectURL(url)
    } catch {}
  })
  blobUrls.clear()
  // 清理脚本 URL
  scriptKeys.forEach(k => {
    try {
      script_url.delete(k)
    } catch {}
  })
  scriptKeys.clear()
  // 清理与本容器相关的 ResizeObserver 监听
  try {
    const ro = getSharedResizeObserver()
    if (window._observedElements && ro) {
      for (const [el, data] of Array.from(window._observedElements.entries())) {
        const ifr = data?.iframe
        if (!ifr || !ifr.isConnected) {
          ro.unobserve(el)
          window._observedElements.delete(el)
        }
      }
    }
  } catch {}
}

async function renderCurrentHtml() {
  const container = containerRef.value
  if (!container) return
  await cleanupResources()
  // 用格式化后的内容字符串重置 DOM
  container.innerHTML = formattedCurrentHtml.value || ''

  await nextTick()
  let iframeCounter = 1
  const pres = Array.from(container.querySelectorAll('pre'))
  pres.forEach(preEl => {
    try {
      let extractedText = preEl.textContent || ''
      const hasBodyTag = extractedText.includes('<body') && extractedText.includes('</body>')
      if (!hasBodyTag) {
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

      const wrapper = document.createElement('div')
      wrapper.style.cssText = 'position:relative;width:100%'
      const iframe = document.createElement('iframe')
      iframe.id = `message-iframe-${props.messageId}-${iframeCounter++}`
      iframe.setAttribute('loading', 'lazy')
      iframe.style.cssText = 'margin:5px auto;border:none;width:100%;display:block'
      if (needsVhHandling) iframe.setAttribute('data-needs-vh', 'true')

      // 加载遮罩
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
        timers.set(iframe.id, loadingTimer)
      }

      wrapper.appendChild(iframe)

      const key = `iframe-script-${props.messageId}-0-${iframeCounter}`
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

      preEl.replaceWith(wrapper)
    } catch {}
  })
}

onMounted(async () => {
  await nextTick()
  await renderCurrentHtml()
})

watch(currentHtml, async () => {
  // 当内容切换时，复用容器并重新构建内部 DOM
  await renderCurrentHtml()
})

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

function observeIframeContent(iframe) {
  if (!iframe.contentWindow || !iframe.contentWindow.document.body) return
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

function adjustIframeHeight(iframe) {
  if (!iframe.contentWindow || !iframe.contentWindow.document.body) return
  try {
    const doc = iframe.contentWindow.document
    const body = doc.body
    body.style.margin = '0'
    body.style.padding = '0'
    const newHeight = body.scrollHeight
    const currentHeight = parseFloat(iframe.style.height) || 0
    if (Math.abs(currentHeight - newHeight) > 5) {
      iframe.style.height = `${newHeight}px`
      if (iframe.getAttribute('data-needs-vh') === 'true' && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ request: 'updateViewportHeight', newHeight: window.innerHeight }, '*')
      }
    }
  } catch {}
}

// 已通过 currentHtml 计算得到当前渲染内容

function onSwipe(direction) {
  if (isAnimating.value || contents.value.length <= 1) return
  const container = containerRef.value
  if (!container) return
  isAnimating.value = true
  const distance = direction === 'left' ? swipeRange : -swipeRange

  // 第一步：向一个方向位移
  container.style.transition = `transform ${swipeDuration}ms ease`
  container.style.transform = `translateX(${distance * -1}px)`

  setTimeout(async () => {
    // 第二步：切换索引并把元素瞬时放到相反侧
    if (direction === 'left') {
      index.value = (index.value - 1 + contents.value.length) % contents.value.length
    } else {
      index.value = (index.value + 1) % contents.value.length
    }

    // 确保内容已重建
    await renderCurrentHtml()

    // 立即反向放置，无动画
    container.style.transition = 'none'
    container.style.transform = `translateX(${distance}px)`

    // 强制 reflow
    void container.offsetHeight

    // 第三步：动画回到 0，实现“滑动切换”效果
    container.style.transition = `transform ${swipeDuration}ms ease`
    container.style.transform = 'translateX(0)'

    setTimeout(() => {
      container.style.transition = ''
      container.style.transform = ''
      isAnimating.value = false
    }, swipeDuration)
  }, swipeDuration)
}
</script>

<style scoped>
.mi-root {
  position: relative;
  width: 100%;
  display: flex;
  align-items: stretch;
}
.mi-viewport {
  position: relative;
  flex: 1 1 auto;
}
.mi-raw {
  width: 100%;
  will-change: transform;
}
.mi-swipe-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.mi-swipe-btn:hover {
  background: #f8fafc;
}
.mi-swipe-left {
  left: -6px;
}
.mi-swipe-right {
  right: -6px;
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
  inset: 0;
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
/* 该样式需要作用于动态注入的 HTML（不带 scoped 标记才生效） */
q {
  color: #f59d0f;
}
q:before,
q:after {
  content: '';
}
</style>
