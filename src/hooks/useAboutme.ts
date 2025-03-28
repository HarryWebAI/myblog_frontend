// http://localhost:8000/api/aboutme/ => 后端接口地址

import { ref, markRaw } from 'vue'
import http from '@/utils/http'
import type { Section, SectionContent } from '@/types'
import { Briefcase, School, Folder, Tools } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface ApiResponse {
  code: number
  message: string
  data: SectionContent
}

export const useAboutme = () => {
  const sections = ref<Section[]>([])
  const loading = ref(true)
  const aboutme = ref<SectionContent>({
    work: [],
    education: [],
    projects: [],
    skills: [],
  })

  const fetchAboutme = async () => {
    try {
      loading.value = true
      const response = await http.get<ApiResponse>('/aboutme/')
      if (response.data.code === 200 && response.data.data) {
        const data = response.data.data
        aboutme.value = data

        // 构建 sections 数据
        sections.value = [
          {
            id: 1,
            type: 'work',
            title: '工作经历',
            icon: markRaw(Briefcase),
            content: data.work,
          },
          {
            id: 2,
            type: 'education',
            title: '教育背景',
            icon: markRaw(School),
            content: data.education,
          },
          {
            id: 3,
            type: 'projects',
            title: '项目经验',
            icon: markRaw(Folder),
            content: data.projects,
          },
          {
            id: 4,
            type: 'skills',
            title: '技能特长',
            icon: markRaw(Tools),
            content: data.skills,
          },
        ]
      } else {
        ElMessage.error(response.data.message || '获取数据失败')
      }
    } catch (error) {
      console.error('获取 aboutme 数据失败:', error)
      ElMessage.error('获取数据失败')
    } finally {
      loading.value = false
    }
  }

  const saveAboutmeConfig = () => {
    http
      .put<ApiResponse>('/aboutme/update/', aboutme.value)
      .then((res) => {
        if (res.data.code === 200) {
          ElMessage.success(res.data.message)
        } else {
          ElMessage.error(res.data.message)
        }
      })
      .catch((err) => {
        ElMessage.error(err.response?.data?.message || '保存失败')
      })
  }

  return {
    sections,
    loading,
    aboutme,
    fetchAboutme,
    saveAboutmeConfig,
  }
}
