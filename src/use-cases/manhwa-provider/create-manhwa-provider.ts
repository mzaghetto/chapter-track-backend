import { ManhwaProvider } from '@prisma/client'
import { ManhwaProviderRepository } from '@/repositories/manhwa-provider-repository'
import { ManhwasRepository } from '@/repositories/manhwas-repository'
import { ProvidersRepository } from '@/repositories/providers-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

interface CreateManhwaProviderUseCaseRequest {
  manhwaId: bigint
  providerId: bigint
  lastEpisodeReleased?: number | null
  url?: string | null
}

interface CreateManhwaProviderUseCaseResponse {
  manhwaProvider: ManhwaProvider
}

export class CreateManhwaProviderUseCase {
  constructor(
    private manhwaProviderRepository: ManhwaProviderRepository,
    private manhwasRepository: ManhwasRepository,
    private providersRepository: ProvidersRepository,
  ) {}

  async execute({
    manhwaId,
    providerId,
    lastEpisodeReleased,
    url,
  }: CreateManhwaProviderUseCaseRequest): Promise<CreateManhwaProviderUseCaseResponse> {
    const manhwa = await this.manhwasRepository.findByID(manhwaId)

    if (!manhwa) {
      throw new ResourceNotFoundError()
    }

    const provider = await this.providersRepository.findById(providerId)

    if (!provider) {
      throw new ResourceNotFoundError()
    }

    const manhwaProvider = await this.manhwaProviderRepository.create({
      manhwaId,
      providerId,
      lastEpisodeReleased,
      url,
    })

    return {
      manhwaProvider,
    }
  }
}
