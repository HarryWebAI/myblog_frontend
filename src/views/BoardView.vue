<template>
  <div class="board-container">
    <CommonHeader title="MSG Board" />

    <!-- 创建留言按钮 -->
    <div class="action-wrapper">
      <el-button class="create-button" @click="openCreateDialog">
        <el-icon class="icon">
          <Edit />
        </el-icon>
        写留言
      </el-button>
    </div>

    <!-- 留言列表区域 -->
    <div class="board-content">
      <BoardList @reply="handleReply" />
    </div>

    <!-- 创建留言对话框 -->
    <CreateBoard v-model="showCreateDialog" @submit="handleCreateMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BoardList from '@/components/board/BoardList.vue'
import CommonHeader from '@/components/CommonHeader.vue'
import CreateBoard from '@/components/board/CreateBoard.vue'
import { Edit } from '@element-plus/icons-vue'
import type { Message } from '@/types'

interface MessageForm {
  content: string
}

const showCreateDialog = ref(false)

const openCreateDialog = () => {
  showCreateDialog.value = true
}

const handleCreateMessage = (data: MessageForm) => {
  console.log('创建新留言:', data)
  // TODO: 调用后端 API 创建留言
}

const handleReply = (message: Message) => {
  console.log('回复消息:', message)
  // TODO: 实现回复功能
}
</script>

<style scoped>
.board-container {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  overflow-y: auto;
  /* 主容器负责滚动 */
  overflow-x: hidden;
}

.action-wrapper {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  flex-shrink: 0;
  /* 防止压缩 */
}

.board-content {
  flex: 1;
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
  padding-bottom: 1rem;
  box-sizing: border-box;
}

.create-button {
  padding: 8px 25px;
  font-size: 1.1rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
}

.create-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(52, 148, 230, 0.3);
}

.icon {
  font-size: 1.2rem;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
  background-color: #2a2a2a;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  color: white;
  position: relative;
}

:deep(.el-dialog__title) {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
}

:deep(.el-dialog__headerbtn) {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

:deep(.el-dialog__headerbtn:hover) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) rotate(90deg);
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

:deep(.el-dialog__body) {
  padding: 0;
}

/* 滚动条样式 */
.board-container::-webkit-scrollbar {
  width: 6px;
}

.board-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.board-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.board-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
