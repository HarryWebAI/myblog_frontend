<template>
  <div class="system-admin">
    <div class="admin-container">
      <!-- 分类管理 -->
      <div class="section-container">
        <div class="section-header">
          <div class="header-left">
            <el-icon class="header-icon">
              <Folder />
            </el-icon>
            <h2>分类管理</h2>
          </div>
          <el-button type="primary" @click="handleAddCategory">
            <el-icon>
              <Plus />
            </el-icon>
            添加分类
          </el-button>
        </div>
        <div class="section-content">
          <div class="search-bar">
            <el-input v-model="categorySearch" placeholder="搜索分类" clearable>
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </div>
          <div class="items-container" v-loading="loading">
            <div v-for="category in filteredCategories" :key="category.id" class="item-card">
              <div class="item-content">
                <div class="item-info">
                  <el-icon class="category-icon">
                    <Folder />
                  </el-icon>
                  <h3>{{ category.name }}</h3>
                </div>
                <div class="item-actions">
                  <el-button class="action-btn" @click="handleEditCategory(category)">
                    <el-icon>
                      <Edit />
                    </el-icon>
                  </el-button>
                  <el-button class="action-btn delete" @click="handleDeleteCategory(category)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签管理 -->
      <div class="section-container">
        <div class="section-header">
          <div class="header-left">
            <el-icon class="header-icon">
              <Collection />
            </el-icon>
            <h2>标签管理</h2>
          </div>
          <el-button type="primary" @click="handleAddTag">
            <el-icon>
              <Plus />
            </el-icon>
            添加标签
          </el-button>
        </div>
        <div class="section-content">
          <div class="search-bar">
            <el-input v-model="tagSearch" placeholder="搜索标签" clearable>
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </div>
          <div class="tags-wrapper" v-loading="loading">
            <TransitionGroup name="tag-list" tag="div" class="tags-container">
              <el-tag v-for="tag in filteredTags" :key="tag.id" closable class="tag-item" @close="handleDeleteTag(tag)">
                {{ tag.name }}
              </el-tag>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>

    <!-- 对话框组件 -->
    <CreateCategory v-model="categoryDialogVisible" @success="handleCategorySuccess" />
    <CreateTag v-model="tagDialogVisible" @success="handleTagSuccess" />
    <EditCategory v-if="currentCategory" v-model="editCategoryDialogVisible" :category="currentCategory"
      @success="handleEditCategorySuccess" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import useBlog from '@/hooks/useBlog'
import useCategoryAndTag from '@/hooks/useCategoryAndTag'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { BlogCategory, BlogTag } from '@/types'
import { Plus, Search, Edit, Delete, Folder, Collection } from '@element-plus/icons-vue'
import CreateCategory from '@/components/system/CreateCategory.vue'
import CreateTag from '@/components/system/CreateTag.vue'
import EditCategory from '@/components/system/EditCategory.vue'

const { categories, tags, loading, getCategoriesAndTags } = useBlog()
const { deleteCategory, deleteTag } = useCategoryAndTag()

// 搜索功能
const categorySearch = ref('')
const tagSearch = ref('')

const filteredCategories = computed(() => {
  if (!categorySearch.value) return categories.value
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(categorySearch.value.toLowerCase())
  )
})

const filteredTags = computed(() => {
  if (!tagSearch.value) return tags.value
  return tags.value.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.value.toLowerCase())
  )
})

// 对话框控制
const categoryDialogVisible = ref(false)
const tagDialogVisible = ref(false)
const editCategoryDialogVisible = ref(false)
const currentCategory = ref<BlogCategory | null>(null)

// 获取分类和标签数据
onMounted(async () => {
  try {
    await getCategoriesAndTags()
  } catch {
    ElMessage.error('获取分类和标签数据失败')
  }
})

// 分类管理方法
const handleAddCategory = () => {
  categoryDialogVisible.value = true
}

const handleEditCategory = (category: BlogCategory) => {
  currentCategory.value = category
  editCategoryDialogVisible.value = true
}

const handleDeleteCategory = async (category: BlogCategory) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类 "${category.name}" 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const success = await deleteCategory(category.id)
    if (success) {
      await getCategoriesAndTags() // 重新获取数据
    }
  } catch {
    // 用户取消删除
  }
}

const handleCategorySuccess = async () => {
  await getCategoriesAndTags()
}

// 标签管理方法
const handleAddTag = () => {
  tagDialogVisible.value = true
}

const handleDeleteTag = async (tag: BlogTag) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除标签 "${tag.name}" 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const success = await deleteTag(tag.id)
    if (success) {
      await getCategoriesAndTags() // 重新获取数据
    }
  } catch {
    // 用户取消删除
  }
}

const handleTagSuccess = async () => {
  await getCategoriesAndTags()
}

const handleEditCategorySuccess = async () => {
  await getCategoriesAndTags()
}
</script>

<style scoped>
.system-admin {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #f0f0f0;
}

.admin-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  height: 100%;
  min-height: 0;
  /* 关键：允许网格容器在flex布局中收缩 */
}

.section-container {
  display: flex;
  flex-direction: column;
  background: #2d2d2d;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  min-height: 0;
  /* 关键：允许容器在grid布局中收缩 */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  /* 防止头部收缩 */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 20px;
  color: #3494e6;
}

.section-header h2 {
  margin: 0;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}

.section-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-height: 0;
  /* 关键：允许内容区域在flex布局中收缩 */
}

.search-bar {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  /* 防止搜索栏收缩 */
}

.search-bar :deep(.el-input__wrapper) {
  background-color: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
  transition: all 0.3s ease;
}

.search-bar :deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.2);
}

.search-bar :deep(.el-input__wrapper.is-focus) {
  border-color: #3494e6;
  box-shadow: 0 0 0 2px rgba(52, 148, 230, 0.1);
}

.items-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  align-content: start;
  min-height: 0;
}

.items-container::-webkit-scrollbar {
  width: 6px;
}

.items-container::-webkit-scrollbar-track {
  background: transparent;
  margin: 10px 0;
}

.items-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.items-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}

.items-container::-webkit-scrollbar-button {
  display: none;
}

.item-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.item-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: rgba(52, 148, 230, 0.3);
}

.item-content {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon {
  font-size: 18px;
  color: #3494e6;
}

.item-info h3 {
  margin: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px;
  height: 32px;
  width: 32px;
  border: none;
  background: transparent;
  color: #3494e6;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.action-btn:hover {
  color: #2980b9;
  background: rgba(52, 148, 230, 0.1);
}

.action-btn.delete {
  color: #e74c3c;
}

.action-btn.delete:hover {
  color: #c0392b;
  background: rgba(231, 76, 60, 0.1);
}

.action-btn .el-icon {
  font-size: 16px;
}

.tags-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;
}

.tags-wrapper::-webkit-scrollbar {
  width: 6px;
}

.tags-wrapper::-webkit-scrollbar-track {
  background: transparent;
  margin: 10px 0;
}

.tags-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tags-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}

.tags-wrapper::-webkit-scrollbar-button {
  display: none;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: flex-start;
}

.tag-item {
  background: rgba(52, 148, 230, 0.1);
  border: 1px solid rgba(52, 148, 230, 0.2);
  color: #3494e6;
  transition: all 0.3s ease;
  border-radius: 16px;
  font-size: 14px;
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
}

.tag-item:hover {
  background: rgba(52, 148, 230, 0.2);
  transform: translateY(-1px);
  border-color: rgba(52, 148, 230, 0.4);
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

/* 响应式布局 */
@media (max-width: 768px) {
  .admin-container {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 16px;
  }

  .items-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    padding: 16px;
  }
}

/* 对话框样式 */
:deep(.el-dialog) {
  background-color: #2d2d2d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-dialog__title) {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #f0f0f0;
  transition: all 0.3s ease;
}

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: #3494e6;
  transform: rotate(90deg);
}

:deep(.el-dialog__body) {
  padding: 24px;
  color: #f0f0f0;
}

:deep(.el-dialog__footer) {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-input__wrapper) {
  background-color: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #3494e6;
  box-shadow: 0 0 0 2px rgba(52, 148, 230, 0.1);
}

:deep(.el-input__inner) {
  color: #f0f0f0;
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.3);
}

:deep(.el-form-item__label) {
  color: #f0f0f0;
}

:deep(.el-button--primary) {
  background-color: #3494e6;
  border-color: #3494e6;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  background-color: #2980b9;
  border-color: #2980b9;
  transform: translateY(-1px);
}

:deep(.el-button--default) {
  background-color: transparent;
  border-color: rgba(255, 255, 255, 0.2);
  color: #f0f0f0;
  transition: all 0.3s ease;
}

:deep(.el-button--default:hover) {
  border-color: #3494e6;
  color: #3494e6;
  transform: translateY(-1px);
}
</style>
