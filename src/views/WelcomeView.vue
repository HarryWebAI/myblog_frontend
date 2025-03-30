<template>
  <div class="welcome-container">
    <transition name="fade-down" appear>
      <h1 class="name">{{ welcome.title }}</h1>
    </transition>

    <transition-group name="fade-up" appear tag="div" class="motto-group">
      <div class="motto" v-for="(description, index) in welcome.descriptions" :key="description.id">
        <span class="motto-item">{{ description.content }}</span>
        <span class="motto-divider" v-if="index !== welcome.descriptions.length - 1">·</span>
      </div>
    </transition-group>

    <transition name="fade-up" appear>
      <button class="explore-btn" @click="handleExplore" v-if="welcome.buttonText">
        <el-icon class="icon">
          <Compass />
        </el-icon>
        {{ welcome.buttonText }}
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { Compass } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import useWelcome from '@/hooks/useWelcome'
import { onMounted } from 'vue'
const router = useRouter()

const { welcome, getWelcome } = useWelcome()
const handleExplore = () => {
  router.replace({ name: 'home' })
}

onMounted(() => {
  getWelcome()
})
</script>

<style scoped>
.welcome-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffffff;
}

.name {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.motto {
  font-size: 1.5rem;
  margin-bottom: 3rem;
}

.motto-item {
  opacity: 0.9;
}

.motto-divider {
  margin: 0 1rem;
  opacity: 0.5;
}

.explore-btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 30px;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.explore-btn:hover {
  transform: translateY(-3px);
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

.motto-group {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
