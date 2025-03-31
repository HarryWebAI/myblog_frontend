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
            <div class="header-left">
              <h3 class="modal-title">{{ blog?.title }}</h3>
              <el-switch v-if="authStore.isSuperuser() && blog" v-model="blog.is_top"
                :active-text="blog.is_top ? '已置顶' : '置顶'" :class="{ 'is-top': blog.is_top }" @change="handleToggleTop"
                class="top-switch" />
              <el-button v-if="authStore.isSuperuser() && blog" type="primary" size="small" @click="handleEdit"
                class="edit-btn">
                <el-icon>
                  <Edit />
                </el-icon>
                编辑
              </el-button>
            </div>
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
                <span class="blog-date">{{ formatDate(blog.created_at) }}</span>
                <div class="blog-stats">
                  <span><el-icon>
                      <View />
                    </el-icon> {{ blog.view_count }}</span>
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
                <div class="content-divider"></div>
                <div class="blog-full-content" v-html="blog.content"></div>
                <BlogComment :blog="blog" :current-reply-to="currentReplyTo" @submit="handleCommentSubmit"
                  @reply="handleReply" @delete="handleCommentDelete" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { View, ChatDotRound, Close, Edit } from '@element-plus/icons-vue'
import useBlog from '@/hooks/useBlog'
import { ElMessage } from 'element-plus'
import BlogComment from './BlogComment.vue'
import type { Comment } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const { blog, getBlog, loading, submitComment, deleteComment, toggleBlogTop } = useBlog()
const authStore = useAuthStore()
const router = useRouter()

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
  if (comment) {
    nextTick(() => {
      const commentForm = document.querySelector('.comment-form')
      if (commentForm) {
        commentForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // 自动聚焦到文本域
        const textarea = document.querySelector('.comment-form textarea') as HTMLTextAreaElement
        if (textarea) {
          textarea.focus()
        }
      }
    })
  }
}

// 处理评论删除
const handleCommentDelete = async (commentId: number) => {
  try {
    const success = await deleteComment(commentId)
    if (success && blog.value) {
      // 删除成功后重新获取博客详情以更新评论列表
      await getBlog(blog.value.id)
      // 滚动到评论输入框
      nextTick(() => {
        const commentForm = document.querySelector('.comment-form')
        if (commentForm) {
          commentForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    }
  } catch (error) {
    console.error('删除评论失败:', error)
  }
}

// 处理博客置顶
const handleToggleTop = async () => {
  if (!blog.value) return
  try {
    await toggleBlogTop(blog.value.id)
  } catch (error: unknown) {
    const err = error as { message?: string }
    ElMessage.error(err.message || '操作失败')
    // 如果操作失败，恢复开关状态
    blog.value.is_top = !blog.value.is_top
  }
}

// 处理编辑按钮点击
const handleEdit = () => {
  if (blog.value) {
    router.push({ name: 'editblog', params: { id: blog.value.id } })
  }
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

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
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

.top-switch {
  margin-left: 8px;
}

.top-switch :deep(.el-switch__label) {
  color: #888;
  font-weight: 300;
  transition: all 0.3s ease;
}

.top-switch.is-top :deep(.el-switch__label) {
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 600;
}

.top-switch :deep(.el-switch__core) {
  border-color: rgba(52, 148, 230, 0.3);
  background: rgba(52, 148, 230, 0.1);
}

.top-switch :deep(.el-switch.is-checked .el-switch__core) {
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  border-color: transparent;
}

.edit-btn {
  margin-left: 8px;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  border: none;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 148, 230, 0.3);
}

.edit-btn .el-icon {
  margin-right: 4px;
}

/* 弹窗内容区域 */
.modal-body {
  flex: 1;
  overflow-y: auto;
  color: #fff;
  padding-right: 6px;
  /* 为滚动条预留空间 */
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px 0;
}

.modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
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

.content-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(60, 60, 70, 0.5), transparent);
  margin: 24px 0;
}

.blog-full-content {
  font-size: 16px;
  line-height: 1.8;
  color: #ccc;
}

/* 富文本内容样式 */
.blog-full-content :deep(p) {
  margin-bottom: 1em;
}

.blog-full-content :deep(h1),
.blog-full-content :deep(h2),
.blog-full-content :deep(h3),
.blog-full-content :deep(h4),
.blog-full-content :deep(h5),
.blog-full-content :deep(h6) {
  color: #fff;
  margin: 1.5em 0 0.8em;
  font-weight: 600;
}

.blog-full-content :deep(h1) {
  font-size: 2em;
}

.blog-full-content :deep(h2) {
  font-size: 1.75em;
}

.blog-full-content :deep(h3) {
  font-size: 1.5em;
}

.blog-full-content :deep(h4) {
  font-size: 1.25em;
}

.blog-full-content :deep(h5) {
  font-size: 1.1em;
}

.blog-full-content :deep(h6) {
  font-size: 1em;
}

.blog-full-content :deep(ul),
.blog-full-content :deep(ol) {
  padding-left: 2em;
  margin-bottom: 1em;
}

.blog-full-content :deep(li) {
  margin-bottom: 0.5em;
}

.blog-full-content :deep(blockquote) {
  border-left: 4px solid #3494e6;
  margin: 1em 0;
  padding: 0.5em 1em;
  background: rgba(52, 148, 230, 0.1);
  color: #ddd;
}

.blog-full-content :deep(code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.blog-full-content :deep(pre) {
  background: rgba(0, 0, 0, 0.2);
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1em 0;
}

.blog-full-content :deep(pre code) {
  background: none;
  padding: 0;
}

.blog-full-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 1em 0;
}

.blog-full-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.blog-full-content :deep(th),
.blog-full-content :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5em;
  text-align: left;
}

.blog-full-content :deep(th) {
  background: rgba(255, 255, 255, 0.05);
}

.blog-full-content :deep(a) {
  color: #3494e6;
  text-decoration: none;
  transition: color 0.3s;
}

.blog-full-content :deep(a:hover) {
  color: #ec6ead;
}

.blog-full-content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 2em 0;
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
