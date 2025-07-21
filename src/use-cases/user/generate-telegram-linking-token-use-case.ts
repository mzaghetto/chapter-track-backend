import { UsersRepository } from '@/repositories/users-repository'
import { Users } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface GenerateTelegramLinkingTokenUseCaseRequest {
  userId: bigint
}

interface GenerateTelegramLinkingTokenUseCaseResponse {
  user: Users
}

export class GenerateTelegramLinkingTokenUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GenerateTelegramLinkingTokenUseCaseRequest): Promise<GenerateTelegramLinkingTokenUseCaseResponse> {
    const user = await this.usersRepository.findByID(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const telegramLinkingToken = randomUUID()

    const updatedUser = await this.usersRepository.findByIDAndUpdate(user.id, {
      telegramLinkingToken,
    })

    if (!updatedUser) {
      throw new ResourceNotFoundError()
    }

    return { user: updatedUser }
  }
}
