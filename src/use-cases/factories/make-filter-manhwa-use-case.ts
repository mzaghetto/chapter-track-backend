import { PrismaManhwasRepository } from '@/repositories/prisma/prisma-manhwas-repository'
import { FilterManhwaByNameUseCase } from '@/use-cases/manhwa/filter-manhwas'

export function makeFilterManhwaByNameToUserUseCase() {
  const manhwaRepository = new PrismaManhwasRepository()
  const filterManhwaByNameUseCase = new FilterManhwaByNameUseCase(
    manhwaRepository,
  )

  return filterManhwaByNameUseCase
}
