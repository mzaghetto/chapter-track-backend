import { UserManhwa, Prisma, UserManhwaStatus } from '@prisma/client'
import { UserManhwaRepository } from '../user-manhwa-repository'
import { DetailedUserManhwa } from '../dtos/detailed-user-manhwa'

export class InMemoryUserManhwaRepository implements UserManhwaRepository {
  public items: UserManhwa[] = []
  private nextId = 1n

  async create(
    data: Prisma.UserManhwaUncheckedCreateInput,
  ): Promise<UserManhwa> {
    const userManhwa: UserManhwa = {
      id: this.nextId++,
      userId: BigInt(data.userId),
      manhwaId: BigInt(data.manhwaId),
      providerId: data.providerId ? BigInt(data.providerId) : null,
      status: data.status ?? UserManhwaStatus.READING,
      lastEpisodeRead: data.lastEpisodeRead ?? null,
      lastNotifiedEpisode: data.lastNotifiedEpisode ?? null,
      order: data.order,
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.items.push(userManhwa)
    return userManhwa
  }

  async findByUserIdAndManhwaId(
    userId: bigint,
    manhwaId: bigint,
  ): Promise<UserManhwa | null> {
    return (
      this.items.find(
        (item) => item.userId === userId && item.manhwaId === manhwaId,
      ) ?? null
    )
  }

  async findByUserId(
    userId: bigint,
    page: number,
    pageSize: number,
    status?: 'ONGOING' | 'COMPLETED' | 'HIATUS',
    userStatus?: 'READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED',
    manhwaName?: string,
  ): Promise<DetailedUserManhwa[]> {
    let userManhwas = this.items.filter((item) => item.userId === userId)

    if (status) {
      // In-memory doesn't have manhwa status, so this won't filter anything unless we mock it
    }

    if (userStatus) {
      userManhwas = userManhwas.filter((item) => item.status === userStatus)
    }

    // Mock DetailedUserManhwa for filtering and then apply filter
    let detailedManhwas: DetailedUserManhwa[] = userManhwas.map((um) => ({
      id: um.id,
      manhwaId: um.manhwaId,
      manhwaName: `Mock Manhwa ${um.manhwaId}`, // Mocked name for in-memory
      coverImage: 'test.jpg',
      providerId: 1n,
      providerName: 'Test Provider',
      lastEpisodeReleased: 100,
      manhwaUrlProvider: 'test.com',
      statusReading: um.status,
      statusManhwa: 'ONGOING',
      lastEpisodeRead: um.lastEpisodeRead,
      lastNotifiedEpisode: um.lastNotifiedEpisode,
      isTelegramNotificationEnabled: false,
      lastEpisodeReleasedAllProviders: 100, // Placeholder for in-memory
      order: um.order,
      lastUpdated: um.lastUpdated,
      createdAt: um.createdAt,
      updatedAt: um.updatedAt,
    }))

    if (manhwaName) {
      detailedManhwas = detailedManhwas.filter((item) =>
        item.manhwaName?.toLowerCase().includes(manhwaName.toLowerCase()),
      )
    }

    return detailedManhwas.slice((page - 1) * pageSize, page * pageSize)
  }

  async update(
    id: bigint,
    data: Prisma.UserManhwaUncheckedUpdateInput,
  ): Promise<UserManhwa> {
    const index = this.items.findIndex((item) => item.id === id)
    const item = this.items[index]

    const updatedItem = {
      ...item,
      ...data,
      id,
      updatedAt: new Date(),
    } as UserManhwa
    this.items[index] = updatedItem

    return updatedItem
  }

  async delete(id: bigint): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index > -1) {
      this.items.splice(index, 1)
    }
  }

  async countByUserId(
    userId: bigint,
    status?: 'ONGOING' | 'COMPLETED' | 'HIATUS',
    userStatus?: 'READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED',
    manhwaName?: string,
  ): Promise<number> {
    let userManhwas = this.items.filter((item) => item.userId === userId)

    if (status) {
      // In-memory doesn't have manhwa status, so this won't filter anything unless we mock it
    }

    if (userStatus) {
      userManhwas = userManhwas.filter((item) => item.status === userStatus)
    }

    // Mock DetailedUserManhwa for filtering and then apply filter
    let detailedManhwas: DetailedUserManhwa[] = userManhwas.map((um) => ({
      id: um.id,
      manhwaId: um.manhwaId,
      manhwaName: `Mock Manhwa ${um.manhwaId}`, // Mocked name for in-memory
      coverImage: 'test.jpg',
      providerId: 1n,
      providerName: 'Test Provider',
      lastEpisodeReleased: 100,
      manhwaUrlProvider: 'test.com',
      statusReading: um.status,
      statusManhwa: 'ONGOING',
      lastEpisodeRead: um.lastEpisodeRead,
      lastNotifiedEpisode: um.lastNotifiedEpisode,
      isTelegramNotificationEnabled: false,
      lastEpisodeReleasedAllProviders: 100, // Placeholder for in-memory
      order: um.order,
      lastUpdated: um.lastUpdated,
      createdAt: um.createdAt,
      updatedAt: um.updatedAt,
    }))

    if (manhwaName) {
      detailedManhwas = detailedManhwas.filter((item) =>
        item.manhwaName?.toLowerCase().includes(manhwaName.toLowerCase()),
      )
    }

    return detailedManhwas.length
  }

  async findManyByUserId(userId: bigint): Promise<UserManhwa[]> {
    return this.items.filter((item) => item.userId === userId)
  }
}
