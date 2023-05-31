import { UpdateManhwaUseCase } from '../update-manhwa'
import { PrismaManhwasRepository } from '@/repositories/prisma/prisma-manhwas-repository'

export function makeUpdateManhwaUseCase() {
  const manhwasRepository = new PrismaManhwasRepository()
  const updateManhwaUseCase = new UpdateManhwaUseCase(manhwasRepository)

  return updateManhwaUseCase
}
