import { Manhwas, Prisma } from '@prisma/client'
import { ManhwasRepository } from '@/repositories/manhwas-repository'
import { ManhwaAlreadyExistsError } from './errors/manhwa-already-exists-error'

interface RegisterManhwaUseCaseRequest {
  name: string
  author?: string | null
  genre?: Prisma.InputJsonValue
  coverImage?: string | null
  description?: string | null
  status?: 'ONGOING' | 'COMPLETED' | 'HIATUS' | null
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
  }: RegisterManhwaUseCaseRequest): Promise<RegisterManhwaUseCaseReponse> {
    const manhwaAlreadyExists = await this.manhwasRepository.findByName(name)

    if (manhwaAlreadyExists) {
      throw new ManhwaAlreadyExistsError()
    }

    const manhwa = await this.manhwasRepository.create({
      name,
      author,
      genre,
      coverImage,
      description,
      status,
    })

    return {
      manhwa,
    }
  }
}
