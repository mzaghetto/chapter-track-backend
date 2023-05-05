import { ManhwaUserManhwa, UserManhwa } from '@prisma/client'
import { randomUUID } from 'crypto'
import { UserManhwaRepository } from '../user-manhwa-repository'
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

  async addManhwa(
    userID: string,
    data: ManhwaUserManhwa,
  ): Promise<UserManhwa | null> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa) {
      return Promise.resolve(null)
    }

    userIDManhwa.manhwas.push(data)

    return Promise.resolve(userIDManhwa)
  }

  removeManhwa(userID: string, manhwaID: string): Promise<UserManhwa | null> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa) {
      return Promise.resolve(null)
    }

    const manhwaIDIndex = userIDManhwa.manhwas.findIndex(
      (item) => item.manhwa_id === manhwaID,
    )

    if (manhwaIDIndex === -1) {
      return Promise.resolve(null)
    }

    userIDManhwa.manhwas.splice(manhwaIDIndex, 1)

    return Promise.resolve(userIDManhwa)
  }

  getAllManhwas(userID: string): Promise<ManhwaUserManhwa[] | null> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa) {
      return Promise.resolve(null)
    }

    return Promise.resolve(userIDManhwa.manhwas)
  }

  getManhwasByProfile(
    userID: string,
    page: number,
  ): Promise<UserManhwa | null> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa) {
      return Promise.resolve(null)
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
  ): Promise<string | null> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa || !userIDManhwa.manhwas) {
      return Promise.resolve(null)
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

  getQtyManhwas(userID: string): Promise<number | null> {
    const userIDManhwa = this.items.find((item) => item.user_id === userID)

    if (!userIDManhwa) {
      return Promise.resolve(null)
    }

    return Promise.resolve(userIDManhwa.manhwas.length)
  }
}
