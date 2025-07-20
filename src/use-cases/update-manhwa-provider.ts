import { ManhwaProvider, Prisma } from '@prisma/client'
import { ManhwaProviderRepository } from '@/repositories/manhwa-provider-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface UpdateManhwaProviderUseCaseRequest {
  manhwaProviderId: bigint
  data: Prisma.ManhwaProviderUpdateInput
}

interface UpdateManhwaProviderUseCaseResponse {
  manhwaProvider: ManhwaProvider
}

export class UpdateManhwaProviderUseCase {
  constructor(private manhwaProviderRepository: ManhwaProviderRepository) {}

  async execute({
    manhwaProviderId,
    data,
  }: UpdateManhwaProviderUseCaseRequest): Promise<UpdateManhwaProviderUseCaseResponse> {
    const manhwaProvider = await this.manhwaProviderRepository.update(
      manhwaProviderId,
      data,
    )

    if (!manhwaProvider) {
      throw new ResourceNotFoundError()
    }

    return {
      manhwaProvider,
    }
  }
}
