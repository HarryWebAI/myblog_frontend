<template>
  <el-dialog v-model="dialogVisible" title="修改信息" width="400px" :close-on-click-modal="false" :show-close="true"
    @close="handleClose" class="message-dialog" destroy-on-close>
    <div class="form-container">
      <!-- 头像上传区域 -->
      <div class="avatar-section">
        <el-upload class="avatar-uploader" :action="`${API_URL}/user/avatar/upload/`" :show-file-list="false"
          :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess" :on-error="handleUploadError"
          :headers="uploadHeaders" name="avatar">
          <img :src="getAvatar(authStore.getUser()?.avatar || '')" class="avatar" />
        </el-upload>
        <div class="upload-tip">点击更换头像</div>
      </div>

      <!-- 昵称输入区域 -->
      <el-form ref="formRef" :model="form" :rules="rules" label-width="0" class="message-form">
        <el-form-item prop="name">
          <div class="form-item-label">昵称</div>
          <el-input v-model="form.name" placeholder="请输入您的昵称" />
        </el-form-item>

        <div class="form-footer">
          <el-button class="cancel-btn" @click="handleClose">取消</el-button>
          <el-button class="submit-btn" @click="handleSubmit" :loading="loading">
            保存修改
          </el-button>
        </div>
      </el-form>
    </div>

    <!-- 裁剪对话框 -->
    <el-dialog v-model="cropperVisible" title="裁剪头像" width="600px" :close-on-click-modal="false">
      <div class="cropper-container">
        <VueCropper ref="cropperRef" :src="cropperImage" :aspect-ratio="1" :view-mode="2" :auto-crop-width="200"
          :auto-crop-height="200" :center-box="true" :info="true" :full="false" :can-move="true" :can-move-box="true"
          :original="false" :auto-crop="true" :fixed="true" :fixed-number="[1, 1]" :center="true" :info-true="true"
          :high="true" :img="cropperImage" @real-time="realTime" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="cancel-btn" @click="cropperVisible = false">取消</el-button>
          <el-button class="submit-btn" @click="handleCrop" :loading="cropping">
            确认裁剪
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import type { UploadResponse, UploadError, CropperData, UserForm } from '@/types'
import { useEditUser } from '@/hooks/useEditUser'
import { chineseNameRegExp } from '@/utils/regExp'
import { getAvatar } from '@/utils/getAvatar'

// 定义API URL和图片基础URL
const API_URL = import.meta.env.VITE_BASE_URL

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: UserForm): void
}>()

const authStore = useAuthStore()
const loading = ref(false)
const formRef = ref<FormInstance>()
const dialogVisible = ref(props.modelValue)

// 使用useEditUser钩子
const { updateUserInfo, cropAndUploadAvatar, validateAvatarBeforeUpload, cropping } = useEditUser()

// 裁剪相关
const cropperVisible = ref(false)
const cropperRef = ref()
const cropperImage = ref('')
const cropperData = ref<CropperData>({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1
})

const form = reactive<UserForm>({
  name: authStore.getUser()?.name || '',
  avatar: authStore.getUser()?.avatar || ''
})

const uploadHeaders = {
  Authorization: `JWT ${authStore.getToken()}`
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.name = authStore.getUser()?.name || ''
  form.avatar = authStore.getUser()?.avatar || ''
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
      ElMessage.error('请输入正确的昵称!')
      return
    } else {
      loading.value = true
      try {
        const result = await updateUserInfo(form)
        if (result) {
          emit('submit', { ...form })
          handleClose()
        }
      } catch (error) {
        console.error('更新失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

const handleAvatarSuccess = (response: UploadResponse) => {
  form.avatar = response.url
  ElMessage.success('头像上传成功')

  // 更新用户信息
  const currentUser = authStore.getUser()
  if (currentUser) {
    authStore.setUser({
      ...currentUser,
      avatar: response.url
    }, authStore.getToken()!)
  }
}

const handleUploadError = (error: UploadError) => {
  console.error('上传失败:', error)
  ElMessage.error(error.message || '上传失败，请重试')
}

const beforeAvatarUpload = (file: File) => {
  const isValid = validateAvatarBeforeUpload(file)

  if (isValid) {
    // 读取文件并显示裁剪对话框
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      cropperImage.value = reader.result as string
      cropperVisible.value = true
    }
  }

  return false // 阻止自动上传
}

const realTime = (data: CropperData) => {
  cropperData.value = data
}

const handleCrop = async () => {
  if (!cropperRef.value) return

  // 获取裁剪后的数据并转为Blob
  cropperRef.value.getCropBlob(async (blob: Blob) => {
    const response = await cropAndUploadAvatar(blob)
    if (response) {
      form.avatar = response.url
      cropperVisible.value = false
    }
  })
}

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
    { pattern: chineseNameRegExp, message: '请输入正确的中文姓名', trigger: 'blur' }
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

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.avatar-uploader {
  border: 1px dashed #404040;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: #3494e6;
  transform: translateY(-2px);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
  border-radius: 50%;
}

.upload-tip {
  color: #8c939d;
  font-size: 0.9rem;
  margin-top: 8px;
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

.cropper-container {
  width: 100%;
  height: 400px;
  background-color: #333;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 20px 0;
}

:deep(.vue-cropper) {
  background-color: #333;
}

:deep(.cropper-view-box) {
  outline: 2px solid #3494e6;
  outline-color: rgba(52, 148, 230, 0.75);
}

:deep(.cropper-point) {
  background-color: #3494e6;
}

:deep(.cropper-line) {
  background-color: #3494e6;
}
</style>
