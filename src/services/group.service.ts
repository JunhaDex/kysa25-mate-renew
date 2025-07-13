import ApiService from '@/services/api.service.ts'
import type { KeyMapping, PageRequest, PageResponse } from '@/types/common.type.ts'
import type { Group } from '@/types/group.type.ts'
import { cleanObj } from '@/utils/use.util.ts'

export class GroupService extends ApiService {
  private groupKeyMapping: KeyMapping = {
    id: 'id',
    ref: 'ref',
    groupName: 'groupName',
    profileImg: 'profileImg',
    introduce: 'introduce',
    isShow: 'isShow',
    priority: 'priority',
    followers: 'followers',
  }

  constructor() {
    super('group')
  }

  async listGroups(options?: { page?: PageRequest; name?: string }): Promise<PageResponse<Group>> {
    const res = await this.setAuth().get('', {
      params: {
        page: options?.page?.page,
        size: 10,
        name: options?.name,
      },
    })
    const { meta, list } = this.unpackRes(res) as PageResponse<Group>
    if (list.length > 0) {
      return {
        meta: {
          pageNo: meta.pageNo,
          pageSize: meta.pageSize,
          totalPage: meta.totalPage,
          totalCount: meta.totalCount,
        },
        list: list.map((group: any) => {
          const semi = cleanObj<Group>(group, this.groupKeyMapping)
          semi.creator = {
            ref: group.creatorRef,
            nickname: group.creatorNickname,
          }
          if (group.already !== undefined) semi.already = group.already
          return semi
        }),
      }
    }
    return this.emptyPage as PageResponse<Group>
  }

  // async getMyGroups(): Promise<Group[]> {
  //   const res = await this.auth().client.get('/mylist')
  //   const groups = this.unpackRes(res) as Group[]
  //   return groups.map((group) => this.cleanGroup(group))
  // }
}
