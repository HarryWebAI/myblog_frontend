// GET /blog/blogs?page=? => 获取博客列表api
// pOST /api/blogs/:blog_id/view/ => 访问量增加接口

import type { Blog, PaginatedResponse } from '@/types'
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
    const res = await http.get(`/blog/blogs/${blogId}/`)
    if (res.status === 200) {
      blog.value = res.data as Blog
    }
  }

  const increaseView = async (blogId: number) => {
    try {
      const res = await http.post(`/blog/blogs/${blogId}/view/`)
      if (res.status === 200) {
        ElMessage.success('访问量增加成功')
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      ElMessage.error(err.message || '访问量增加失败')
    }
  }

  return {
    blogs,
    total,
    nextPage,
    prevPage,
    loading,
    getBlogs,
    increaseView,
    blog,
    getBlog,
  }
}

export default useBlog
