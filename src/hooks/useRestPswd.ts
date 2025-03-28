// http://localhost:8000/api/user/resetpassword/  重置密码api
import http from '@/utils/http'
import { ElMessage } from 'element-plus'
import type { ResetPasswordParams, ResetPasswordResponse } from '@/types'

export function useResetPswd() {
  const resetPswd = async (params: ResetPasswordParams) => {
    try {
      const res = await http.post<ResetPasswordResponse>('/user/resetpassword/', params)
      if (res.status === 200) {
        ElMessage.success('密码修改成功')
        return true
      }
      return false
    } catch (error: unknown) {
      console.error('修改密码失败:', error)
      const err = error as { response?: { data?: { message?: string } } }
      ElMessage.error(err.response?.data?.message || '修改密码失败，请重试')
      return false
    }
  }

  return {
    resetPswd,
  }
}
