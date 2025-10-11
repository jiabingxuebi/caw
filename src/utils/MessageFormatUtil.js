// MessageFormatting：
// - formatMessage(str): 确保 reasoning 前后缀（包含 < 或 >）转义，仅替换首次出现
// - initMessageFormatUtil(): 显式初始化（创建 Showdown 转换器 + 注册 DOMPurify 钩子）

import showdown from 'showdown'
import { markdownUnderscoreExt } from './ShowdownUnderscore.js'
import DOMPurify from 'dompurify'

const REASONING_PREFIX = '<think>\n'
const REASONING_SUFFIX = '\n</think>'

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function encodeStyleTags(text) {
  const styleRegex = /<style>(.+?)<\/style>/gims
  return text.replaceAll(styleRegex, (_, match) => {
    return `<custom-style>${encodeURIComponent(match)}</custom-style>`
  })
}

function decodeStyleTags(text, { prefix } = { prefix: '.mes_text ' }) {
  const styleDecodeRegex = /<custom-style>(.+?)<\/custom-style>/gms
  const mediaAllowed = isExternalMediaAllowed()

  function sanitizeRule(rule) {
    if (Array.isArray(rule.selectors)) {
      for (let i = 0; i < rule.selectors.length; i++) {
        const selector = rule.selectors[i]
        if (selector) {
          rule.selectors[i] = prefix + sanitizeSelector(selector)
        }
      }
    }
    if (!mediaAllowed && Array.isArray(rule.declarations) && rule.declarations.length > 0) {
      rule.declarations = rule.declarations.filter(declaration => !declaration.value.includes('://'))
    }
  }

  function sanitizeSelector(selector) {
    // Handle pseudo-classes that can contain nested selectors
    const pseudoClasses = ['has', 'not', 'where', 'is', 'matches', 'any']
    const pseudoRegex = new RegExp(`:(${pseudoClasses.join('|')})\\(([^)]+)\\)`, 'g')

    // First, sanitize any nested selectors within pseudo-classes
    selector = selector.replace(pseudoRegex, (match, pseudoClass, content) => {
      // Recursively sanitize the content within the pseudo-class
      const sanitizedContent = sanitizeSimpleSelector(content)
      return `:${pseudoClass}(${sanitizedContent})`
    })

    // Then sanitize the main selector parts
    return sanitizeSimpleSelector(selector)
  }

  function sanitizeSimpleSelector(selector) {
    // Split by spaces but preserve complex selectors
    return selector
      .split(/\s+/)
      .map(part => {
        // Handle class selectors, but preserve pseudo-classes and other complex parts
        return part.replace(/\.([\w-]+)/g, (match, className) => {
          // Don't modify if it's already prefixed with 'custom-'
          if (className.startsWith('custom-')) {
            return match
          }
          return `.custom-${className}`
        })
      })
      .join(' ')
  }

  function sanitizeRuleSet(ruleSet) {
    if (Array.isArray(ruleSet.selectors) || Array.isArray(ruleSet.declarations)) {
      sanitizeRule(ruleSet)
    }

    if (Array.isArray(ruleSet.rules)) {
      ruleSet.rules = ruleSet.rules.filter(rule => rule.type !== 'import')

      for (const mediaRule of ruleSet.rules) {
        sanitizeRuleSet(mediaRule)
      }
    }
  }

  return text.replaceAll(styleDecodeRegex, (_, style) => {
    try {
      let styleCleaned = decodeURIComponent(style).replaceAll(/<br\/>/g, '')
      const ast = css.parse(styleCleaned)
      const sheet = ast?.stylesheet
      if (sheet) {
        sanitizeRuleSet(ast.stylesheet)
      }
      return `<style>${css.stringify(ast)}</style>`
    } catch (error) {
      return `CSS ERROR: ${error}`
    }
  })
}

function isExternalMediaAllowed() {
  return true
}

export function formatMessage(mes) {
  if (!mes) {
    return ''
  }

  ;[REASONING_PREFIX, REASONING_SUFFIX].forEach(reasoningString => {
    if (!reasoningString || !reasoningString.trim().length) return
    if (mes.includes(reasoningString)) {
      mes = mes.replace(reasoningString, escapeHtml(reasoningString))
    }
  })

  //1. 替换q标签
  mes = mes.replace(/<([^>]+)>/g, function (_, contents) {
    return '<' + contents.replace(/"/g, '\ufffe') + '>'
  })
  mes = mes.replace(/<style>[\s\S]*?<\/style>|```[\s\S]*?```|~~~[\s\S]*?~~~|``[\s\S]*?``|`[\s\S]*?`|(".*?")|(\u201C.*?\u201D)|(\u00AB.*?\u00BB)|(\u300C.*?\u300D)|(\u300E.*?\u300F)|(\uFF02.*?\uFF02)/gim, function (match, p1, p2, p3, p4, p5, p6) {
    if (p1) {
      // English double quotes
      return `<q>"${p1.slice(1, -1)}"</q>`
    } else if (p2) {
      // Curly double quotes “ ”
      return `<q>“${p2.slice(1, -1)}”</q>`
    } else if (p3) {
      // Guillemets « »
      return `<q>«${p3.slice(1, -1)}»</q>`
    } else if (p4) {
      // Corner brackets 「 」
      return `<q>「${p4.slice(1, -1)}」</q>`
    } else if (p5) {
      // White corner brackets 『 』
      return `<q>『${p5.slice(1, -1)}』</q>`
    } else if (p6) {
      // Fullwidth quotes ＂ ＂
      return `<q>＂${p6.slice(1, -1)}＂</q>`
    } else {
      // Return the original match if no quotes are found
      return match
    }
  })
  mes = mes.replace(/\ufffe/g, '"')

  //2. 替换markdown中的align
  mes = mes.replaceAll('\\begin{align*}', '$$')
  mes = mes.replaceAll('\\end{align*}', '$$')

  //3. 转html（需要在应用启动时先 initMessageFormatUtil）
  mes = converter.makeHtml(mes)

  mes = mes.trim()
  mes = mes.replace(/<code(.*)>[\s\S]*?<\/code>/g, function (match) {
    return match.replace(/&amp;/g, '&')
  })

  const config = {
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
    MESSAGE_SANITIZE: true,
    ADD_TAGS: ['custom-style'],
  }
  mes = encodeStyleTags(mes)
  mes = DOMPurify.sanitize(mes, config)
  mes = decodeStyleTags(mes, { prefix: '.mes_text ' })

  return mes
}

// 转换器与钩子初始化（显式调用）
let converter
let dompurifyHooksReady = false

export function initMessageFormatUtil() {
  if (!converter) {
    converter = new showdown.Converter({
      emoji: true,
      literalMidWordUnderscores: true,
      parseImgDimensions: true,
      tables: true,
      underline: true,
      simpleLineBreaks: true,
      strikethrough: true,
      disableForced4SpacesIndentedSublists: true,
      extensions: [markdownUnderscoreExt()],
    })
  }

  if (!dompurifyHooksReady) {
    dompurifyHooksReady = true
    // Allow target="_blank" in links
    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
      if ('target' in node) {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener')
      }
    })

    DOMPurify.addHook('uponSanitizeAttribute', (node, data, config) => {
      if (!config['MESSAGE_SANITIZE']) {
        return
      }

      /* Retain the classes on UI elements of messages that interact with the main UI */
      const permittedNodeTypes = ['BUTTON', 'DIV']
      if (config['MESSAGE_ALLOW_SYSTEM_UI'] && node.classList.contains('menu_button') && permittedNodeTypes.includes(node.nodeName)) {
        return
      }

      switch (data.attrName) {
        case 'class': {
          if (data.attrValue) {
            data.attrValue = data.attrValue
              .split(' ')
              .map(v => {
                if (v.startsWith('fa-') || v.startsWith('note-') || v === 'monospace') {
                  return v
                }

                return 'custom-' + v
              })
              .join(' ')
          }
          break
        }
      }
    })

    DOMPurify.addHook('uponSanitizeElement', (node, _, config) => {
      if (!config['MESSAGE_SANITIZE']) {
        return
      }

      // Replace line breaks with <br> in unknown elements
      if (node instanceof HTMLUnknownElement) {
        node.innerHTML = node.innerHTML.trim()

        /** @type {Text[]} */
        const candidates = []
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
        while (walker.nextNode()) {
          const textNode = /** @type {Text} */ (walker.currentNode)
          if (!textNode.data.includes('\n')) continue

          // Skip if this text node is within a <pre> (any ancestor)
          if (textNode.parentElement && textNode.parentElement.closest('pre')) continue

          candidates.push(textNode)
        }

        for (const textNode of candidates) {
          const parts = textNode.data.split('\n')
          const frag = document.createDocumentFragment()
          parts.forEach((part, idx) => {
            if (part.length) {
              frag.appendChild(document.createTextNode(part))
            }
            if (idx < parts.length - 1) {
              frag.appendChild(document.createElement('br'))
            }
          })
          textNode.replaceWith(frag)
        }
      }

      const isMediaAllowed = isExternalMediaAllowed()
      if (isMediaAllowed) {
        return
      }

      if (!(node instanceof Element)) {
        return
      }

      let mediaBlocked = false

      switch (node.tagName) {
        case 'AUDIO':
        case 'VIDEO':
        case 'SOURCE':
        case 'TRACK':
        case 'EMBED':
        case 'OBJECT':
        case 'IMG':
          {
            const isExternalUrl = url => (url.indexOf('://') > 0 || url.indexOf('//') === 0) && !url.startsWith(window.location.origin)
            const src = node.getAttribute('src')
            const data = node.getAttribute('data')
            const srcset = node.getAttribute('srcset')

            if (srcset) {
              const srcsetUrls = srcset.split(',')

              for (const srcsetUrl of srcsetUrls) {
                const [url] = srcsetUrl.trim().split(' ')

                if (isExternalUrl(url)) {
                  console.warn('External media blocked', url)
                  node.remove()
                  mediaBlocked = true
                  break
                }
              }
            }

            if (src && isExternalUrl(src)) {
              console.warn('External media blocked', src)
              mediaBlocked = true
              node.remove()
            }

            if (data && isExternalUrl(data)) {
              console.warn('External media blocked', data)
              mediaBlocked = true
              node.remove()
            }

            if (mediaBlocked && node instanceof HTMLMediaElement) {
              node.autoplay = false
              node.pause()
            }
          }
          break
      }

      if (mediaBlocked) {
        console.log('External media has been blocked')
      }
    })
  }
}
