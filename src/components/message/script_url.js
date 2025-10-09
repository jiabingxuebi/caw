// 等价于 src/script_url.ts 的 JS 版本（自包含）
import { extract } from './map_util.js'

function createObjectURLFromScript(code) {
  return URL.createObjectURL(new Blob([code], { type: 'application/javascript' }))
}

class ScriptUrl {
  constructor() {
    this.map = new Map()
  }
  get(name) {
    return this.map.get(name)
  }
  set(name, code) {
    this.map.set(name, createObjectURLFromScript(code))
  }
  delete(name) {
    const url = extract(this.map, name)
    if (!url) return url
    try {
      URL.revokeObjectURL(url)
    } catch {}
    return url
  }
}

export const script_url = new ScriptUrl()
