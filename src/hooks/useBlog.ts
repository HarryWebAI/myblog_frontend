// GET /blog/blogs?page=? => 获取博客列表api
// GET /blog/blogs/:blog_id/ => 获取博客详情api
// POST /api/blog/comments/ => 提交评论api

import type { Blog, PaginatedResponse, BlogComment } from '@/types'
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
  }
}

export default useBlog
