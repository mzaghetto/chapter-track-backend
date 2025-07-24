import { ManhwasRepository } from '../../repositories/manhwas-repository'
import { Manhwas } from '@prisma/client'

interface GetRandomManhwasUseCaseRequest {
  count: number
}

interface GetRandomManhwasUseCaseResponse {
  manhwas: Manhwas[]
}

export class GetRandomManhwasUseCase {
  constructor(private manhwasRepository: ManhwasRepository) {}

  async execute({
    count,
  }: GetRandomManhwasUseCaseRequest): Promise<GetRandomManhwasUseCaseResponse> {
    const manhwas = await this.manhwasRepository.findRandom(count)

    return { manhwas }
  }
}
