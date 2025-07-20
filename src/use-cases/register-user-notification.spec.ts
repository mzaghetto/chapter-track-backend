import { InMemoryUserNotificationsRepository } from '@/repositories/in-memory/in-memory-user-notifications-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUserNotificationUseCase } from './register-user-notification'
import { NotificationChannel } from '@prisma/client'

describe('Register User Notification Use Case', () => {
  let userNotificationsRepository: InMemoryUserNotificationsRepository
  let sut: RegisterUserNotificationUseCase

  beforeEach(() => {
    userNotificationsRepository = new InMemoryUserNotificationsRepository()
    sut = new RegisterUserNotificationUseCase(userNotificationsRepository)
  })

  it('should be able to register a user notification', async () => {
    const { userNotification } = await sut.execute({
      userId: 1n,
      manhwaId: 10n,
      channel: NotificationChannel.TELEGRAM,
      isEnabled: true,
    })

    expect(userNotification.id).toEqual(expect.any(BigInt))
    expect(userNotification.channel).toEqual(NotificationChannel.TELEGRAM)
  })

  it('should be able to update an existing user notification', async () => {
    await userNotificationsRepository.create({
      userId: 1n,
      manhwaId: 10n,
      channel: NotificationChannel.TELEGRAM,
      isEnabled: true,
    })

    const { userNotification } = await sut.execute({
      userId: 1n,
      manhwaId: 10n,
      channel: NotificationChannel.EMAIL,
      isEnabled: false,
    })

    expect(userNotification.channel).toEqual(NotificationChannel.EMAIL)
    expect(userNotification.isEnabled).toEqual(false)
  })
})
