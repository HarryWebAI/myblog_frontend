// 删除分类：DELETE /api/blog/categories/{category_id}/
// 删除标签：DELETE /api/blog/tags/{tag_id}/
// 创建分类：POST /api/blog/categories/
// 创建标签：POST /api/blog/tags/
// 更新分类：PUT /api/blog/categories/{category_id}/
// 更新标签：PUT /api/blog/tags/{tag_id}/

import { ref } from 'vue'
import http from '@/utils/http'
import { ElMessage } from 'element-plus'

const useCategoryAndTag = () => {
  const loading = ref(false)

  // 删除分类
  const deleteCategory = async (categoryId: number) => {
    try {
      const res = await http.delete(`/blog/categories/${categoryId}/`)
      if (res.status === 204) {
        ElMessage.success('分类删除成功')
        return true
      }
      ElMessage.error('分类删除失败')
      return false
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '删除分类失败')
      return false
    }
  }

  // 删除标签
  const deleteTag = async (tagId: number) => {
    try {
      const res = await http.delete(`/blog/tags/${tagId}/`)
      if (res.status === 204) {
        ElMessage.success('标签删除成功')
        return true
      }
      ElMessage.error('标签删除失败')
      return false
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '删除标签失败')
      return false
    }
  }

  // 创建分类
  const createCategory = async (data: { name: string; description?: string }) => {
    try {
      const res = await http.post('/blog/categories/', data)
      if (res.status === 201) {
        ElMessage.success('分类创建成功')
        return true
      }
      ElMessage.error('分类创建失败')
      return false
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '创建分类失败')
      return false
    }
  }

  // 创建标签
  const createTag = async (data: { name: string; description?: string }) => {
    try {
      const res = await http.post('/blog/tags/', data)
      if (res.status === 201) {
        ElMessage.success('标签创建成功')
        return true
      }
      ElMessage.error('标签创建失败')
      return false
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '创建标签失败')
      return false
    }
  }

  // 更新分类
  const updateCategory = async (
    categoryId: number,
    data: { name: string; description?: string },
  ) => {
    try {
      const res = await http.put(`/blog/categories/${categoryId}/`, data)
      if (res.status === 200) {
        ElMessage.success('分类更新成功')
        return true
      }
      ElMessage.error('分类更新失败')
      return false
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '更新分类失败')
      return false
    }
  }

  // 更新标签
  const updateTag = async (tagId: number, data: { name: string; description?: string }) => {
    try {
      const res = await http.put(`/blog/tags/${tagId}/`, data)
      if (res.status === 200) {
        ElMessage.success('标签更新成功')
        return true
      }
      ElMessage.error('标签更新失败')
      return false
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '更新标签失败')
      return false
    }
  }

  return {
    loading,
    deleteCategory,
    deleteTag,
    createCategory,
    createTag,
    updateCategory,
    updateTag,
  }
}

export default useCategoryAndTag
