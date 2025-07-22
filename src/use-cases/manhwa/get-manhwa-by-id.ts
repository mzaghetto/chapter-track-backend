import { ManhwasRepository } from '@/repositories/manhwas-repository'
import { Manhwas } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface GetManhwaByIdUseCaseRequest {
  manhwaId: bigint
}

interface GetManhwaByIdUseCaseResponse {
  manhwa: Manhwas
}

export class GetManhwaByIdUseCase {
  constructor(private manhwasRepository: ManhwasRepository) {}

  async execute({
    manhwaId,
  }: GetManhwaByIdUseCaseRequest): Promise<GetManhwaByIdUseCaseResponse> {
    const manhwa = await this.manhwasRepository.findByID(manhwaId)

    if (!manhwa) {
      throw new ResourceNotFoundError()
    }

    return {
      manhwa,
    }
  }
}
