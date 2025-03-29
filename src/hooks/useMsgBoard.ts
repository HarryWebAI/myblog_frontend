// /GET api/msgboard/messages/ => 获取留言列表
// /POST api/msgboard/messages/ => 创建留言
// DELETE /api/msgboard/messages/{message_id}/ => 删除留言
// POST /api/msgboard/messages/:message_id/create_reply/ => 创建回复
// DELETE /api/msgboard/messages/{message_id}/replies/{reply_id}/ => 删除回复

import { ref } from 'vue'
import type { Message, Reply, PaginatedResponse } from '@/types'
import http from '@/utils/http'
export default function useMsgBoard() {
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const total = ref(0)
  const next = ref<string | null>(null)
  const previous = ref<string | null>(null)

  // 获取留言列表
  const getMessages = async (page: number = 1) => {
    try {
      loading.value = true
      const res = await http.get<PaginatedResponse<Message>>(`/msgboard/messages/?page=${page}`)
      if (res.status === 200) {
        messages.value = res.data.results
        total.value = res.data.count
        next.value = res.data.next
        previous.value = res.data.previous
      }
    } catch (error) {
      console.error('获取留言列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 加载下一页
  const loadNext = async () => {
    if (next.value) {
      const url = new URL(next.value)
      const page = parseInt(url.searchParams.get('page') || '1')
      await getMessages(page)
    }
  }

  // 加载上一页
  const loadPrevious = async () => {
    if (previous.value) {
      const url = new URL(previous.value)
      const page = parseInt(url.searchParams.get('page') || '1')
      await getMessages(page)
    }
  }

  // 创建留言
  const createMessage = async (content: string) => {
    try {
      const res = await http.post<Message>('/msgboard/messages/', { content })
      if (res.status === 201) {
        return true
      }
      return false
    } catch (error) {
      console.error('创建留言失败:', error)
      return false
    }
  }

  // 创建回复
  const createReply = async (
    messageId: number,
    content: string,
    parentReplyId: number | null = null,
  ) => {
    try {
      const res = await http.post<Reply>(`/msgboard/messages/${messageId}/create_reply/`, {
        content,
        parent_reply: parentReplyId,
      })
      if (res.status === 201) {
        return true
      }
      return false
    } catch (error) {
      console.error('创建回复失败:', error)
      return false
    }
  }

  // 删除留言
  const deleteMessage = async (messageId: number) => {
    try {
      const res = await http.delete(`/msgboard/messages/${messageId}/`)
      if (res.status === 204) {
        // 从列表中移除该留言
        messages.value = messages.value.filter((m) => m.id !== messageId)
        total.value--
        return true
      }
      return false
    } catch (error) {
      console.error('删除留言失败:', error)
      return false
    }
  }

  // 删除回复
  const deleteReply = async (messageId: number, replyId: number) => {
    try {
      const res = await http.delete(`/msgboard/messages/${messageId}/replies/${replyId}/`)
      if (res.status === 204) {
        // 从本地状态中移除该回复
        messages.value = messages.value.map((message) => {
          if (message.id === messageId) {
            return {
              ...message,
              replies: message.replies.filter((reply) => reply.id !== replyId),
            }
          }
          return message
        })
        return true
      }
      return false
    } catch (error) {
      console.error('删除回复失败:', error)
      return false
    }
  }

  return {
    messages,
    loading,
    total,
    next,
    previous,
    getMessages,
    loadNext,
    loadPrevious,
    createMessage,
    createReply,
    deleteMessage,
    deleteReply,
  }
}
