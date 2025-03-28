// http://127.0.0.1:8000/api/user/initcode/ => 发送验证码接口

import http from '@/utils/http'
import { ElMessage } from 'element-plus'
import type { InitCodeForm, InitCodeResponse, RegisterForm, RegisterResponse } from '@/types'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
export function useRegister() {
  const router = useRouter()
  const loading = ref(false)

  // 获取验证码
  const sendInitCode = async (initCodeForm: InitCodeForm) => {
    await http
      .post<InitCodeResponse>('/user/initcode/', initCodeForm)
      .then((res) => {
        if (res.status === 200) {
          ElMessage.success('验证码已发送到您的邮箱')
        }
      })
      .catch((err) => {
        console.log(err)
        ElMessage.error(err.response.data.message)
        return false
      })
  }

  // 注册
  const register = async (registerForm: RegisterForm) => {
    loading.value = true
    await http
      .post<RegisterResponse>('/user/register/', registerForm)
      .then((res) => {
        if (res.status === 200) {
          ElMessage.success(res.data.message)
          router.replace({ name: 'home' })
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

  return { sendInitCode, register, loading }
}
