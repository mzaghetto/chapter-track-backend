import { UserManhwa } from '@prisma/client'
import { randomUUID } from 'crypto'
import { UserManhwaRepository } from '../user-manhwa-repository'

export class InMemoryUserManhwaRepository implements UserManhwaRepository {
  public items: UserManhwa[] = []

  async create(data: UserManhwa): Promise<UserManhwa> {
    const userManhwa = {
      user_id: data.user_id,
      id: randomUUID(),
      manhwas: null,
      telegram_active: false,
      telegram_id: null,
    }

    this.items.push(userManhwa)

    return Promise.resolve(userManhwa)
  }
}
