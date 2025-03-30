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
  background: transparent;
}

.blog-view-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.blog-view-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}
</style>

<!-- 全局样式 -->
<style>
/* BlogDetail 弹窗样式覆盖 */
.blog-detail-dialog .el-dialog {
  background: rgba(22, 24, 35, 0.95) !important;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(60, 60, 70, 0.3);
  overflow: hidden;
  backdrop-filter: blur(10px);
  max-width: 1200px;
  height: 90vh;
  display: flex;
  flex-direction: column;
}

.blog-detail-dialog .el-dialog__body {
  padding: 0;
  flex: 1;
  overflow-y: auto;
  color: #fff;
  scrollbar-width: thin;
  scrollbar-color: rgba(60, 60, 70, 0.5) transparent;
}

.blog-detail-dialog .el-dialog__header {
  padding: 0;
  margin: 0;
  background: linear-gradient(to right, rgba(22, 24, 30, 1), rgba(30, 32, 45, 0.95));
  border-bottom: 1px solid rgba(60, 60, 70, 0.5);
}

.blog-detail-dialog .custom-header {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blog-detail-dialog .el-overlay {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}

/* 博客详情弹窗滚动条样式 */
.blog-detail-dialog .el-dialog__body::-webkit-scrollbar {
  width: 6px;
}

.blog-detail-dialog .el-dialog__body::-webkit-scrollbar-track {
  background: transparent;
}

.blog-detail-dialog .el-dialog__body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.blog-detail-dialog .el-dialog__body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}
</style>
