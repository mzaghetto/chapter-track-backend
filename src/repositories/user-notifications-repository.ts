import { UserNotifications, Prisma } from '@prisma/client'
import { DetailedUserNotification } from './dtos/detailed-user-notification'

export interface UserNotificationsRepository {
  create(
    data: Prisma.UserNotificationsUncheckedCreateInput,
  ): Promise<UserNotifications>
  findByUserIdAndManhwaId(
    userId: bigint,
    manhwaId: bigint,
  ): Promise<UserNotifications | null>
  findById(id: bigint): Promise<UserNotifications | null>
  update(
    id: bigint,
    data: Prisma.UserNotificationsUpdateInput,
  ): Promise<UserNotifications | null>
  delete(id: bigint): Promise<void>
  findManyByUserId(userId: bigint): Promise<UserNotifications[]>
  findByManhwaId(manhwaId: bigint): Promise<UserNotifications[]>
  findDetailedByManhwaId(manhwaId: bigint): Promise<DetailedUserNotification[]>
}
