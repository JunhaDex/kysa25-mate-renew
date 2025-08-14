import type { Mention } from '@/types/common.type.ts'

export interface Group {
  id: number
  ref: string
  groupName: string
  creator: Mention
  profileImg: string
  coverImg: string
  introduce: string
  isShow: boolean
  priority: number
  posts: Post[]
  postCount: number
  followers: number
  already?: boolean
}

export interface Post {
  id: number
  author: Mention
  team: Team
  image: string | null
  content: string
  createdAt: string
  likes: number
  comments: number
  isLiked: boolean
}

export interface Team {}

export interface Reply {
  id: number
  author: Mention
  message: string
  createdAt: string
}
