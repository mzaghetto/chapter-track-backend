import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserManhwaUseCase } from '../register-user-manhwa'

export function makeRegisterUserManhwaUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const registerUserManhwaUseCase = new RegisterUserManhwaUseCase(
    userManhwaRepository,
    usersRepository,
  )

  return registerUserManhwaUseCase
}
