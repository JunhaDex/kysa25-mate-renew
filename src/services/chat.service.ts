import ApiService from '@/services/api.service.ts'

export class ChatService extends ApiService {
  constructor() {
    super('chat')
  }

  async listChats() {
    const res = await this.setAuth().get('/recent')
  }
}
