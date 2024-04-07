import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { TelegramIDRequired } from './errors/telegram-id-required'

interface NotificationTelegramStatusUseCaseRequest {
  userID: string
  telegramID?: string
  activate: boolean
}

interface NotificationTelegramStatusUseCaseResponse {
  activate: boolean
}

export class TelegramNotificationUseCase {
  constructor(private userManhwaRepository: UserManhwaRepository) {}

  async execute({
    userID,
    telegramID,
    activate,
  }: NotificationTelegramStatusUseCaseRequest): Promise<NotificationTelegramStatusUseCaseResponse> {
    const userTelegramInfo = await this.userManhwaRepository.getTelegramUser(
      userID,
    )

    if (!userTelegramInfo) {
      throw new ResourceNotFoundError()
    }

    if (telegramID) userTelegramInfo.telegramID = telegramID
    if (!userTelegramInfo.telegramID) throw new TelegramIDRequired()

    activate
      ? (userTelegramInfo.telegramActive = true)
      : (userTelegramInfo.telegramActive = false)

    const userTelegramUpdate =
      await this.userManhwaRepository.updateTelegramUser(
        userID,
        userTelegramInfo.telegramID,
        userTelegramInfo.telegramActive,
      )

    return {
      activate: userTelegramUpdate.telegramActive,
    }
  }
}
