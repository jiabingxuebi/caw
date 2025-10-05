/**
 * 角色相关 API
 */

import http from './http'

/**
 * 角色 API 服务
 */
export const characterAPI = {
  /**
   * 获取角色列表
   * @returns {Promise} 角色列表数据
   */
  getCharacters: () => {
    return http.get('/character')
  },

  /**
   * 获取角色列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.limit - 每页数量
   * @param {string} params.sort - 排序方式
   * @param {string} params.search - 搜索关键词
   * @param {Array} params.tags - 标签筛选
   * @param {boolean} params.unlimited - 无限制模式
   * @returns {Promise} 角色列表数据
   */
  getCharacterList: (params = {}) => {
    return http.get('/characters', { params })
  },

  /**
   * 获取角色详情
   * @param {string|number} id - 角色ID
   * @returns {Promise} 角色详情数据
   */
  getCharacterDetail: id => {
    return http.get(`/characters/${id}`)
  },

  /**
   * 创建新角色
   * @param {Object} characterData - 角色数据
   * @param {string} characterData.name - 角色名称
   * @param {string} characterData.description - 角色描述
   * @param {string} characterData.greeting - 问候语
   * @param {string} characterData.personality - 角色性格
   * @param {string} characterData.visibility - 可见性设置
   * @param {File} characterData.backgroundImageFile - 背景图片文件
   * @returns {Promise} 创建结果
   */
  createCharacter: characterData => {
    // 如果包含文件，使用FormData
    if (characterData.backgroundImageFile instanceof File) {
      const formData = new FormData()
      Object.keys(characterData).forEach(key => {
        if (characterData[key] !== null && characterData[key] !== undefined) {
          // 特殊处理文件字段名映射
          if (key === 'backgroundImageFile') {
            formData.append('backgroundImage', characterData[key])
          } else {
            formData.append(key, characterData[key])
          }
        }
      })
      return http.post('/characters', formData, {
        headers: {
          // 让浏览器自动设置Content-Type
        },
      })
    }

    return http.post('/characters', characterData)
  },

  /**
   * 更新角色信息
   * @param {string|number} id - 角色ID
   * @param {Object} characterData - 更新数据
   * @returns {Promise} 更新结果
   */
  updateCharacter: (id, characterData) => {
    // 如果包含文件，使用FormData
    if (characterData.backgroundImageFile instanceof File) {
      const formData = new FormData()
      Object.keys(characterData).forEach(key => {
        if (characterData[key] !== null && characterData[key] !== undefined) {
          // 特殊处理文件字段名映射
          if (key === 'backgroundImageFile') {
            formData.append('backgroundImage', characterData[key])
          } else {
            formData.append(key, characterData[key])
          }
        }
      })
      return http.put(`/characters/${id}`, formData, {
        headers: {
          // 让浏览器自动设置Content-Type
        },
      })
    }

    return http.put(`/characters/${id}`, characterData)
  },

  /**
   * 删除角色
   * @param {string|number} id - 角色ID
   * @returns {Promise} 删除结果
   */
  deleteCharacter: id => {
    return http.delete(`/characters/${id}`)
  },

  /**
   * 批量删除角色
   * @param {Array} ids - 角色ID数组
   * @returns {Promise} 删除结果
   */
  batchDeleteCharacters: ids => {
    return http.post('/characters/batch-delete', { ids })
  },

  /**
   * 保存角色草稿
   * @param {Object} draftData - 草稿数据
   * @returns {Promise} 保存结果
   */
  saveDraft: draftData => {
    return http.post('/characters/drafts', draftData)
  },

  /**
   * 获取角色草稿列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 草稿列表
   */
  getDraftList: (params = {}) => {
    return http.get('/characters/drafts', { params })
  },

  /**
   * 获取角色草稿详情
   * @param {string|number} id - 草稿ID
   * @returns {Promise} 草稿详情
   */
  getDraftDetail: id => {
    return http.get(`/characters/drafts/${id}`)
  },

  /**
   * 删除角色草稿
   * @param {string|number} id - 草稿ID
   * @returns {Promise} 删除结果
   */
  deleteDraft: id => {
    return http.delete(`/characters/drafts/${id}`)
  },

  /**
   * 将草稿发布为正式角色
   * @param {string|number} id - 草稿ID
   * @returns {Promise} 发布结果
   */
  publishDraft: id => {
    return http.post(`/characters/drafts/${id}/publish`)
  },

  /**
   * 导出角色卡
   * @param {string|number} id - 角色ID
   * @param {string} format - 导出格式 ('json' | 'txt')
   * @returns {Promise} 导出结果
   */
  exportCharacterCard: (id, format = 'json') => {
    return http.get(`/characters/${id}/export`, {
      params: { format },
      headers: {
        Accept: format === 'json' ? 'application/json' : 'text/plain',
      },
    })
  },

  /**
   * 复制/克隆角色
   * @param {string|number} id - 原角色ID
   * @param {Object} options - 克隆选项
   * @param {string} options.name - 新角色名称
   * @returns {Promise} 克隆结果
   */
  cloneCharacter: (id, options = {}) => {
    return http.post(`/characters/${id}/clone`, options)
  },

  /**
   * 获取角色标签列表
   * @returns {Promise} 标签列表
   */
  getCharacterTags: () => {
    return http.get('/characters/tags')
  },

  /**
   * 为角色添加标签
   * @param {string|number} id - 角色ID
   * @param {Array} tags - 标签数组
   * @returns {Promise} 添加结果
   */
  addCharacterTags: (id, tags) => {
    return http.post(`/characters/${id}/tags`, { tags })
  },

  /**
   * 移除角色标签
   * @param {string|number} id - 角色ID
   * @param {Array} tags - 要移除的标签数组
   * @returns {Promise} 移除结果
   */
  removeCharacterTags: (id, tags) => {
    return http.delete(`/characters/${id}/tags`, { data: { tags } })
  },

  /**
   * 获取推荐角色
   * @param {Object} params - 推荐参数
   * @param {number} params.limit - 推荐数量
   * @param {string} params.category - 分类筛选
   * @returns {Promise} 推荐角色列表
   */
  getRecommendedCharacters: (params = {}) => {
    return http.get('/characters/recommended', { params })
  },

  /**
   * 获取热门角色
   * @param {Object} params - 查询参数
   * @param {number} params.limit - 数量限制
   * @param {string} params.timeRange - 时间范围 ('day' | 'week' | 'month')
   * @returns {Promise} 热门角色列表
   */
  getTrendingCharacters: (params = {}) => {
    return http.get('/characters/trending', { params })
  },

  /**
   * 获取我的角色列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 我的角色列表
   */
  getMyCharacters: (params = {}) => {
    return http.get('/characters/mine', { params })
  },

  /**
   * 收藏/取消收藏角色
   * @param {string|number} id - 角色ID
   * @param {boolean} favorite - 是否收藏
   * @returns {Promise} 收藏结果
   */
  toggleFavorite: (id, favorite = true) => {
    return favorite ? http.post(`/characters/${id}/favorite`) : http.delete(`/characters/${id}/favorite`)
  },

  /**
   * 获取收藏的角色列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 收藏角色列表
   */
  getFavoriteCharacters: (params = {}) => {
    return http.get('/characters/favorites', { params })
  },
}

export default characterAPI
