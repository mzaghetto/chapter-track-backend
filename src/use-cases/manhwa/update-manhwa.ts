import { Manhwas, Prisma } from '@prisma/client'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { ManhwasRepository } from '@/repositories/manhwas-repository'
import { ManhwaAlreadyExistsError } from '@/use-cases/errors/manhwa-already-exists-error'
import { parseGenre } from '@/utils/genre-parser'

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
    const existingManhwa = await this.manhwasRepository.findByID(manhwaID)

    if (!existingManhwa) {
      throw new ResourceNotFoundError()
    }

    if (
      data.name &&
      typeof data.name === 'string' &&
      data.name !== existingManhwa.name
    ) {
      const manhwaWithSameName = await this.manhwasRepository.findByName(
        data.name,
      )

      if (manhwaWithSameName && manhwaWithSameName.id !== manhwaID) {
        throw new ManhwaAlreadyExistsError()
      }
    }

    const processedGenre = parseGenre(data.genre)

    const updatedData = {
      ...data,
      genre:
        processedGenre === null
          ? undefined
          : (processedGenre as Prisma.InputJsonValue),
    }

    const manhwa = await this.manhwasRepository.findByIDAndUpdate(
      manhwaID,
      updatedData,
    )

    if (!manhwa) {
      throw new ResourceNotFoundError()
    }

    return {
      manhwa,
    }
  }
}
