import { ManhwaUserManhwa, UserManhwa } from '@prisma/client'
import { randomUUID } from 'crypto'
import { UserManhwaRepository } from '../user-manhwa-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { ManhwaAlreadyExistsError } from '@/use-cases/errors/manhwa-already-exists-error'

export class InMemoryUserManhwaRepository implements UserManhwaRepository {
  public items: UserManhwa[] = []

  async create(data: UserManhwa): Promise<UserManhwa> {
    const userManhwa = {
      user_id: data.user_id,
      id: data.id ?? randomUUID(),
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

  removeManhwa(userID: string, manhwaID: string): Promise<UserManhwa> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa) {
      throw new ResourceNotFoundError()
    }

    const manhwaIDIndex = userIDManhwa.manhwas.findIndex(
      (item) => item.manhwa_id === manhwaID,
    )

    if (manhwaIDIndex === -1) {
      throw new ResourceNotFoundError()
    }

    userIDManhwa.manhwas.splice(manhwaIDIndex, 1)

    return Promise.resolve(userIDManhwa)
  }

  getAllManhwas(userID: string): Promise<ManhwaUserManhwa[]> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa) {
      throw new ResourceNotFoundError()
    }

    return Promise.resolve(userIDManhwa.manhwas)
  }

  getManhwasByProfile(userID: string, page: number): Promise<UserManhwa> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa) {
      throw new ResourceNotFoundError()
    }

    userIDManhwa.manhwas = userIDManhwa.manhwas.slice(
      (page - 1) * 20,
      page * 20,
    )

    return Promise.resolve(userIDManhwa)
  }

  updateManhwaOrder(
    userID: string,
    order: { manhwa_id: string; manhwa_position: number }[],
  ): Promise<string> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa || !userIDManhwa.manhwas) {
      throw new ResourceNotFoundError()
    }

    const manhwaList = userIDManhwa.manhwas
    const updatedManhwas = order
      .map((manhwa) => {
        const matchingManhwas = manhwaList.filter(
          (item) => item.manhwa_id === manhwa.manhwa_id,
        )
        matchingManhwas.forEach((matchingManhwa) => {
          matchingManhwa.manhwa_position = manhwa.manhwa_position
        })
        return matchingManhwas
      })
      .flat()

    userIDManhwa.manhwas = updatedManhwas

    return Promise.resolve('Atualizado com sucesso!')
  }

  findByManhwaID(
    userID: string,
    manhwaID: string,
  ): Promise<UserManhwa | null | undefined> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    const manhwaAlreadyRegistered = userIDManhwa?.manhwas.find(
      (item) => item.manhwa_id === manhwaID,
    )

    if (manhwaAlreadyRegistered) {
      throw new ManhwaAlreadyExistsError()
    }

    return Promise.resolve(manhwaAlreadyRegistered)
  }

  getQtyManhwas(userID: string): Promise<number> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa) {
      throw new ResourceNotFoundError()
    }

    return Promise.resolve(userIDManhwa.manhwas.length)
  }
}
