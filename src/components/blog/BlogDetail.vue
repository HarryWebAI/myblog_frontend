<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="blog-detail-modal">
        <!-- 自定义遮罩层 -->
        <div class="modal-overlay" @click="handleClose"></div>

        <!-- 弹窗容器 -->
        <div class="modal-container">
          <!-- 弹窗头部 -->
          <div class="modal-header">
            <h3 class="modal-title">{{ blog?.title }}</h3>
            <button @click="handleClose" class="close-btn">
              <el-icon>
                <Close />
              </el-icon>
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="modal-body">
            <div v-if="loading" class="loading-container">
              <el-skeleton :rows="10" animated />
            </div>
            <div v-else-if="blog" class="blog-detail-content">
              <div class="blog-meta">
                <span class="blog-category">{{ blog.category.name }}</span>
                <span class="blog-date">{{ formatDate(blog.published_at) }}</span>
                <div class="blog-stats">
                  <span><el-icon>
                      <View />
                    </el-icon> {{ blog.view_count }}</span>
                  <span><el-icon>
                      <Star />
                    </el-icon> {{ blog.like_count }}</span>
                  <span><el-icon>
                      <ChatDotRound />
                    </el-icon> {{ blog.comment_count }}</span>
                </div>
              </div>

              <div class="blog-tags">
                <el-tag v-for="tag in blog.tags" :key="tag.id" effect="dark" class="blog-tag">
                  {{ tag.name }}
                </el-tag>
              </div>

              <div class="blog-content">
                <p class="blog-summary">{{ blog.summary }}</p>
                <div class="content-divider"></div>
                <div class="blog-full-content">
                  {{ blog.content }}
                </div>
                <BlogComment :blog="blog" :current-reply-to="currentReplyTo" @submit="handleCommentSubmit"
                  @reply="handleReply" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { View, Star, ChatDotRound, Close } from '@element-plus/icons-vue'
import useBlog from '@/hooks/useBlog'
import { ElMessage } from 'element-plus'
import BlogComment from './BlogComment.vue'
import type { Comment } from '@/types'

const { blog, getBlog, loading, submitComment } = useBlog()

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible'])

// 当前正在回复的评论
const currentReplyTo = ref<Comment | null>(null)

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
  // 关闭弹窗时清除回复状态
  currentReplyTo.value = null
}

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

// 处理评论提交
const handleCommentSubmit = async (content: string, parentId?: number | null) => {
  try {
    await submitComment(blog.value?.id || 0, content, parentId)
    currentReplyTo.value = null
  } catch (error) {
    console.error('评论提交失败:', error)
  }
}

// 处理回复
const handleReply = (comment: Comment | null) => {
  currentReplyTo.value = comment
}

onMounted(async () => {
  if (props.id) {
    try {
      await getBlog(props.id)
    } catch {
      ElMessage.error('获取博客详情失败')
    }
  }
})
</script>

<style scoped>
/* 弹窗基础样式 */
.blog-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 遮罩层 */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}

/* 弹窗容器 */
.modal-container {
  position: relative;
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  background-color: rgb(22, 24, 35);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(60, 60, 70, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

/* 弹窗头部 */
.modal-header {
  padding: 16px 24px;
  background: linear-gradient(to right, rgb(22, 24, 35), rgba(30, 32, 45, 0.95));
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(60, 60, 70, 0.5);
  flex-shrink: 0;
}

.modal-title {
  margin: 0;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.close-btn {
  background: #3494e6;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background: #ec6ead;
}

/* 弹窗内容区域 */
.modal-body {
  flex: 1;
  overflow-y: auto;
  color: #fff;
  scrollbar-width: thin;
  scrollbar-color: rgba(60, 60, 70, 0.5) transparent;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background-color: rgba(60, 60, 70, 0.5);
  border-radius: 3px;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 博客内容样式 */
.blog-detail-content {
  padding: 24px 30px;
  max-width: 900px;
  margin: 0 auto;
}

.blog-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #aaa;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.blog-category {
  color: #3494e6;
  font-weight: 500;
}

.blog-stats {
  display: flex;
  gap: 16px;
  margin-left: auto;
}

.blog-stats span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.blog-tags {
  margin-bottom: 24px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.blog-tag {
  background: rgba(52, 148, 230, 0.2);
  border: none;
  padding: 6px 12px;
  transition: all 0.3s;
}

.blog-tag:hover {
  transform: translateY(-2px);
  background: rgba(52, 148, 230, 0.3);
}

.blog-summary {
  font-size: 18px;
  line-height: 1.6;
  color: #ddd;
  margin-bottom: 24px;
  font-weight: 500;
  padding: 16px;
  background: rgba(40, 40, 50, 0.3);
  border-radius: 8px;
  border-left: 3px solid #3494e6;
}

.content-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(60, 60, 70, 0.5), transparent);
  margin: 24px 0;
}

.blog-full-content {
  font-size: 16px;
  line-height: 1.8;
  color: #ccc;
  white-space: pre-wrap;
}

.loading-container {
  padding: 24px 30px;
  max-width: 900px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .blog-detail-content {
    padding: 16px;
  }

  .blog-stats {
    margin-left: 0;
    margin-top: 12px;
    width: 100%;
  }

  .modal-container {
    width: 95%;
    height: 95vh;
  }
}
</style>
