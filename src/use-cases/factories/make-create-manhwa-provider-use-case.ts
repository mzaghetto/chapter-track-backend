import { CreateManhwaProviderUseCase } from '@/use-cases/manhwa-provider/create-manhwa-provider'
import { PrismaManhwaProviderRepository } from '@/repositories/prisma/prisma-manhwa-provider-repository'
import { PrismaManhwasRepository } from '@/repositories/prisma/prisma-manhwas-repository'
import { PrismaProvidersRepository } from '@/repositories/prisma/prisma-providers-repository'

export function makeCreateManhwaProviderUseCase() {
  const manhwaProviderRepository = new PrismaManhwaProviderRepository()
  const manhwasRepository = new PrismaManhwasRepository()
  const providersRepository = new PrismaProvidersRepository()
  const createManhwaProviderUseCase = new CreateManhwaProviderUseCase(
    manhwaProviderRepository,
    manhwasRepository,
    providersRepository,
  )

  return createManhwaProviderUseCase
}
