import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { ManhwasRepository } from '@/repositories/manhwas-repository'
import { ProvidersRepository } from '@/repositories/providers-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { UserManhwa, UserManhwaStatus } from '@prisma/client'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { ManhwaAlreadyExistsError } from '@/use-cases/errors/manhwa-already-exists-error'

interface AddManhwaToUserUseCaseRequest {
  userId: bigint
  manhwaId: bigint
  providerId?: bigint
  status?: UserManhwaStatus
  lastEpisodeRead?: number
  order: number
}

interface AddManhwaToUserUseCaseResponse {
  userManhwa: UserManhwa
}

export class AddManhwaToUserUseCase {
  constructor(
    private userManhwaRepository: UserManhwaRepository,
    private manhwasRepository: ManhwasRepository,
    private providersRepository: ProvidersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    manhwaId,
    providerId,
    status,
    lastEpisodeRead,
  }: AddManhwaToUserUseCaseRequest): Promise<AddManhwaToUserUseCaseResponse> {
    const user = await this.usersRepository.findByID(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }

    const manhwa = await this.manhwasRepository.findByID(manhwaId)
    if (!manhwa) {
      throw new ResourceNotFoundError()
    }

    if (providerId) {
      const provider = await this.providersRepository.findById(providerId)
      if (!provider) {
        throw new ResourceNotFoundError()
      }
    }

    const userManhwaExists =
      await this.userManhwaRepository.findByUserIdAndManhwaId(userId, manhwaId)

    if (userManhwaExists) {
      throw new ManhwaAlreadyExistsError()
    }

    const order = await this.userManhwaRepository.countByUserId(userId)

    const userManhwa = await this.userManhwaRepository.create({
      userId,
      manhwaId,
      providerId,
      status: status ?? UserManhwaStatus.READING,
      lastEpisodeRead,
      order,
    })

    return {
      userManhwa,
    }
  }
}
