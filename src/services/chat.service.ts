import ApiService from '@/services/api.service.ts'
import type { KeyMapping, PageRequest, PageResponse } from '@/types/common.type.ts'
import type { Chat, ChatRoom } from '@/types/chat.type.ts'
import { cleanObj } from '@/utils/use.util.ts'
import type { UserProfile } from '@/types/friend.type.ts'

export class ChatService extends ApiService {
  private chatRoomKeyMapping: KeyMapping = {
    id: 'id',
    ref: 'ref',
    title: 'title',
    isBlock: 'isBlock',
    userId: 'userId',
    lastRead: 'lastRead',
  }

  private chatItemKeyMapping: KeyMapping = {
    id: 'id',
    sender: 'sender',
    message: 'message',
    encoded: 'encoded',
    createdAt: 'createdAt',
  }

  private chatUserKeyMapping: KeyMapping = {
    id: 'id',
    ref: 'ref',
    nickname: 'nickname',
    profileImg: 'profileImg',
    coverImg: 'coverImg',
    introduce: 'introduce',
    teamId: 'teamId',
  }

  constructor() {
    super('chat')
  }

  async listChats(options?: { page?: PageRequest }): Promise<PageResponse<ChatRoom>> {
    const res = await this.setAuth().get('/recent', {
      params: {
        page: options?.page?.page,
        size: 10,
      },
    })
    const { meta, list } = this.unpackRes(res) as PageResponse<ChatRoom>
    if (list.length > 0) {
      const roomList = list.map((room: any) => {
        console.log(room.lastChat)
        const semi = cleanObj<ChatRoom>(room, this.chatRoomKeyMapping)
        semi.lastChat = cleanObj<Chat>(room.lastChat, this.chatItemKeyMapping)
        console.log(semi.lastChat)
        semi.party = room.party.map((user: any) => {
          return cleanObj(user, this.chatUserKeyMapping)
        })
        return semi
      })
      return {
        list: roomList,
        meta: {
          pageNo: meta.pageNo,
          pageSize: meta.pageSize,
          totalPage: meta.totalPage,
          totalCount: meta.totalCount,
        },
      }
    }
    return this.emptyPage as PageResponse<ChatRoom>
  }

  async getChatRoom(
    chatRoomId: string,
    options?: { page?: PageRequest; anchor?: number },
  ): Promise<PageResponse<Chat>> {
    const res = await this.setAuth().get(`/history/${chatRoomId}`, {
      params: {
        page: options?.page?.page,
        size: 20,
        'begin-id': options?.anchor,
      },
    })
    const { meta, list } = this.unpackRes(res) as PageResponse<Chat>
    if (list.length > 0) {
      return {
        meta,
        list: list.map((chat: any) => {
          return cleanObj<Chat>(chat, this.chatItemKeyMapping)
        }),
      }
    }
    return this.emptyPage as PageResponse<Chat>
  }

  async getChatRoomDetail(roomRef: string): Promise<{
    room: ChatRoom
    users: UserProfile[]
  }> {
    const res = await this.setAuth().get(`/room/${roomRef}/detail`)
    const raw = this.unpackRes(res) as any
    const room = cleanObj<ChatRoom>(raw.chatRoom, this.chatRoomKeyMapping)
    const users = raw.users.map((user: any) => {
      return cleanObj<UserProfile>(user, this.chatUserKeyMapping)
    })
    return {
      room,
      users,
    }
  }

  getSocket(roomRef: string) {
    const jwt = this.authStore.token
    return new WebSocket(`${import.meta.env.VITE_SOCKET_URL}/chat/${roomRef}`, [jwt])
  }

  parseSocketMessage(msg: any): Chat {
    const reqKeys = ['id', 'sender', 'message', 'encoded', 'createdAt']
    if (reqKeys.every((key) => Object.keys(msg).includes(key))) {
      return cleanObj<Chat>(msg, this.chatItemKeyMapping)
    }
    throw new Error('Invalid message format')
  }

  /**
   * create or find chat room
   */
  async getChatRoomRef(userRef: string) {
    const res = await this.setAuth().get(`/user/${userRef}`)
    const upk = this.unpackRes(res) as any
    return upk.ref
  }

  async sendTicket(recipientRef: string, parentChatId?: number) {
    const params = parentChatId ? { originId: parentChatId } : {}
    await this.setAuth().post(`/ticket/${recipientRef}`, {}, { params })
  }

  async markAsRead(roomRef: string): Promise<void> {
    await this.setAuth().put(`read/${roomRef}`)
  }

  async countTicketRemain(): Promise<number> {
    const res = await this.setAuth().get('ticket/count')
    const raw = this.unpackRes(res) as { count: number }
    return raw.count
  }

  async authPostmanAccess(key: string): Promise<boolean> {
    try {
      await this.setAuth().post('postman/auth', { passKey: key })
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async sendPostmanAlert(refs: string[], key: string): Promise<void> {
    const payload = {
      refs,
      passKey: key,
    }
    await this.setAuth().post('postman/send', payload)
  }
}
