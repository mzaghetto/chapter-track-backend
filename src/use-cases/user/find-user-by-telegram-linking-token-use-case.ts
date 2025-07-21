import { UsersRepository } from '@/repositories/users-repository'
import { Users } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface FindUserByTelegramLinkingTokenUseCaseRequest {
  token: string
}

interface FindUserByTelegramLinkingTokenUseCaseResponse {
  user: Users
}

export class FindUserByTelegramLinkingTokenUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    token,
  }: FindUserByTelegramLinkingTokenUseCaseRequest): Promise<FindUserByTelegramLinkingTokenUseCaseResponse> {
    const user = await this.usersRepository.findByTelegramLinkingToken(token)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
