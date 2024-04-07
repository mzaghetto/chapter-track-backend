import { TelegramNotificationUseCase } from '../telegram-notification-status'
import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'

export function makeTelegramNotificationUseCase() {
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const telegramNotificationUseCase = new TelegramNotificationUseCase(
    userManhwaRepository,
  )

  return telegramNotificationUseCase
}
