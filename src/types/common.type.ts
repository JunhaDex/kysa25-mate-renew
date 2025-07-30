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
}

export type SkeletonUIType = 'list-card'
