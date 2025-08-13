import ApiService from '@/services/api.service.ts'
import type { Notification, PageRequest, PageResponse } from '@/types/common.type.ts'
import { cleanObj } from '@/utils/use.util.ts'

export class AlertService extends ApiService {
  private notificationKeyMapping = {
    id: 'id',
    target: 'target',
    message: 'message',
    title: 'title',
    readAt: 'readAt',
    createdAt: 'createdAt',
  }

  constructor() {
    super('user')
  }

  async listNotifications(options?: { page?: PageRequest }): Promise<PageResponse<Notification>> {
    const res = await this.setAuth().get('/my/noti', {
      params: {
        page: options?.page?.page,
        size: 20,
      },
    })
    const { meta, list } = this.unpackRes(res) as PageResponse<Notification>
    if (list.length > 0) {
      const notifications = list.map((noti: any) => {
        const semi = cleanObj<Notification>(noti, this.notificationKeyMapping)
        const [category, sub] = noti.type.split('__')
        semi.type = { category, sub }
        semi.payload = JSON.parse(noti.payload)
        return semi
      })
      return {
        meta: {
          pageNo: meta.pageNo,
          pageSize: meta.pageSize,
          totalPage: meta.totalPage,
          totalCount: meta.totalCount,
        },
        list: notifications,
      }
    }
    return this.emptyPage as PageResponse<Notification>
  }

  async markAsRead(params: { ids: number[] }) {
    await this.setAuth().post('/my/noti', params)
  }
}
