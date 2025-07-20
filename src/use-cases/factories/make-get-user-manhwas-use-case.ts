import { GetUserManhwasUseCase } from '../get-user-manhwas'
import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeGetUserManhwasUseCase() {
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const usersRepository = new PrismaUsersRepository()
  const getUserManhwasUseCase = new GetUserManhwasUseCase(
    userManhwaRepository,
    usersRepository,
  )

  return getUserManhwasUseCase
}
