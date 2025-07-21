import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FindUserByTelegramLinkingTokenUseCase } from '../user/find-user-by-telegram-linking-token-use-case'

export function makeFindUserByTelegramLinkingTokenUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new FindUserByTelegramLinkingTokenUseCase(usersRepository)

  return useCase
}
