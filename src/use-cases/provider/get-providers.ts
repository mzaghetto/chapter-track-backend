import { ProvidersRepository } from '@/repositories/providers-repository'
import { Providers } from '@prisma/client'

interface GetProvidersUseCaseRequest {
  searchTerm?: string
}

interface GetProvidersUseCaseResponse {
  providers: Providers[]
}

export class GetProvidersUseCase {
  constructor(private providersRepository: ProvidersRepository) {}

  async execute({
    searchTerm,
  }: GetProvidersUseCaseRequest): Promise<GetProvidersUseCaseResponse> {
    const providers = await this.providersRepository.findAll(searchTerm)

    return {
      providers,
    }
  }
}
