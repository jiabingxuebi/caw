/**
 * HTTP 请求工具类
 * 基于 fetch API 封装，支持拦截器、错误处理、自动重试等功能
 */

class HttpClient {
  constructor(config = {}) {
    // 默认配置
    this.config = {
      baseURL: config.baseURL || import.meta.env.VITE_API_BASE_URL || '',
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      retryCount: config.retryCount || 0, // 默认不重试
      retryDelay: config.retryDelay || 1000,
      ...config
    }

    // 拦截器
    this.requestInterceptors = []
    this.responseInterceptors = []
  }

  /**
   * 添加请求拦截器
   * @param {Function} fulfilled - 请求成功处理函数
   * @param {Function} rejected - 请求失败处理函数
   */
  interceptors = {
    request: {
      use: (fulfilled, rejected) => {
        this.requestInterceptors.push({ fulfilled, rejected })
      }
    },
    response: {
      use: (fulfilled, rejected) => {
        this.responseInterceptors.push({ fulfilled, rejected })
      }
    }
  }

  /**
   * 创建完整的URL
   * @param {string} url - 请求路径
   * @returns {string} 完整URL
   */
  createURL(url) {
    if (url.startsWith('http')) return url
    return `${this.config.baseURL}${url.startsWith('/') ? url : `/${url}`}`
  }

  /**
   * 创建带超时的 fetch
   * @param {string} url - 请求URL
   * @param {Object} options - fetch选项
   * @returns {Promise} fetch Promise
   */
  createTimeoutFetch(url, options) {
    return new Promise((resolve, reject) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        reject(new Error(`Request timeout after ${this.config.timeout}ms`))
      }, this.config.timeout)

      fetch(url, {
        ...options,
        signal: controller.signal
      })
        .then(response => {
          clearTimeout(timeoutId)
          resolve(response)
        })
        .catch(error => {
          clearTimeout(timeoutId)
          reject(error)
        })
    })
  }

  /**
   * 处理响应
   * @param {Response} response - fetch Response对象
   * @returns {Promise} 处理后的数据
   */
  async handleResponse(response) {
    const contentType = response.headers.get('Content-Type') || ''

    let data
    if (contentType.includes('application/json')) {
      data = await response.json()
    } else if (contentType.includes('text/')) {
      data = await response.text()
    } else {
      data = await response.blob()
    }

    if (!response.ok) {
      const error = new Error(data.message || `HTTP Error: ${response.status}`)
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  }

  /**
   * 应用请求拦截器
   * @param {Object} config - 请求配置
   * @returns {Object} 处理后的配置
   */
  async applyRequestInterceptors(config) {
    for (const interceptor of this.requestInterceptors) {
      try {
        config = await interceptor.fulfilled(config)
      } catch (error) {
        if (interceptor.rejected) {
          await interceptor.rejected(error)
        }
        throw error
      }
    }
    return config
  }

  /**
   * 应用响应拦截器
   * @param {*} response - 响应数据
   * @returns {*} 处理后的响应
   */
  async applyResponseInterceptors(response) {
    for (const interceptor of this.responseInterceptors) {
      try {
        response = await interceptor.fulfilled(response)
      } catch (error) {
        if (interceptor.rejected) {
          response = await interceptor.rejected(error)
        } else {
          throw error
        }
      }
    }
    return response
  }

  /**
   * 重试请求
   * @param {Function} requestFn - 请求函数
   * @param {number} retryCount - 重试次数
   * @param {number} delay - 延迟时间
   * @returns {Promise} 请求结果
   */
  async retryRequest(requestFn, retryCount = this.config.retryCount, delay = this.config.retryDelay) {
    try {
      return await requestFn()
    } catch (error) {
      if (retryCount > 0 && this.shouldRetry(error)) {
        console.warn(`Request failed, retrying... (${retryCount} attempts left)`, error.message)
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.retryRequest(requestFn, retryCount - 1, delay * 1.5)
      }
      throw error
    }
  }

  /**
   * 判断是否应该重试
   * @param {Error} error - 错误对象
   * @returns {boolean} 是否重试
   */
  shouldRetry(error) {
    // 网络错误或服务器错误才重试
    return (
      error.name === 'TypeError' || // 网络错误
      (error.status >= 500 && error.status < 600) || // 服务器错误
      error.message.includes('timeout') // 超时
    )
  }

  /**
   * 核心请求方法
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  async request(url, options = {}) {
    // 合并配置
    let config = {
      url,
      headers: { ...this.config.headers, ...options.headers },
      method: options.method || 'GET',
      ...options
    }

    // 应用请求拦截器
    config = await this.applyRequestInterceptors(config)

    // 构建fetch选项
    const fetchOptions = {
      method: config.method,
      headers: config.headers
    }

    // 处理请求体
    if (config.data && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
      if (config.headers['Content-Type'] === 'application/json') {
        fetchOptions.body = JSON.stringify(config.data)
      } else if (config.data instanceof FormData) {
        fetchOptions.body = config.data
        // FormData时删除Content-Type，让浏览器自动设置
        delete fetchOptions.headers['Content-Type']
      } else {
        fetchOptions.body = config.data
      }
    }

    // 处理URL参数
    const fullURL = this.createURL(config.url)
    let requestURL = fullURL
    if (config.params) {
      const searchParams = new URLSearchParams(config.params)
      requestURL += (fullURL.includes('?') ? '&' : '?') + searchParams.toString()
    }

    // 执行请求（带重试）
    const executeRequest = async () => {
      const response = await this.createTimeoutFetch(requestURL, fetchOptions)
      const data = await this.handleResponse(response)
      return data
    }

    try {
      let result = await this.retryRequest(executeRequest)

      // 应用响应拦截器
      result = await this.applyResponseInterceptors(result)

      return result
    } catch (error) {
      // 应用响应拦截器的错误处理
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.rejected) {
          try {
            return await interceptor.rejected(error)
          } catch (interceptorError) {
            // 继续抛出原始错误
          }
        }
      }
      throw error
    }
  }

  /**
   * GET 请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' })
  }

  /**
   * POST 请求
   * @param {string} url - 请求URL
   * @param {*} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  post(url, data, options = {}) {
    return this.request(url, { ...options, method: 'POST', data })
  }

  /**
   * PUT 请求
   * @param {string} url - 请求URL
   * @param {*} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  put(url, data, options = {}) {
    return this.request(url, { ...options, method: 'PUT', data })
  }

  /**
   * PATCH 请求
   * @param {string} url - 请求URL
   * @param {*} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  patch(url, data, options = {}) {
    return this.request(url, { ...options, method: 'PATCH', data })
  }

  /**
   * DELETE 请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' })
  }

  /**
   * 上传文件
   * @param {string} url - 上传URL
   * @param {FormData|File} data - 文件数据
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  upload(url, data, options = {}) {
    const formData = data instanceof FormData ? data : new FormData()
    if (data instanceof File) {
      formData.append('file', data)
    }

    return this.request(url, {
      ...options,
      method: 'POST',
      data: formData,
      headers: {
        // 不设置Content-Type，让浏览器自动处理
        ...options.headers
      }
    })
  }
}

// 创建默认实例
const http = new HttpClient()

// 添加认证拦截器
http.interceptors.request.use(config => {
  // 自动添加认证token
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  console.log('Request:', config.method, config.url, config)
  return config
})

// 添加响应拦截器
http.interceptors.response.use(
  response => {
    console.log('Response:', response)
    return response
  },
  error => {
    console.error('Request Error:', error)

    // 处理认证错误
    if (error.status === 401) {
      // 清除token
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_token')

      // 可以触发登录页面跳转
      // router.push('/login')

      // 或者显示错误提示
      console.warn('Authentication failed, please login again')
    }

    // 处理其他HTTP错误
    if (error.status >= 500) {
      console.error('Server error:', error.message)
    }

    throw error
  }
)

export { HttpClient }
export default http