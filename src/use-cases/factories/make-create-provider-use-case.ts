import { CreateProviderUseCase } from '@/use-cases/provider/create-provider'
import { PrismaProvidersRepository } from '@/repositories/prisma/prisma-providers-repository'

export function makeCreateProviderUseCase() {
  const providersRepository = new PrismaProvidersRepository()
  const createProviderUseCase = new CreateProviderUseCase(providersRepository)

  return createProviderUseCase
}
