import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

interface Response<T = unknown> {
  status: number
  data: T
}

class Http {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      timeout: 10000,
    })

    this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const authStore = useAuthStore()
      const token = authStore.getToken()
      if (token) {
        config.headers['Authorization'] = `JWT ${token}`
      }
      return config
    })
  }

  async post<T>(path: string, data?: unknown): Promise<Response<T>> {
    const response = await this.instance.post(path, data)
    return {
      status: response.status,
      data: response.data,
    }
  }

  async put<T>(path: string, data?: unknown): Promise<Response<T>> {
    const response = await this.instance.put(path, data)
    return {
      status: response.status,
      data: response.data,
    }
  }

  async get<T>(path: string, params?: unknown): Promise<Response<T>> {
    const response = await this.instance.get(path, { params })
    return {
      status: response.status,
      data: response.data,
    }
  }

  async delete<T>(path: string): Promise<Response<T>> {
    const response = await this.instance.delete(path)
    return {
      status: response.status,
      data: response.data,
    }
  }

  async patch<T>(path: string, data?: unknown): Promise<Response<T>> {
    const response = await this.instance.patch(path, data)
    return {
      status: response.status,
      data: response.data,
    }
  }

  async upload<T>(path: string, file: File, fieldName: string = 'file'): Promise<Response<T>> {
    const formData = new FormData()
    formData.append(fieldName, file)

    const response = await this.instance.post(path, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return {
      status: response.status,
      data: response.data,
    }
  }

  // async download(path: string): Promise<Response<Blob>> {
  //   const response = await this.instance.get(path, { responseType: 'blob' })
  //   return {
  //     status: response.status,
  //     data: response.data,
  //   }
  // }
}

export default new Http()
