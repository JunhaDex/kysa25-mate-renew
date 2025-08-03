import ApiService from '@/services/api.service.ts'
import type { AuthLogin, KeyMapping } from '@/types/common.type.ts'
import { cleanObj } from '@/utils/use.util.ts'
import type { Friend } from '@/types/friend.type.ts'

export class AuthService extends ApiService {
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
    super('auth')
  }

  async login(params: {
    id: string
    pwd: string
    fcm?: {
      token: string
      device: string
    }
  }): Promise<void> {
    const res = await this.setAuth().post('/login', { ...params })
    const auth = this.unpackRes(res) as AuthLogin
    this.authStore.token = auth.accessToken
    await this.getMyInfo()
  }

  logout(): void {
    this.authStore.token = ''
    this.authStore.myInfo = undefined
  }

  async updateMyInfo(
    ref: string,
    params: {
      profileImg?: string
      introduce?: string
    },
  ): Promise<void> {
    await this.setAuth().patch(`${import.meta.env.VITE_API_URL}/user/my/${ref}`, params)
  }

  async getMyInfo(): Promise<void> {
    const my = await this.setAuth().get('/my')
    const user = this.unpackRes(my) as any
    const info = cleanObj<Friend>(user, this.friendKeyMapping)
    info.team = {
      teamId: user.teamId,
      teamName: user.teamName,
    }
    this.authStore.myInfo = info
  }
}
