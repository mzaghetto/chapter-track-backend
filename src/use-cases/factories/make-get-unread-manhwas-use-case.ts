import { PrismaManhwasRepository } from '@/repositories/prisma/prisma-manhwas-repository'
import { GetUnreadManhwasUseCase } from '@/use-cases/user/get-unread-manhwas'
import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'

export function makeGetUnreadManhwasUseCase() {
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const manhwasRepository = new PrismaManhwasRepository()
  const getUnreadManhwasUseCase = new GetUnreadManhwasUseCase(
    userManhwaRepository,
    manhwasRepository,
  )

  return getUnreadManhwasUseCase
}
