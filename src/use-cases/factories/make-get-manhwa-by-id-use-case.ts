import { PrismaManhwasRepository } from '@/repositories/prisma/prisma-manhwas-repository'
import { GetManhwaByIdUseCase } from '../manhwa/get-manhwa-by-id'

export function makeGetManhwaByIdUseCase() {
  const manhwaRepository = new PrismaManhwasRepository()
  const getManhwaByIdUseCase = new GetManhwaByIdUseCase(manhwaRepository)

  return getManhwaByIdUseCase
}
