import { UserNotificationsRepository } from '@/repositories/user-notifications-repository'
import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'

interface TriggerManhwaNotificationUseCaseRequest {
  manhwaId: bigint
  newEpisodeNumber: number
}

export class TriggerManhwaNotificationUseCase {
  constructor(
    private userNotificationsRepository: UserNotificationsRepository,
    private userManhwaRepository: UserManhwaRepository,
  ) {}

  async execute({
    manhwaId,
    newEpisodeNumber,
  }: TriggerManhwaNotificationUseCaseRequest): Promise<void> {
    const userNotifications =
      await this.userNotificationsRepository.findByManhwaId(manhwaId)

    for (const userNotification of userNotifications) {
      // Simulate sending notification
      console.log(
        `Sending notification to user ${userNotification.userId} for manhwa ${userNotification.manhwaId} new episode ${newEpisodeNumber} via ${userNotification.channel}`,
      )

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
