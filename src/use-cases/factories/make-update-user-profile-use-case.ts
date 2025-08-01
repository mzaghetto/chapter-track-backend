import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UpdateUserProfileUseCase } from '@/use-cases/user/update-user-profile'

export function makeUpdateUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const updateUserProfileUseCase = new UpdateUserProfileUseCase(usersRepository)

  return updateUserProfileUseCase
}
