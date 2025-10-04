/**
 * API 统一入口文件
 * 导出所有 API 服务，提供统一的调用接口
 */

// 导入HTTP客户端
import http, { HttpClient } from './http'

// 导入各个API服务
import { characterAPI } from './characterApi'
import { characterMetaAPI } from './characterMetaApi'
import { messageAPI, chatAPI, realtimeAPI } from './messageApi'

// 统一导出所有API服务
export const api = {
  // 角色相关
  character: characterAPI,

  // 角色卡元数据相关
  characterMeta: characterMetaAPI,

  // 消息/聊天相关
  message: messageAPI,
  chat: chatAPI,
  realtime: realtimeAPI,
}

// 导出HTTP客户端（用于自定义请求）
export { http, HttpClient }

// 默认导出API对象
export default api
