<template>
  <div class="board-container">
    <!-- 加载遮罩层 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <el-icon class="loading-icon">
          <Loading />
        </el-icon>
        <p class="loading-text">正在加载, 请稍后...</p>
      </div>
    </div>

    <div v-if="!loading" class="message-list">
      <div v-if="messages.length === 0" class="empty-state">
        <el-empty description="暂无留言" />
      </div>
      <div v-else>
        <div v-for="message in messages" :key="message.id" class="message-card">
          <!-- 主留言 -->
          <div class="message-content">
            <div class="message-header">
              <div class="user-info">
                <el-avatar :size="40" :src="message.user.avatar_url" />
                <div class="user-details">
                  <div class="user-meta">
                    <span class="username">{{ message.user.name }}</span>
                    <el-button v-if="canDeleteMessage(message)" type="danger" text size="small"
                      @click="handleDelete(message)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </el-button>
                  </div>
                  <span class="time">{{ formatTime(message.time) }}</span>
                </div>
              </div>
              <el-button type="primary" text @click="handleReply(message)">
                <el-icon>
                  <ChatDotRound />
                </el-icon>
                回复
              </el-button>
            </div>
            <div class="message-body">
              {{ message.content }}
            </div>
          </div>

          <!-- 回复列表 -->
          <div v-if="message.replies && message.replies.length > 0" class="replies-container">
            <div v-for="reply in message.replies" :key="reply.id" class="reply-item">
              <div class="reply-content">
                <div class="reply-header">
                  <div class="user-info">
                    <el-avatar :size="32" :src="getAvatar(reply.user.avatar_url || '')" />
                    <div class="user-details">
                      <div class="user-meta">
                        <span class="username">{{ reply.user.name }}</span>
                        <el-button v-if="canDeleteReply(reply)" type="danger" text size="small"
                          @click="handleDeleteReply(message, reply)">
                          <el-icon>
                            <Delete />
                          </el-icon>
                        </el-button>
                      </div>
                      <span class="time">{{ formatTime(reply.time) }}</span>
                    </div>
                  </div>
                  <el-button type="primary" text size="small" @click="handleReply(message, reply)">
                    <el-icon>
                      <ChatDotRound />
                    </el-icon>
                    回复
                  </el-button>
                </div>
                <div class="reply-body">
                  <template v-if="reply.reply_to">
                    <span class="reply-to">@{{ reply.reply_to }}</span>
                  </template>
                  {{ reply.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && total > 0" class="pagination-wrapper">
      <div class="pagination-container">
        <el-pagination key="pagination" v-model:current-page="currentPage" :total="total" :page-size="3"
          layout="prev, pager, next" @current-change="handleCurrentChange" />
      </div>
    </div>

    <CreateReply v-if="currentMessage" v-model="showReplyDialog" :message="currentMessage"
      :parent-reply="currentParentReply" @submit="handleReplySubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChatDotRound, Delete, Loading } from '@element-plus/icons-vue'
import type { Message, Reply } from '@/types'
import CreateReply from './CreateReply.vue'
import useMsgBoard from '@/hooks/useMsgBoard'
import { getAvatar } from '@/utils/getAvatar'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

interface ReplyForm {
  content: string
}

const authStore = useAuthStore()
const { messages, loading, total, getMessages, createReply, deleteMessage, deleteReply } = useMsgBoard()
const currentPage = ref(1)

const showReplyDialog = ref(false)
const currentMessage = ref<Message | null>(null)
const currentParentReply = ref<Reply | undefined>(undefined)

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleReply = (message: Message, parentReply?: Reply) => {
  currentMessage.value = message
  currentParentReply.value = parentReply
  showReplyDialog.value = true
}

const handleReplySubmit = async (data: ReplyForm) => {
  console.log('handleReplySubmit called:', data)
  if (currentMessage.value) {
    const success = await createReply(
      currentMessage.value.id,
      data.content,
      currentParentReply.value?.id || 0
    )
    if (success) {
      showReplyDialog.value = false
      currentMessage.value = null
      currentParentReply.value = undefined
    }
  }
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getMessages(val)
}

// 判断是否可以删除留言
const canDeleteMessage = (message: Message) => {
  if (!authStore.isLoggedIn()) return false
  return message.user.uid === authStore.user?.uid || authStore.isSuperuser()
}

// 判断是否可以删除回复
const canDeleteReply = (reply: Reply) => {
  if (!authStore.isLoggedIn()) return false
  return reply.user.uid === authStore.user?.uid || authStore.isSuperuser()
}

// 处理删除留言
const handleDelete = async (message: Message) => {
  try {
    await ElMessageBox.confirm('确定要删除这条留言吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const success = await deleteMessage(message.id)
    if (success) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除留言失败:', error)
    }
  }
}

// 处理删除回复
const handleDeleteReply = async (message: Message, reply: Reply) => {
  try {
    await ElMessageBox.confirm('确定要删除这条回复吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const success = await deleteReply(message.id, reply.id)
    if (success) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除回复失败:', error)
    }
  }
}

// 组件挂载时获取留言列表
onMounted(() => {
  getMessages(1)
})
</script>

<style scoped>
.board-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
  /* 隐藏所有滚动条 */
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

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
}

.message-list {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 留言卡片 */
.message-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  transition: transform 0.3s ease;
}

.message-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* 留言头部 */
.message-header {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e0e0e0;
}

.time {
  font-size: 0.9rem;
  color: #b0b0b0;
}

/* 留言内容 */
.message-body {
  font-size: 1rem;
  line-height: 1.6;
  color: #d0d0d0;
  margin-bottom: 15px;
}

/* 回复列表 */
.replies-container {
  margin-left: 60px;
  padding-left: 25px;
  border-left: 2px solid rgba(52, 148, 230, 0.3);
}

.reply-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
}

.reply-content {
  display: flex;
  flex-direction: column;
}

.reply-header {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.reply-body {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #d0d0d0;
}

/* 调整回复按钮样式 */
:deep(.el-button--text) {
  padding: 0;
  height: auto;
  font-size: 0.9rem;
  margin-top: 2px;
}

:deep(.el-button--text .el-icon) {
  margin-right: 4px;
  font-size: 1rem;
}

.reply-to {
  color: #ec6ead;
  font-weight: 500;
  margin-right: 8px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .message-card {
    padding: 20px;
  }

  .replies-container {
    margin-left: 40px;
    padding-left: 20px;
  }

  .reply-item {
    padding: 15px;
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.pagination-container {
  position: relative;
}

/* 分页样式 */
:deep(.el-pagination) {
  --el-pagination-button-color: #ffffff;
  --el-pagination-hover-color: #3494e6;
  --el-pagination-active-color: #3494e6;
}

:deep(.el-pagination .el-pager li) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin: 0 4px;
  transition: all 0.3s ease;
}

:deep(.el-pagination .el-pager li:hover) {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

:deep(.el-pagination .el-pager li.active) {
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 148, 230, 0.3);
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  transition: all 0.3s ease;
}

:deep(.el-pagination .btn-prev:hover),
:deep(.el-pagination .btn-next:hover) {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

:deep(.el-pagination .btn-prev:disabled),
:deep(.el-pagination .btn-next:disabled) {
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.3);
}

.message-actions,
.reply-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
