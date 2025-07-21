import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GenerateTelegramLinkingTokenUseCase } from '../user/generate-telegram-linking-token-use-case'

export function makeGenerateTelegramLinkingTokenUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GenerateTelegramLinkingTokenUseCase(usersRepository)

  return useCase
}
