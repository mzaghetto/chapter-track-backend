import { DetailedManhwaProvider } from '@/repositories/dtos/detailed-manhwa-provider'
import { ManhwaProviderRepository } from '@/repositories/manhwa-provider-repository'

interface GetManhwaProvidersUseCaseRequest {
  manhwaId?: bigint
  providerId?: bigint
  manhwaName?: string
  providerName?: string
  page: number
  pageSize: number
}

interface GetManhwaProvidersUseCaseResponse {
  manhwaProviders: DetailedManhwaProvider[]
  totalCount: number
}

export class GetManhwaProvidersUseCase {
  constructor(private manhwaProviderRepository: ManhwaProviderRepository) {}

  async execute({
    manhwaId,
    providerId,
    manhwaName,
    providerName,
    page,
    pageSize,
  }: GetManhwaProvidersUseCaseRequest): Promise<GetManhwaProvidersUseCaseResponse> {
    const { manhwaProviders, totalCount } =
      await this.manhwaProviderRepository.findAllPaginated({
        manhwaId,
        providerId,
        manhwaName,
        providerName,
        page,
        pageSize,
      })

    return {
      manhwaProviders,
      totalCount,
    }
  }
}
