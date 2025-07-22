import ApiService from '@/services/api.service.ts'
import type { KeyMapping, PageRequest, PageResponse } from '@/types/common.type.ts'
import type { Chat, ChatRoom } from '@/types/chat.type.ts'
import { cleanObj } from '@/utils/use.util.ts'

export class ChatService extends ApiService {
  private chatRoomKeyMapping: KeyMapping = {
    id: 'id',
    ref: 'ref',
    title: 'title',
    isBlock: 'isBlock',
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
        const semi = cleanObj<ChatRoom>(room, this.chatRoomKeyMapping)
        semi.lastChat = cleanObj(room.lastChat, this.chatItemKeyMapping)
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

  async getChatRoom(chatRoomId: string): Promise<PageResponse<Chat>> {
    const res = await this.setAuth().get(`/history/${chatRoomId}`)
    const { meta, list } = this.unpackRes(res) as PageResponse<Chat>
    return this.emptyPage as PageResponse<Chat>
  }
}
