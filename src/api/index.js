/**
 * API 统一入口文件
 * 导出所有 API 服务，提供统一的调用接口
 */

// 导入HTTP客户端
import http, { HttpClient } from './http'

// 导入各个API服务
import { characterAPI } from './characterApi'
import { messageAPI, chatAPI, realtimeAPI } from './messageApi'

// 统一导出所有API服务
export const api = {
  // 角色相关
  character: characterAPI,

  // 消息/聊天相关
  message: messageAPI,
  chat: chatAPI,
  realtime: realtimeAPI,
}

// 导出HTTP客户端（用于自定义请求）
export { http, HttpClient }

// 默认导出API对象
export default api

/**
 * 使用示例：
 *
 * import api from '@/api'
 *
 * // 获取角色列表
 * const characters = await api.character.getCharacterList({ page: 1, limit: 10 })
 *
 * // 发送消息
 * const message = await api.message.sendMessage({
 *   chatId: '123',
 *   characterId: '456',
 *   content: 'Hello!'
 * })
 *
 * // 创建聊天
 * const chat = await api.chat.createChat({ characterId: '456' })
 */