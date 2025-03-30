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
        show-word-limit resize="none" ref="commentInput" />
      <div class="form-actions">
        <el-button type="primary" @click="handleSubmit" :loading="submitting" :disabled="!commentContent.trim()">
          发表评论
        </el-button>
      </div>
    </div>
    <div v-else class="login-tip">
      请 <el-button type="primary" link @click="handleLogin">登录</el-button> 后发表评论
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
          </div>
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
import { ElMessage } from 'element-plus'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import type { Blog, Comment, User } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { getAvatar } from '@/utils/getAvatar'

const props = defineProps<{
  blog: Blog
  currentReplyTo: Comment | null
}>()

const emit = defineEmits<{
  (e: 'submit', content: string, parentId?: number | null): void
  (e: 'reply', comment: Comment | null): void
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

// 处理登录
const handleLogin = () => {
  // 这里可以触发登录流程
  ElMessage.info('请先登录')
}

// 处理取消回复
const handleCancelReply = () => {
  emit('reply', null)
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
  margin-top: 20px;
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
</style>
