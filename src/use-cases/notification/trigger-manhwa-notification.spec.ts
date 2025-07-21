import { InMemoryUserNotificationsRepository } from '@/repositories/in-memory/in-memory-user-notifications-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TriggerManhwaNotificationUseCase } from './trigger-manhwa-notification'
import { UserManhwaStatus, NotificationChannel } from '@prisma/client'
import { InMemoryUserManhwaRepository } from '@/repositories/in-memory/in-memory-user-manhwa-repository'
import { TelegramService } from '@/services/telegram-service'

describe('Trigger Manhwa Notification Use Case', () => {
  let userNotificationsRepository: InMemoryUserNotificationsRepository
  let userManhwaRepository: InMemoryUserManhwaRepository
  let telegramService: TelegramService
  let sut: TriggerManhwaNotificationUseCase

  beforeEach(() => {
    userNotificationsRepository = new InMemoryUserNotificationsRepository()
    userManhwaRepository = new InMemoryUserManhwaRepository()
    telegramService = { sendMessage: vi.fn() } as unknown as TelegramService
    sut = new TriggerManhwaNotificationUseCase(
      userNotificationsRepository,
      userManhwaRepository,
      telegramService,
    )
  })

  it('should be able to trigger notifications for users subscribed to a manhwa', async () => {
    const userId1 = 1n
    const userId2 = 2n
    const manhwaId = 10n
    const newEpisodeNumber = 100

    await userNotificationsRepository.create({
      userId: userId1,
      manhwaId,
      channel: NotificationChannel.TELEGRAM,
      isEnabled: true,
    })

    await userNotificationsRepository.create({
      userId: userId2,
      manhwaId,
      channel: NotificationChannel.EMAIL,
      isEnabled: true,
    })

    await userManhwaRepository.create({
      userId: userId1,
      manhwaId,
      status: UserManhwaStatus.READING,
      order: 1,
    })

    await userManhwaRepository.create({
      userId: userId2,
      manhwaId,
      status: UserManhwaStatus.READING,
      order: 1,
    })

    await sut.execute({ manhwaId, newEpisodeNumber })

    expect(telegramService.sendMessage).toHaveBeenCalledTimes(1)
    expect(telegramService.sendMessage).toHaveBeenCalledWith(
      `telegram-${userId1}`,
      `New episode of *Manhwa ${manhwaId}* is out! Episode *${newEpisodeNumber}* is now available.`,
    )

    const userManhwa1 = await userManhwaRepository.findByUserIdAndManhwaId(
      userId1,
      manhwaId,
    )
    const userManhwa2 = await userManhwaRepository.findByUserIdAndManhwaId(
      userId2,
      manhwaId,
    )

    expect(userManhwa1?.lastNotifiedEpisode).toBe(newEpisodeNumber)
    expect(userManhwa2?.lastNotifiedEpisode).toBe(newEpisodeNumber)
  })

  it('should not send notifications to disabled channels', async () => {
    const userId = 1n
    const manhwaId = 10n
    const newEpisodeNumber = 100

    await userNotificationsRepository.create({
      userId,
      manhwaId,
      channel: NotificationChannel.TELEGRAM,
      isEnabled: false,
    })

    await userManhwaRepository.create({
      userId,
      manhwaId,
      status: UserManhwaStatus.READING,
      order: 1,
    })

    await sut.execute({ manhwaId, newEpisodeNumber })

    expect(telegramService.sendMessage).not.toHaveBeenCalled()

    const userManhwa = await userManhwaRepository.findByUserIdAndManhwaId(
      userId,
      manhwaId,
    )

    expect(userManhwa?.lastNotifiedEpisode).toBeNull()
  })
})
