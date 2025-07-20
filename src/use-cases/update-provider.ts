import { ProvidersRepository } from '@/repositories/providers-repository'
import { Providers, Prisma } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface UpdateProviderUseCaseRequest {
  providerId: bigint
  data: Prisma.ProvidersUpdateInput
}

interface UpdateProviderUseCaseResponse {
  provider: Providers
}

export class UpdateProviderUseCase {
  constructor(private providersRepository: ProvidersRepository) {}

  async execute({
    providerId,
    data,
  }: UpdateProviderUseCaseRequest): Promise<UpdateProviderUseCaseResponse> {
    const provider = await this.providersRepository.update(providerId, data)

    if (!provider) {
      throw new ResourceNotFoundError()
    }

    return {
      provider,
    }
  }
}