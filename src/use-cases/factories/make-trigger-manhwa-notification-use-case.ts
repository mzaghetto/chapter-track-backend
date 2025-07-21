import { PrismaUserNotificationsRepository } from '@/repositories/prisma/prisma-user-notifications-repository'
import { TriggerManhwaNotificationUseCase } from '@/use-cases/notification/trigger-manhwa-notification'
import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'
import { TelegramService } from '@/services/telegram-service'

export function makeTriggerManhwaNotificationUseCase() {
  const userNotificationsRepository = new PrismaUserNotificationsRepository()
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const telegramService = new TelegramService()
  const useCase = new TriggerManhwaNotificationUseCase(
    userNotificationsRepository,
    userManhwaRepository,
    telegramService,
  )

  return useCase
}
