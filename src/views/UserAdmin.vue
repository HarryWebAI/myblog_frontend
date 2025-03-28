<template>
  <div class="user-admin">
    <el-button class="refresh-btn" type="primary" circle @click="refreshUsers" :loading="loading">
      <el-icon>
        <Refresh />
      </el-icon>
    </el-button>

    <div v-if="loading" class="loading-container">
      <el-skeleton :count="6" animated>
        <template #template>
          <div class="skeleton"></div>
        </template>
      </el-skeleton>
    </div>

    <el-empty v-else-if="!userList.length" description="暂无用户数据" />

    <div v-else class="user-grid">
      <el-tooltip v-for="user in userList" :key="user.uid" :content="user.is_active ? '已激活' : '未激活'" placement="top"
        :effect="user.is_active ? 'light' : 'dark'">
        <div class="user-item" @click="handleUserClick(user)">
          <el-avatar :size="60" :src="user.avatar_url" :class="{ 'admin': user.is_superuser }" />
          <span class="user-name" :class="{ 'active': user.is_active, 'inactive': !user.is_active }">
            {{ user.name }}
          </span>
        </div>
      </el-tooltip>
    </div>

    <UserDetail v-model="showUserDetail" :user="selectedUser" @status-change="handleStatusChange" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import useUser from '@/hooks/useUser'
import UserDetail from '@/components/user/UserDetail.vue'
import type { User } from '@/types'

const { users, getUsers, loading } = useUser()
const showUserDetail = ref(false)
const selectedUser = ref<User | null>(null)

const userList = computed(() => users.value || [])

const refreshUsers = async () => {
  await getUsers()
}

const handleUserClick = (user: User) => {
  selectedUser.value = user
  showUserDetail.value = true
}

const handleStatusChange = (userId: string, isActive: boolean) => {
  const user = userList.value.find(u => u.uid === userId)
  if (user) {
    user.is_active = isActive
  }
}

onMounted(() => {
  refreshUsers()
})
</script>

<style scoped>
.user-admin {
  height: calc(100% + 40px);
  width: calc(100% + 40px);
  margin: -20px;
  position: relative;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
  color: white;
  overflow: auto;
}

:deep(.el-dialog) {
  background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0;
  padding: 20px;
}

:deep(.el-dialog__title) {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
}

:deep(.el-dialog__body) {
  padding: 0;
}

.refresh-btn {
  position: absolute;
  right: 30px;
  top: 30px;
  z-index: 1;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.refresh-btn:hover {
  opacity: 1;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
  padding: 40px;
}

.user-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
  transition: transform 0.3s ease;
}

.user-item:hover {
  transform: translateY(-5px);
}

.el-avatar {
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.el-avatar.admin {
  border-color: #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.user-item:hover .el-avatar {
  border-color: #409EFF;
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.4);
}

.user-name {
  font-size: 14px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.user-name.active {
  color: #67C23A;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(103, 194, 58, 0.3);
}

.user-name.inactive {
  color: #909399;
  font-weight: normal;
  text-shadow: none;
}

.loading-container {
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
}

.skeleton {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 auto;
}
</style>
