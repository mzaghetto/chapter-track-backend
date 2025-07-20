import { PrismaProvidersRepository } from '@/repositories/prisma/prisma-providers-repository'
import { GetProvidersUseCase } from '@/use-cases/provider/get-providers'

export function makeGetProvidersUseCase() {
  const providersRepository = new PrismaProvidersRepository()
  const useCase = new GetProvidersUseCase(providersRepository)

  return useCase
}
