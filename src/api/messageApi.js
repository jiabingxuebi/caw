/**
 * 消息/聊天相关 API
 */

import http from './http'

/**
 * 消息 API 服务
 */
const messageAPI = {
  /**
   * 发送消息
   * @param {Object} messageData - 消息数据
   * @param {string|number} messageData.chatId - 聊天ID
   * @param {string|number} messageData.characterId - 角色ID
   * @param {string} messageData.content - 消息内容
   * @param {string} messageData.type - 消息类型 ('text' | 'image' | 'file')
   * @param {File} messageData.file - 文件（如果是文件消息）
   * @returns {Promise} 发送结果
   */
  sendMessage: (messageData) => {
    // 如果包含文件，使用FormData
    if (messageData.file instanceof File) {
      const formData = new FormData()
      Object.keys(messageData).forEach(key => {
        if (messageData[key] !== null && messageData[key] !== undefined) {
          formData.append(key, messageData[key])
        }
      })
      return http.post('/messages', formData)
    }

    return http.post('/messages', messageData)
  },

  /**
   * 获取聊天消息列表
   * @param {string|number} chatId - 聊天ID
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.limit - 每页数量
   * @param {string} params.before - 获取指定消息之前的消息
   * @param {string} params.after - 获取指定消息之后的消息
   * @returns {Promise} 消息列表
   */
  getChatMessages: (chatId, params = {}) => {
    return http.get(`/chats/${chatId}/messages`, { params })
  },

  /**
   * 获取消息详情
   * @param {string|number} messageId - 消息ID
   * @returns {Promise} 消息详情
   */
  getMessageDetail: (messageId) => {
    return http.get(`/messages/${messageId}`)
  },

  /**
   * 删除消息
   * @param {string|number} messageId - 消息ID
   * @returns {Promise} 删除结果
   */
  deleteMessage: (messageId) => {
    return http.delete(`/messages/${messageId}`)
  },

  /**
   * 编辑消息
   * @param {string|number} messageId - 消息ID
   * @param {Object} updateData - 更新数据
   * @param {string} updateData.content - 新的消息内容
   * @returns {Promise} 编辑结果
   */
  editMessage: (messageId, updateData) => {
    return http.put(`/messages/${messageId}`, updateData)
  },

  /**
   * 重新生成AI回复
   * @param {string|number} messageId - 用户消息ID
   * @returns {Promise} 新的AI回复
   */
  regenerateResponse: (messageId) => {
    return http.post(`/messages/${messageId}/regenerate`)
  },

  /**
   * 为消息点赞/取消点赞
   * @param {string|number} messageId - 消息ID
   * @param {boolean} liked - 是否点赞
   * @returns {Promise} 点赞结果
   */
  toggleMessageLike: (messageId, liked = true) => {
    return liked
      ? http.post(`/messages/${messageId}/like`)
      : http.delete(`/messages/${messageId}/like`)
  },

  /**
   * 举报消息
   * @param {string|number} messageId - 消息ID
   * @param {Object} reportData - 举报数据
   * @param {string} reportData.reason - 举报原因
   * @param {string} reportData.description - 详细描述
   * @returns {Promise} 举报结果
   */
  reportMessage: (messageId, reportData) => {
    return http.post(`/messages/${messageId}/report`, reportData)
  }
}

/**
 * 聊天会话 API 服务
 */
const chatAPI = {
  /**
   * 创建新聊天会话
   * @param {Object} chatData - 聊天数据
   * @param {string|number} chatData.characterId - 角色ID
   * @param {string} chatData.name - 聊天名称（可选）
   * @param {string} chatData.scenario - 聊天场景（可选）
   * @returns {Promise} 创建结果
   */
  createChat: (chatData) => {
    return http.post('/chats', chatData)
  },

  /**
   * 获取聊天会话列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.limit - 每页数量
   * @param {string} params.search - 搜索关键词
   * @param {string|number} params.characterId - 按角色筛选
   * @returns {Promise} 聊天列表
   */
  getChatList: (params = {}) => {
    return http.get('/chats', { params })
  },

  /**
   * 获取聊天会话详情
   * @param {string|number} chatId - 聊天ID
   * @returns {Promise} 聊天详情
   */
  getChatDetail: (chatId) => {
    return http.get(`/chats/${chatId}`)
  },

  /**
   * 更新聊天会话信息
   * @param {string|number} chatId - 聊天ID
   * @param {Object} updateData - 更新数据
   * @param {string} updateData.name - 聊天名称
   * @param {string} updateData.scenario - 聊天场景
   * @returns {Promise} 更新结果
   */
  updateChat: (chatId, updateData) => {
    return http.put(`/chats/${chatId}`, updateData)
  },

  /**
   * 删除聊天会话
   * @param {string|number} chatId - 聊天ID
   * @returns {Promise} 删除结果
   */
  deleteChat: (chatId) => {
    return http.delete(`/chats/${chatId}`)
  },

  /**
   * 批量删除聊天会话
   * @param {Array} chatIds - 聊天ID数组
   * @returns {Promise} 删除结果
   */
  batchDeleteChats: (chatIds) => {
    return http.post('/chats/batch-delete', { ids: chatIds })
  },

  /**
   * 归档聊天会话
   * @param {string|number} chatId - 聊天ID
   * @returns {Promise} 归档结果
   */
  archiveChat: (chatId) => {
    return http.post(`/chats/${chatId}/archive`)
  },

  /**
   * 取消归档聊天会话
   * @param {string|number} chatId - 聊天ID
   * @returns {Promise} 取消归档结果
   */
  unarchiveChat: (chatId) => {
    return http.post(`/chats/${chatId}/unarchive`)
  },

  /**
   * 获取归档的聊天列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 归档聊天列表
   */
  getArchivedChats: (params = {}) => {
    return http.get('/chats/archived', { params })
  },

  /**
   * 置顶/取消置顶聊天
   * @param {string|number} chatId - 聊天ID
   * @param {boolean} pinned - 是否置顶
   * @returns {Promise} 置顶结果
   */
  toggleChatPin: (chatId, pinned = true) => {
    return pinned
      ? http.post(`/chats/${chatId}/pin`)
      : http.delete(`/chats/${chatId}/pin`)
  },

  /**
   * 获取置顶的聊天列表
   * @returns {Promise} 置顶聊天列表
   */
  getPinnedChats: () => {
    return http.get('/chats/pinned')
  },

  /**
   * 导出聊天记录
   * @param {string|number} chatId - 聊天ID
   * @param {Object} options - 导出选项
   * @param {string} options.format - 导出格式 ('json' | 'txt' | 'html')
   * @param {string} options.dateRange - 时间范围
   * @returns {Promise} 导出结果
   */
  exportChat: (chatId, options = {}) => {
    return http.get(`/chats/${chatId}/export`, {
      params: options,
      headers: {
        'Accept': options.format === 'json' ? 'application/json' : 'text/plain'
      }
    })
  },

  /**
   * 分享聊天会话
   * @param {string|number} chatId - 聊天ID
   * @param {Object} shareOptions - 分享选项
   * @param {boolean} shareOptions.public - 是否公开
   * @param {string} shareOptions.password - 访问密码（可选）
   * @param {string} shareOptions.expiresAt - 过期时间
   * @returns {Promise} 分享链接信息
   */
  shareChat: (chatId, shareOptions = {}) => {
    return http.post(`/chats/${chatId}/share`, shareOptions)
  },

  /**
   * 获取分享的聊天内容
   * @param {string} shareToken - 分享令牌
   * @param {string} password - 访问密码（如果需要）
   * @returns {Promise} 分享的聊天内容
   */
  getSharedChat: (shareToken, password) => {
    return http.get(`/chats/shared/${shareToken}`, {
      params: password ? { password } : {}
    })
  },

  /**
   * 搜索聊天消息
   * @param {Object} searchParams - 搜索参数
   * @param {string} searchParams.query - 搜索关键词
   * @param {string|number} searchParams.chatId - 限制在特定聊天中搜索
   * @param {string|number} searchParams.characterId - 限制在特定角色聊天中搜索
   * @param {string} searchParams.dateFrom - 开始日期
   * @param {string} searchParams.dateTo - 结束日期
   * @returns {Promise} 搜索结果
   */
  searchMessages: (searchParams) => {
    return http.get('/chats/search', { params: searchParams })
  }
}

/**
 * 实时消息 API 服务（WebSocket相关）
 */
const realtimeAPI = {
  /**
   * 获取WebSocket连接令牌
   * @returns {Promise} WebSocket令牌
   */
  getWebSocketToken: () => {
    return http.get('/realtime/token')
  },

  /**
   * 加入聊天房间
   * @param {string|number} chatId - 聊天ID
   * @returns {Promise} 加入结果
   */
  joinChatRoom: (chatId) => {
    return http.post(`/realtime/chats/${chatId}/join`)
  },

  /**
   * 离开聊天房间
   * @param {string|number} chatId - 聊天ID
   * @returns {Promise} 离开结果
   */
  leaveChatRoom: (chatId) => {
    return http.post(`/realtime/chats/${chatId}/leave`)
  },

  /**
   * 发送打字状态
   * @param {string|number} chatId - 聊天ID
   * @param {boolean} typing - 是否正在打字
   * @returns {Promise} 发送结果
   */
  sendTypingStatus: (chatId, typing = true) => {
    return http.post(`/realtime/chats/${chatId}/typing`, { typing })
  }
}

export { messageAPI, chatAPI, realtimeAPI }
export default messageAPI