<template>
  <div class="login-container">
    <transition name="fade-down" appear>
      <h1 class="title">HarryWebAI</h1>
    </transition>

    <transition name="fade-up" appear>
      <div class="login-form">
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
          <el-form-item label="邮箱" prop="email" class="no-label">
            <el-input v-model="form.email" placeholder="请输入登录邮箱" prefix-icon="Message" />
          </el-form-item>
          <el-form-item label="密码" prop="password" class="no-label">
            <el-input v-model="form.password" type="password" placeholder="请输入登录密码" prefix-icon="Lock" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
              <el-icon class="icon">
                <Select />
              </el-icon>
              登录
            </el-button>
          </el-form-item>
          <div class="register-link">
            没有账号？<router-link to="/register">立即注册</router-link>
          </div>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Select } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { emailRegExp } from '@/utils/regExp'
import { useLogin } from '@/hooks/useLogin'
import { ElMessage } from 'element-plus'

const formRef = ref<FormInstance>()

const { loading, login } = useLogin()

const form = reactive({
  email: '',
  password: ''
})

const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { pattern: emailRegExp, message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
})

const handleLogin = () => {
  formRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error('请输入正确的邮箱和密码')
      return
    }

    login(form)
  })
}
</script>

<style scoped>
.login-container {
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

.login-form {
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

.login-btn {
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

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.icon {
  font-size: 1.2rem;
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

.register-link {
  text-align: center;
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.register-link a {
  color: #ec6ead;
  text-decoration: none;
  margin-left: 4px;
  transition: all 0.3s ease;
}

.register-link a:hover {
  color: #3494e6;
  text-decoration: underline;
}
</style>
