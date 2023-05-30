import { PrismaManhwasRepository } from '@/repositories/prisma/prisma-manhwas-repository'
import { AddManhwaToUserManhwaUseCase } from '../register-manhwa-to-user'
import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'

export function makeRegisterManhwaToUserUseCase() {
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const manhwaRepository = new PrismaManhwasRepository()
  const registerManhwaToUserUseCase = new AddManhwaToUserManhwaUseCase(
    userManhwaRepository,
    manhwaRepository,
  )

  return registerManhwaToUserUseCase
}
