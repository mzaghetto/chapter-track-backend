import { UserNotifications, Prisma } from '@prisma/client'
import { UserNotificationsRepository } from '@/repositories/user-notifications-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface UpdateUserNotificationUseCaseRequest {
  userNotificationId: bigint
  data: Prisma.UserNotificationsUpdateInput
}

interface UpdateUserNotificationUseCaseResponse {
  userNotification: UserNotifications
}

export class UpdateUserNotificationUseCase {
  constructor(private userNotificationsRepository: UserNotificationsRepository) {}

  async execute({
    userNotificationId,
    data,
  }: UpdateUserNotificationUseCaseRequest): Promise<UpdateUserNotificationUseCaseResponse> {
    const userNotification = await this.userNotificationsRepository.update(
      userNotificationId,
      data,
    )

    if (!userNotification) {
      throw new ResourceNotFoundError()
    }

    return {
      userNotification,
    }
  }
}