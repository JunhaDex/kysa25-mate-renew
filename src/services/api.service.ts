import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import type { PageMeta, PageResponse } from '@/types/common.type.ts'
import { useAuthStore } from '@/stores/auth.store.ts'
import { useTeamStore } from '@/stores/team.store.ts'

export default abstract class ApiService {
  protected authStore: any
  protected teamStore: any
  protected axios: AxiosInstance
  private emptyPageMeta: PageMeta = {
    pageNo: 1,
    pageSize: 0,
    totalPage: 0,
    totalCount: 0,
  } as const
  protected emptyPage: PageResponse<unknown> = {
    meta: this.emptyPageMeta,
    list: [],
  }

  constructor(resource: string) {
    this.authStore = useAuthStore()
    this.teamStore = useTeamStore()
    this.axios = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/${resource}`,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    this.axios.interceptors.response.use(
      (res) => {
        return res
      },
      (err) => {
        if (err.response.status === 401) {
          this.authStore.token = ''
          window.location.href = '/login'
        } else if (err.response.status === 500) {
          this.authStore.circuitBreak = true
          window.location.href = '/error'
        }
        return Promise.reject(err)
      },
    )
  }

  setAuth(): AxiosInstance {
    const token = this.authStore.token
    if (token) {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    return this.axios
  }

  unpackRes(res: AxiosResponse): unknown {
    return res.data.result
  }
}
