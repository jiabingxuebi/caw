/**
 * Toast 通知工具
 * 使用原生 JavaScript 创建 Toast 提示
 */

class Toast {
  constructor() {
    this.container = null
    this.createContainer()
  }

  /**
   * 创建 Toast 容器
   */
  createContainer() {
    if (this.container) return

    this.container = document.createElement('div')
    this.container.className = 'toast toast-top toast-end z-50'
    this.container.style.position = 'fixed'
    this.container.style.top = '1rem'
    this.container.style.right = '1rem'
    this.container.style.zIndex = '9999'
    document.body.appendChild(this.container)
  }

  /**
   * 显示 Toast
   * @param {string} message - 消息内容
   * @param {string} type - 类型：success, error, warning, info
   * @param {number} duration - 持续时间（毫秒）
   */
  show(message, type = 'info', duration = 3000) {
    const alert = document.createElement('div')

    // 根据类型设置样式
    const typeClasses = {
      success: 'alert-success',
      error: 'alert-error',
      warning: 'alert-warning',
      info: 'alert-info'
    }

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    }

    alert.className = `alert ${typeClasses[type] || typeClasses.info}`
    alert.innerHTML = `
      <span>${icons[type] || icons.info}</span>
      <span>${message}</span>
    `

    // 添加到容器
    this.container.appendChild(alert)

    // 自动移除
    setTimeout(() => {
      if (alert.parentNode) {
        alert.style.transform = 'translateX(100%)'
        alert.style.opacity = '0'
        setTimeout(() => {
          if (alert.parentNode) {
            this.container.removeChild(alert)
          }
        }, 300)
      }
    }, duration)

    return alert
  }

  /**
   * 成功提示
   * @param {string} message - 消息内容
   * @param {number} duration - 持续时间
   */
  success(message, duration) {
    return this.show(message, 'success', duration)
  }

  /**
   * 错误提示
   * @param {string} message - 消息内容
   * @param {number} duration - 持续时间
   */
  error(message, duration) {
    return this.show(message, 'error', duration)
  }

  /**
   * 警告提示
   * @param {string} message - 消息内容
   * @param {number} duration - 持续时间
   */
  warning(message, duration) {
    return this.show(message, 'warning', duration)
  }

  /**
   * 信息提示
   * @param {string} message - 消息内容
   * @param {number} duration - 持续时间
   */
  info(message, duration) {
    return this.show(message, 'info', duration)
  }
}

// 创建全局实例
const toast = new Toast()

export default toast