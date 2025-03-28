<template>
  <div class="active-container">
    <transition name="fade-down" appear>
      <h1 class="title">账号激活</h1>
    </transition>

    <transition name="fade-up" appear>
      <div class="active-form">
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
          <el-form-item label="密码" prop="password" class="no-label">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword" class="no-label">
            <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" prefix-icon="Lock"
              show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="active-btn" :loading="loading" @click="handleActive">
              <el-icon class="icon">
                <Check />
              </el-icon>
              激活账号
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Check } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import useUser from '@/hooks/useUser'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)
const { activeUser } = useUser()

const form = reactive({
  password: '',
  confirmPassword: ''
})

const validatePass = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (form.confirmPassword !== '') {
      formRef.value?.validateField('confirmPassword')
    }
    callback()
  }
}

const validatePass2 = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ]
})

const handleActive = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请输入正确的密码')
      return
    }

    loading.value = true
    try {
      const activekey = route.query.activekey as string
      if (!activekey) {
        ElMessage.error('无效的激活链接')
        return
      }

      const success = await activeUser({
        activekey,
        password: form.password,
        confirm_password: form.confirmPassword
      })

      if (success) {
        router.push({ name: 'userinfo' })
      }
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.active-container {
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

.active-form {
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

.active-btn {
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

.active-btn:hover {
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
</style>
