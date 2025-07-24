import { PrismaManhwasRepository } from '../../repositories/prisma/prisma-manhwas-repository'
import { GetRandomManhwasUseCase } from '../manhwa/get-random-manhwas'

export function makeGetRandomManhwasUseCase() {
  const manhwasRepository = new PrismaManhwasRepository()
  const getRandomManhwasUseCase = new GetRandomManhwasUseCase(manhwasRepository)

  return getRandomManhwasUseCase
}
