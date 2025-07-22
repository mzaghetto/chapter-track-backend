import { ProvidersRepository } from '@/repositories/providers-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface DeleteProviderUseCaseRequest {
  providerId: bigint
}

export class DeleteProviderUseCase {
  constructor(private providersRepository: ProvidersRepository) {}

  async execute({ providerId }: DeleteProviderUseCaseRequest): Promise<void> {
    const provider = await this.providersRepository.findById(providerId)

    if (!provider) {
      throw new ResourceNotFoundError()
    }

    await this.providersRepository.delete(providerId)
  }
}
