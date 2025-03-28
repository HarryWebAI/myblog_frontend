import type { WelcomeData, WelcomeResponse } from '@/types'
import { ref } from 'vue'
import http from '@/utils/http'
import { ElMessage } from 'element-plus'

const useWelcome = () => {
  const loading = ref(false)
  const welcome = ref<WelcomeData>({
    title: '',
    buttonText: '',
    descriptions: [],
  })

  const getWelcome = async () => {
    loading.value = true
    try {
      const res = await http.get<WelcomeResponse>('/welcome/')
      if (res.data.code === 200) {
        welcome.value = res.data.data
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '获取欢迎信息失败')
    } finally {
      loading.value = false
    }
  }

  const saveWelcomeConfig = () => {
    http
      .put<WelcomeResponse>('/welcome/update/', welcome.value)
      .then((res) => {
        if (res.data && res.data.code === 200) {
          ElMessage.success('保存成功')
        }
      })
      .catch((err) => {
        ElMessage.error(err.response.data.message)
      })
  }

  return {
    welcome,
    getWelcome,
    loading,
    saveWelcomeConfig,
  }
}

export default useWelcome
