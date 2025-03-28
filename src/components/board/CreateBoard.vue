<template>
  <el-dialog v-model="dialogVisible" title="写留言" width="50%" :close-on-click-modal="false" :show-close="true"
    @close="handleClose" class="message-dialog" destroy-on-close>
    <div class="welcome-message">
      <div class="welcome-text">
        有什么好的建议? 或者寻求合作?
      </div>
      <div class="welcome-highlight">
        欢迎留言!
      </div>
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="0" class="message-form">
      <el-form-item prop="content">
        <template v-if="authStore.isLoggedIn()">
          <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入留言内容" resize="none" />
        </template>
        <template v-else>
          <div class="login-tip">
            <el-button type="primary" class="login-button" @click="router.push({ name: 'login' })">
              请先登录
            </el-button>
          </div>
        </template>
      </el-form-item>

      <div class="form-footer">
        <el-button class="cancel-btn" @click="handleClose">取消</el-button>
        <el-button class="submit-btn" @click="handleSubmit" :loading="loading" :disabled="!authStore.isLoggedIn()">
          提交
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

interface MessageForm {
  content: string
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: MessageForm): void
}>()

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const formRef = ref<FormInstance>()
const dialogVisible = ref(props.modelValue)

const form = reactive<MessageForm>({
  content: ''
})

const resetForm = () => {
  formRef.value?.resetFields()
}

defineExpose({
  resetForm
})

const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

const handleSubmit = async () => {
  if (!authStore.isLoggedIn()) {
    ElMessage.warning('请先登录后再发表留言')
    handleClose()
    return
  }

  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))

    emit('submit', { ...form })
    handleClose()
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

const rules = reactive<FormRules>({
  content: [
    { required: true, message: '请输入留言内容', trigger: 'blur' },
    { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
  ]
})

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
.welcome-message {
  background: linear-gradient(135deg, rgba(52, 148, 230, 0.1), rgba(236, 106, 173, 0.1));
  border-radius: 12px;
  padding: 20px;
  margin: 20px 20px 0;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.welcome-text {
  font-size: 1.1rem;
  color: #b0b0b0;
  margin-bottom: 12px;
}

.welcome-highlight {
  font-size: 1.4rem;
  font-weight: 600;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
}

.message-form {
  padding: 20px;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
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
  font-weight: 500;
  color: #e0e0e0;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__wrapper) {
  background-color: #333333;
  box-shadow: 0 0 0 1px #404040;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__wrapper:hover) {
  box-shadow: 0 0 0 1px #3494e6;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3494e6;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  color: #e0e0e0;
  background-color: transparent;
}

:deep(.el-input__inner::placeholder),
:deep(.el-textarea__inner::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

/* 修改滚动条样式 */
:deep(.el-textarea__inner::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-textarea__inner::-webkit-scrollbar-track) {
  background: #333333;
  border-radius: 3px;
}

:deep(.el-textarea__inner::-webkit-scrollbar-thumb) {
  background: #666666;
  border-radius: 3px;
}

:deep(.el-textarea__inner::-webkit-scrollbar-thumb:hover) {
  background: #888888;
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

.login-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  background-color: #333333;
  border-radius: 8px;
  border: 1px solid #404040;
  padding: 20px;
  width: 100%;
}

.login-button {
  width: 100%;
  max-width: 400px;
  height: 50px;
  font-size: 1.1rem;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  border: none;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 148, 230, 0.2);
  opacity: 0.9;
}

.login-button:active {
  transform: translateY(0);
  box-shadow: none;
}
</style>
