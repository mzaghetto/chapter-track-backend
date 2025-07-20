import { UserNotifications, NotificationChannel } from '@prisma/client'
import { UserNotificationsRepository } from '@/repositories/user-notifications-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { UsersRepository } from '@/repositories/users-repository'
import { ManhwasRepository } from '@/repositories/manhwas-repository'

interface CreateUserNotificationUseCaseRequest {
  userId: bigint
  manhwaId: bigint
  channel: NotificationChannel
  isEnabled?: boolean
}

interface CreateUserNotificationUseCaseResponse {
  userNotification: UserNotifications
}

export class CreateUserNotificationUseCase {
  constructor(
    private userNotificationsRepository: UserNotificationsRepository,
    private usersRepository: UsersRepository,
    private manhwasRepository: ManhwasRepository,
  ) {}

  async execute({
    userId,
    manhwaId,
    channel,
    isEnabled,
  }: CreateUserNotificationUseCaseRequest): Promise<CreateUserNotificationUseCaseResponse> {
    const user = await this.usersRepository.findByID(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }

    const manhwa = await this.manhwasRepository.findByID(manhwaId)
    if (!manhwa) {
      throw new ResourceNotFoundError()
    }

    const userNotification = await this.userNotificationsRepository.create({
      userId,
      manhwaId,
      channel,
      isEnabled,
    })

    return {
      userNotification,
    }
  }
}