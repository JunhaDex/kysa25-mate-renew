import ApiService from '@/services/api.service.ts'
import type { KeyMapping, PageRequest, PageResponse } from '@/types/common.type.ts'
import type { Friend } from '@/types/friend.type.ts'
import { cleanObj } from '@/utils/use.util.ts'

export class FriendService extends ApiService {
  private friendKeyMapping: KeyMapping = {
    id: 'id',
    ref: 'ref',
    name: 'name',
    sex: 'sex',
    age: 'age',
    dob: 'dob',
    geo: 'geo',
    nickname: 'nickname',
    profileImg: 'profileImg',
    introduce: 'introduce',
  }
  constructor() {
    super('user')
  }

  async listFriends(options?: {
    page?: PageRequest
    name?: string
    team?: string
    sex?: number
  }): Promise<PageResponse<Friend>> {
    const res = await this.setAuth().get('/secure-list', {
      params: {
        page: options?.page?.page,
        size: options?.page?.size,
        name: options?.name,
        'team-name': options?.team,
        sex: options?.sex,
      },
    })
    const { meta, list } = this.unpackRes(res) as PageResponse<Friend>
    if (list.length > 0) {
      return {
        meta: {
          pageNo: meta.pageNo,
          pageSize: meta.pageSize,
          totalPage: meta.totalPage,
          totalCount: meta.totalCount,
        },
        list: list.map((friend: any) => {
          const semi = cleanObj<Friend>(friend, this.friendKeyMapping)
          semi.team = {
            teamId: friend.teamId,
            teamName: friend.teamName,
          }
          return semi
        }),
      }
    }
    return this.emptyPage as PageResponse<Friend>
  }
}
