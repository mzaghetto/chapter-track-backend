import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { TelegramIDRequired } from './errors/telegram-id-required'

interface NotificationTelegramStatusUseCaseRequest {
  userId: bigint
  telegramId?: string
  activate: boolean
}

interface NotificationTelegramStatusUseCaseResponse {
  activate: boolean
}

export class TelegramNotificationUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    telegramId,
    activate,
  }: NotificationTelegramStatusUseCaseRequest): Promise<NotificationTelegramStatusUseCaseResponse> {
    const user = await this.usersRepository.findByID(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    if (telegramId) {
      user.telegramId = telegramId
    } else if (!user.telegramId) {
      throw new TelegramIDRequired()
    }

    await this.usersRepository.updateTelegram(userId, user.telegramId, activate)

    return {
      activate,
    }
  }
}