// GET http://localhost:8000/api/user/user => 获取用户列表api
// POST http://localhost:8000/api/user/agreeuser/ => 同意用户注册,发送激活邮件的api
// POST http://localhost:8000/api/user/activeuser/ => 激活用户api
// DELETE http://localhost:8000/api/user/user/:id => 删除用户api

import type { User } from '@/types'
import { ref } from 'vue'
import http from '@/utils/http'
import { ElMessage } from 'element-plus'
import type { UserResponse, ActiveUserParams, AgreeUserParams } from '@/types'

const useUser = () => {
  const loading = ref(false)
  const users = ref<User[]>([])

  const getUsers = async () => {
    loading.value = true
    try {
      const res = await http.get<UserResponse>('/user/user/')

      // 直接使用 res.data, 因为它已经是用户数组
      if (Array.isArray(res.data)) {
        users.value = res.data
      } else {
        console.error('接口返回的数据格式不正确:', res.data)
      }
    } catch (error: unknown) {
      console.error('获取用户列表失败:', error)
      const err = error as { message?: string }
      ElMessage.error(err.message || '获取用户列表失败')
    } finally {
      loading.value = false
    }
  }

  const activeUser = async (params: ActiveUserParams) => {
    try {
      const res = await http.post('/user/activeuser/', params)
      if (res.status === 200) {
        ElMessage.success('账号激活成功! 请登录')
        return true
      }
      return false
    } catch (error: unknown) {
      console.error('激活用户失败:', error)
      const err = error as { message?: string }
      ElMessage.error(err.message || '激活用户失败')
      return false
    }
  }

  const agreeUser = async (params: AgreeUserParams): Promise<boolean> => {
    try {
      const res = await http.post('/user/agreeuser/', params)
      if (res.status === 200) {
        ElMessage.success('已发送激活邮件')
        return true
      }
      return false
    } catch (error: unknown) {
      console.error('发送激活邮件失败:', error)
      const err = error as { message?: string }
      ElMessage.error(err.message || '发送激活邮件失败')
      return false
    }
  }

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      const res = await http.delete(`/user/user/${userId}/`)
      if (res.status === 204) {
        ElMessage.success('用户删除成功, 页面即将刷新')
        return true
      }
      return false
    } catch (error: unknown) {
      const err = error as { response: { data: { message?: string } } }
      ElMessage.error(err.response.data.message || '删除用户失败')
      return false
    }
  }

  return {
    users,
    getUsers,
    loading,
    activeUser,
    agreeUser,
    deleteUser,
  }
}

export default useUser
