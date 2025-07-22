import { UsersRepository } from '@/repositories/users-repository'
import { Users } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface UpdateUserTelegramUseCaseRequest {
  userId: bigint
  telegramId: string | null
  telegramActive: boolean
  telegramLinkingToken?: string | null
}

interface UpdateUserTelegramUseCaseResponse {
  user: Users
}

export class UpdateUserTelegramUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    telegramId,
    telegramActive,
    telegramLinkingToken,
  }: UpdateUserTelegramUseCaseRequest): Promise<UpdateUserTelegramUseCaseResponse> {
    const user = await this.usersRepository.updateTelegram(
      userId,
      telegramId,
      telegramActive,
      telegramLinkingToken,
    )

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
