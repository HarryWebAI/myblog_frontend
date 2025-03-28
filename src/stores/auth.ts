import { defineStore } from 'pinia'
import type { User } from '@/types'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 配置键名
  const TOKEN_KEY: string = 'HARRYWEB_TOKEN_KEY'
  const USER_KEY: string = 'HARRYWEB_USER_KEY'

  // 状态
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(null)

  // 初始化时从 localStorage 获取用户信息
  const storedUser = localStorage.getItem(USER_KEY)
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }

  // 初始化时从 localStorage 获取 token
  const storedToken = localStorage.getItem(TOKEN_KEY)
  if (storedToken) {
    token.value = storedToken
  }

  // 设置用户信息和token
  const setUser = (userData: User, newToken: string) => {
    user.value = userData
    token.value = newToken
    // 保存到本地存储
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    localStorage.setItem(TOKEN_KEY, newToken)
  }

  // 清除用户信息
  const clearUser = () => {
    user.value = null
    token.value = null
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  // 获取用户信息
  const getUser = () => user.value

  // 获取 token
  const getToken = () => token.value

  // 检查是否已登录
  const isLoggedIn = () => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    return !!storedToken && !!storedUser && !!token.value && !!user.value
  }

  // 检查是否是超级用户
  const isSuperuser = () => {
    return user.value?.is_superuser
  }

  return {
    user,
    token,
    setUser,
    clearUser,
    getUser,
    isLoggedIn,
    getToken,
    isSuperuser,
  }
})
