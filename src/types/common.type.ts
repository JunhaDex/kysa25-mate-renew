export interface PageResponse<T> {
  meta: PageMeta
  list: T[]
}

export interface PageMeta {
  pageNo: number
  pageSize: number
  totalPage: number
  totalCount: number
}

export interface PageRequest {
  page?: number
  size?: number
}

export type KeyMapping = { [key: string]: string }

export interface AuthLogin {
  accessToken: string
  isRegister: boolean
}

export interface Mention {
  ref: string
  nickname: string
  profileImg?: string
}

export interface ToastMessage {
  id: number
  message: string
  type?: 'success' | 'error' | 'info' | 'message'
}

export type SkeletonUIType = 'list-card'

export interface Notification {
  id: number
  target: number
  type: {
    category: string
    sub: string
  }
  payload: any
  message: string
  title: string
  readAt: string | null
  createdAt: string
}
