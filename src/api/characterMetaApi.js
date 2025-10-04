/**
 * 角色卡元数据相关 API
 */

import http from './http'

/**
 * 角色卡元数据 API 服务
 */
export const characterMetaAPI = {
  /**
   * 上传角色卡文件（JSON或PNG格式）
   * @param {File} file - 角色卡文件（JSON/PNG格式）
   * @returns {Promise} 上传结果
   */
  uploadCharacterCard: file => {
    const formData = new FormData()
    formData.append('file', file)
    return http.post('/character/meta/upload', formData, {
      headers: {
        // 让浏览器自动设置Content-Type为multipart/form-data
      },
    })
  },

  /**
   * 上传角色图片
   * @param {File} file - 图片文件
   * @returns {Promise<{backgroundImagePath: string, backgroundImageUrl: string}>} 上传结果
   */
  uploadImage: file => {
    const formData = new FormData()
    formData.append('file', file)
    return http.post('/character/meta/img/upload', formData, {
      headers: {
        // 让浏览器自动设置Content-Type为multipart/form-data
      },
    })
  },

  /**
   * 创建角色卡
   * @param {Object} characterData - 角色数据
   * @returns {Promise} 创建结果
   */
  createCharacter: characterData => {
    return http.post('/character/meta/create', characterData)
  },
}

export default characterMetaAPI
