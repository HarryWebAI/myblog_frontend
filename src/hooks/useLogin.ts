// http://127.0.0.1:8000/api/user/login/ => 登录接口

import { ref } from 'vue'
import http from '@/utils/http'
import type { Ref } from 'vue'
import type { LoginForm, LoginResponse } from '@/types'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export function useLogin() {
  const loading: Ref<boolean> = ref(false)
  const authStore = useAuthStore()
  const router = useRouter()

  // 登录
  const login = async (loginForm: LoginForm) => {
    loading.value = true

    await http
      .post<LoginResponse>('/user/login/', loginForm)
      .then((res) => {
        if (res.status === 200) {
          const { user, token } = res.data
          ElMessage.success('欢迎光临')
          authStore.setUser(user, token)
          // 使用 replace 替换当前页面，这样返回时就不会回到登录页
          router.back()
        }
      })
      .catch((err) => {
        console.log(err)
        ElMessage.error(err.response.data.message)
        return false
      })
      .finally(() => {
        loading.value = false
      })
  }

  return { loading, login }
}
