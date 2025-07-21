import { UserNotificationsRepository } from '@/repositories/user-notifications-repository'
import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { TelegramService } from '@/services/telegram-service'
import { NotificationChannel } from '@prisma/client'

interface TriggerManhwaNotificationUseCaseRequest {
  manhwaId: bigint
  newEpisodeNumber: number
}

export class TriggerManhwaNotificationUseCase {
  constructor(
    private userNotificationsRepository: UserNotificationsRepository,
    private userManhwaRepository: UserManhwaRepository,
    private telegramService: TelegramService,
  ) {}

  async execute({
    manhwaId,
    newEpisodeNumber,
  }: TriggerManhwaNotificationUseCaseRequest): Promise<void> {
    const userNotifications =
      await this.userNotificationsRepository.findDetailedByManhwaId(manhwaId)

    for (const userNotification of userNotifications) {
      if (userNotification.channel === NotificationChannel.TELEGRAM) {
        if (
          userNotification.user.telegramId &&
          userNotification.user.telegramActive
        ) {
          const message = `New episode of *${userNotification.manhwa.name}* is out! Episode *${newEpisodeNumber}* is now available.`
          await this.telegramService.sendMessage(
            userNotification.user.telegramId,
            message,
          )
        }
      }

      // Update lastNotifiedEpisode in UserManhwa
      const userManhwa =
        await this.userManhwaRepository.findByUserIdAndManhwaId(
          userNotification.userId,
          userNotification.manhwaId,
        )

      if (userManhwa) {
        await this.userManhwaRepository.update(userManhwa.id, {
          lastNotifiedEpisode: newEpisodeNumber,
        })
      }
    }
  }
}
