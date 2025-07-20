import { ProvidersRepository } from '@/repositories/providers-repository'
import { Providers } from '@prisma/client'

interface CreateProviderUseCaseRequest {
  name: string
  url?: string | null
}

interface CreateProviderUseCaseResponse {
  provider: Providers
}

export class CreateProviderUseCase {
  constructor(private providersRepository: ProvidersRepository) {}

  async execute({
    name,
    url,
  }: CreateProviderUseCaseRequest): Promise<CreateProviderUseCaseResponse> {
    const provider = await this.providersRepository.create({
      name,
      url,
    })

    return {
      provider,
    }
  }
}
