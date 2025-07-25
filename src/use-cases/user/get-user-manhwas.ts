import { UserManhwaRepository } from '@/repositories/user-manhwa-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { DetailedUserManhwa } from '@/repositories/dtos/detailed-user-manhwa'

interface GetUserManhwasUseCaseRequest {
  userId: bigint
  page: number
  pageSize: number
  status?: 'ONGOING' | 'COMPLETED' | 'HIATUS'
  userStatus?: 'READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED'
}

interface GetUserManhwasUseCaseResponse {
  userManhwas: DetailedUserManhwa[]
  total: number
}

export class GetUserManhwasUseCase {
  constructor(
    private userManhwaRepository: UserManhwaRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    page,
    pageSize,
    status,
    userStatus,
  }: GetUserManhwasUseCaseRequest): Promise<GetUserManhwasUseCaseResponse> {
    const user = await this.usersRepository.findByID(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }

    const userManhwas = await this.userManhwaRepository.findByUserId(
      userId,
      page,
      pageSize,
      status,
      userStatus,
    )
    const total = await this.userManhwaRepository.countByUserId(
      userId,
      status,
      userStatus,
    )

    return {
      userManhwas,
      total,
    }
  }
}
