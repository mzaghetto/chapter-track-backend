import { ManhwaUserManhwa, UserManhwa } from '@prisma/client'
import { randomUUID } from 'crypto'
import { UserManhwaRepository } from '../user-manhwa-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

export class InMemoryUserManhwaRepository implements UserManhwaRepository {
  public items: UserManhwa[] = []

  async create(data: UserManhwa): Promise<UserManhwa> {
    const userManhwa = {
      user_id: data.user_id,
      id: randomUUID(),
      manhwas: [],
      telegram_active: false,
      telegram_id: null,
    }

    this.items.push(userManhwa)

    return Promise.resolve(userManhwa)
  }

  async addManhwa(userID: string, data: ManhwaUserManhwa): Promise<UserManhwa> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa) {
      throw new ResourceNotFoundError()
    }

    userIDManhwa.manhwas.push(data)

    return Promise.resolve(userIDManhwa)
  }
}
