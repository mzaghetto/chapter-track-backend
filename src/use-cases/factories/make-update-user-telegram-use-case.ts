import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateUserTelegramUseCase } from '../user/update-user-telegram'

export function makeUpdateUserTelegramUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new UpdateUserTelegramUseCase(usersRepository)

  return useCase
}
