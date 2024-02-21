export function stringToJson<T = any>(str: string): T | null {
  try {
    return JSON.parse(str)
  } catch (e) {
    return null
  }
}
