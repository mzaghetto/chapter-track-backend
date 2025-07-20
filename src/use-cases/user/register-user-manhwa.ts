import { UserManhwa, UserManhwaStatus } from '@prisma/client'
import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'

interface RegisterUserManhwaUseCaseRequest {
  userId: bigint
  manhwaId: bigint
  providerId?: bigint | null
  status?: UserManhwaStatus
  lastEpisodeRead?: number | null
  lastNotifiedEpisode?: number | null
  order: number
}

interface RegisterUserManhwaUseCaseResponse {
  userManhwa: UserManhwa
}

export class RegisterUserManhwaUseCase {
  constructor(
    private userManhwaRepository: UserManhwaRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    manhwaId,
    providerId,
    status,
    lastEpisodeRead,
    lastNotifiedEpisode,
    order,
  }: RegisterUserManhwaUseCaseRequest): Promise<RegisterUserManhwaUseCaseResponse> {
    const userExists = await this.usersRepository.findByID(userId)

    if (!userExists) {
      throw new ResourceNotFoundError()
    }

    const userManhwa = await this.userManhwaRepository.create({
      userId,
      manhwaId,
      providerId,
      status: status ?? UserManhwaStatus.READING,
      lastEpisodeRead,
      lastNotifiedEpisode,
      order,
    })

    return {
      userManhwa,
    }
  }
}
