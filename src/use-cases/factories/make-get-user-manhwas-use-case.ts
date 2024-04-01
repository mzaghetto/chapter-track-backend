import { GetUserManhwasUseCase } from '../get-user-manhwas'
import { PrismaUserManhwaRepository } from '@/repositories/prisma/prisma-user-manhwa-repository'

export function makeGetUserManhwasUseCase() {
  const userManhwaRepository = new PrismaUserManhwaRepository()
  const getUserManhwasUseCase = new GetUserManhwasUseCase(userManhwaRepository)

  return getUserManhwasUseCase
}
