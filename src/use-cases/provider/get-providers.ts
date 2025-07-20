import { ProvidersRepository } from '@/repositories/providers-repository'
import { Providers } from '@prisma/client'

interface GetProvidersUseCaseResponse {
  providers: Providers[]
}

export class GetProvidersUseCase {
  constructor(private providersRepository: ProvidersRepository) {}

  async execute(): Promise<GetProvidersUseCaseResponse> {
    const providers = await this.providersRepository.findAll()

    return {
      providers,
    }
  }
}
