import { Manhwas, Prisma } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { ManhwasRepository } from '@/repositories/manhwas-repository'
import { ManhwaAlreadyExistsError } from './errors/manhwa-already-exists-error'

interface UpdateManhwaUseCaseRequest {
  manhwaID: bigint
  data: Prisma.ManhwasUpdateInput
}

interface UpdateManhwaUseCaseResponse {
  manhwa: Manhwas
}

export class UpdateManhwaUseCase {
  constructor(private manhwasRepository: ManhwasRepository) {}

  async execute({
    manhwaID,
    data,
  }: UpdateManhwaUseCaseRequest): Promise<UpdateManhwaUseCaseResponse> {
    if (data.name) {
      if (typeof data.name === 'string') {
        const manhwaNameAlreadyExists = await this.manhwasRepository.findByName(
          data.name,
        )

        if (manhwaNameAlreadyExists) {
          throw new ManhwaAlreadyExistsError()
        }
      }
    }

    const manhwa = await this.manhwasRepository.findByIDAndUpdate(
      manhwaID,
      data,
    )

    if (!manhwa) {
      throw new ResourceNotFoundError()
    }

    return {
      manhwa,
    }
  }
}
