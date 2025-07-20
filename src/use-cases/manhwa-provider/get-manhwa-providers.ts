import { DetailedManhwaProvider } from '@/repositories/dtos/detailed-manhwa-provider'
import { ManhwaProviderRepository } from '@/repositories/manhwa-provider-repository'

interface GetManhwaProvidersUseCaseRequest {
  manhwaId?: bigint
  providerId?: bigint
  manhwaName?: string
  providerName?: string
}

interface GetManhwaProvidersUseCaseResponse {
  manhwaProviders: DetailedManhwaProvider[]
}

export class GetManhwaProvidersUseCase {
  constructor(private manhwaProviderRepository: ManhwaProviderRepository) {}

  async execute({
    manhwaId,
    providerId,
    manhwaName,
    providerName,
  }: GetManhwaProvidersUseCaseRequest): Promise<GetManhwaProvidersUseCaseResponse> {
    const manhwaProviders = await this.manhwaProviderRepository.findAll({
      manhwaId,
      providerId,
      manhwaName,
      providerName,
    })

    return {
      manhwaProviders,
    }
  }
}
