<template>
  <el-dialog v-model="dialogVisible" title="用户详情" width="600px" :close-on-click-modal="false">
    <div class="user-detail">
      <div class="left-section">
        <div class="avatar-container">
          <el-avatar :size="120" :src="user?.avatar_url" :class="{ 'admin': user?.is_superuser }" />
        </div>
        <div class="status-section">
          <span class="status-label">账号状态</span>
          <div class="status-content">
            <template v-if="user?.is_active">
              <el-tag type="success" effect="dark">已激活</el-tag>
            </template>
            <template v-else-if="emailSent">
              <el-tag type="warning" effect="dark">已发送激活邮件</el-tag>
            </template>
            <template v-else>
              <el-button type="primary" :loading="loading" @click="handleActivate" class="activate-btn">
                <el-icon>
                  <Check />
                </el-icon>
                激活账号
              </el-button>
            </template>
          </div>
          <el-button type="danger" :loading="deleteLoading" @click="handleDelete" class="delete-btn" size="small">
            <el-icon>
              <Delete />
            </el-icon>
            删除用户
          </el-button>
        </div>
      </div>

      <div class="right-section">
        <div class="info-item">
          <span class="label">
            <el-icon>
              <UserIcon />
            </el-icon>
            用户名
          </span>
          <span class="value">{{ user?.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">
            <el-icon>
              <Message />
            </el-icon>
            邮箱
          </span>
          <span class="value">{{ user?.email }}</span>
        </div>
        <div class="info-item">
          <span class="label">
            <el-icon>
              <Phone />
            </el-icon>
            电话
          </span>
          <span class="value">{{ user?.telephone }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/types'
import { User as UserIcon, Message, Phone, Check, Delete } from '@element-plus/icons-vue'
import useUser from '@/hooks/useUser'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'status-change', userId: string, isActive: boolean): void
}>()

const dialogVisible = ref(props.modelValue)
const loading = ref(false)
const deleteLoading = ref(false)
const emailSent = ref(false)
const { agreeUser, deleteUser } = useUser()

watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
})

watch(() => dialogVisible.value, (newVal) => {
  emit('update:modelValue', newVal)
})

// 当对话框关闭时重置状态
watch(() => dialogVisible.value, (newVal) => {
  if (!newVal) {
    emailSent.value = false
  }
})

const handleActivate = async () => {
  if (!props.user?.email) return

  loading.value = true
  try {
    const success = await agreeUser({ email: props.user.email })
    if (success) {
      emailSent.value = true
    }
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  ElMessageBox.confirm('删除后不可复原! 确定要删除用户吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      deleteLoading.value = true
      const success = await deleteUser(props.user?.uid || '')
      if (success) {
        dialogVisible.value = false
        setInterval(() => {
          window.location.reload()
        }, 1000)
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
    .finally(() => {
      deleteLoading.value = false
    })
}
</script>

<style scoped>
.user-detail {
  display: flex;
  padding: 30px;
  gap: 40px;
}

.left-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.avatar-container {
  margin-bottom: 10px;
}

.el-avatar {
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.el-avatar.admin {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
}

.status-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.status-label {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.activate-btn {
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  border: none;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  width: 120px;
  justify-content: center;
}

.activate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.activate-btn .el-icon {
  font-size: 16px;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding-top: 10px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.label {
  color: #3494e6;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label .el-icon {
  font-size: 16px;
}

.value {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
}

.delete-btn {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  width: 120px;
  justify-content: center;
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

.delete-btn .el-icon {
  font-size: 14px;
}

:deep(.el-tag) {
  width: 120px;
  text-align: center;
  padding: 8px 16px;
}
</style>
