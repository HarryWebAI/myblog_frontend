<template>
  <div class="layout-container">
    <header class="layout-header">
      <HeaderComponent />
    </header>

    <main class="layout-main">
      <router-view />
    </main>

    <footer class="layout-footer">
      <FooterComponent />
    </footer>
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/home/HeaderComponent.vue'
import FooterComponent from '@/components/home/FooterComponent.vue'
</script>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  /* 防止水平滚动条 */
  background: linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%);
}

.layout-header {
  flex: 0 0 64px;
  /* 固定高度 */
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
}

.layout-main {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  /* 只在内容区域显示滚动条 */
  overflow-x: hidden;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  /* 确保flex子元素可以正确滚动 */
  box-sizing: border-box;
  /* 确保padding不会增加元素宽度 */
}

.layout-main::before {
  content: '';
  position: fixed;
  /* 改为fixed确保背景覆盖整个视口 */
  top: 64px;
  /* 头部高度 */
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(52, 148, 230, 0.05), transparent 50%),
    radial-gradient(circle at bottom left, rgba(236, 106, 173, 0.05), transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.layout-footer {
  flex: 0 0 auto;
  /* 高度由内容决定 */
  width: 100%;
  position: sticky;
  bottom: 0;
  z-index: 100;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
}

/* 自定义滚动条样式 */
.layout-main::-webkit-scrollbar {
  width: 6px;
}

.layout-main::-webkit-scrollbar-track {
  background: transparent;
}

.layout-main::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>
