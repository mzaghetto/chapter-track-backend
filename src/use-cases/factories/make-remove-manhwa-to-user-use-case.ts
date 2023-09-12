import { PrismaManhwasRepository } from '@/repositories/prisma/prisma-manhwas-repository'
import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'
import { RemoveManhwaToUserManhwaUseCase } from '../remove-manhwa-to-user'

export function makeRemoveManhwaToUserUseCase() {
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const manhwaRepository = new PrismaManhwasRepository()
  const removeManhwaToUserUseCase = new RemoveManhwaToUserManhwaUseCase(
    userManhwaRepository,
    manhwaRepository,
  )

  return removeManhwaToUserUseCase
}
