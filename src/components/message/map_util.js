// 等价于 src/util/map_util.ts 的 JS 版本
export function try_set(map, key, value) {
  if (map.has(key)) return false;
  map.set(key, value);
  return true;
}

export function get_or_set(map, key, defaulter) {
  const existing = map.get(key);
  if (existing) return existing;
  const v = defaulter();
  map.set(key, v);
  return v;
}

export function extract(map, key) {
  const v = map.get(key);
  if (!v) return undefined;
  map.delete(key);
  return v;
}

