import { UserManhwa, Prisma, UserManhwaStatus } from '@prisma/client'
import { UserManhwaRepository } from '../user-manhwa-repository'

export class InMemoryUserManhwaRepository implements UserManhwaRepository {
  public items: UserManhwa[] = []
  private nextId = 1n

  async create(data: Prisma.UserManhwaUncheckedCreateInput): Promise<UserManhwa> {
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

  async findByUserId(userId: bigint, page: number, pageSize: number): Promise<UserManhwa[]> {
    const userManhwas = this.items.filter((item) => item.userId === userId)
    return userManhwas.slice((page - 1) * pageSize, page * pageSize)
  }

  async update(id: bigint, data: Prisma.UserManhwaUncheckedUpdateInput): Promise<UserManhwa> {
    const index = this.items.findIndex((item) => item.id === id)
    const item = this.items[index]

    const updatedItem = { ...item, ...data, id, updatedAt: new Date() } as UserManhwa
    this.items[index] = updatedItem

    return updatedItem
  }

  async delete(id: bigint): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index > -1) {
      this.items.splice(index, 1)
    }
  }

  async countByUserId(userId: bigint): Promise<number> {
    return this.items.filter((item) => item.userId === userId).length
  }

  async findManyByUserId(userId: bigint): Promise<UserManhwa[]> {
    return this.items.filter((item) => item.userId === userId)
  }
}