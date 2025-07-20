import { PrismaManhwasRepository } from '@/repositories/prisma/prisma-manhwas-repository'
import { AddManhwaToUserUseCase } from '@/use-cases/user/add-manhwa-to-user'
import { PrismaProvidersRepository } from '@/repositories/prisma/prisma-providers-repository'
import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeAddManhwaToUserUseCase() {
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const manhwaRepository = new PrismaManhwasRepository()
  const providersRepository = new PrismaProvidersRepository()
  const usersRepository = new PrismaUsersRepository()
  const addManhwaToUserUseCase = new AddManhwaToUserUseCase(
    userManhwaRepository,
    manhwaRepository,
    providersRepository,
    usersRepository,
  )

  return addManhwaToUserUseCase
}
