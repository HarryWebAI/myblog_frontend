<template>
  <div class="blog-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="blog-loading">
      <div class="loading-spinner"></div>
    </div>

    <!-- 博客列表 -->
    <template v-else>
      <div v-if="blogs.length === 0" class="blog-empty">
        <div class="empty-icon">📄</div>
        <div class="empty-text">暂无博客内容</div>
      </div>

      <div v-else class="blog-list">
        <!-- 置顶文章 -->
        <div v-for="blog in topBlogs" :key="'top-' + blog.id" class="blog-item top-blog">
          <div class="top-badge">置顶</div>
          <div class="blog-header">
            <h2 class="blog-title">{{ blog.title }}</h2>
            <div class="blog-meta">
              <span class="blog-category">{{ blog.category.name }}</span>
              <span class="blog-date">{{ formatDate(blog.published_at) }}</span>
            </div>
          </div>
          <p class="blog-summary">{{ blog.summary }}</p>
          <div class="blog-footer">
            <div class="blog-tags">
              <span v-for="tag in blog.tags.slice(0, 4)" :key="tag.id" class="tag">{{ tag.name }}</span>
            </div>
            <div class="blog-stats">
              <span><i class="far fa-eye"></i> {{ blog.view_count }}</span>
              <span><i class="far fa-heart"></i> {{ blog.like_count }}</span>
              <span><i class="far fa-comment"></i> {{ blog.comment_count }}</span>
            </div>
          </div>
        </div>

        <!-- 普通文章 -->
        <div v-for="blog in normalBlogs" :key="blog.id" class="blog-item">
          <div class="blog-header">
            <h2 class="blog-title">{{ blog.title }}</h2>
            <div class="blog-meta">
              <span class="blog-category">{{ blog.category.name }}</span>
              <span class="blog-date">{{ formatDate(blog.published_at) }}</span>
            </div>
          </div>
          <p class="blog-summary">{{ blog.summary }}</p>
          <div class="blog-footer">
            <div class="blog-tags">
              <span v-for="tag in blog.tags.slice(0, 4)" :key="tag.id" class="tag">{{ tag.name }}</span>
            </div>
            <div class="blog-stats">
              <span><i class="far fa-eye"></i> {{ blog.view_count }}</span>
              <span><i class="far fa-heart"></i> {{ blog.like_count }}</span>
              <span><i class="far fa-comment"></i> {{ blog.comment_count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="blog-pagination">
        <button class="btn-page" :disabled="!prevPage" @click="loadPrevPage">
          上一页
        </button>
        <span class="pagination-info">{{ currentPage }} / {{ Math.ceil(total / 10) }}</span>
        <button class="btn-page" :disabled="!nextPage" @click="loadNextPage">
          下一页
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import useBlog from '@/hooks/useBlog'

const { blogs, total, loading, getBlogs, nextPage, prevPage } = useBlog()
const currentPage = ref(1)

// 分离置顶和普通博客
const topBlogs = computed(() => blogs.value.filter(blog => blog.is_top))
const normalBlogs = computed(() => blogs.value.filter(blog => !blog.is_top))

onMounted(() => {
  getBlogs()
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Intl.DateTimeFormat('zh-CN', options).format(date)
}

// 加载上一页
const loadPrevPage = () => {
  if (prevPage.value) {
    getBlogs(prevPage.value)
    currentPage.value--
  }
}

// 加载下一页
const loadNextPage = () => {
  if (nextPage.value) {
    getBlogs(nextPage.value)
    currentPage.value++
  }
}
</script>

<style scoped>
.blog-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
}

/* 加载状态 */
.blog-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #3494e6;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 空状态 */
.blog-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #888;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 博客列表 */
.blog-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.blog-item {
  position: relative;
  padding: 20px 24px;
  border-radius: 8px;
  background: rgba(30, 30, 40, 0.4);
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.blog-item:hover {
  background: rgba(40, 40, 50, 0.6);
  transform: translateX(5px);
  border-left-color: #3494e6;
}

.top-blog {
  background: rgba(40, 40, 60, 0.5);
  border-left: 3px solid #ec6ead;
}

.top-blog:hover {
  background: rgba(50, 50, 70, 0.7);
  border-left-color: #ec6ead;
}

.top-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 3px 8px;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: 500;
}

/* 博客标题和摘要 */
.blog-header {
  margin-bottom: 12px;
}

.blog-title {
  font-size: 20px;
  color: #fff;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.blog-meta {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #aaa;
}

.blog-category {
  color: #3494e6;
  font-weight: 500;
}

.blog-summary {
  color: #ccc;
  font-size: 15px;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 博客底部 */
.blog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 12px;
  color: #ccc;
  transition: all 0.2s ease;
}

.tag:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.blog-stats {
  display: flex;
  gap: 16px;
  color: #888;
  font-size: 14px;
}

/* 分页 */
.blog-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  padding: 16px 0;
  gap: 16px;
}

.btn-page {
  padding: 8px 16px;
  background: rgba(40, 40, 50, 0.5);
  border: none;
  border-radius: 4px;
  color: #ccc;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-page:hover:not(:disabled) {
  background: rgba(60, 60, 70, 0.7);
  color: white;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #aaa;
  font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .blog-stats {
    display: none;
  }

  .blog-footer {
    justify-content: flex-start;
  }

  .blog-item {
    padding: 16px;
  }

  .blog-title {
    font-size: 18px;
  }
}
</style>
