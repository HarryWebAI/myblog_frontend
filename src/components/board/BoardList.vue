<template>
  <div class="board-container">
    <div class="message-list">
      <transition name="fade-up" appear>
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="3" animated />
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
      </transition>
    </div>

    <transition name="fade-up" appear>
      <div class="pagination-wrapper">
        <transition-group name="page-fade" tag="div" class="pagination-container">
          <el-pagination key="pagination" v-model:current-page="currentPage" :total="total" :page-size="3"
            layout="prev, pager, next" @current-change="handleCurrentChange" />
        </transition-group>
      </div>
    </transition>

    <CreateReply v-if="currentMessage" v-model="showReplyDialog" :message="currentMessage"
      :parent-reply="currentParentReply" @submit="handleReplySubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ChatDotRound, Delete } from '@element-plus/icons-vue'
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
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 40px;
}

.message-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  overflow-y: auto;
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

/* 留言底部 */
.message-footer {
  display: none;
}

/* 滚动条样式 */
.message-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track {
  background: transparent;
}

.message-list::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .message-list {
    padding: 0 20px;
  }

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

.loading-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.child-replies {
  margin-left: 40px;
  padding-left: 20px;
  border-left: 2px solid rgba(52, 148, 230, 0.2);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
}

.pagination-container {
  position: relative;
}

/* 页面切换动画 */
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

:deep(.el-pagination) {
  --el-pagination-button-color: #ffffff;
  --el-pagination-hover-color: #3494e6;
  --el-pagination-active-color: #3494e6;
}

:deep(.el-pagination .el-pager li) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin: 0 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

/* 页码切换动画 */
.page-fade-move,
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.page-fade-leave-active {
  position: absolute;
}

.message-actions,
.reply-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
