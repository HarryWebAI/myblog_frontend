<template>
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
        <el-select v-model="blogForm.category_id" placeholder="选择分类" :class="{ 'is-error': !blogForm.category_id }"
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
      <div class="preview-header">
        <div class="preview-title">{{ blogForm.title || '请输入标题...' }}</div>
        <div class="preview-category" v-if="blogForm.category_id">
          {{categories.find(c => c.id === blogForm.category_id)?.name}}
        </div>
      </div>
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
          <el-select v-model="blogForm.tag_ids" multiple filterable placeholder="选择或搜索标签 (最多5个)" class="tags-select"
            popper-class="dark-select" :max-collapse-tags="3" @change="handleTagsChange">
            <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
          </el-select>
          <div class="selected-tags">
            <TransitionGroup name="tag-list">
              <el-tag v-for="tag in getSelectedTags" :key="tag.id" closable class="tag-item"
                @close="blogForm.tag_ids = blogForm.tag_ids.filter(id => id !== tag.id)">
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
    <el-button type="primary" size="large" @click="handleSubmit">保存修改</el-button>
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
import { useRouter, useRoute } from 'vue-router'

// 编辑器实例, 必须用 shallowRef
const editorRef = shallowRef()
const router = useRouter()
const route = useRoute()

// 分类和标签数据
const { categories, tags, getCategoriesAndTags, getBlog, updateBlog, blog } = useBlog()

// 表单数据
const blogForm = ref<CreateBlogForm>({
  title: '',
  content: '',
  summary: '',
  category_id: '' as unknown as number,
  tag_ids: [],
  is_top: false
})

// 已选标签展示
const getSelectedTags = computed(() => {
  return blogForm.value.tag_ids
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

// 组件销毁前检查
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) {
    editor.destroy()
  }
})

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 表单提交和取消
const handleSubmit = async () => {
  try {
    // 标题验证
    const title = blogForm.value.title.trim()
    if (!title) {
      ElMessage.error('请输入博客标题')
      return
    }
    if (title.length < 5) {
      ElMessage.error('博客标题不能少于5个字')
      return
    }

    // 分类验证
    if (!blogForm.value.category_id) {
      ElMessage.error('请选择博客分类')
      return
    }

    // 摘要验证
    const summary = blogForm.value.summary.trim()
    if (!summary) {
      ElMessage.error('请输入博客摘要')
      return
    }
    if (summary.length < 10) {
      ElMessage.error('博客摘要不能少于10个字')
      return
    }

    // 内容验证
    const content = blogForm.value.content.trim()
    if (!content) {
      ElMessage.error('请输入博客内容')
      return
    }
    if (content.length < 50) {
      ElMessage.error('博客内容不能少于50个字')
      return
    }

    const blogId = Number(route.params.id)
    const success = await updateBlog(blogId, blogForm.value)
    if (success) {
      ElMessage.success('博客更新成功')
      router.push({ name: 'blog' })
    }
  } catch (error) {
    console.error('更新博客失败:', error)
  }
}

const handleCancel = () => {
  router.push({ name: 'blog' })
}

// 处理标签选择变化
const handleTagsChange = (value: number[]) => {
  if (value.length > 5) {
    ElMessage.warning('最多只能选择5个标签')
    blogForm.value.tag_ids = value.slice(0, 5)
  }
}

onMounted(async () => {
  try {
    await getCategoriesAndTags()
    // 获取博客数据
    const blogId = Number(route.params.id)
    if (isNaN(blogId)) {
      ElMessage.error('无效的博客 ID')
      router.push({ name: 'blog' })
      return
    }
    await getBlog(blogId)
    if (blog.value) {
      blogForm.value = {
        title: blog.value.title,
        content: blog.value.content,
        summary: blog.value.summary,
        category_id: blog.value.category.id,
        tag_ids: blog.value.tags.map(tag => tag.id),
        is_top: blog.value.is_top
      }
    }
  } catch (error) {
    console.error('Failed to fetch blog data:', error)
    ElMessage.error('获取博客数据失败')
    router.push({ name: 'blog' })
  }
})
</script>

<style scoped>
/* 复用 CreateBlog.vue 的样式 */
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
  height: 50px;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  border-radius: 0 0 12px 12px;
}

/* 编辑器内容区域滚动条样式 */
.editor-content :deep(.w-e-text-container)::-webkit-scrollbar {
  width: 6px;
}

.editor-content :deep(.w-e-text-container)::-webkit-scrollbar-track {
  background: transparent;
}

.editor-content :deep(.w-e-text-container)::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.editor-content :deep(.w-e-text-container)::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}

.preview-container {
  background: rgb(18, 20, 29);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  height: 600px;
  display: flex;
  flex-direction: column;
}

.preview-header {
  height: 50px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-title {
  font-size: 16px;
  font-weight: 500;
  color: #e1e1e1;
  flex: 1;
  margin-right: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-category {
  font-size: 14px;
  color: #3494e6;
  background: rgba(52, 148, 230, 0.1);
  padding: 4px 12px;
  border-radius: 16px;
  white-space: nowrap;
}

.preview-content {
  flex: 1;
  padding: 32px 40px;
  overflow-y: auto;
  color: #e1e1e1;
}

/* 预览区富文本内容样式 */
.preview-content :deep(p) {
  margin-bottom: 1em;
}

.preview-content :deep(h1),
.preview-content :deep(h2),
.preview-content :deep(h3),
.preview-content :deep(h4),
.preview-content :deep(h5),
.preview-content :deep(h6) {
  color: #fff;
  margin: 1.5em 0 0.8em;
  font-weight: 600;
}

.preview-content :deep(h1) {
  font-size: 2em;
}

.preview-content :deep(h2) {
  font-size: 1.75em;
}

.preview-content :deep(h3) {
  font-size: 1.5em;
}

.preview-content :deep(h4) {
  font-size: 1.25em;
}

.preview-content :deep(h5) {
  font-size: 1.1em;
}

.preview-content :deep(h6) {
  font-size: 1em;
}

.preview-content :deep(ul),
.preview-content :deep(ol) {
  padding-left: 2em;
  margin-bottom: 1em;
}

.preview-content :deep(li) {
  margin-bottom: 0.5em;
}

.preview-content :deep(blockquote) {
  border-left: 4px solid #3494e6;
  margin: 1em 0;
  padding: 0.5em 1em;
  background: rgba(52, 148, 230, 0.1);
  color: #ddd;
}

.preview-content :deep(code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.preview-content :deep(pre) {
  background: rgba(0, 0, 0, 0.2);
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1em 0;
}

.preview-content :deep(pre code) {
  background: none;
  padding: 0;
}

.preview-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 1em 0;
}

.preview-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.preview-content :deep(th),
.preview-content :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5em;
  text-align: left;
}

.preview-content :deep(th) {
  background: rgba(255, 255, 255, 0.05);
}

.preview-content :deep(a) {
  color: #3494e6;
  text-decoration: none;
  transition: color 0.3s;
}

.preview-content :deep(a:hover) {
  color: #ec6ead;
}

.preview-content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 2em 0;
}

/* 预览内容区域滚动条样式 */
.preview-content::-webkit-scrollbar {
  width: 6px;
}

.preview-content::-webkit-scrollbar-track {
  background: transparent;
}

.preview-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
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

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}
</style>
