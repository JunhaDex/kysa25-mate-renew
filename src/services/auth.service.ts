import ApiService from '@/services/api.service.ts'
import type { AuthLogin } from '@/types/common.type.ts'

export class AuthService extends ApiService {
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
  }

  logout(): void {
    this.authStore.token = ''
  }
}
