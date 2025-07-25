import { TelegramNotificationUseCase } from '@/use-cases/user/telegram-notification-status'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeTelegramNotificationUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const telegramNotificationUseCase = new TelegramNotificationUseCase(
    usersRepository,
  )

  return telegramNotificationUseCase
}
