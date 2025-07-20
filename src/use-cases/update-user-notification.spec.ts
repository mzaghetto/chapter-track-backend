import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserNotificationsRepository } from '@/repositories/in-memory/in-memory-user-notifications-repository'
import { UpdateUserNotificationUseCase } from './update-user-notification'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { NotificationChannel } from '@prisma/client'

let userNotificationsRepository: InMemoryUserNotificationsRepository
let sut: UpdateUserNotificationUseCase

describe('Update User Notification Use Case', () => {
  beforeEach(async () => {
    userNotificationsRepository = new InMemoryUserNotificationsRepository()
    sut = new UpdateUserNotificationUseCase(userNotificationsRepository)

    await userNotificationsRepository.create({
      userId: BigInt(1),
      manhwaId: BigInt(1),
      channel: NotificationChannel.TELEGRAM,
      isEnabled: true,
    })
  })

  it('should be able to update a user notification', async () => {
    const { userNotification } = await sut.execute({
      userNotificationId: BigInt(1),
      data: {
        isEnabled: false,
      },
    })

    expect(userNotification.isEnabled).toEqual(false)
  })

  it('should not be able to update a non-existent user notification', async () => {
    await expect(() =>
      sut.execute({
        userNotificationId: BigInt(99),
        data: {
          isEnabled: false,
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})