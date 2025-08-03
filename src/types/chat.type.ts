import type { UserProfile } from '@/types/friend.type.ts'

export interface ChatRoom {
  id: number
  ref: string
  title: string
  isBlock: boolean
  lastRead: number
  lastChat: Chat
  userId: number
  party: UserProfile[]
}

export interface Chat {
  id: number
  sender: number
  message: string
  encoded: boolean
  createdAt: string
}
