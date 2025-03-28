<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="400px" :close-on-click-modal="false" :show-close="true"
    @close="handleClose" class="message-dialog" destroy-on-close>
    <div class="form-container">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="0" class="message-form">
        <el-form-item prop="old_password">
          <div class="form-item-label">旧密码</div>
          <el-input v-model="form.old_password" type="password" placeholder="请输入旧密码" show-password />
        </el-form-item>

        <el-form-item prop="password">
          <div class="form-item-label">新密码</div>
          <el-input v-model="form.password" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>

        <el-form-item prop="confirm_password">
          <div class="form-item-label">确认密码</div>
          <el-input v-model="form.confirm_password" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>

        <div class="form-footer">
          <el-button class="cancel-btn" @click="handleClose">取消</el-button>
          <el-button class="submit-btn" @click="handleSubmit" :loading="loading">
            确认修改
          </el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useResetPswd } from '@/hooks/useRestPswd'
import { useAuthStore } from '@/stores/auth'
import type { ResetPasswordParams } from '@/types'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const loading = ref(false)
const formRef = ref<FormInstance>()
const dialogVisible = ref(props.modelValue)
const authStore = useAuthStore()
const user = authStore.getUser()

const form = reactive<ResetPasswordParams>({
  uid: user!.uid,
  email: user!.email,
  old_password: '',
  password: '',
  confirm_password: ''
})

const validatePass = (rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (form.confirm_password !== '') {
      formRef.value?.validateField('confirm_password')
    }
    callback()
  }
}

const validatePass2 = (rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  old_password: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirm_password: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ]
})

const resetForm = () => {
  formRef.value?.resetFields()
  form.old_password = ''
  form.password = ''
  form.confirm_password = ''
}

defineExpose({
  resetForm
})

const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请检查输入信息!')
      return
    } else {
      loading.value = true

      console.log(form)
      try {
        const { resetPswd } = useResetPswd()
        const result = await resetPswd(form)
        if (result) {
          handleClose()
          authStore.clearUser()
          router.push('/login')
        }
      } catch (error) {
        console.error('修改失败:', error)
        ElMessage.error('密码修改失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
})

// 监听 dialogVisible 变化
watch(() => dialogVisible.value, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.message-form {
  width: 100%;
  max-width: 300px;
}

.form-item-label {
  color: #e0e0e0;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.submit-btn {
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  border: none;
  padding: 12px 24px;
  color: white;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 148, 230, 0.2);
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e0e0e0;
  padding: 12px 24px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #ec6ead;
  color: #ec6ead;
}

:deep(.el-form-item__label) {
  display: none;
}

:deep(.el-input__wrapper) {
  background-color: #333333;
  box-shadow: 0 0 0 1px #404040;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #3494e6;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3494e6;
}

:deep(.el-input__inner) {
  color: #e0e0e0;
  background-color: transparent;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
  background-color: #2a2a2a;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  color: white;
  position: relative;
}

:deep(.el-dialog__title) {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
}

:deep(.el-dialog__headerbtn) {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

:deep(.el-dialog__headerbtn:hover) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) rotate(90deg);
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

:deep(.el-dialog__body) {
  padding: 0;
}
</style>
