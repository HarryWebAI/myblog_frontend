<template>
  <div class="create-blog">
    <div class="blog-container">
      <!-- 标题区域 -->
      <div class="blog-header">
        <div class="input-group">
          <div class="title-group">
            <div class="input-label required">文章标题</div>
            <input v-model="blogForm.title" class="title-input" placeholder="输入文章标题..."
              :class="{ 'is-empty': !blogForm.title }">
          </div>
          <div class="category-select">
            <div class="input-label required">文章分类</div>
            <el-select v-model="blogForm.category" placeholder="选择分类" :class="{ 'is-error': !blogForm.category }"
              popper-class="dark-select">
              <el-option value="" disabled label="请选择分类" />
              <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>
        </div>
      </div>

      <!-- 主编辑区域 -->
      <div class="blog-main">
        <div class="editor-container">
          <div class="toolbar-container">
            <Toolbar class="editor-toolbar" :editor="editorRef" :default-config="toolbarConfig" mode="default" />
          </div>
          <Editor class="editor-content" v-model="blogForm.content" :default-config="editorConfig" mode="default"
            @onCreated="handleCreated" />
        </div>
        <div class="preview-container">
          <div class="preview-content markdown-body" v-html="previewContent"></div>
        </div>
      </div>

      <!-- 底部元信息区域 -->
      <div class="blog-meta">
        <div class="meta-group">
          <div class="meta-item summary-section">
            <div class="meta-label">文章摘要</div>
            <el-input v-model="blogForm.summary" type="textarea" :rows="3" resize="none" placeholder="简要描述文章的主要内容..."
              class="summary-input" />
          </div>
          <div class="meta-item tags-section">
            <div class="meta-label">文章标签</div>
            <div class="tags-container">
              <el-select v-model="blogForm.tags" multiple filterable placeholder="选择或搜索标签 (最多5个)" class="tags-select"
                popper-class="dark-select" :max-collapse-tags="3" @change="handleTagsChange">
                <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
              </el-select>
              <div class="selected-tags">
                <TransitionGroup name="tag-list">
                  <el-tag v-for="tag in getSelectedTags" :key="tag.id" closable class="tag-item"
                    @close="blogForm.tags = blogForm.tags.filter(id => id !== tag.id)">
                    {{ tag.name }}
                  </el-tag>
                </TransitionGroup>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="blog-actions">
        <el-button type="default" size="large" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="large" @click="handleSubmit">发布文章</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, computed, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor } from '@wangeditor/editor'
import { ElMessage } from 'element-plus'
import type { CreateBlogForm } from '@/types'
import useBlog from '@/hooks/useBlog'

// 编辑器实例, 必须用 shallowRef
const editorRef = shallowRef()

// 分类和标签数据
const { categories, tags, getCategoriesAndTags } = useBlog()

// 表单数据
const blogForm = ref<CreateBlogForm>({
  title: '',
  content: '',
  summary: '',
  category: '' as unknown as number,
  tags: [],
  status: 'draft',
  is_top: false
})

// 已选标签展示
const getSelectedTags = computed(() => {
  return blogForm.value.tags
    .map(tagId => tags.value.find(t => t.id === tagId))
    .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined)
})

// 编辑器配置
const toolbarConfig = {
  excludeKeys: [
    'uploadVideo',
    'group-video',
    'group-image',
    'emotion',
    'fontSize',
    'fontFamily',
    'lineHeight',
    'bgColor',
    'color',
    'group-more-style',
    'insertTable',
    'todo',
    'fullScreen'
  ]
}

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      disabled: true
    },
    uploadVideo: {
      disabled: true
    }
  }
}

// 预览内容
const previewContent = computed(() => {
  return blogForm.value.content
})

// 组件销毁时, 销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 表单提交和取消
const handleSubmit = async () => {
  try {
    if (!blogForm.value.title.trim()) {
      ElMessage.error('请输入博客标题')
      return
    }
    if (!blogForm.value.category) {
      ElMessage.error('请选择博客分类')
      return
    }
    if (!blogForm.value.summary.trim()) {
      ElMessage.error('请输入博客摘要')
      return
    }
    if (!blogForm.value.content.trim()) {
      ElMessage.error('请输入博客内容')
      return
    }

    console.log('提交表单:', blogForm.value)
    ElMessage.success('博客创建成功')
  } catch (error) {
    console.error('创建博客失败:', error)
    ElMessage.error('创建博客失败')
  }
}

const handleCancel = () => {
  console.log('取消编辑')
}

// 处理标签选择变化
const handleTagsChange = (value: number[]) => {
  if (value.length > 5) {
    ElMessage.warning('最多只能选择5个标签')
    blogForm.value.tags = value.slice(0, 5)
  }
}

onMounted(async () => {
  try {
    await getCategoriesAndTags()
  } catch (error) {
    console.error('Failed to fetch categories and tags:', error)
  }
})
</script>

<style scoped>
.create-blog {
  min-height: 100vh;
  background: rgb(22, 24, 35);
  padding: 24px;
  color: #e1e1e1;
  border-radius: 12px;
}

.blog-container {
  max-width: 1800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* 标题区域 */
.blog-header {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
}

.input-group {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 24px;
  align-items: start;
}

.title-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  min-width: 70px;
  display: flex;
  align-items: center;
}

.input-label.required::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.title-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #fff;
  padding: 8px 0;
  outline: none;
  font-weight: 500;
}

.title-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.title-input.is-empty::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.category-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 主编辑区域 */
.blog-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  height: 600px;
  margin: 24px 0;
}

.editor-container {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.toolbar-container {
  border-bottom: 1px solid #eee;
  padding: 8px;
  background: #fff;
  border-radius: 12px 12px 0 0;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  height: calc(600px - 50px);
  border-radius: 0 0 12px 12px;
  /* 自定义滚动条样式 */
}

.edit-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.edit-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.edit-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.edit-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}

/* 禁用编辑内容区域的滚动条箭头 */
.edit-content::-webkit-scrollbar-button {
  display: none;
}

.preview-container {
  background: rgb(18, 20, 29);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  height: 600px;
}

.preview-content {
  height: 100%;
  padding: 32px 40px;
  overflow-y: auto;
  color: #e1e1e1;
  border-radius: 12px;
}

/* 元信息区域 */
.blog-meta {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
}

.meta-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  min-width: 70px;
  display: flex;
  align-items: center;
}

.meta-label.required::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.summary-input :deep(.el-textarea__inner) {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e1e1e1;
  resize: none;
  height: 100px;
}

.summary-input :deep(.el-textarea__inner:focus) {
  border-color: #3494e6;
  box-shadow: 0 0 0 2px rgba(52, 148, 230, 0.2);
}

.tags-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tags-select {
  width: 100%;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 32px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.tag-item {
  background: rgba(52, 148, 230, 0.1);
  border-color: rgba(52, 148, 230, 0.2);
  color: #3494e6;
  transition: all 0.3s ease;
  border-radius: 16px;
}

.tag-item:hover {
  background: rgba(52, 148, 230, 0.2);
}

/* 操作按钮区域 */
.blog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 0;
}

/* 标签动画 */
.tag-list-enter-active,
.tag-list-leave-active {
  transition: all 0.3s ease;
}

.tag-list-enter-from,
.tag-list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* 暗色下拉菜单 */
:deep(.dark-select) {
  background: rgb(30, 32, 45);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.dark-select .el-select-dropdown__item) {
  color: #e1e1e1;
}

:deep(.dark-select .el-select-dropdown__item:hover),
:deep(.dark-select .el-select-dropdown__item.selected) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.dark-select .el-select-dropdown__item.selected) {
  color: #3494e6;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .blog-main {
    grid-template-columns: 1fr;
  }

  .preview-container {
    display: none;
  }

  .meta-group {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .create-blog {
    padding: 16px;
  }

  .title-input {
    font-size: 20px;
  }

  .blog-header,
  .blog-meta {
    padding: 16px;
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
  margin: 10px 0;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}

/* 滚动条箭头样式 */
::-webkit-scrollbar-button:start:decrement,
::-webkit-scrollbar-button:end:increment {
  width: 6px;
  height: 6px;
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.2), rgba(236, 106, 173, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-button:start:decrement:hover,
::-webkit-scrollbar-button:end:increment:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.4), rgba(236, 106, 173, 0.4));
}

::-webkit-scrollbar-button:start:decrement {
  display: block;
  border-width: 4px;
  border-style: solid;
  border-color: transparent transparent #e1e1e1 transparent;
  background: rgba(22, 24, 35, 0.9);
}

::-webkit-scrollbar-button:end:increment {
  display: block;
  border-width: 4px;
  border-style: solid;
  border-color: #e1e1e1 transparent transparent transparent;
  background: rgba(22, 24, 35, 0.9);
}

/* 项目经验样式 */
.projects-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 100%;
}

.project-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.project-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(52, 148, 230, 0.3);
}

.project-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.project-header h3 {
  color: #3494e6;
  margin: 0;
  font-size: 1.2rem;
  flex: 1;
}

.tech-stack-badge {
  display: inline-block;
  background: linear-gradient(45deg, rgba(52, 148, 230, 0.2), rgba(236, 106, 173, 0.2));
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #ec6ead;
  white-space: nowrap;
}

.project-details {
  margin: 0;
  padding: 0;
}

.project-details p {
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.project-details p::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #ec6ead;
  font-size: 1.2rem;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .projects-container {
    grid-template-columns: 1fr;
  }
}
</style>
