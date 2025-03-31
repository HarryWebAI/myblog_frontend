// GET /blog/blogs?page=? => 获取博客列表api
// GET /blog/blogs/:blog_id/ => 获取博客详情api
// POST /api/blog/comments/ => 提交评论api
// DELETE  /api/blog/comments/:comment_id/ => 删除评论api
// GET /blog/categories/ => 获取分类列表api
// GET /blog/tags/ => 获取标签列表api
// POST /blog/blogs/ => 创建博客api
// POST /blog/blogs/{blog_id}/toggle_top/ => 置顶/取消置顶博客api

import type {
  Blog,
  PaginatedResponse,
  BlogComment,
  BlogCategory,
  BlogTag,
  CreateBlogForm,
} from '@/types'
import { ref } from 'vue'
import http from '@/utils/http'
import { ElMessage } from 'element-plus'

const useBlog = () => {
  const loading = ref(false)
  const blogs = ref<Blog[]>([])
  const total = ref(0)
  const nextPage = ref<string | null>(null)
  const prevPage = ref<string | null>(null)
  const blog = ref<Blog | null>(null)
  const categories = ref<BlogCategory[]>([])
  const tags = ref<BlogTag[]>([])

  // 获取博客列表
  const getBlogs = async (url: string = '/blog/blogs/') => {
    loading.value = true
    try {
      const res = await http.get<PaginatedResponse<Blog>>(url)
      if (res.status === 200) {
        blogs.value = res.data.results
        total.value = res.data.count
        nextPage.value = res.data.next
        prevPage.value = res.data.previous
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '获取博客列表失败')
    } finally {
      loading.value = false
    }
  }

  // 获取博客
  const getBlog = async (blogId: number) => {
    try {
      const res = await http.get(`/blog/blogs/${blogId}/`)
      if (res.status === 200) {
        blog.value = res.data as Blog
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '获取博客详情失败')
      throw error
    }
  }

  // 提交评论
  const submitComment = async (blogId: number, content: string, parentId?: number | null) => {
    try {
      const commentData: BlogComment = {
        blog_id: blogId,
        content,
        parent_comment_id: parentId || null,
      }

      const res = await http.post('/blog/comments/', commentData)
      if (res.status === 201) {
        // 评论成功后重新获取博客详情以更新评论列表
        await getBlog(blogId)
        return true
      }
      return false
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '评论提交失败')
      throw error
    }
  }

  const getCategoriesAndTags = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        http.get<BlogCategory[]>('/blog/categories/'),
        http.get<BlogTag[]>('/blog/tags/'),
      ])

      if (categoriesRes.status === 200) {
        categories.value = categoriesRes.data
      }

      if (tagsRes.status === 200) {
        tags.value = tagsRes.data
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '获取分类和标签失败')
      throw error
    }
  }

  const createBlog = async (blogData: CreateBlogForm) => {
    try {
      const res = await http.post('/blog/blogs/', blogData)
      if (res.status === 201) {
        ElMessage.success('博客创建成功')
        return true
      }
      ElMessage.error('博客创建失败')
      return false
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '创建博客失败')
      throw error
    }
  }

  const deleteComment = async (commentId: number) => {
    try {
      const res = await http.delete(`/blog/comments/${commentId}/`)
      if (res.status === 204) {
        return true
      }
      return false
    } catch (error: unknown) {
      throw error
    }
  }

  // 删除博客
  const deleteBlog = async (blogId: number) => {
    try {
      const response = await http.delete(`/blog/blogs/${blogId}/`)
      return response.status === 204
    } catch (error) {
      console.error('删除博客失败:', error)
      throw error
    }
  }

  // 置顶/取消置顶博客
  const toggleBlogTop = async (blogId: number) => {
    try {
      interface ToggleTopResponse {
        is_top: boolean
      }

      const res = await http.post<ToggleTopResponse>(`/blog/blogs/${blogId}/toggle_top/`)
      if (res.status === 200) {
        // 更新本地博客列表中的置顶状态
        blogs.value = blogs.value.map((blog) => {
          if (blog.id === blogId) {
            return { ...blog, is_top: !blog.is_top }
          }
          return blog
        })
        return true
      }
      return false
    } catch (error: unknown) {
      throw error
    }
  }

  // 更新博客
  const updateBlog = async (blogId: number, blogData: CreateBlogForm) => {
    try {
      const res = await http.put(`/blog/blogs/${blogId}/`, blogData)
      if (res.status === 200) {
        ElMessage.success('博客更新成功')
        return true
      }
      ElMessage.error('博客更新失败')
      return false
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '更新博客失败')
      throw error
    }
  }

  return {
    blogs,
    total,
    nextPage,
    prevPage,
    loading,
    getBlogs,
    blog,
    getBlog,
    submitComment,
    categories,
    tags,
    getCategoriesAndTags,
    createBlog,
    deleteComment,
    deleteBlog,
    toggleBlogTop,
    updateBlog,
  }
}

export default useBlog
