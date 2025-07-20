import { UserNotificationsRepository } from '@/repositories/user-notifications-repository'
import { NotificationChannel, UserNotifications } from '@prisma/client'

interface RegisterUserNotificationUseCaseRequest {
  userId: bigint
  manhwaId: bigint
  channel: NotificationChannel
  isEnabled: boolean
}

interface RegisterUserNotificationUseCaseResponse {
  userNotification: UserNotifications
}

export class RegisterUserNotificationUseCase {
  constructor(
    private userNotificationsRepository: UserNotificationsRepository,
  ) {}

  async execute({
    userId,
    manhwaId,
    channel,
    isEnabled,
  }: RegisterUserNotificationUseCaseRequest): Promise<RegisterUserNotificationUseCaseResponse> {
    const existingNotification =
      await this.userNotificationsRepository.findByUserIdAndManhwaId(
        userId,
        manhwaId,
      )

    let userNotification: UserNotifications

    if (existingNotification) {
      userNotification = (await this.userNotificationsRepository.update(
        existingNotification.id,
        {
          channel,
          isEnabled,
        },
      )) as UserNotifications
    } else {
      userNotification = await this.userNotificationsRepository.create({
        userId,
        manhwaId,
        channel,
        isEnabled,
      })
    }

    return {
      userNotification,
    }
  }
}
