import { UserNotifications, Prisma } from '@prisma/client'
import { UserNotificationsRepository } from '../user-notifications-repository'
import { DetailedUserNotification } from '../dtos/detailed-user-notification'

export class InMemoryUserNotificationsRepository
  implements UserNotificationsRepository
{
  public items: UserNotifications[] = []
  private nextId = 1n

  async create(
    data: Prisma.UserNotificationsUncheckedCreateInput,
  ): Promise<UserNotifications> {
    const userNotification: UserNotifications = {
      id: this.nextId++,
      userId: BigInt(data.userId),
      manhwaId: BigInt(data.manhwaId),
      channel: data.channel,
      isEnabled: data.isEnabled ?? true,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    }
    this.items.push(userNotification)
    return userNotification
  }

  async findByUserIdAndManhwaId(
    userId: bigint,
    manhwaId: bigint,
  ): Promise<UserNotifications | null> {
    return (
      this.items.find(
        (item) => item.userId === userId && item.manhwaId === manhwaId,
      ) ?? null
    )
  }

  async findById(id: bigint): Promise<UserNotifications | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async update(
    id: bigint,
    data: Prisma.UserNotificationsUpdateInput,
  ): Promise<UserNotifications | null> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      return null
    }
    const updatedItem = {
      ...this.items[index],
      ...data,
      updatedAt: new Date(),
    } as UserNotifications
    this.items[index] = updatedItem
    return updatedItem
  }

  async delete(id: bigint): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index > -1) {
      this.items.splice(index, 1)
    }
  }

  async findManyByUserId(userId: bigint): Promise<UserNotifications[]> {
    return this.items.filter((item) => item.userId === userId)
  }

  async findByManhwaId(manhwaId: bigint): Promise<UserNotifications[]> {
    return this.items.filter(
      (item) => item.manhwaId === manhwaId && item.isEnabled,
    )
  }

  async findDetailedByManhwaId(
    manhwaId: bigint,
  ): Promise<DetailedUserNotification[]> {
    const notifications = this.items.filter(
      (item) => item.manhwaId === manhwaId && item.isEnabled,
    )

    return notifications.map((notification) => ({
      ...notification,
      user: {
        telegramId: `telegram-${notification.userId}`,
        name: `User ${notification.userId}`,
        telegramActive: true,
      },
      manhwa: {
        name: `Manhwa ${notification.manhwaId}`,
      },
    }))
  }
}
