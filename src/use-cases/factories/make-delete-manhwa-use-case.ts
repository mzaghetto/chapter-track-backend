import { PrismaManhwasRepository } from '@/repositories/prisma/prisma-manhwas-repository'
import { DeleteManhwaUseCase } from '../manhwa/delete-manhwa'

export function makeDeleteManhwaUseCase() {
  const manhwaRepository = new PrismaManhwasRepository()
  const deleteManhwaUseCase = new DeleteManhwaUseCase(manhwaRepository)

  return deleteManhwaUseCase
}
