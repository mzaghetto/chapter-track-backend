import { Manhwas, Prisma } from '@prisma/client'
import { ManhwasRepository } from '@/repositories/manhwas-repository'
import { ManhwaAlreadyExistsError } from '@/use-cases/errors/manhwa-already-exists-error'
import { parseStringArray } from '@/utils/string-array-parser'

interface RegisterManhwaUseCaseRequest {
  name: string
  author?: string | null
  genre?: Prisma.InputJsonValue
  coverImage?: string | null
  description?: string | null
  status?: 'ONGOING' | 'COMPLETED' | 'HIATUS' | null
  alternativeNames?: string[] | null
}

interface RegisterManhwaUseCaseReponse {
  manhwa: Manhwas
}

export class RegisterManhwaUseCase {
  constructor(private manhwasRepository: ManhwasRepository) {}

  async execute({
    name,
    author,
    genre,
    coverImage,
    description,
    status,
    alternativeNames,
  }: RegisterManhwaUseCaseRequest): Promise<RegisterManhwaUseCaseReponse> {
    const manhwaAlreadyExists = await this.manhwasRepository.findByName(name)

    if (manhwaAlreadyExists) {
      throw new ManhwaAlreadyExistsError()
    }

    const processedGenre = parseStringArray(genre)
    const processedAlternativeNames = parseStringArray(alternativeNames)

    const manhwa = await this.manhwasRepository.create({
      name,
      author,
      genre:
        processedGenre === null
          ? undefined
          : (processedGenre as Prisma.InputJsonValue),
      coverImage,
      description,
      status,
      alternativeNames:
        processedAlternativeNames === null
          ? undefined
          : (processedAlternativeNames as Prisma.InputJsonValue),
    })

    return {
      manhwa,
    }
  }
}
