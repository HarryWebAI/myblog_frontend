<template>
  <div class="message-list">
    <div v-for="message in messages" :key="message.id" class="message-card">
      <!-- 主留言 -->
      <div class="message-content">
        <div class="message-header">
          <div class="user-info">
            <el-avatar :size="40" :src="message.avatar" />
            <div class="user-details">
              <span class="username">{{ message.username }}</span>
              <span class="time">{{ message.time }}</span>
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
                <el-avatar :size="32" :src="reply.avatar" />
                <div class="user-details">
                  <div class="user-meta">
                    <span class="username">{{ reply.username }}</span>
                    <span class="time">{{ reply.time }}</span>
                  </div>
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
              <template v-if="reply.replyTo">
                <span class="reply-to">@{{ getReplyUsername(message.replies, reply.replyTo) }}</span>
              </template>
              {{ reply.content }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <CreateReply v-if="currentMessage" v-model="showReplyDialog" :message="currentMessage"
      :parent-reply="currentParentReply" @submit="handleReplySubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'
import type { Message, Reply } from '@/types'
import CreateReply from './CreateReply.vue'

const messages = ref<Message[]>([
  {
    id: 1,
    username: '张三',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e400bcpng.png',
    time: '2024-03-15 14:30',
    content: '这个博客设计得真不错，特别是配色方案，看起来很舒服！',
    replies: [
      {
        id: 2,
        username: '李四',
        avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9cpng.png',
        time: '2024-03-15 15:00',
        content: '确实，深色主题配上渐变色，视觉效果很棒！'
      },
      {
        id: 6,
        username: '王五',
        avatar: 'https://cube.elemecdn.com/d/e4/dd4d3b7e7f2382d3fdbd74dcc627dcpng.png',
        time: '2024-03-15 15:15',
        content: '特别是那个渐变色按钮，点击效果也很棒！',
        replyTo: 2
      },
      {
        id: 3,
        username: '赵六',
        avatar: 'https://cube.elemecdn.com/3/28/bbf893f792f03d544518b19e49c8fpng.png',
        time: '2024-03-15 15:30',
        content: '动画效果也很流畅，用户体验很好。'
      },
      {
        id: 8,
        username: '博主',
        avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48png.png',
        time: '2024-03-15 15:35',
        content: '感谢支持！我们确实花了很多时间在动画效果上。',
        replyTo: 3
      }
    ]
  },
  {
    id: 4,
    username: '小明',
    avatar: 'https://cube.elemecdn.com/3/28/bbf893f792f03d544518b19e49c8fpng.png',
    time: '2024-03-16 09:15',
    content: '请问这个博客是用什么技术栈开发的？想学习一下。',
    replies: [
      {
        id: 5,
        username: '博主',
        avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48png.png',
        time: '2024-03-16 09:30',
        content: '使用 Vue3 + TypeScript + Element Plus 开发的，欢迎交流学习！'
      },
      {
        id: 9,
        username: '小明',
        avatar: 'https://cube.elemecdn.com/3/28/bbf893f792f03d544518b19e49c8fpng.png',
        time: '2024-03-16 09:35',
        content: '太棒了！我也想学习这些技术，有什么推荐的学习路线吗？',
        replyTo: 5
      }
    ]
  }
])

interface ReplyForm {
  content: string
}

const emit = defineEmits<{
  (e: 'reply', message: Message): void
  (e: 'replySubmit', data: ReplyForm, originalMessage: Message, parentReply?: Reply): void
}>()

const showReplyDialog = ref(false)
const currentMessage = ref<Message | null>(null)
const currentParentReply = ref<Reply | undefined>(undefined)

const handleReply = (message: Message, parentReply?: Reply) => {
  currentMessage.value = message
  currentParentReply.value = parentReply
  showReplyDialog.value = true
}

const handleReplySubmit = (data: ReplyForm) => {
  if (currentMessage.value) {
    emit('replySubmit', data, currentMessage.value, currentParentReply.value)
  }
}

// 获取被引用回复的用户名
const getReplyUsername = (replies: Reply[], replyId: number): string => {
  const reply = replies.find(r => r.id === replyId)
  return reply ? reply.username : ''
}
</script>

<style scoped>
.message-list {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 40px;
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

.user-meta {
  display: flex;
  align-items: center;
  gap: 12px;
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
</style>
