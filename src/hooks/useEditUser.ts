import http from '@/utils/http'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import type { UploadResponse, UserForm } from '@/types'

export function useEditUser() {
  const authStore = useAuthStore()
  const loading = ref(false)
  const cropping = ref(false)

  // 更新用户信息
  const updateUserInfo = async (form: UserForm) => {
    loading.value = true

    // 获取当前用户ID
    const currentUser = authStore.getUser()
    if (!currentUser?.uid) {
      ElMessage.error('获取用户信息失败')
      loading.value = false
      return false
    }

    try {
      const res = await http.patch<UploadResponse>(`/user/user/${currentUser.uid}/`, {
        name: form.name,
      })

      if (res.status === 200) {
        // 确保更新本地存储的用户信息
        const updatedUser = {
          ...currentUser,
          name: form.name,
        }

        // 更新Pinia存储
        authStore.setUser(updatedUser, authStore.getToken()!)

        // 额外确保localStorage也被更新
        const storageKey = import.meta.env.VITE_STORAGE_KEY || 'blog_storage'
        const storageData = JSON.parse(localStorage.getItem(storageKey) || '{}')

        if (storageData && storageData.user) {
          storageData.user = updatedUser
          localStorage.setItem(storageKey, JSON.stringify(storageData))
        }

        ElMessage.success('用户信息更新成功')
        return true
      }

      return false
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      ElMessage.error(error.response?.data?.message || '更新失败')
      return false
    } finally {
      loading.value = false
    }
  }

  // 上传头像
  const uploadAvatar = async (file: File) => {
    try {
      const response = await http.upload<UploadResponse>('/user/avatar/upload/', file, 'avatar')

      // 更新用户信息
      const currentUser = authStore.getUser()
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          avatar: response.data.url,
        }

        // 更新Pinia存储
        authStore.setUser(updatedUser, authStore.getToken()!)

        // 额外确保localStorage也被更新
        const storageKey = import.meta.env.VITE_STORAGE_KEY || 'blog_storage'
        const storageData = JSON.parse(localStorage.getItem(storageKey) || '{}')

        if (storageData && storageData.user) {
          storageData.user = updatedUser
          localStorage.setItem(storageKey, JSON.stringify(storageData))
        }
      }

      ElMessage.success('头像上传成功')
      return response.data
    } catch (error: unknown) {
      console.error('上传失败:', error)
      const err = error as { response?: { data?: { message?: string } } }
      ElMessage.error(err.response?.data?.message || '上传失败，请重试')
      return null
    }
  }

  // 裁剪并上传头像
  const cropAndUploadAvatar = async (blob: Blob) => {
    cropping.value = true
    try {
      // 创建文件对象
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })

      // 使用uploadAvatar方法上传
      const result = await uploadAvatar(file)
      cropping.value = false
      return result
    } catch (error) {
      console.error('裁剪上传失败:', error)
      ElMessage.error('裁剪失败，请重试')
      cropping.value = false
      return null
    }
  }

  // 验证头像上传前的文件
  const validateAvatarBeforeUpload = (file: File) => {
    const isJPG =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG) {
      ElMessage.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
      return false
    }
    if (!isLt2M) {
      ElMessage.error('上传头像图片大小不能超过 2MB!')
      return false
    }

    return true
  }

  return {
    updateUserInfo,
    uploadAvatar,
    cropAndUploadAvatar,
    validateAvatarBeforeUpload,
    loading,
    cropping,
  }
}
