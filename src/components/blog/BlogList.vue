<template>
  <div class="blog-container">
    <!-- 加载遮罩层 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <el-icon class="loading-icon">
          <Loading />
        </el-icon>
        <p class="loading-text">正在加载, 请稍后...</p>
      </div>
    </div>

    <!-- 博客列表 -->
    <template v-else>
      <div v-if="blogs.length === 0" class="blog-empty">
        <div class="empty-text">暂无博客内容</div>
        <div class="subtitle">待博主发布第一篇博客...</div>
      </div>

      <div v-else class="blog-list">
        <!-- 置顶文章 -->
        <div v-for="blog in topBlogs" :key="'top-' + blog.id" class="blog-item top-blog" @click="openBlogDetail(blog)">
          <div class="top-badge">置顶</div>
          <div class="blog-header">
            <h2 class="blog-title">{{ blog.title }}</h2>
            <div class="blog-meta">
              <span class="blog-category">{{ blog.category.name }}</span>
              <span class="blog-date">{{ formatDate(blog.created_at) }}</span>
            </div>
          </div>
          <p class="blog-summary">{{ blog.summary }}</p>
          <div class="blog-footer">
            <div class="blog-tags">
              <span v-for="tag in blog.tags.slice(0, 4)" :key="tag.id" class="tag">{{ tag.name }}</span>
            </div>
            <div class="blog-stats">
              <span><el-icon>
                  <View />
                </el-icon> {{ blog.view_count }}</span>
              <span><el-icon>
                  <ChatDotRound />
                </el-icon> {{ blog.comment_count }}</span>
              <el-button v-if="authStore.isSuperuser()" type="danger" :icon="Delete" circle size="small"
                @click="handleDeleteBlog(blog, $event)" class="delete-btn" />
            </div>
          </div>
        </div>

        <!-- 普通文章 -->
        <div v-for="blog in normalBlogs" :key="blog.id" class="blog-item" @click="openBlogDetail(blog)">
          <div class="blog-header">
            <h2 class="blog-title">{{ blog.title }}</h2>
            <div class="blog-meta">
              <span class="blog-category">{{ blog.category.name }}</span>
              <span class="blog-date">{{ formatDate(blog.created_at) }}</span>
            </div>
          </div>
          <p class="blog-summary">{{ blog.summary }}</p>
          <div class="blog-footer">
            <div class="blog-tags">
              <span v-for="tag in blog.tags.slice(0, 4)" :key="tag.id" class="tag">{{ tag.name }}</span>
            </div>
            <div class="blog-stats">
              <span><el-icon>
                  <View />
                </el-icon> {{ blog.view_count }}</span>
              <span><el-icon>
                  <ChatDotRound />
                </el-icon> {{ blog.comment_count }}</span>
              <el-button v-if="authStore.isSuperuser()" type="danger" :icon="Delete" circle size="small"
                @click="handleDeleteBlog(blog, $event)" class="delete-btn" />
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="blog-pagination" v-if="total > 6">
        <button class="btn-page" :disabled="!prevPage" @click="loadPrevPage">
          上一页
        </button>
        <span class="pagination-info">{{ currentPage }} / {{ Math.ceil(total / 6) }}</span>
        <button class="btn-page" :disabled="!nextPage" @click="loadNextPage">
          下一页
        </button>
      </div>
    </template>

    <!-- 博客详情弹窗 -->
    <BlogDetail v-if="selectedBlogId" :id="selectedBlogId" v-model:visible="showBlogDetail"
      @update:visible="closeBlogDetail" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import useBlog from '@/hooks/useBlog'
import { View, ChatDotRound, Loading, Delete } from '@element-plus/icons-vue'
import BlogDetail from './BlogDetail.vue'
import type { Blog } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

const { blogs, total, loading, getBlogs, nextPage, prevPage, deleteBlog } = useBlog()
const currentPage = ref(1)
const authStore = useAuthStore()

// 博客详情相关状态
const showBlogDetail = ref(false)
const selectedBlogId = ref<number | null>(null)

// 打开博客详情
const openBlogDetail = (blog: Blog) => {
  selectedBlogId.value = blog.id
  showBlogDetail.value = true
}

// 关闭博客详情
const closeBlogDetail = () => {
  showBlogDetail.value = false
  selectedBlogId.value = null
}

// 处理博客删除
const handleDeleteBlog = async (blog: Blog, event: Event) => {
  event.stopPropagation() // 阻止事件冒泡,避免触发博客详情
  try {
    await ElMessageBox.confirm(
      `确定要删除博客 "${blog.title}" 吗?`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
      }
    )

    await deleteBlog(blog.id)
    ElMessage.success('博客删除成功')
    // 重新加载博客列表
    getBlogs()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除博客失败:', error)
      ElMessage.error('删除博客失败')
    }
  }
}

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
  position: relative;
}

/* 加载遮罩层样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: #fff;
}

.loading-icon {
  font-size: 48px;
  margin-bottom: 20px;
  animation: rotate 2s linear infinite;
}

.loading-text {
  font-size: 18px;
  margin: 0;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

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
  text-align: center;
}

.empty-text {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle {
  font-size: 1rem;
  color: #888;
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
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
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
  align-items: center;
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

.delete-btn {
  margin-left: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.blog-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  transform: scale(1.1);
}
</style>
