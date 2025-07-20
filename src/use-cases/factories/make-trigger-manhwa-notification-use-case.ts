import { PrismaUserNotificationsRepository } from '@/repositories/prisma/prisma-user-notifications-repository'
import { TriggerManhwaNotificationUseCase } from '../trigger-manhwa-notification'
import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'

export function makeTriggerManhwaNotificationUseCase() {
  const userNotificationsRepository = new PrismaUserNotificationsRepository()
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const useCase = new TriggerManhwaNotificationUseCase(
    userNotificationsRepository,
    userManhwaRepository,
  )

  return useCase
}
