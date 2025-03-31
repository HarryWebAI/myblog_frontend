<template>
  <div class="blog-comment">
    <!-- 自定义提示组件 -->
    <transition name="fade">
      <div v-if="showSuccessTip" class="success-tip">
        <el-icon>
          <CircleCheckFilled />
        </el-icon>
        <span>评论发表成功</span>
      </div>
    </transition>

    <!-- 评论表单 -->
    <div v-if="isLoggedIn" class="comment-form">
      <!-- 回复提示 -->
      <div v-if="currentReplyTo" class="reply-tip">
        正在回复 @{{ currentReplyTo.user?.name || '匿名用户' }}
        <el-button type="primary" link @click="handleCancelReply">
          取消回复
        </el-button>
      </div>
      <el-input v-model="commentContent" type="textarea" :rows="3" placeholder="写下你的评论..." :maxlength="500"
        show-word-limit resize="none" ref="commentInput" style="
          --el-input-bg-color: rgba(35, 37, 50, 0.8);
          --el-input-border-color: rgba(60, 60, 70, 0.5);
          --el-input-text-color: #e1e1e1;
          --el-input-hover-border-color: #3494e6;
          --el-input-focus-border-color: #3494e6;
        " />
      <div class="form-actions">
        <el-button type="primary" @click="handleSubmit" :loading="submitting" :disabled="!commentContent.trim()">
          发表评论
        </el-button>
      </div>
    </div>
    <div v-else class="login-tip" style="height: 60px;">
      请 <el-button type="primary" link @click="router.push({ name: 'login' })">登录</el-button> 后发表评论
    </div>

    <!-- 提示组件 -->
    <div v-show="showTip" :class="['tip-message', tipType]">
      <el-icon>
        <component :is="tipIcon" />
      </el-icon>
      <span>{{ tipMessage }}</span>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div v-if="blog?.comments?.length" class="comments-container">
        <div v-for="comment in blog.comments" :key="comment.id" class="comment-item">
          <!-- 主评论 -->
          <div class="comment-content">
            <div class="comment-header">
              <div class="user-info">
                <el-avatar :size="40" :src="getAvatar(comment.user.avatar_url || '')">
                  {{ getUserInitials(comment.user) }}

                </el-avatar>
                <div class="user-details">
                  <span class="username">{{ comment.user?.name || '匿名用户' }}</span>
                  <span class="time">{{ formatDate(comment.time) }}</span>
                </div>
              </div>
            </div>
            <div class="comment-text">
              <template v-if="comment.reply_to">
                <span class="reply-to">@{{ comment.reply_to }}</span>
              </template>
              {{ comment.content }}
            </div>
          </div>

          <!-- 回复按钮 -->
          <div class="comment-actions">
            <el-button type="primary" link @click="handleReply(comment)" :disabled="!isLoggedIn">
              回复
            </el-button>
            <el-button v-if="canDeleteComment(comment)" type="danger" link @click="showDeleteConfirm(comment)">
              删除
            </el-button>
          </div>

          <!-- 删除确认层 -->
          <transition name="slide-fade">
            <div v-if="deleteConfirmComment?.id === comment.id" class="delete-confirm">
              <div class="delete-content">
                <el-icon class="warning-icon">
                  <Warning />
                </el-icon>
                <div class="delete-text">
                  <p>确定要删除这条评论吗?</p>
                  <p class="sub-text">此操作不可恢复</p>
                </div>
                <div class="delete-actions">
                  <el-button type="default" link @click="cancelDelete">
                    取消
                  </el-button>
                  <el-button type="danger" @click="confirmDelete">
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div v-else class="no-comments">
        暂无评论，快来抢沙发吧！
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { CircleCheckFilled, Warning } from '@element-plus/icons-vue'
import type { Blog, Comment, User } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { getAvatar } from '@/utils/getAvatar'
import { useRouter } from 'vue-router'

const props = defineProps<{
  blog: Blog
  currentReplyTo: Comment | null
}>()

const emit = defineEmits<{
  (e: 'submit', content: string, parentId?: number | null): void
  (e: 'reply', comment: Comment | null): void
  (e: 'delete', commentId: number): void
}>()

const authStore = useAuthStore()
const commentContent = ref('')
const submitting = ref(false)
const commentInput = ref<HTMLElement | null>(null)
const showSuccessTip = ref(false)
const showTip = ref(false)
const tipMessage = ref('')
const tipType = ref<'success' | 'error'>('success')
const tipIcon = ref('CircleCheckFilled')
const router = useRouter()

// 计算属性
const isLoggedIn = computed(() => authStore.isLoggedIn())

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Intl.DateTimeFormat('zh-CN', options).format(date)
}


// 获取用户首字母
const getUserInitials = (user: User) => {
  if (!user?.name) return '?'
  return user.name.charAt(0).toUpperCase()
}

// 处理回复
const handleReply = (comment: Comment) => {
  emit('reply', comment)
  // 滚动到输入框
  nextTick(() => {
    const commentForm = document.querySelector('.comment-form')
    if (commentForm) {
      commentForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

// 显示提示
const showTipMessage = (message: string, type: 'success' | 'error') => {
  tipMessage.value = message
  tipType.value = type
  tipIcon.value = type === 'success' ? 'CircleCheckFilled' : 'CircleCloseFilled'
  showTip.value = true
  setTimeout(() => {
    showTip.value = false
  }, 3000)
}

// 处理提交
const handleSubmit = async () => {
  const trimmedContent = commentContent.value.trim()
  if (!trimmedContent) return

  // 验证评论长度
  if (trimmedContent.length < 10) {
    showTipMessage('评论内容不能少于10个字', 'error')
    return
  }

  submitting.value = true
  try {
    await emit('submit', trimmedContent, props.currentReplyTo?.id || null)
    commentContent.value = ''
    showTipMessage('评论发表成功', 'success')
  } catch {
    showTipMessage('评论发表失败', 'error')
  } finally {
    submitting.value = false
  }
}

// 处理取消回复
const handleCancelReply = () => {
  emit('reply', null)
}

// 判断是否可以删除评论
const canDeleteComment = (comment: Comment) => {
  const currentUser = authStore.user
  if (!currentUser) return false

  // 超级管理员可以删除任何评论
  if (currentUser.is_superuser) return true

  // 评论作者可以删除自己的评论
  return currentUser.uid === comment.user.uid
}

// 删除确认相关
const deleteConfirmComment = ref<Comment | null>(null)

// 显示删除确认
const showDeleteConfirm = (comment: Comment) => {
  deleteConfirmComment.value = comment
}

// 取消删除
const cancelDelete = () => {
  deleteConfirmComment.value = null
}

// 确认删除
const confirmDelete = async () => {
  if (!deleteConfirmComment.value) return

  try {
    await emit('delete', deleteConfirmComment.value.id)
    showTipMessage('评论删除成功', 'success')
    deleteConfirmComment.value = null
  } catch {
    showTipMessage('评论删除失败', 'error')
  }
}
</script>

<style scoped>
.blog-comment {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(60, 60, 70, 0.3);
}

.comment-list {
  margin-bottom: 30px;
}

.comment-item {
  position: relative;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(40, 40, 50, 0.3);
  border-radius: 8px;
  transition: all 0.3s;
}

.comment-item:hover {
  background: rgba(40, 40, 50, 0.5);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 500;
  color: #fff;
}

.time {
  font-size: 12px;
  color: #aaa;
}

.comment-text {
  color: #ddd;
  line-height: 1.6;
  margin-bottom: 12px;
}

.reply-to {
  color: #3494e6;
  margin-right: 8px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.comment-form {
  margin-top: 24px;
}

.comment-form :deep(.el-textarea__inner) {
  background-color: rgba(35, 37, 50, 0.8);
  border: 1px solid rgba(60, 60, 70, 0.5);
  color: #e1e1e1;
}

.comment-form :deep(.el-textarea__inner:focus) {
  background-color: rgba(40, 42, 55, 0.9);
  border-color: #3494e6;
}

.comment-form :deep(.el-input__count) {
  background-color: transparent;
  color: #888;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.no-comments {
  text-align: center;
  color: #aaa;
  padding: 40px 0;
}

.login-tip {
  text-align: center;
  color: #aaa;
  margin-top: 20px;
}

.reply-tip {
  margin-bottom: 12px;
  padding: 8px 12px;
  background: rgba(52, 148, 230, 0.1);
  border-radius: 4px;
  color: #3494e6;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 768px) {
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

.success-tip {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(52, 148, 230, 0.9);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}

.success-tip .el-icon {
  font-size: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.tip-message {
  margin: 16px 0;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.tip-message.success {
  background: rgba(67, 160, 71, 0.1);
  color: #4caf50;
  border: 1px solid rgba(67, 160, 71, 0.2);
}

.tip-message.error {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.tip-message .el-icon {
  font-size: 18px;
}

.delete-confirm {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(22, 24, 35, 0.95);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 1;
}

.delete-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  text-align: center;
}

.warning-icon {
  font-size: 48px;
  color: #f56c6c;
}

.delete-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.delete-text p {
  margin: 0;
  color: #fff;
  font-size: 16px;
}

.delete-text .sub-text {
  color: #aaa;
  font-size: 14px;
}

.delete-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
