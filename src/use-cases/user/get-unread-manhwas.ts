import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { ManhwasRepository } from '@/repositories/manhwas-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

interface GetUnreadManhwasUseCaseRequest {
  userId: bigint
}

interface ManhwaResponse {
  manhwaId: bigint
  lastEpisodeRead: number | null
  lastEpisodeReleased: number | null
}

interface GetUnreadManhwasUseCaseResponse {
  unreadManhwas: ManhwaResponse[]
}

export class GetUnreadManhwasUseCase {
  constructor(
    private userManhwaRepository: UserManhwaRepository,
    private manhwasRepository: ManhwasRepository,
  ) {}

  async execute({
    userId,
  }: GetUnreadManhwasUseCaseRequest): Promise<GetUnreadManhwasUseCaseResponse> {
    const userManhwas = await this.userManhwaRepository.findManyByUserId(userId)

    if (!userManhwas || userManhwas.length === 0) {
      throw new ResourceNotFoundError()
    }

    const unreadManhwas: ManhwaResponse[] = []

    for (const userManhwa of userManhwas) {
      const manhwa = await this.manhwasRepository.findByID(userManhwa.manhwaId)

      if (
        manhwa &&
        manhwa.status === 'ONGOING' &&
        manhwa.manhwaProviders.length > 0
      ) {
        const latestEpisode = manhwa.manhwaProviders.reduce(
          (
            maxEpisode: number,
            provider: { lastEpisodeReleased: number | null },
          ) => {
            return Math.max(maxEpisode, provider.lastEpisodeReleased ?? 0)
          },
          0,
        )

        if (latestEpisode > (userManhwa.lastEpisodeRead ?? 0)) {
          unreadManhwas.push({
            manhwaId: userManhwa.manhwaId,
            lastEpisodeRead: userManhwa.lastEpisodeRead,
            lastEpisodeReleased: latestEpisode,
          })
        }
      }
    }

    return {
      unreadManhwas,
    }
  }
}
