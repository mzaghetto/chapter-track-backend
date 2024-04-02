import { PrismaManhwasRepository } from '@/repositories/prisma/prisma-manhwas-repository'
import { FilterManhwaByNameUseCase } from '../filter-manhwas'

export function makeFilterManhwaByNameToUserUseCase() {
  const manhwaRepository = new PrismaManhwasRepository()
  const filterManhwaByNameUseCase = new FilterManhwaByNameUseCase(
    manhwaRepository,
  )

  return filterManhwaByNameUseCase
}
