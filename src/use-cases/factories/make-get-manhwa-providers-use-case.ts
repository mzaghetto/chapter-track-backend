import { PrismaManhwaProviderRepository } from '@/repositories/prisma/prisma-manhwa-provider-repository'
import { GetManhwaProvidersUseCase } from '../get-manhwa-providers'

export function makeGetManhwaProvidersUseCase() {
  const manhwaProviderRepository = new PrismaManhwaProviderRepository()
  const useCase = new GetManhwaProvidersUseCase(manhwaProviderRepository)

  return useCase
}
