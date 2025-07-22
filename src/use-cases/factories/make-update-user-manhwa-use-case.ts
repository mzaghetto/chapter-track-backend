import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'
import { UpdateUserManhwaUseCase } from '../user/update-user-manhwa'

export function makeUpdateUserManhwaUseCase() {
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const useCase = new UpdateUserManhwaUseCase(userManhwaRepository)

  return useCase
}
