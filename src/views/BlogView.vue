<template>
  <div class="blog-view-container">
    <CommonHeader title="Newest Blogs" />

    <div class="subtitle">分享技术与生活</div>

    <div class="blog-content">
      <Bloglist />
    </div>
  </div>
</template>

<script setup lang="ts">
import Bloglist from '@/components/blog/BlogList.vue'
import CommonHeader from '@/components/CommonHeader.vue'
</script>

<style scoped>
.blog-view-container {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  /* 主容器负责滚动 */
  overflow-x: hidden;
  box-sizing: border-box;
}

.subtitle {
  font-size: 1.2rem;
  color: #e0e0e0;
  opacity: 0.9;
  text-align: center;
  margin: 2rem 0;
  flex-shrink: 0;
}

.blog-content {
  flex: 1;
  width: 100%;
  position: relative;
  padding-bottom: 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

/* 滚动条样式 */
.blog-view-container::-webkit-scrollbar {
  width: 6px;
}

.blog-view-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.blog-view-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.blog-view-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
