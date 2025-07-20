import { UserNotifications, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { UserNotificationsRepository } from '../user-notifications-repository'

export class PrismaUserNotificationsRepository implements UserNotificationsRepository {
  async create(data: Prisma.UserNotificationsUncheckedCreateInput): Promise<UserNotifications> {
    return prisma.userNotifications.create({ data })
  }

  async findByUserIdAndManhwaId(
    userId: bigint,
    manhwaId: bigint,
  ): Promise<UserNotifications | null> {
    return prisma.userNotifications.findFirst({
      where: { userId, manhwaId },
    })
  }

  async findById(id: bigint): Promise<UserNotifications | null> {
    return prisma.userNotifications.findUnique({
      where: { id },
    })
  }

  async update(id: bigint, data: Prisma.UserNotificationsUpdateInput): Promise<UserNotifications> {
    return prisma.userNotifications.update({
      where: { id },
      data,
    })
  }

  async delete(id: bigint): Promise<void> {
    await prisma.userNotifications.delete({ where: { id } })
  }

  async findManyByUserId(userId: bigint): Promise<UserNotifications[]> {
    return prisma.userNotifications.findMany({
      where: { userId },
    })
  }
}