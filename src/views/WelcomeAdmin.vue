<template>
  <div class="admin-container">
    <!-- 预览区域 -->
    <div class="preview-wrapper">
      <div class="preview-inner">
        <h1 class="preview-title">{{ welcome.title }}</h1>
        <div class="preview-descriptions">
          <div v-for="(description, index) in welcome.descriptions" :key="description.id" class="preview-motto">
            <span>{{ description.content }}</span>
            <span v-if="index !== welcome.descriptions.length - 1" class="divider">·</span>
          </div>
        </div>
        <button class="preview-button">
          <el-icon>
            <Compass />
          </el-icon>
          {{ welcome.buttonText }}
        </button>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="edit-wrapper">
      <div class="edit-header">
        <div class="title-container">
          <div class="section-title">编辑内容</div>
        </div>
        <div class="button-container">
          <el-button type="warning" @click="resetWelcome" class="reset-btn">
            <el-icon>
              <RefreshRight />
            </el-icon> 重置
          </el-button>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-item">
          <div class="form-label">标题</div>
          <el-input v-model="welcome.title" placeholder="请输入欢迎页标题" />
        </div>

        <div class="form-item">
          <div class="form-label">按钮文本</div>
          <el-input v-model="welcome.buttonText" placeholder="请输入按钮文本" />
        </div>
      </div>

      <div class="form-item descriptions-section">
        <div class="form-header">
          <div class="form-label">描述内容</div>
          <el-button type="success" @click="addDescription" class="add-btn">
            <el-icon>
              <Plus />
            </el-icon>添加描述
          </el-button>
        </div>

        <div class="descriptions-list">
          <div v-for="(description, index) in welcome.descriptions" :key="description.id" class="description-item">
            <el-input v-model="description.content" placeholder="请输入描述内容" />
            <el-button type="danger" circle @click="removeDescription(index)" class="delete-btn">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <div class="actions">
        <el-button type="primary" @click="saveWelcomeConfig" class="save-btn">保存配置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Delete, Plus, Compass, RefreshRight } from '@element-plus/icons-vue'
import useWelcome from '@/hooks/useWelcome'
import { onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const { welcome, getWelcome, saveWelcomeConfig } = useWelcome()

const addDescription = () => {
  welcome.value.descriptions.push({
    id: Date.now(), // 临时ID
    content: ''
  })
}

const removeDescription = (index: number) => {
  welcome.value.descriptions.splice(index, 1)
}

const resetWelcome = () => {
  ElMessageBox.confirm('确定要重置所有更改吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    getWelcome() // 重新获取数据
    ElMessage.success('已重置')
  }).catch(() => {
    ElMessage.info('取消重置')
  })
}

onMounted(() => {
  getWelcome()
})
</script>

<style scoped>
.admin-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  color: #f0f0f0;
  overflow-x: hidden;
  box-sizing: border-box;
  scrollbar-width: thin;
  /* Firefox */
  scrollbar-color: #444 #222;
  /* Firefox */
}

.admin-container::-webkit-scrollbar {
  width: 8px;
}

.admin-container::-webkit-scrollbar-track {
  background: #222;
  border-radius: 4px;
}

.admin-container::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 4px;
  border: 2px solid #222;
}

.admin-container::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

/* 预览区域 */
.preview-wrapper {
  width: 100%;
  max-width: 100%;
  /* 确保不超出容器 */
  padding: 40px 20px;
  /* 减小左右padding */
  background-color: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  box-sizing: border-box;
  /* 确保padding包含在宽度内 */
}

.preview-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  /* 减小最大宽度 */
  width: 100%;
}

.preview-title {
  font-size: 3rem;
  /* 稍微减小标题 */
  font-weight: bold;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align: center;
  word-break: break-word;
  /* 防止长标题导致溢出 */
}

.preview-descriptions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2.5rem;
  font-size: 1.4rem;
  /* 增大描述文字 */
}

.preview-motto {
  display: flex;
  align-items: center;
}

.divider {
  margin: 0 0.5rem;
  opacity: 0.5;
}

.preview-button {
  padding: 1rem 2.5rem;
  /* 增大按钮 */
  font-size: 1.2rem;
  border: none;
  border-radius: 30px;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
}

/* 编辑区域 */
.edit-wrapper {
  flex: 1;
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 30px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
  scrollbar-width: thin;
  /* Firefox */
  scrollbar-color: #444 #222;
  /* Firefox */
}

.edit-wrapper::-webkit-scrollbar {
  width: 8px;
}

.edit-wrapper::-webkit-scrollbar-track {
  background: #222;
  border-radius: 4px;
}

.edit-wrapper::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 4px;
  border: 2px solid #222;
}

.edit-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.title-container {
  flex: 1;
}

.button-container {
  flex: 0;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 500;
  color: #fff;
  /* 移除标题自身的边框和padding */
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  font-size: 1rem;
  margin-bottom: 10px;
  color: #bbb;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.descriptions-section {
  margin-bottom: 40px;
}

.descriptions-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #444 #222;
}

.descriptions-list::-webkit-scrollbar {
  width: 8px;
}

.descriptions-list::-webkit-scrollbar-track {
  background: #222;
  border-radius: 4px;
}

.descriptions-list::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 4px;
  border: 2px solid #222;
}

.descriptions-list::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

@media (max-width: 1200px) {
  .descriptions-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .descriptions-list {
    grid-template-columns: 1fr;
  }
}

.description-item {
  display: flex;
  gap: 8px;
  /* 减小gap */
  align-items: center;
  width: 100%;
}

.add-btn {
  background-color: #25c96f;
  border-color: #25c96f;
  color: white;
  padding: 8px 16px;
}

.add-btn:hover,
.add-btn:focus {
  background-color: #27d575;
  border-color: #27d575;
}

.delete-btn {
  flex-shrink: 0;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.save-btn {
  font-size: 1rem;
  padding: 10px 30px;
  min-width: 150px;
}

/* Element Plus 组件覆盖样式 */
:deep(.el-input__wrapper) {
  background-color: #2d2d2d;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  border-radius: 4px;
}

:deep(.el-input__inner) {
  color: #f0f0f0;
}

:deep(.el-button) {
  border-radius: 4px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3494e6 inset;
}

/* 确保表单元素不溢出 */
:deep(.el-input) {
  width: 100%;
  max-width: 100%;
}

/* 调整输入框和按钮布局,防止溢出 */
.description-item :deep(.el-input) {
  flex: 1;
  min-width: 0;
  /* 允许flex项目收缩到比内容更小 */
}
</style>