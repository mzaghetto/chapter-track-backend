import { Manhwas } from '@prisma/client'
import { ManhwasRepository } from '@/repositories/manhwas-repository'
import { ManhwaAlreadyExistsError } from './errors/manhwa-already-exists-error'

interface RegisterManhwaUseCaseRequest {
  name: string
  last_episode_released: number
  last_episode_notified: number
  available_read_url: string[]
  manhwa_thumb: string
  url_crawler?: string
  users_to_notify: string[]
}

interface RegisterManhwaUseCaseReponse {
  manhwa: Manhwas
}

export class RegisterManhwaUseCase {
  constructor(private manhwasRepository: ManhwasRepository) {}

  async execute({
    name,
    last_episode_released,
    last_episode_notified,
    available_read_url,
    manhwa_thumb,
    url_crawler,
    users_to_notify,
  }: RegisterManhwaUseCaseRequest): Promise<RegisterManhwaUseCaseReponse> {
    const manhwaAlreadyExists = await this.manhwasRepository.findByName(name)

    if (manhwaAlreadyExists) {
      throw new ManhwaAlreadyExistsError()
    }

    const manhwa = await this.manhwasRepository.create({
      name,
      last_episode_released,
      last_episode_notified,
      available_read_url,
      manhwa_thumb,
      url_crawler,
      users_to_notify,
    })

    return {
      manhwa,
    }
  }
}
