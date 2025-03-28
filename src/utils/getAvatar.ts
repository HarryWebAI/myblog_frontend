const URL = import.meta.env.VITE_BASE_URL.replace('/api', '')

export function getAvatar(avatar: string) {
  return `${URL}${avatar}`
}
