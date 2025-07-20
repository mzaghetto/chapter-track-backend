import { PrismaUserNotificationsRepository } from '@/repositories/prisma/prisma-user-notifications-repository'
import { RegisterUserNotificationUseCase } from '../register-user-notification'

export function makeRegisterUserNotificationUseCase() {
  const userNotificationsRepository = new PrismaUserNotificationsRepository()
  const useCase = new RegisterUserNotificationUseCase(
    userNotificationsRepository,
  )

  return useCase
}
