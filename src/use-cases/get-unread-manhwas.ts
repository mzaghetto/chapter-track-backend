/* eslint-disable prettier/prettier */
import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { ManhwasRepository } from '@/repositories/manhwas-repository'

interface GetUnreadManhwasUseCaseRequest {
  user_id: string
}

interface manhwaResponse {
  manhwa_id: string
  last_episode_read: number
  last_episode_released: number | undefined
}

interface GetUnreadManhwasUseCaseReponse {
  unreadManhwas: manhwaResponse[]
}

export class GetUnreadManhwasUseCase {
  constructor(
    private userManhwaRepository: UserManhwaRepository,
    private manhwasRepository: ManhwasRepository,
  ) {}

  async execute({
    user_id,
  }: GetUnreadManhwasUseCaseRequest): Promise<GetUnreadManhwasUseCaseReponse> {
    const getAllManhwasFromUser = await this.userManhwaRepository.getAllManhwas(
      user_id,
    )

    if (getAllManhwasFromUser?.length === 0 || getAllManhwasFromUser === null) {
      throw new ResourceNotFoundError()
    }

    const manhwas = await Promise.all(
      getAllManhwasFromUser.map(async (manhwa) => {
        const foundManhwa = await this.manhwasRepository.findByID(
          manhwa.manhwa_id,
        )

        return {
          manhwa_id: manhwa.manhwa_id,
          last_episode_read: manhwa.last_episode_read,
          last_episode_released: foundManhwa?.last_episode_released,
        }
      }),
    )

    const unreadManhwas = manhwas.filter((manhwa) => {
      return manhwa.last_episode_released != null && manhwa.last_episode_released > manhwa.last_episode_read;
    });

    return {
      unreadManhwas,
    }
  }
}
