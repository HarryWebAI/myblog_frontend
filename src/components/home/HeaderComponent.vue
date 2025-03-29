<template>
  <header class="header">
    <transition name="fade-down" appear>
      <div class="logo">
        <span class="logo-text" @click="restart">HarryWebAI</span>
      </div>
    </transition>

    <nav class="nav-links">
      <transition-group name="fade-down" appear>
        <div class="nav-link" :class="{ active: isLinkActive('/home/aboutme') }" @click="navigateTo('/home/aboutme')"
          :style="{ animationDelay: '0.1s' }" :key="1">
          <el-icon class="nav-icon">
            <User />
          </el-icon>
          关于我
        </div>

        <div class="nav-link" :class="{ active: isLinkActive('/home/blog') }" @click="navigateTo('/home/blog')"
          :style="{ animationDelay: '0.2s' }" :key="2">
          <el-icon class="nav-icon">
            <Document />
          </el-icon>
          博&nbsp;&nbsp;&nbsp;&nbsp;客
        </div>

        <div class="nav-link" :class="{ active: isLinkActive('/home/board') }" @click="navigateTo('/home/board')"
          :style="{ animationDelay: '0.3s' }" :key="3">
          <el-icon class="nav-icon">
            <ChatDotRound />
          </el-icon>
          留言板
        </div>

        <div v-if="!isLoggedIn" class="nav-link" :class="{ active: isLinkActive('/login') }"
          @click="navigateTo('/login')" :style="{ animationDelay: '0.4s' }" :key="4">
          <el-icon class="nav-icon">
            <Key />
          </el-icon>
          登录
        </div>

        <div v-else class="nav-link" :class="{ active: isLinkActive('/home/userinfo') }"
          @click="navigateTo('/home/userinfo')" :style="{ animationDelay: '0.4s' }" :key="5">
          您是: <img :src="getAvatar(user!.avatar || '')" class="avatar">{{ user!.name }}
        </div>
      </transition-group>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { User, Document, ChatDotRound, Key } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { getAvatar } from '@/utils/getAvatar'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const user = computed(() => authStore.getUser())
const isLoggedIn = computed(() => authStore.isLoggedIn())

const restart = () => {
  router.replace({ name: 'welcome' })
}

const navigateTo = (path: string) => {
  router.push(path)
}

const isLinkActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  padding: 0 48px;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: 600;
}

.logo-text {
  font-weight: 600;
  font-size: 1.5rem;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo-text:hover {
  transform: scale(1.05);
  text-shadow: 0 0 10px rgba(236, 106, 173, 0.5);
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(52, 148, 230, 0.15);
}

.nav-link.active {
  color: #ffffff;
  background: rgba(52, 148, 230, 0.2);
  font-weight: 500;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
}

.avatar {
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

/* 动画效果 */
.fade-down-enter-active {
  transition: all 0.6s ease;
  animation: fadeInDown 0.6s ease forwards;
}

.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 20px;
  }

  .nav-links {
    gap: 16px;
  }

  .nav-link {
    padding: 8px 12px;
  }

  .logo-text {
    display: none;
  }
}
</style>
