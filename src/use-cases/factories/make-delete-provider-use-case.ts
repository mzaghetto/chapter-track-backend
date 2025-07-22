import { PrismaProvidersRepository } from '@/repositories/prisma/prisma-providers-repository'
import { DeleteProviderUseCase } from '../provider/delete-provider'

export function makeDeleteProviderUseCase() {
  const providersRepository = new PrismaProvidersRepository()
  const deleteProviderUseCase = new DeleteProviderUseCase(providersRepository)

  return deleteProviderUseCase
}
