<template>
  <div class="admin-container">
    <!-- 侧边栏 -->
    <div class="sidebar-wrapper" :class="{ collapsed: isCollapsed }">
      <SideBar :is-collapse="isCollapsed" />
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="header">
        <el-button class="toggle-btn" text @click="toggleCollapse">
          <el-icon>
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
        </el-button>
        <div class="header-right">
          <el-dropdown trigger="click">
            <el-avatar :size="32" :src="getAvatar(authStore.getUser()?.avatar || '')" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleUserInfo">个人信息</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Fold, Expand } from '@element-plus/icons-vue'
import SideBar from '@/components/admin/SideBar.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { getAvatar } from '@/utils/getAvatar'

const isCollapsed = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    authStore.clearUser()
    router.push({ name: 'welcome' })
  }).catch(() => {
    console.log('取消退出')
  })
}

const handleUserInfo = () => {
  router.push({ name: 'userinfo' })
}
</script>

<style scoped>
.admin-container {
  height: 100vh;
  display: flex;
  background-color: #2d2d2d;
}

.sidebar-wrapper {
  width: 240px;
  transition: width 0.3s;
  flex-shrink: 0;
}

.sidebar-wrapper.collapsed {
  width: 64px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header {
  height: 64px;
  background-color: #1a1a1a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.toggle-btn {
  font-size: 1.2rem;
  color: #e0e0e0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 滚动条样式 */
.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
