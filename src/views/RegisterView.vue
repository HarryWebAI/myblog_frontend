<template>
  <div class="register-container">
    <transition name="fade-down" appear>
      <h1 class="title">HarryWebAI</h1>
    </transition>

    <transition name="fade-up" appear>
      <div class="register-form">
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
          <el-form-item label="邮箱" prop="email" class="no-label">
            <el-input v-model="form.email" placeholder="请输入登录邮箱" prefix-icon="Message" />
          </el-form-item>
          <el-form-item label="验证码" prop="code" class="no-label">
            <div class="verify-code-wrapper" :class="{ 'is-error': codeError }">
              <el-input v-model="form.code" placeholder="点击获取验证码" prefix-icon="Key" @blur="validateCode"
                @input="handleCodeInput" />
              <div class="error-message" v-if="codeError">{{ codeErrorMessage }}</div>
              <el-button type="primary" class="verify-code-btn" :disabled="countdown > 0" @click="handleGetCode">
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item label="姓名" prop="name" class="no-label">
            <el-input v-model="form.name" placeholder="请输入中文姓名" prefix-icon="User" />
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone" class="no-label">
            <el-input v-model="form.telephone" placeholder="请输入联系电话" prefix-icon="Phone" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="register-btn" @click="handleRegister" :loading="loading">
              <el-icon class="icon">
                <Select />
              </el-icon>
              注册
            </el-button>
          </el-form-item>
          <div class="login-link">
            已有账号？<router-link to="/login">立即登录</router-link>
          </div>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Select } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { emailRegExp, telphoneRegExp, chineseNameRegExp } from '@/utils/regExp'
import { useRegister } from '@/hooks/useRegister'

const formRef = ref<FormInstance>()
const countdown = ref(0)
const codeError = ref(false)
const codeErrorMessage = ref('')
const { sendInitCode, register, loading } = useRegister()
const form = reactive({
  email: '',
  code: '',
  name: '',
  telephone: ''
})

const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入登录邮箱', trigger: 'blur' },
    { pattern: emailRegExp, message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入中文姓名', trigger: 'blur' },
    { pattern: chineseNameRegExp, message: '请输入正确的中文姓名', trigger: 'blur' }
  ],
  telephone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: telphoneRegExp, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

const validateCode = () => {
  if (!form.code) {
    codeError.value = true
    codeErrorMessage.value = '请输入验证码'
    return false
  }
  if (!/^\d{6}$/.test(form.code)) {
    codeError.value = true
    codeErrorMessage.value = '验证码必须是6位数字'
    return false
  }
  codeError.value = false
  codeErrorMessage.value = ''
  return true
}

const handleCodeInput = () => {
  if (codeError.value) {
    validateCode()
  }
}

const handleGetCode = async () => {
  if (!form.email) {
    ElMessage.error('请先输入邮箱')
    return
  }

  if (!emailRegExp.test(form.email)) {
    ElMessage.error('请输入正确的邮箱格式')
    return
  }

  // TODO: 调用发送验证码接口
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  sendInitCode({ email: form.email })
}

const handleRegister = () => {
  // 验证验证码
  const isCodeValid = validateCode()
  if (!isCodeValid) return

  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error('请输入正确的注册信息')
      return
    }

    register(form)
  })

}
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffffff;
}

.title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 3rem;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.register-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

:deep(.el-form-item__label) {
  color: #ffffff;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
  height: 48px;
  padding: 0 16px;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #ec6ead;
  box-shadow: 0 0 0 1px #ec6ead;
}

:deep(.el-input__inner) {
  color: #ffffff;
  font-size: 16px;
  height: 48px;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
  margin-top: 8px;
}

.verify-code-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 4px;
}

.verify-code-wrapper.is-error :deep(.el-input__wrapper) {
  border-color: #f56c6c;
  box-shadow: 0 0 0 1px #f56c6c;
}

.verify-code-wrapper.is-error :deep(.el-input__wrapper:hover) {
  border-color: #f56c6c;
}

.error-message {
  position: absolute;
  left: 0;
  bottom: -20px;
  font-size: 12px;
  color: #f56c6c;
  line-height: 1;
}

.verify-code-wrapper :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
  height: 48px;
  padding-right: 120px;
  border-radius: 4px;
  transition: all 0.3s;
}

.verify-code-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
  height: 36px;
  min-height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
  z-index: 1;
}

.verify-code-btn:not(:disabled) {
  background: linear-gradient(45deg, #3494e6, #ec6ead);
}

.verify-code-btn:hover:not(:disabled) {
  transform: translateY(-50%) translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.verify-code-btn:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}

.register-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  border: none;
  border-radius: 24px;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.icon {
  font-size: 1.2rem;
}

.login-link {
  text-align: center;
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.login-link a {
  color: #ec6ead;
  text-decoration: none;
  margin-left: 4px;
  transition: all 0.3s ease;
}

.login-link a:hover {
  color: #3494e6;
  text-decoration: underline;
}

/* 动画效果 */
.fade-down-enter-active,
.fade-up-enter-active {
  transition: all 0.8s ease;
}

.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-50px);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(50px);
}

.fade-down-enter-to,
.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

:deep(.no-label .el-form-item__label) {
  display: none;
}

:deep(.no-label .el-form-item__content) {
  margin-left: 0 !important;
}

/* 删除之前的样式 */
:deep(.el-input-group),
:deep(.el-input-group__append),
.code-input {
  display: none;
}
</style>
