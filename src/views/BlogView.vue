<template>
  <div class="blog-container">
    <CommonHeader title="Newest Blogs" />

    <transition name="fade-up" appear>
      <p class="subtitle">分享技术与生活</p>
    </transition>

    <transition name="fade-up" appear>
      <div class="blog-list">
        <Bloglist />
      </div>
    </transition>

    <transition name="fade-up" appear>
      <div class="pagination-wrapper">
        <PaginationView :total="100" @update:page="handlePageChange" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import Bloglist from '@/components/blog/BlogList.vue'
import PaginationView from '@/components/PaginationView.vue'
import CommonHeader from '@/components/CommonHeader.vue'

const handlePageChange = (page: number) => {
  console.log('页码改变:', page)
  // TODO: 在这里处理页码改变的逻辑
}
</script>

<style scoped>
.blog-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.subtitle {
  font-size: 1.2rem;
  color: #e0e0e0;
  opacity: 0.9;
  text-align: center;
  margin-bottom: 2rem;
}

.blog-list {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 2rem;
  width: 100%;
  position: relative;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

/* 动画效果 */
.fade-up-enter-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: calc(var(--el-transition-duration) * 0.2);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
