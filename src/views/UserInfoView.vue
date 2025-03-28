<template>
  <div class="user-info-container">
    <transition name="fade-up" appear>
      <div class="content-wrapper">
        <el-card class="user-card">
          <div class="card-content">
            <!-- 左侧用户信息 -->
            <transition name="fade-right" appear>
              <div class="user-info">
                <div class="avatar-wrapper">
                  <el-avatar :size="100" :src="getAvatar(authStore.getUser()?.avatar || '')" />
                  <h2 class="user-name">{{ user?.name || '未设置昵称' }}</h2>
                </div>

                <div class="info-details">
                  <div class="detail-item">
                    <el-icon>
                      <Message />
                    </el-icon>
                    <span class="label">邮箱：</span>
                    <span class="value">{{ user?.email || '未设置邮箱' }}</span>
                  </div>

                  <div class="detail-item">
                    <el-icon>
                      <Phone />
                    </el-icon>
                    <span class="label">电话：</span>
                    <span class="value">{{ user?.telephone || '未设置电话' }}</span>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 右侧操作按钮 -->
            <transition name="fade-left" appear>
              <div class="action-buttons">
                <div class="button-container">
                  <el-button type="primary" @click="handleEdit" class="action-btn">
                    <el-icon>
                      <Edit />
                    </el-icon>
                    修改信息
                  </el-button>

                  <el-button type="warning" @click="handleResetPswd" class="action-btn">
                    <el-icon>
                      <Lock />
                    </el-icon>
                    修改密码
                  </el-button>

                  <el-button v-if="isSuperuser" type="success" @click="handleAdmin" class="action-btn">
                    <el-icon>
                      <Setting />
                    </el-icon>
                    进入后台
                  </el-button>

                  <el-button type="danger" @click="handleLogout" class="action-btn">
                    <el-icon>
                      <SwitchButton />
                    </el-icon>
                    退出登录
                  </el-button>
                </div>
              </div>
            </transition>
          </div>
        </el-card>
      </div>
    </transition>
    <EditUserInfo v-model="dialogVisible" />
    <ResetPswd v-model="resetPswdVisible" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { Message, Phone, Edit, Setting, SwitchButton, Lock } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import EditUserInfo from '@/components/user/EditUserInfo.vue'
import ResetPswd from '@/components/user/ResetPswd.vue'
import { getAvatar } from '@/utils/getAvatar'

const dialogVisible = ref(false)
const resetPswdVisible = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.getUser())
const isSuperuser = computed(() => authStore.isSuperuser())

const handleEdit = () => {
  dialogVisible.value = true
}

const handleResetPswd = () => {
  resetPswdVisible.value = true
}

const handleAdmin = () => {
  router.push('/admin')
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    authStore.clearUser()
    ElMessage.success('感谢光临, 期待再见!')
    router.push('/login')
  }).catch(() => { })
}
</script>

<style scoped>
.user-info-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.content-wrapper {
  flex: 1;
  position: relative;
  margin: 20px auto;
  width: 90%;
  max-width: 900px;
  height: calc(100vh - 40px);
  display: flex;
  align-items: center;
}

.user-card {
  width: 100%;
  border-radius: 16px;
  background: rgba(26, 26, 26, 0.7) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

:deep(.el-card__body) {
  padding: 0;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30px;
  gap: 40px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-name {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 8px 12px;
  border-radius: 8px;
}

.detail-item .el-icon {
  margin-right: 12px;
  font-size: 24px;
  color: #3494e6;
}

.label {
  color: rgba(255, 255, 255, 0.7);
  margin-right: 12px;
  width: 60px;
}

.value {
  color: #ffffff;
  font-weight: 500;
}

.action-buttons {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding-left: 40px;
  align-self: stretch;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 160px;
}

:deep(.action-btn) {
  width: 160px !important;
  height: 40px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin: 0;
}

:deep(.action-btn)::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
  transition: all 0.5s;
}

:deep(.action-btn:hover)::before {
  left: 100%;
}

:deep(.action-btn .el-icon) {
  font-size: 1.2rem;
  margin-right: 8px;
}

@media (max-width: 768px) {
  .content-wrapper {
    margin: 10px auto;
    width: 95%;
    height: calc(100vh - 20px);
  }

  .card-content {
    flex-direction: column;
    padding: 20px;
  }

  .action-buttons {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 30px 0 0 0;
    width: 100%;
    justify-content: center;
  }

  .button-container {
    width: 200px;
  }

  :deep(.action-btn) {
    width: 200px !important;
  }

  :deep(.action-btn:hover) {
    transform: translateY(-2px);
  }

  .fade-right-enter-from,
  .fade-left-enter-from {
    transform: translateY(30px);
  }

  .fade-right-enter-to,
  .fade-left-enter-to {
    transform: translateY(0);
  }

  .detail-item:hover {
    transform: translateX(0);
  }
}

/* 添加动画效果 */
.fade-up-enter-active,
.fade-right-enter-active,
.fade-left-enter-active {
  transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-up-enter-to,
.fade-right-enter-to,
.fade-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* 添加头像悬浮效果 */
:deep(.el-avatar) {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

:deep(.el-avatar:hover) {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* 添加信息项悬浮效果 */
.detail-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

/* 添加对话框样式覆盖 */
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
  background-color: #2a2a2a !important;
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
  padding: 20px;
  background-color: #2a2a2a;
}
</style>
